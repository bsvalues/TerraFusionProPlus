import { eq, and, desc } from 'drizzle-orm';
import { db } from './db';
import {
  users, properties, appraisals, comparables, adjustments, attachments, marketData,
  User, InsertUser,
  Property, InsertProperty,
  Appraisal, InsertAppraisal,
  Comparable, InsertComparable,
  Adjustment, InsertAdjustment,
  Attachment, InsertAttachment,
  MarketData, InsertMarketData
} from '../shared/schema';

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Property operations
  getProperty(id: number): Promise<Property | undefined>;
  getProperties(filters?: Partial<Property>): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  
  // Appraisal operations
  getAppraisal(id: number): Promise<Appraisal | undefined>;
  getAppraisalsByProperty(propertyId: number): Promise<Appraisal[]>;
  getAppraisalsByAppraiser(appraiserId: number): Promise<Appraisal[]>;
  createAppraisal(appraisal: InsertAppraisal): Promise<Appraisal>;
  updateAppraisal(id: number, appraisal: Partial<InsertAppraisal>): Promise<Appraisal | undefined>;
  deleteAppraisal(id: number): Promise<boolean>;
  
  // Comparable operations
  getComparable(id: number): Promise<Comparable | undefined>;
  getComparablesByAppraisal(appraisalId: number): Promise<Comparable[]>;
  createComparable(comparable: InsertComparable): Promise<Comparable>;
  updateComparable(id: number, comparable: Partial<InsertComparable>): Promise<Comparable | undefined>;
  deleteComparable(id: number): Promise<boolean>;
  
  // Adjustment operations
  getAdjustment(id: number): Promise<Adjustment | undefined>;
  getAdjustmentsByComparable(comparableId: number): Promise<Adjustment[]>;
  createAdjustment(adjustment: InsertAdjustment): Promise<Adjustment>;
  updateAdjustment(id: number, adjustment: Partial<InsertAdjustment>): Promise<Adjustment | undefined>;
  deleteAdjustment(id: number): Promise<boolean>;
  
  // Attachment operations
  getAttachment(id: number): Promise<Attachment | undefined>;
  getAttachmentsByAppraisal(appraisalId: number): Promise<Attachment[]>;
  createAttachment(attachment: InsertAttachment): Promise<Attachment>;
  deleteAttachment(id: number): Promise<boolean>;
  
  // Market data operations
  getMarketData(id: number): Promise<MarketData | undefined>;
  getMarketDataByZipCode(zipCode: string): Promise<MarketData[]>;
  createMarketData(marketData: InsertMarketData): Promise<MarketData>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return results[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return results[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const results = await db.insert(users).values(insertUser).returning();
    return results[0];
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const results = await db.update(users).set(userData).where(eq(users.id, id)).returning();
    return results[0];
  }

  // Property operations
  async getProperty(id: number): Promise<Property | undefined> {
    const results = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
    return results[0];
  }

  async getProperties(filters?: Partial<Property>): Promise<Property[]> {
    let query = db.select().from(properties);
    
    if (filters) {
      // Add filters if provided
      if (filters.city) {
        query = query.where(eq(properties.city, filters.city));
      }
      if (filters.state) {
        query = query.where(eq(properties.state, filters.state));
      }
      if (filters.zipCode) {
        query = query.where(eq(properties.zipCode, filters.zipCode));
      }
      if (filters.propertyType) {
        query = query.where(eq(properties.propertyType, filters.propertyType));
      }
    }
    
    return await query.orderBy(desc(properties.createdAt));
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const results = await db.insert(properties).values(insertProperty).returning();
    return results[0];
  }

  async updateProperty(id: number, propertyData: Partial<InsertProperty>): Promise<Property | undefined> {
    const results = await db.update(properties)
      .set({
        ...propertyData,
        updatedAt: new Date()
      })
      .where(eq(properties.id, id))
      .returning();
    return results[0];
  }

  async deleteProperty(id: number): Promise<boolean> {
    const results = await db.delete(properties).where(eq(properties.id, id)).returning();
    return results.length > 0;
  }

  // Appraisal operations
  async getAppraisal(id: number): Promise<Appraisal | undefined> {
    const results = await db.select().from(appraisals).where(eq(appraisals.id, id)).limit(1);
    return results[0];
  }

  async getAppraisalsByProperty(propertyId: number): Promise<Appraisal[]> {
    return await db.select().from(appraisals).where(eq(appraisals.propertyId, propertyId));
  }

  async getAppraisalsByAppraiser(appraiserId: number): Promise<Appraisal[]> {
    return await db.select().from(appraisals).where(eq(appraisals.appraiserId, appraiserId));
  }

  async createAppraisal(insertAppraisal: InsertAppraisal): Promise<Appraisal> {
    const results = await db.insert(appraisals).values(insertAppraisal).returning();
    return results[0];
  }

  async updateAppraisal(id: number, appraisalData: Partial<InsertAppraisal>): Promise<Appraisal | undefined> {
    const results = await db.update(appraisals).set(appraisalData).where(eq(appraisals.id, id)).returning();
    return results[0];
  }

  async deleteAppraisal(id: number): Promise<boolean> {
    const results = await db.delete(appraisals).where(eq(appraisals.id, id)).returning();
    return results.length > 0;
  }

  // Comparable operations
  async getComparable(id: number): Promise<Comparable | undefined> {
    const results = await db.select().from(comparables).where(eq(comparables.id, id)).limit(1);
    return results[0];
  }

  async getComparablesByAppraisal(appraisalId: number): Promise<Comparable[]> {
    return await db.select().from(comparables).where(eq(comparables.appraisalId, appraisalId));
  }

  async createComparable(insertComparable: InsertComparable): Promise<Comparable> {
    const results = await db.insert(comparables).values(insertComparable).returning();
    return results[0];
  }

  async updateComparable(id: number, comparableData: Partial<InsertComparable>): Promise<Comparable | undefined> {
    const results = await db.update(comparables).set(comparableData).where(eq(comparables.id, id)).returning();
    return results[0];
  }

  async deleteComparable(id: number): Promise<boolean> {
    const results = await db.delete(comparables).where(eq(comparables.id, id)).returning();
    return results.length > 0;
  }

  // Adjustment operations
  async getAdjustment(id: number): Promise<Adjustment | undefined> {
    const results = await db.select().from(adjustments).where(eq(adjustments.id, id)).limit(1);
    return results[0];
  }

  async getAdjustmentsByComparable(comparableId: number): Promise<Adjustment[]> {
    return await db.select().from(adjustments).where(eq(adjustments.comparableId, comparableId));
  }

  async createAdjustment(insertAdjustment: InsertAdjustment): Promise<Adjustment> {
    const results = await db.insert(adjustments).values(insertAdjustment).returning();
    return results[0];
  }

  async updateAdjustment(id: number, adjustmentData: Partial<InsertAdjustment>): Promise<Adjustment | undefined> {
    const results = await db.update(adjustments).set(adjustmentData).where(eq(adjustments.id, id)).returning();
    return results[0];
  }

  async deleteAdjustment(id: number): Promise<boolean> {
    const results = await db.delete(adjustments).where(eq(adjustments.id, id)).returning();
    return results.length > 0;
  }

  // Attachment operations
  async getAttachment(id: number): Promise<Attachment | undefined> {
    const results = await db.select().from(attachments).where(eq(attachments.id, id)).limit(1);
    return results[0];
  }

  async getAttachmentsByAppraisal(appraisalId: number): Promise<Attachment[]> {
    return await db.select().from(attachments).where(eq(attachments.appraisalId, appraisalId));
  }

  async createAttachment(insertAttachment: InsertAttachment): Promise<Attachment> {
    const results = await db.insert(attachments).values(insertAttachment).returning();
    return results[0];
  }

  async deleteAttachment(id: number): Promise<boolean> {
    const results = await db.delete(attachments).where(eq(attachments.id, id)).returning();
    return results.length > 0;
  }

  // Market data operations
  async getMarketData(id: number): Promise<MarketData | undefined> {
    const results = await db.select().from(marketData).where(eq(marketData.id, id)).limit(1);
    return results[0];
  }

  async getMarketDataByZipCode(zipCode: string): Promise<MarketData[]> {
    return await db.select().from(marketData).where(eq(marketData.zipCode, zipCode)).orderBy(desc(marketData.date));
  }

  async createMarketData(insertMarketData: InsertMarketData): Promise<MarketData> {
    const results = await db.insert(marketData).values(insertMarketData).returning();
    return results[0];
  }

  // Helper method to get market data for a property based on zip code
  async getMarketDataForProperty(propertyId: number): Promise<MarketData[]> {
    const property = await this.getProperty(propertyId);
    if (!property) {
      return [];
    }
    
    return await this.getMarketDataByZipCode(property.zipCode);
  }
}

// Export a singleton instance of the storage
export const storage = new DatabaseStorage();