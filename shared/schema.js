const { pgTable, serial, text, integer, timestamp, boolean, date, numeric, json } = require('drizzle-orm/pg-core');
const { relations } = require('drizzle-orm');

// Users table
const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  role: text('role').notNull().default('appraiser'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Properties table
const properties = pgTable('properties', {
  id: serial('id').primaryKey(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zip_code').notNull(),
  propertyType: text('property_type').notNull(),
  bedrooms: integer('bedrooms'),
  bathrooms: numeric('bathrooms', { precision: 3, scale: 1 }),
  squareFeet: integer('square_feet'),
  lotSize: numeric('lot_size'),
  lotSizeUnit: text('lot_size_unit'),
  yearBuilt: integer('year_built'),
  lastAppraisalDate: date('last_appraisal_date'),
  lastAppraisalValue: integer('last_appraisal_value'),
  ownerId: integer('owner_id').references(() => users.id),
  description: text('description'),
  features: json('features'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Appraisals table
const appraisals = pgTable('appraisals', {
  id: serial('id').primaryKey(),
  propertyId: integer('property_id').notNull().references(() => properties.id),
  appraiserId: integer('appraiser_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  status: text('status').notNull().default('pending'),
  purpose: text('purpose'),
  marketValue: integer('market_value'),
  valuationMethod: text('valuation_method'),
  effectiveDate: date('effective_date'),
  reportDate: date('report_date'),
  clientName: text('client_name'),
  clientEmail: text('client_email'),
  clientPhone: text('client_phone'),
  dueDate: date('due_date'),
  notes: text('notes'),
  metadata: json('metadata'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Comparables table
const comparables = pgTable('comparables', {
  id: serial('id').primaryKey(),
  appraisalId: integer('appraisal_id').notNull().references(() => appraisals.id),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zip_code').notNull(),
  propertyType: text('property_type').notNull(),
  bedrooms: integer('bedrooms'),
  bathrooms: numeric('bathrooms', { precision: 3, scale: 1 }),
  squareFeet: integer('square_feet'),
  lotSize: numeric('lot_size'),
  lotSizeUnit: text('lot_size_unit'),
  yearBuilt: integer('year_built'),
  saleDate: date('sale_date'),
  salePrice: integer('sale_price').notNull(),
  distanceFromSubject: numeric('distance_from_subject'),
  adjustedPrice: integer('adjusted_price'),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Adjustments table
const adjustments = pgTable('adjustments', {
  id: serial('id').primaryKey(),
  comparableId: integer('comparable_id').notNull().references(() => comparables.id),
  name: text('name').notNull(),
  category: text('category').notNull(),
  adjustmentAmount: integer('adjustment_amount').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Attachments table
const attachments = pgTable('attachments', {
  id: serial('id').primaryKey(),
  appraisalId: integer('appraisal_id').notNull().references(() => appraisals.id),
  fileName: text('file_name').notNull(),
  fileType: text('file_type').notNull(),
  fileSize: integer('file_size').notNull(),
  fileUrl: text('file_url').notNull(),
  uploadedBy: integer('uploaded_by').references(() => users.id),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Market Data table
const marketData = pgTable('market_data', {
  id: serial('id').primaryKey(),
  zipCode: text('zip_code').notNull(),
  averagePrice: integer('average_price'),
  medianPrice: integer('median_price'),
  pricePerSqFt: integer('price_per_sqft'),
  inventory: integer('inventory'),
  daysOnMarket: integer('days_on_market'),
  period: text('period').notNull(),
  periodStart: date('period_start').notNull(),
  periodEnd: date('period_end').notNull(),
  propertyType: text('property_type').notNull(),
  transactionCount: integer('transaction_count'),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Define relationships
const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
  appraisals: many(appraisals),
}));

const propertiesRelations = relations(properties, ({ many, one }) => ({
  owner: one(users, {
    fields: [properties.ownerId],
    references: [users.id],
  }),
  appraisals: many(appraisals),
}));

const appraisalsRelations = relations(appraisals, ({ one, many }) => ({
  property: one(properties, {
    fields: [appraisals.propertyId],
    references: [properties.id],
  }),
  appraiser: one(users, {
    fields: [appraisals.appraiserId],
    references: [users.id],
  }),
  comparables: many(comparables),
  attachments: many(attachments),
}));

const comparablesRelations = relations(comparables, ({ one, many }) => ({
  appraisal: one(appraisals, {
    fields: [comparables.appraisalId],
    references: [appraisals.id],
  }),
  adjustments: many(adjustments),
}));

const adjustmentsRelations = relations(adjustments, ({ one }) => ({
  comparable: one(comparables, {
    fields: [adjustments.comparableId],
    references: [comparables.id],
  }),
}));

const attachmentsRelations = relations(attachments, ({ one }) => ({
  appraisal: one(appraisals, {
    fields: [attachments.appraisalId],
    references: [appraisals.id],
  }),
  uploader: one(users, {
    fields: [attachments.uploadedBy],
    references: [users.id],
  }),
}));

module.exports = {
  users,
  properties,
  appraisals,
  comparables,
  adjustments,
  attachments,
  marketData,
  usersRelations,
  propertiesRelations,
  appraisalsRelations,
  comparablesRelations,
  adjustmentsRelations,
  attachmentsRelations
};