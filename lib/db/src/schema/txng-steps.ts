import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { productLots } from "./product-lots";

export const txngSteps = pgTable("txng_steps", {
  id: serial("id").primaryKey(),
  lotId: integer("lot_id")
    .references(() => productLots.id)
    .notNull(),
  // e.g. thu_mua | so_che | che_bien | dong_goi | van_chuyen | phan_phoi
  stepType: text("step_type").notNull(),
  // Human-readable label (e.g. "Thu mua", "Đóng gói")
  stepName: text("step_name").notNull(),
  startTime: timestamp("start_time", { withTimezone: true }),
  endTime: timestamp("end_time", { withTimezone: true }),
  executor: text("executor"),
  locationCode: text("location_code"),
  description: text("description"),
  evidenceUrl: text("evidence_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const insertTxngStepSchema = createInsertSchema(txngSteps).omit({ id: true, createdAt: true });
export type InsertTxngStep = z.infer<typeof insertTxngStepSchema>;
export type TxngStep = typeof txngSteps.$inferSelect;
