import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { integer, pgTable, serial, text, timestamp, boolean, numeric, jsonb } from "drizzle-orm/pg-core";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").notNull().default("appraiser"),
  licenseNumber: text("license_number"),
  company: text("company"),
  createdAt: timestamp("created_at").defaultNow(),
  phone: text("phone"),
  profileImage: text("profile_image"),
  lastLogin: timestamp("last_login"),
  status: text("status").default("active"),
  preferences: jsonb("preferences"),
});

// Properties table
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  propertyType: text("property_type").notNull(),
  yearBuilt: integer("year_built"),
  squareFeet: numeric("square_feet"),
  bedrooms: numeric("bedrooms"),
  bathrooms: numeric("bathrooms"),
  lotSize: numeric("lot_size"),
  description: text("description"),
  lastSalePrice: numeric("last_sale_price"),
  lastSaleDate: timestamp("last_sale_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  parcelNumber: text("parcel_number"),
  zoning: text("zoning"),
  lotUnit: text("lot_unit"), // acres, sq.ft., etc.
  latitude: numeric("latitude", { precision: 10, scale: 6 }),
  longitude: numeric("longitude", { precision: 10, scale: 6 }),
  features: jsonb("features"), // JSON object for property features
  legalDescription: text("legal_description"),
  condition: text("condition"), // Excellent, Good, Average, Fair, Poor
  taxAssessment: numeric("tax_assessment"),
  neighborhood: text("neighborhood"),
  floodZone: text("flood_zone"),
  propertyTaxes: numeric("property_taxes"),
});

// Appraisals table
export const appraisals = pgTable("appraisals", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  appraiserId: integer("appraiser_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  status: text("status").notNull().default("draft"), // draft, in_progress, completed, reviewed
  purpose: text("purpose"), // Refinance, Purchase, etc.
  marketValue: numeric("market_value"),
  valuationMethod: text("valuation_method"), // Sales Comparison, Income, Cost
  inspectionDate: timestamp("inspection_date"),
  effectiveDate: timestamp("effective_date"),
  reportUrl: text("report_url"),
  clientId: integer("client_id"),
  clientName: text("client_name"),
  clientEmail: text("client_email"),
  clientPhone: text("client_phone"),
  reportType: text("report_type"), // Full, Limited, Hybrid
  adjustments: jsonb("adjustments"), // JSON object for adjustments data
  intendedUse: text("intended_use"),
  scopeOfWork: text("scope_of_work"),
  lenderName: text("lender_name"),
  loanNumber: text("loan_number"),
  notes: text("notes"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Comparables table
export const comparables = pgTable("comparables", {
  id: serial("id").primaryKey(),
  appraisalId: integer("appraisal_id").notNull().references(() => appraisals.id),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  salePrice: numeric("sale_price"),
  saleDate: timestamp("sale_date"),
  squareFeet: numeric("square_feet"),
  bedrooms: numeric("bedrooms"),
  bathrooms: numeric("bathrooms"),
  yearBuilt: integer("year_built"),
  adjustmentDetails: jsonb("adjustment_details"), // Structured adjustment data as JSON
  adjustedPrice: numeric("adjusted_price"),
  createdAt: timestamp("created_at").defaultNow(),
  lotSize: numeric("lot_size"),
  distance: numeric("distance"), // Distance from subject property
  propertyType: text("property_type"),
  latitude: numeric("latitude", { precision: 10, scale: 6 }),
  longitude: numeric("longitude", { precision: 10, scale: 6 }),
  condition: text("condition"),
  daysOnMarket: integer("days_on_market"),
  source: text("source"), // MLS, Public Records, etc.
  imageUrl: text("image_url"),
  proximityScore: numeric("proximity_score"), // Calculated score based on location
  similarityScore: numeric("similarity_score"), // Calculated score based on property features
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Adjustments table for tracking specific adjustments to comparables
export const adjustments = pgTable("adjustments", {
  id: serial("id").primaryKey(),
  comparableId: integer("comparable_id").notNull().references(() => comparables.id),
  category: text("category").notNull(), // Location, Size, Quality, Age, etc.
  description: text("description").notNull(),
  amount: numeric("amount").notNull(),
  percentage: boolean("percentage").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  adjustmentType: text("adjustment_type"), // Addition, Subtraction
  notes: text("notes"),
  calculationMethod: text("calculation_method"), // Manual, Automated
});

// Attachments for storing files related to properties and appraisals
export const attachments = pgTable("attachments", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  fileUrl: text("file_url").notNull(),
  propertyId: integer("property_id").references(() => properties.id),
  appraisalId: integer("appraisal_id").references(() => appraisals.id),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  description: text("description"),
  attachmentType: text("attachment_type"), // Photo, Document, Map, etc.
  tags: jsonb("tags"), // Array of tags
});

// Market data for real estate market analysis
export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  regionId: text("region_id").notNull(), // City, Zip, Neighborhood ID
  regionType: text("region_type").notNull(), // City, Zip, Neighborhood
  dataPoint: text("data_point").notNull(), // Median Price, Avg Price per SqFt, etc.
  value: numeric("value").notNull(),
  period: timestamp("period").notNull(), // The month/quarter/year this data represents
  propertyType: text("property_type"), // Single Family, Condo, etc.
  createdAt: timestamp("created_at").defaultNow(),
  source: text("source"), // Where the data came from
  confidenceScore: numeric("confidence_score"), // How reliable the data is
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  passwordHash: z.string().min(8),
}).omit({ id: true, createdAt: true, lastLogin: true });

export const insertPropertySchema = createInsertSchema(properties).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true 
});

export const insertAppraisalSchema = createInsertSchema(appraisals).omit({ 
  id: true, 
  createdAt: true, 
  completedAt: true,
  updatedAt: true
});

export const insertComparableSchema = createInsertSchema(comparables).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true
});

export const insertAdjustmentSchema = createInsertSchema(adjustments).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertAttachmentSchema = createInsertSchema(attachments).omit({
  id: true,
  createdAt: true
});

export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
  createdAt: true
});

// Type definitions
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