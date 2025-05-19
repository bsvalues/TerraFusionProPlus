import { 
  users, properties, appraisals, comparables, attachments,
  type User, type InsertUser,
  type Property, type InsertProperty,
  type Appraisal, type InsertAppraisal,
  type Comparable, type InsertComparable,
  type Attachment, type InsertAttachment
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;
  
  // Property methods
  getProperty(id: number): Promise<Property | undefined>;
  getProperties(userId?: number, limit?: number): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, data: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  
  // Appraisal methods
  getAppraisal(id: number): Promise<Appraisal | undefined>;
  getAppraisals(propertyId?: number, assignedTo?: number, status?: string, limit?: number): Promise<Appraisal[]>;
  createAppraisal(appraisal: InsertAppraisal): Promise<Appraisal>;
  updateAppraisal(id: number, data: Partial<InsertAppraisal>): Promise<Appraisal | undefined>;
  deleteAppraisal(id: number): Promise<boolean>;
  
  // Comparable methods
  getComparable(id: number): Promise<Comparable | undefined>;
  getComparables(appraisalId: number): Promise<Comparable[]>;
  createComparable(comparable: InsertComparable): Promise<Comparable>;
  updateComparable(id: number, data: Partial<InsertComparable>): Promise<Comparable | undefined>;
  deleteComparable(id: number): Promise<boolean>;
  
  // Attachment methods
  getAttachment(id: number): Promise<Attachment | undefined>;
  getAttachments(propertyId?: number, appraisalId?: number, type?: string): Promise<Attachment[]>;
  createAttachment(attachment: InsertAttachment): Promise<Attachment>;
  deleteAttachment(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  // Property methods
  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }
  
  async getProperties(userId?: number, limit: number = 50): Promise<Property[]> {
    let query = db.select().from(properties).limit(limit).orderBy(desc(properties.createdAt));
    
    if (userId) {
      query = query.where(eq(properties.createdById, userId));
    }
    
    return await query;
  }
  
  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db.insert(properties).values(property).returning();
    return newProperty;
  }
  
  async updateProperty(id: number, data: Partial<InsertProperty>): Promise<Property | undefined> {
    const [updatedProperty] = await db
      .update(properties)
      .set({ ...data, updatedAt: sql`NOW()` })
      .where(eq(properties.id, id))
      .returning();
    return updatedProperty;
  }
  
  async deleteProperty(id: number): Promise<boolean> {
    const result = await db.delete(properties).where(eq(properties.id, id));
    return true; // In Drizzle, if the operation doesn't throw, it succeeded
  }
  
  // Appraisal methods
  async getAppraisal(id: number): Promise<Appraisal | undefined> {
    const [appraisal] = await db.select().from(appraisals).where(eq(appraisals.id, id));
    return appraisal;
  }
  
  async getAppraisals(
    propertyId?: number, 
    assignedTo?: number, 
    status?: string, 
    limit: number = 50
  ): Promise<Appraisal[]> {
    let query = db.select().from(appraisals).limit(limit).orderBy(desc(appraisals.createdAt));
    
    // Build conditions dynamically
    const conditions = [];
    if (propertyId) conditions.push(eq(appraisals.propertyId, propertyId));
    if (assignedTo) conditions.push(eq(appraisals.assignedTo, assignedTo));
    if (status) conditions.push(eq(appraisals.status, status));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query;
  }
  
  async createAppraisal(appraisal: InsertAppraisal): Promise<Appraisal> {
    const [newAppraisal] = await db.insert(appraisals).values(appraisal).returning();
    return newAppraisal;
  }
  
  async updateAppraisal(id: number, data: Partial<InsertAppraisal>): Promise<Appraisal | undefined> {
    const [updatedAppraisal] = await db
      .update(appraisals)
      .set({ ...data, updatedAt: sql`NOW()` })
      .where(eq(appraisals.id, id))
      .returning();
    return updatedAppraisal;
  }
  
  async deleteAppraisal(id: number): Promise<boolean> {
    await db.delete(appraisals).where(eq(appraisals.id, id));
    return true;
  }
  
  // Comparable methods
  async getComparable(id: number): Promise<Comparable | undefined> {
    const [comparable] = await db.select().from(comparables).where(eq(comparables.id, id));
    return comparable;
  }
  
  async getComparables(appraisalId: number): Promise<Comparable[]> {
    return await db
      .select()
      .from(comparables)
      .where(eq(comparables.appraisalId, appraisalId))
      .orderBy(desc(comparables.createdAt));
  }
  
  async createComparable(comparable: InsertComparable): Promise<Comparable> {
    const [newComparable] = await db.insert(comparables).values(comparable).returning();
    return newComparable;
  }
  
  async updateComparable(id: number, data: Partial<InsertComparable>): Promise<Comparable | undefined> {
    const [updatedComparable] = await db
      .update(comparables)
      .set(data)
      .where(eq(comparables.id, id))
      .returning();
    return updatedComparable;
  }
  
  async deleteComparable(id: number): Promise<boolean> {
    await db.delete(comparables).where(eq(comparables.id, id));
    return true;
  }
  
  // Attachment methods
  async getAttachment(id: number): Promise<Attachment | undefined> {
    const [attachment] = await db.select().from(attachments).where(eq(attachments.id, id));
    return attachment;
  }
  
  async getAttachments(
    propertyId?: number,
    appraisalId?: number,
    type?: string
  ): Promise<Attachment[]> {
    let query = db.select().from(attachments).orderBy(desc(attachments.createdAt));
    
    // Build conditions dynamically
    const conditions = [];
    if (propertyId) conditions.push(eq(attachments.propertyId, propertyId));
    if (appraisalId) conditions.push(eq(attachments.appraisalId, appraisalId));
    if (type) conditions.push(eq(attachments.type, type));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query;
  }
  
  async createAttachment(attachment: InsertAttachment): Promise<Attachment> {
    const [newAttachment] = await db.insert(attachments).values(attachment).returning();
    return newAttachment;
  }
  
  async deleteAttachment(id: number): Promise<boolean> {
    await db.delete(attachments).where(eq(attachments.id, id));
    return true;
  }
}

export const storage = new DatabaseStorage();
