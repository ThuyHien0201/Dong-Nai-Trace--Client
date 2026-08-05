import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { industries } from "./industries";

export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  code: text("code").unique(),
  name: text("name").notNull(),
  taxCode: text("tax_code").unique(),
  region: text("region"),
  industryId: integer("industry_id").references(() => industries.id),
  status: text("status").notNull().default("pending"), // pending | active | rejected | locked
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const insertBusinessSchema = createInsertSchema(businesses).omit({ id: true, createdAt: true });
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type Business = typeof businesses.$inferSelect;
