import { pgTable, serial, text, integer, doublePrecision, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").notNull(),
  licenseNumber: text("license_number"),
  company: text("company"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const usersRelations = relations(users, ({ many }) => ({
  appraisals: many(appraisals)
}));

// Properties table
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  propertyType: text("property_type").notNull(),
  yearBuilt: integer("year_built"),
  squareFeet: integer("square_feet"),
  bedrooms: integer("bedrooms"),
  bathrooms: doublePrecision("bathrooms"),
  lotSize: doublePrecision("lot_size"),
  description: text("description"),
  lastSalePrice: integer("last_sale_price"),
  lastSaleDate: timestamp("last_sale_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const propertiesRelations = relations(properties, ({ many, one }) => ({
  appraisals: many(appraisals),
  owner: one(users, {
    fields: [properties.id],
    references: [users.id]
  })
}));

// Appraisals table
export const appraisals = pgTable("appraisals", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  appraiserId: integer("appraiser_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  status: text("status").notNull().default("draft"),
  purpose: text("purpose"),
  marketValue: integer("market_value"),
  valuationMethod: text("valuation_method"),
  effectiveDate: timestamp("effective_date"),
  reportDate: timestamp("report_date")
});

export const appraisalsRelations = relations(appraisals, ({ one, many }) => ({
  property: one(properties, {
    fields: [appraisals.propertyId],
    references: [properties.id]
  }),
  appraiser: one(users, {
    fields: [appraisals.appraiserId],
    references: [users.id]
  }),
  comparables: many(comparables)
}));

// Comparables table
export const comparables = pgTable("comparables", {
  id: serial("id").primaryKey(),
  appraisalId: integer("appraisal_id").notNull().references(() => appraisals.id),
  address: text("address").notNull(),
  salePrice: integer("sale_price").notNull(),
  saleDate: timestamp("sale_date").notNull(),
  squareFeet: integer("square_feet").notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: doublePrecision("bathrooms"),
  yearBuilt: integer("year_built"),
  adjustments: jsonb("adjustments"),
  adjustedPrice: integer("adjusted_price"),
  notes: text("notes"),
  distanceFromSubject: doublePrecision("distance_from_subject")
});

export const comparablesRelations = relations(comparables, ({ one, many }) => ({
  appraisal: one(appraisals, {
    fields: [comparables.appraisalId],
    references: [appraisals.id]
  }),
  adjustments: many(adjustments)
}));

// Adjustments table for comparable properties
export const adjustments = pgTable("adjustments", {
  id: serial("id").primaryKey(),
  comparableId: integer("comparable_id").notNull().references(() => comparables.id),
  name: text("name").notNull(),
  amount: integer("amount").notNull(),
  description: text("description")
});

export const adjustmentsRelations = relations(adjustments, ({ one }) => ({
  comparable: one(comparables, {
    fields: [adjustments.comparableId],
    references: [comparables.id]
  })
}));

// Attachments for appraisals (photos, documents, etc.)
export const attachments = pgTable("attachments", {
  id: serial("id").primaryKey(),
  appraisalId: integer("appraisal_id").notNull().references(() => appraisals.id),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  fileUrl: text("file_url").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  description: text("description")
});

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  appraisal: one(appraisals, {
    fields: [attachments.appraisalId],
    references: [appraisals.id]
  })
}));

// Market data for reference
export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  zipCode: text("zip_code").notNull(),
  date: timestamp("date").notNull(),
  medianSalePrice: integer("median_sale_price"),
  averageSalePrice: integer("average_sale_price"),
  totalSales: integer("total_sales"),
  averageDaysOnMarket: integer("average_days_on_market"),
  pricePerSquareFoot: doublePrecision("price_per_square_foot")
});

// Create insertion schemas with validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'appraiser', 'reviewer', 'client'])
}).omit({ 
  id: true,
  createdAt: true 
});

export const insertPropertySchema = createInsertSchema(properties).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true 
});

export const insertAppraisalSchema = createInsertSchema(appraisals).omit({ 
  id: true, 
  createdAt: true 
});

export const insertComparableSchema = createInsertSchema(comparables).omit({ 
  id: true 
});

export const insertAdjustmentSchema = createInsertSchema(adjustments).omit({
  id: true
});

export const insertAttachmentSchema = createInsertSchema(attachments).omit({
  id: true,
  uploadedAt: true
});

export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;

export type Appraisal = typeof appraisals.$inferSelect;
export type InsertAppraisal = z.infer<typeof insertAppraisalSchema>;

export type Comparable = typeof comparables.$inferSelect;
export type InsertComparable = z.infer<typeof insertComparableSchema>;

export type Adjustment = typeof adjustments.$inferSelect;
export type InsertAdjustment = z.infer<typeof insertAdjustmentSchema>;

export type Attachment = typeof attachments.$inferSelect;
export type InsertAttachment = z.infer<typeof insertAttachmentSchema>;

export type MarketData = typeof marketData.$inferSelect;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;