import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, varchar, date, jsonb, uniqueIndex, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table with enhanced fields for real estate professionals
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull().default("appraiser"), // appraiser, reviewer, admin
  title: text("title"),
  phone: text("phone"),
  licenseNumber: text("license_number"),
  licenseState: text("license_state"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Properties table
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  propertyType: text("property_type").notNull(), // residential, commercial, land, etc.
  yearBuilt: integer("year_built"),
  squareFeet: integer("square_feet"),
  lotSize: doublePrecision("lot_size"),
  lotUnit: text("lot_unit").default("acres"), // acres, square feet, etc.
  bedrooms: integer("bedrooms"),
  bathrooms: doublePrecision("bathrooms"),
  description: text("description"),
  features: jsonb("features"), // JSON array of property features
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  parcelNumber: text("parcel_number"),
  zoning: text("zoning"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdById: integer("created_by_id").references(() => users.id),
});

// Appraisals table
export const appraisals = pgTable("appraisals", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  appraisalDate: date("appraisal_date").notNull(),
  effectiveDate: date("effective_date").notNull(),
  purpose: text("purpose").notNull(), // purchase, refinance, etc.
  appraisalType: text("appraisal_type").notNull(), // full, drive-by, desktop, etc.
  status: text("status").notNull().default("draft"), // draft, in_progress, review, complete
  marketValue: integer("market_value"),
  approachesUsed: jsonb("approaches_used"), // sales comparison, income, cost
  clientName: text("client_name"),
  clientReference: text("client_reference"),
  dueDate: date("due_date"),
  assignedTo: integer("assigned_to").references(() => users.id),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // New fields for reconciliation values
  estimatedValue: integer("estimated_value"),
  finalValue: integer("final_value"),
});

// Comparable Properties table
export const comparables = pgTable("comparables", {
  id: serial("id").primaryKey(),
  appraisalId: integer("appraisal_id").references(() => appraisals.id).notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  saleDate: date("sale_date"),
  salePrice: integer("sale_price"),
  propertyType: text("property_type").notNull(),
  yearBuilt: integer("year_built"),
  squareFeet: integer("square_feet"),
  lotSize: doublePrecision("lot_size"),
  bedrooms: integer("bedrooms"),
  bathrooms: doublePrecision("bathrooms"),
  description: text("description"),
  adjustments: jsonb("adjustments"), // JSON of price adjustments
  proximityMiles: doublePrecision("proximity_miles"),
  source: text("source"), // MLS, public records, etc.
  verified: boolean("verified").default(false),
  daysOnMarket: integer("days_on_market"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Add a separate table for adjustments
export const adjustments = pgTable("adjustments", {
  id: serial("id").primaryKey(),
  comparableId: integer("comparable_id").references(() => comparables.id).notNull(),
  adjustmentType: text("adjustment_type").notNull(), // location, size, quality, etc.
  amount: integer("amount").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    unq: unique().on(table.comparableId, table.adjustmentType),
  }
});

// Attachments table (for photos, documents, etc.)
export const attachments = pgTable("attachments", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id),
  appraisalId: integer("appraisal_id").references(() => appraisals.id),
  type: text("type").notNull(), // photo, document, etc.
  name: text("name").notNull(),
  description: text("description"),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(), // jpg, pdf, etc.
  fileSize: integer("file_size"),
  category: text("category"), // exterior, interior, site, etc.
  uploadedBy: integer("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define table relations
export const usersRelations = relations(users, ({ many }) => ({
  createdProperties: many(properties),
  assignedAppraisals: many(appraisals, { relationName: "assignedAppraisals" }),
  reviewedAppraisals: many(appraisals, { relationName: "reviewedAppraisals" }),
  uploadedAttachments: many(attachments),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  creator: one(users, {
    fields: [properties.createdById],
    references: [users.id],
  }),
  appraisals: many(appraisals),
  attachments: many(attachments),
}));

export const appraisalsRelations = relations(appraisals, ({ one, many }) => ({
  property: one(properties, {
    fields: [appraisals.propertyId],
    references: [properties.id],
  }),
  assignee: one(users, {
    fields: [appraisals.assignedTo],
    references: [users.id],
    relationName: "assignedAppraisals",
  }),
  reviewer: one(users, {
    fields: [appraisals.reviewedBy],
    references: [users.id],
    relationName: "reviewedAppraisals",
  }),
  comparables: many(comparables),
  attachments: many(attachments),
}));

export const comparablesRelations = relations(comparables, ({ one, many }) => ({
  appraisal: one(appraisals, {
    fields: [comparables.appraisalId],
    references: [appraisals.id],
  }),
  adjustments: many(adjustments),
}));

export const adjustmentsRelations = relations(adjustments, ({ one }) => ({
  comparable: one(comparables, {
    fields: [adjustments.comparableId],
    references: [comparables.id],
  }),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  property: one(properties, {
    fields: [attachments.propertyId],
    references: [properties.id],
  }),
  appraisal: one(appraisals, {
    fields: [attachments.appraisalId],
    references: [appraisals.id],
  }),
  uploader: one(users, {
    fields: [attachments.uploadedBy],
    references: [users.id],
  }),
}));

// Insert schemas for all tables
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  title: true,
  phone: true,
  licenseNumber: true,
  licenseState: true,
  profileImage: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAppraisalSchema = createInsertSchema(appraisals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertComparableSchema = createInsertSchema(comparables).omit({
  id: true,
  createdAt: true,
});

export const insertAdjustmentSchema = createInsertSchema(adjustments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAttachmentSchema = createInsertSchema(attachments).omit({
  id: true,
  createdAt: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type InsertAppraisal = z.infer<typeof insertAppraisalSchema>;
export type Appraisal = typeof appraisals.$inferSelect;

export type InsertComparable = z.infer<typeof insertComparableSchema>;
export type Comparable = typeof comparables.$inferSelect;

export type InsertAdjustment = z.infer<typeof insertAdjustmentSchema>;
export type Adjustment = typeof adjustments.$inferSelect;

export type InsertAttachment = z.infer<typeof insertAttachmentSchema>;
export type Attachment = typeof attachments.$inferSelect;
