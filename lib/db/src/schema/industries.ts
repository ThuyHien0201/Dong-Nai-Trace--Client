import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const industries = pgTable("industries", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  // Array of step type keys required before a lot can be pushed to the portal
  requiredStepTypes: text("required_step_types").array().notNull().default([]),
});

export const insertIndustrySchema = createInsertSchema(industries).omit({ id: true });
export type InsertIndustry = z.infer<typeof insertIndustrySchema>;
export type Industry = typeof industries.$inferSelect;
