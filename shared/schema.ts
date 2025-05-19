import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { integer, pgTable, serial, text, timestamp, boolean, numeric } from "drizzle-orm/pg-core";
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
  createdBy: integer("created_by").references(() => users.id),
});

// Appraisals table
export const appraisals = pgTable("appraisals", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  appraiserId: integer("appraiser_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  status: text("status").notNull().default("draft"),
  purpose: text("purpose"),
  marketValue: numeric("market_value"),
  valuationMethod: text("valuation_method"),
});

// Comparables table
export const comparables = pgTable("comparables", {
  id: serial("id").primaryKey(),
  appraisalId: integer("appraisal_id").notNull().references(() => appraisals.id),
  address: text("address").notNull(),
  salePrice: numeric("sale_price").notNull(),
  saleDate: timestamp("sale_date").notNull(),
  squareFeet: numeric("square_feet").notNull(),
  bedrooms: numeric("bedrooms"),
  bathrooms: numeric("bathrooms"),
  yearBuilt: integer("year_built"),
  adjustments: text("adjustments"), // JSON stored as text
  adjustedPrice: numeric("adjusted_price"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User schema for insertion
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  passwordHash: z.string().min(8),
}).omit({ id: true, createdAt: true });

// Property schema for insertion
export const insertPropertySchema = createInsertSchema(properties).omit({ 
  id: true, 
  createdAt: true 
});

// Appraisal schema for insertion
export const insertAppraisalSchema = createInsertSchema(appraisals).omit({ 
  id: true, 
  createdAt: true, 
  completedAt: true 
});

// Comparable schema for insertion
export const insertComparableSchema = createInsertSchema(comparables).omit({ 
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