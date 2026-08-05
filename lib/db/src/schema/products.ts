import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { businesses } from "./businesses";
import { industries } from "./industries";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  gtin: text("gtin").notNull().unique(),
  name: text("name").notNull(),
  businessId: integer("business_id").references(() => businesses.id),
  industryId: integer("industry_id").references(() => industries.id),
  imageUrl: text("image_url"),
  status: text("status").notNull().default("pending"), // pending | active | rejected
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
