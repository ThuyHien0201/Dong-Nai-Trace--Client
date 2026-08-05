import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { products } from "./products";

export const productLots = pgTable("product_lots", {
  id: serial("id").primaryKey(),
  lotCode: text("lot_code").notNull(),
  productId: integer("product_id").references(() => products.id),
  activatedAt: timestamp("activated_at", { withTimezone: true }),
  // not_synced | synced
  syncStatus: text("sync_status").notNull().default("not_synced"),
  syncedAt: timestamp("synced_at", { withTimezone: true }),
  portalUrl: text("portal_url"),
  province: text("province"),
  productionZone: text("production_zone"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const insertProductLotSchema = createInsertSchema(productLots).omit({ id: true, createdAt: true });
export type InsertProductLot = z.infer<typeof insertProductLotSchema>;
export type ProductLot = typeof productLots.$inferSelect;
