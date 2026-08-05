/**
 * Seed script — inserts sample data for the Đồng Nai Trace TXNG sync flow.
 * Run with:  pnpm --filter @workspace/db run seed
 *
 * Idempotent: checks if data already exists before inserting.
 */

import { db } from "./index";
import {
  industries,
  businesses,
  products,
  productLots,
  txngSteps,
} from "./schema";
import { eq, count } from "drizzle-orm";

async function seed() {
  // ── 1. Check if already seeded ──────────────────────────────────────────
  const [{ value: existingIndustries }] = await db
    .select({ value: count() })
    .from(industries);
  if (Number(existingIndustries) > 0) {
    console.log("✓ Database already seeded, skipping.");
    process.exit(0);
  }

  console.log("🌱 Seeding database...");

  // ── 2. Industries ────────────────────────────────────────────────────────
  const [nongSan, thuySan, thucPhamCB, ocop, chanNuoi, duocLieu] = await db
    .insert(industries)
    .values([
      {
        code: "nong_san",
        name: "Nông sản",
        requiredStepTypes: ["thu_mua", "dong_goi"],
      },
      {
        code: "thuy_san",
        name: "Thủy sản",
        requiredStepTypes: ["thu_mua", "che_bien", "dong_goi"],
      },
      {
        code: "thuc_pham_cb",
        name: "Thực phẩm chế biến",
        requiredStepTypes: ["thu_mua", "so_che", "dong_goi"],
      },
      {
        code: "ocop",
        name: "OCOP",
        requiredStepTypes: ["thu_mua", "dong_goi"],
      },
      {
        code: "chan_nuoi",
        name: "Chăn nuôi",
        requiredStepTypes: ["thu_mua", "che_bien", "dong_goi"],
      },
      {
        code: "duoc_lieu",
        name: "Dược liệu",
        requiredStepTypes: ["thu_mua", "so_che", "dong_goi"],
      },
    ])
    .returning();

  console.log(`  ✓ Inserted ${6} industries`);

  // ── 3. Businesses ────────────────────────────────────────────────────────
  const [dn001, dn002, dn003, dn004, dn005, dn006, dn007] = await db
    .insert(businesses)
    .values([
      {
        code: "DNT-2024-0001",
        name: "Công ty TNHH Nông sản An Phú",
        taxCode: "3601234567",
        region: "Biên Hòa",
        industryId: nongSan.id,
        status: "active",
      },
      {
        code: "DNT-2024-0002",
        name: "Công ty CP Thực phẩm Đồng Nai",
        taxCode: "3601112233",
        region: "Long Khánh",
        industryId: thucPhamCB.id,
        status: "active",
      },
      {
        code: "DNT-2024-0003",
        name: "HTX Nông nghiệp Xuân Lộc",
        taxCode: "3607654321",
        region: "Xuân Lộc",
        industryId: ocop.id,
        status: "active",
      },
      {
        code: "DNT-2024-0004",
        name: "Trại nuôi thủy sản Nhơn Trạch",
        taxCode: "3608889900",
        region: "Nhơn Trạch",
        industryId: thuySan.id,
        status: "active",
      },
      {
        code: "DNT-2024-0005",
        name: "Cơ sở chế biến Bưởi Tân Triều",
        taxCode: "3602223344",
        region: "Vĩnh Cửu",
        industryId: ocop.id,
        status: "active",
      },
      {
        code: "DNT-2024-0006",
        name: "Công ty TNHH Dược liệu Định Quán",
        taxCode: "3609990011",
        region: "Định Quán",
        industryId: duocLieu.id,
        status: "active",
      },
      {
        code: "DNT-2024-0007",
        name: "HTX Chăn nuôi Tân Phú",
        taxCode: "3604445566",
        region: "Tân Phú",
        industryId: chanNuoi.id,
        status: "active",
      },
    ])
    .returning();

  console.log(`  ✓ Inserted 7 businesses`);

  // ── 4. Products ──────────────────────────────────────────────────────────
  const [p1, p2, p3, p4, p5, p6, p7, p8] = await db
    .insert(products)
    .values([
      {
        gtin: "8938547458164",
        name: "Bưởi Tân Triều",
        businessId: dn005.id,
        industryId: ocop.id,
        imageUrl: null,
        status: "active",
      },
      {
        gtin: "8938533117082",
        name: "Sầu riêng Xuân Lộc",
        businessId: dn003.id,
        industryId: ocop.id,
        imageUrl: null,
        status: "active",
      },
      {
        gtin: "8938501475398",
        name: "Cà phê Robusta Định Quán",
        businessId: dn001.id,
        industryId: nongSan.id,
        imageUrl: null,
        status: "active",
      },
      {
        gtin: "8938512340001",
        name: "Cá điêu hồng Nhơn Trạch",
        businessId: dn004.id,
        industryId: thuySan.id,
        imageUrl: null,
        status: "active",
      },
      {
        gtin: "8938512340002",
        name: "Tôm thẻ chân trắng Long Khánh",
        businessId: dn004.id,
        industryId: thuySan.id,
        imageUrl: null,
        status: "active",
      },
      {
        gtin: "8938512340003",
        name: "Mật ong rừng Định Quán",
        businessId: dn006.id,
        industryId: duocLieu.id,
        imageUrl: null,
        status: "active",
      },
      {
        gtin: "8938512340004",
        name: "Gà ta Tân Phú",
        businessId: dn007.id,
        industryId: chanNuoi.id,
        imageUrl: null,
        status: "active",
      },
      {
        gtin: "8938512340005",
        name: "Xúc xích heo Đồng Nai",
        businessId: dn002.id,
        industryId: thucPhamCB.id,
        imageUrl: null,
        status: "active",
      },
    ])
    .returning();

  console.log(`  ✓ Inserted 8 products`);

  // ── 5. Product lots ──────────────────────────────────────────────────────
  const now = new Date();
  const d = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86400000);

  const lots = await db
    .insert(productLots)
    .values([
      // Complete + not synced (TXNG steps will be added below)
      {
        lotCode: "260727-01",
        productId: p1.id,
        activatedAt: d(7),
        syncStatus: "not_synced",
        province: "Đồng Nai",
        productionZone: "Vùng bưởi Tân Triều",
      },
      {
        lotCode: "260601-01",
        productId: p2.id,
        activatedAt: d(33),
        syncStatus: "not_synced",
        province: "Đồng Nai",
        productionZone: "Vùng sầu riêng Xuân Lộc",
      },
      {
        lotCode: "260506-01",
        productId: p3.id,
        activatedAt: d(58),
        syncStatus: "not_synced",
        province: "Đồng Nai",
        productionZone: "Vùng cà phê Định Quán",
      },
      // Already synced
      {
        lotCode: "260410-01",
        productId: p1.id,
        activatedAt: d(84),
        syncStatus: "synced",
        syncedAt: d(80),
        portalUrl: "https://txng.gov.vn/portal/product/8938547458164/260410-01",
        province: "Đồng Nai",
        productionZone: "Vùng bưởi Tân Triều",
      },
      {
        lotCode: "260315-01",
        productId: p2.id,
        activatedAt: d(107),
        syncStatus: "synced",
        syncedAt: d(100),
        portalUrl: "https://txng.gov.vn/portal/product/8938533117082/260315-01",
        province: "Đồng Nai",
        productionZone: "Vùng sầu riêng Xuân Lộc",
      },
      // Incomplete (no TXNG steps yet)
      {
        lotCode: "260728-01",
        productId: p4.id,
        activatedAt: d(6),
        syncStatus: "not_synced",
        province: "Đồng Nai",
        productionZone: null,
      },
      {
        lotCode: "260720-01",
        productId: p5.id,
        activatedAt: d(14),
        syncStatus: "not_synced",
        province: "Đồng Nai",
        productionZone: null,
      },
      {
        lotCode: "260715-01",
        productId: p6.id,
        activatedAt: d(19),
        syncStatus: "not_synced",
        province: "Đồng Nai",
        productionZone: "Rừng Định Quán",
      },
      {
        lotCode: "260710-01",
        productId: p7.id,
        activatedAt: d(24),
        syncStatus: "not_synced",
        province: "Đồng Nai",
        productionZone: null,
      },
      {
        lotCode: "260705-01",
        productId: p8.id,
        activatedAt: d(29),
        syncStatus: "not_synced",
        province: "Đồng Nai",
        productionZone: "Khu công nghiệp Long Khánh",
      },
    ])
    .returning();

  console.log(`  ✓ Inserted ${lots.length} product lots`);

  const [lot1, lot2, lot3, lot4, lot5] = lots;

  // ── 6. TXNG Steps for complete lots ─────────────────────────────────────
  await db.insert(txngSteps).values([
    // Lot 1: Bưởi Tân Triều 260727-01 (OCOP → thu_mua + dong_goi)
    {
      lotId: lot1.id,
      stepType: "thu_mua",
      stepName: "Thu mua",
      startTime: d(9),
      endTime: d(8),
      executor: "Nguyễn Văn Hùng",
      locationCode: "DN-VCU-001",
      description: "Thu mua bưởi Tân Triều từ nông hộ, phân loại sơ bộ tại vườn.",
      evidenceUrl: "https://cdn-txng.dongnai.gov.vn/data/lot/260727-01/thu-mua.jpg",
    },
    {
      lotId: lot1.id,
      stepType: "dong_goi",
      stepName: "Đóng gói",
      startTime: d(8),
      endTime: d(7),
      executor: "Trần Thị Mai",
      locationCode: "DN-VCU-002",
      description: "Đóng gói hộp carton 6 quả/hộp, dán tem truy xuất QR.",
      evidenceUrl: "https://cdn-txng.dongnai.gov.vn/data/lot/260727-01/dong-goi.jpg",
    },
    // Lot 2: Sầu riêng Xuân Lộc 260601-01 (OCOP → thu_mua + dong_goi)
    {
      lotId: lot2.id,
      stepType: "thu_mua",
      stepName: "Thu mua",
      startTime: d(35),
      endTime: d(34),
      executor: "Lê Hoàng Nam",
      locationCode: "DN-XLO-001",
      description: "Thu mua sầu riêng Ri6 độ chín 80%, thu hoạch thủ công.",
      evidenceUrl: "https://cdn-txng.dongnai.gov.vn/data/lot/260601-01/thu-mua.jpg",
    },
    {
      lotId: lot2.id,
      stepType: "dong_goi",
      stepName: "Đóng gói",
      startTime: d(34),
      endTime: d(33),
      executor: "Phạm Minh Cường",
      locationCode: "DN-XLO-002",
      description: "Đóng gói từng quả, bọc lưới xốp bảo vệ, dán mã GTIN.",
      evidenceUrl: "https://cdn-txng.dongnai.gov.vn/data/lot/260601-01/dong-goi.jpg",
    },
    // Lot 3: Cà phê Robusta 260506-01 (Nông sản → thu_mua + dong_goi)
    {
      lotId: lot3.id,
      stepType: "thu_mua",
      stepName: "Thu mua",
      startTime: d(60),
      endTime: d(59),
      executor: "Vũ Thị Dung",
      locationCode: "DN-DQU-001",
      description: "Thu mua cà phê nhân xanh từ nông hộ vùng Định Quán.",
      evidenceUrl: "https://cdn-txng.dongnai.gov.vn/data/lot/260506-01/thu-mua.jpg",
    },
    {
      lotId: lot3.id,
      stepType: "dong_goi",
      stepName: "Đóng gói",
      startTime: d(58),
      endTime: d(58),
      executor: "Đỗ Văn Em",
      locationCode: "DN-DQU-002",
      description: "Đóng túi 1kg, hàn nhiệt kín, dán nhãn tiếng Việt đầy đủ.",
      evidenceUrl: "https://cdn-txng.dongnai.gov.vn/data/lot/260506-01/dong-goi.jpg",
    },
    // Lot 4 (synced): also add steps for completeness
    {
      lotId: lot4.id,
      stepType: "thu_mua",
      stepName: "Thu mua",
      startTime: d(86),
      endTime: d(85),
      executor: "Nguyễn Văn Hùng",
      locationCode: "DN-VCU-001",
      description: "Thu mua vụ trước.",
      evidenceUrl: null,
    },
    {
      lotId: lot4.id,
      stepType: "dong_goi",
      stepName: "Đóng gói",
      startTime: d(85),
      endTime: d(84),
      executor: "Trần Thị Mai",
      locationCode: "DN-VCU-002",
      description: "Đóng gói hộp vụ trước.",
      evidenceUrl: null,
    },
    {
      lotId: lot5.id,
      stepType: "thu_mua",
      stepName: "Thu mua",
      startTime: d(109),
      endTime: d(108),
      executor: "Lê Hoàng Nam",
      locationCode: "DN-XLO-001",
      description: "Thu mua vụ trước.",
      evidenceUrl: null,
    },
    {
      lotId: lot5.id,
      stepType: "dong_goi",
      stepName: "Đóng gói",
      startTime: d(108),
      endTime: d(107),
      executor: "Phạm Minh Cường",
      locationCode: "DN-XLO-002",
      description: "Đóng gói vụ trước.",
      evidenceUrl: null,
    },
  ]);

  console.log(`  ✓ Inserted TXNG steps for 5 lots`);
  console.log("\n✅ Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
