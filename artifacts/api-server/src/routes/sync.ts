import { Router } from "express";
import { db } from "@workspace/db";
import {
  industries,
  businesses,
  products,
  productLots,
  txngSteps,
} from "@workspace/db/schema";
import {
  eq,
  and,
  or,
  ilike,
  count,
  inArray,
} from "drizzle-orm";

const syncRouter = Router();

// ─── Helpers ───────────────────────────────────────────────────────────────

/** True when all required step types for the industry are present in steps array */
function computeIsComplete(
  requiredStepTypes: string[],
  steps: { stepType: string; startTime: Date | null }[],
): boolean {
  if (requiredStepTypes.length === 0) return true;
  const presentTypes = new Set(
    steps.filter((s) => s.startTime != null).map((s) => s.stepType),
  );
  return requiredStepTypes.every((r) => presentTypes.has(r));
}

type LotRow = {
  lot: typeof productLots.$inferSelect;
  product: typeof products.$inferSelect;
  business: typeof businesses.$inferSelect;
  industry: typeof industries.$inferSelect;
};

function formatLotItem(
  row: LotRow,
  steps: typeof txngSteps.$inferSelect[],
  isComplete: boolean,
) {
  return {
    id: row.lot.id,
    lotCode: row.lot.lotCode,
    gtin: row.product.gtin,
    productName: row.product.name,
    businessName: row.business.name,
    industryName: row.industry.name,
    imageUrl: row.product.imageUrl,
    activatedAt: row.lot.activatedAt?.toISOString() ?? null,
    syncStatus: row.lot.syncStatus,
    syncedAt: row.lot.syncedAt?.toISOString() ?? null,
    portalUrl: row.lot.portalUrl,
    isComplete,
  };
}

// ─── GET /api/sync/portal-lots ─────────────────────────────────────────────

syncRouter.get("/portal-lots", async (req, res) => {
  const {
    syncStatus = "all",
    gtin,
    lotCode,
    businessName,
    productName,
    page = "1",
    pageSize = "20",
  } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limit = Math.min(100, parseInt(pageSize, 10) || 20);
  const offset = (pageNum - 1) * limit;

  // Build join query
  const baseQuery = db
    .select({
      lot: productLots,
      product: products,
      business: businesses,
      industry: industries,
    })
    .from(productLots)
    .innerJoin(products, eq(productLots.productId, products.id))
    .innerJoin(businesses, eq(products.businessId, businesses.id))
    .innerJoin(industries, eq(products.industryId, industries.id));

  // Build WHERE conditions
  const conditions = [];
  if (syncStatus === "not_synced") {
    conditions.push(eq(productLots.syncStatus, "not_synced"));
  } else if (syncStatus === "synced") {
    conditions.push(eq(productLots.syncStatus, "synced"));
  }
  if (gtin) conditions.push(ilike(products.gtin, `%${gtin}%`));
  if (lotCode) conditions.push(ilike(productLots.lotCode, `%${lotCode}%`));
  if (businessName) conditions.push(ilike(businesses.name, `%${businessName}%`));
  if (productName) conditions.push(ilike(products.name, `%${productName}%`));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  // Paginated rows
  const rows = (await (where ? baseQuery.where(where) : baseQuery)
    .orderBy(productLots.createdAt)
    .limit(limit)
    .offset(offset)) as LotRow[];

  // Count totals
  const [{ total }] = await db
    .select({ total: count() })
    .from(productLots)
    .innerJoin(products, eq(productLots.productId, products.id))
    .innerJoin(businesses, eq(products.businessId, businesses.id))
    .where(where ?? undefined);

  const [{ notSynced }] = await db
    .select({ notSynced: count() })
    .from(productLots)
    .innerJoin(products, eq(productLots.productId, products.id))
    .innerJoin(businesses, eq(products.businessId, businesses.id))
    .where(
      and(
        eq(productLots.syncStatus, "not_synced"),
        where ?? undefined,
      ) ?? undefined,
    );

  const [{ synced }] = await db
    .select({ synced: count() })
    .from(productLots)
    .innerJoin(products, eq(productLots.productId, products.id))
    .innerJoin(businesses, eq(products.businessId, businesses.id))
    .where(
      and(
        eq(productLots.syncStatus, "synced"),
        where ?? undefined,
      ) ?? undefined,
    );

  // Fetch steps for all returned lots
  const lotIds = rows.map((r) => r.lot.id);
  const allSteps =
    lotIds.length > 0
      ? await db
          .select()
          .from(txngSteps)
          .where(inArray(txngSteps.lotId, lotIds))
      : [];

  const stepsByLot = new Map<number, typeof allSteps>();
  for (const step of allSteps) {
    if (!stepsByLot.has(step.lotId)) stepsByLot.set(step.lotId, []);
    stepsByLot.get(step.lotId)!.push(step);
  }

  const data = rows.map((row) => {
    const steps = stepsByLot.get(row.lot.id) ?? [];
    const isComplete = computeIsComplete(row.industry.requiredStepTypes, steps);
    return formatLotItem(row, steps, isComplete);
  });

  res.json({
    data,
    total: Number(total),
    notSyncedCount: Number(notSynced),
    syncedCount: Number(synced),
  });
});

// ─── GET /api/sync/portal-lots/:lotId ─────────────────────────────────────

syncRouter.get("/portal-lots/:lotId", async (req, res) => {
  const lotId = parseInt(req.params.lotId, 10);
  if (isNaN(lotId)) return res.status(400).json({ error: "Invalid lotId" });

  const rows = await db
    .select({
      lot: productLots,
      product: products,
      business: businesses,
      industry: industries,
    })
    .from(productLots)
    .innerJoin(products, eq(productLots.productId, products.id))
    .innerJoin(businesses, eq(products.businessId, businesses.id))
    .innerJoin(industries, eq(products.industryId, industries.id))
    .where(eq(productLots.id, lotId))
    .limit(1);

  if (rows.length === 0) return res.status(404).json({ error: "Lot not found" });

  const row = rows[0] as LotRow;
  const steps = await db
    .select()
    .from(txngSteps)
    .where(eq(txngSteps.lotId, lotId))
    .orderBy(txngSteps.createdAt);

  const isComplete = computeIsComplete(row.industry.requiredStepTypes, steps);

  const detail = {
    ...formatLotItem(row, steps, isComplete),
    province: row.lot.province,
    productionZone: row.lot.productionZone,
    industryCode: row.industry.code,
    requiredStepTypes: row.industry.requiredStepTypes,
    txngSteps: steps.map((s) => ({
      id: s.id,
      lotId: s.lotId,
      stepType: s.stepType,
      stepName: s.stepName,
      startTime: s.startTime?.toISOString() ?? null,
      endTime: s.endTime?.toISOString() ?? null,
      executor: s.executor,
      locationCode: s.locationCode,
      description: s.description,
      evidenceUrl: s.evidenceUrl,
      createdAt: s.createdAt!.toISOString(),
    })),
  };

  res.json(detail);
});

// ─── POST /api/sync/portal-lots/:lotId/steps ──────────────────────────────

syncRouter.post("/portal-lots/:lotId/steps", async (req, res) => {
  const lotId = parseInt(req.params.lotId, 10);
  if (isNaN(lotId)) return res.status(400).json({ error: "Invalid lotId" });

  const rows = await db
    .select({ lot: productLots, industry: industries })
    .from(productLots)
    .innerJoin(products, eq(productLots.productId, products.id))
    .innerJoin(industries, eq(products.industryId, industries.id))
    .where(eq(productLots.id, lotId))
    .limit(1);

  if (rows.length === 0) return res.status(404).json({ error: "Lot not found" });

  const { industry } = rows[0];
  const { steps } = req.body as {
    steps: Array<{
      stepType: string;
      stepName: string;
      startTime?: string | null;
      endTime?: string | null;
      executor?: string | null;
      locationCode?: string | null;
      description?: string | null;
      evidenceUrl?: string | null;
    }>;
  };

  if (!Array.isArray(steps) || steps.length === 0) {
    return res.status(400).json({ error: "steps array required" });
  }

  // Upsert each step: delete existing for same stepType, then insert
  for (const step of steps) {
    await db
      .delete(txngSteps)
      .where(
        and(eq(txngSteps.lotId, lotId), eq(txngSteps.stepType, step.stepType)),
      );
    await db.insert(txngSteps).values({
      lotId,
      stepType: step.stepType,
      stepName: step.stepName,
      startTime: step.startTime ? new Date(step.startTime) : null,
      endTime: step.endTime ? new Date(step.endTime) : null,
      executor: step.executor ?? null,
      locationCode: step.locationCode ?? null,
      description: step.description ?? null,
      evidenceUrl: step.evidenceUrl ?? null,
    });
  }

  const updatedSteps = await db
    .select()
    .from(txngSteps)
    .where(eq(txngSteps.lotId, lotId))
    .orderBy(txngSteps.createdAt);

  const isComplete = computeIsComplete(industry.requiredStepTypes, updatedSteps);

  res.json({
    success: true,
    isComplete,
    txngSteps: updatedSteps.map((s) => ({
      id: s.id,
      lotId: s.lotId,
      stepType: s.stepType,
      stepName: s.stepName,
      startTime: s.startTime?.toISOString() ?? null,
      endTime: s.endTime?.toISOString() ?? null,
      executor: s.executor,
      locationCode: s.locationCode,
      description: s.description,
      evidenceUrl: s.evidenceUrl,
      createdAt: s.createdAt!.toISOString(),
    })),
  });
});

// ─── POST /api/sync/portal-lots/:lotId/push-to-portal ─────────────────────

syncRouter.post("/portal-lots/:lotId/push-to-portal", async (req, res) => {
  const lotId = parseInt(req.params.lotId, 10);
  if (isNaN(lotId)) return res.status(400).json({ error: "Invalid lotId" });

  const rows = await db
    .select({ lot: productLots, product: products, industry: industries })
    .from(productLots)
    .innerJoin(products, eq(productLots.productId, products.id))
    .innerJoin(industries, eq(products.industryId, industries.id))
    .where(eq(productLots.id, lotId))
    .limit(1);

  if (rows.length === 0) return res.status(404).json({ error: "Lot not found" });

  const { lot, product, industry } = rows[0];

  if (lot.syncStatus === "synced") {
    return res.status(409).json({ error: "Lot already synced" });
  }

  // Apply any field overrides from the request body
  const { province, productionZone, stepOverrides } = req.body as {
    province?: string | null;
    productionZone?: string | null;
    stepOverrides?: Array<{
      stepType: string;
      stepName: string;
      locationCode?: string | null;
      startTime?: string | null;
      endTime?: string | null;
      executor?: string | null;
      description?: string | null;
      evidenceUrl?: string | null;
    }>;
  };

  // Apply step overrides if provided
  if (Array.isArray(stepOverrides) && stepOverrides.length > 0) {
    for (const override of stepOverrides) {
      await db
        .delete(txngSteps)
        .where(
          and(
            eq(txngSteps.lotId, lotId),
            eq(txngSteps.stepType, override.stepType),
          ),
        );
      await db.insert(txngSteps).values({
        lotId,
        stepType: override.stepType,
        stepName: override.stepName,
        startTime: override.startTime ? new Date(override.startTime) : null,
        endTime: override.endTime ? new Date(override.endTime) : null,
        executor: override.executor ?? null,
        locationCode: override.locationCode ?? null,
        description: override.description ?? null,
        evidenceUrl: override.evidenceUrl ?? null,
      });
    }
  }

  // Check completeness
  const steps = await db
    .select()
    .from(txngSteps)
    .where(eq(txngSteps.lotId, lotId));

  const isComplete = computeIsComplete(industry.requiredStepTypes, steps);
  if (!isComplete) {
    return res.status(400).json({
      error: "Lot is incomplete — required TXNG steps are missing",
      requiredStepTypes: industry.requiredStepTypes,
      presentStepTypes: steps.map((s) => s.stepType),
    });
  }

  // Update province/productionZone if provided
  const updateFields: Record<string, unknown> = {
    syncStatus: "synced",
    syncedAt: new Date(),
    portalUrl: `https://txng.gov.vn/portal/product/${product.gtin}/${lot.lotCode}`,
  };
  if (province != null) updateFields.province = province;
  if (productionZone != null) updateFields.productionZone = productionZone;

  const [updated] = await db
    .update(productLots)
    .set(updateFields)
    .where(eq(productLots.id, lotId))
    .returning();

  res.json({
    success: true,
    portalUrl: updated.portalUrl!,
    syncedAt: updated.syncedAt!.toISOString(),
  });
});

export default syncRouter;
