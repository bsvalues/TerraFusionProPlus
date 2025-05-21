const { db } = require('./db');
const { eq } = require('drizzle-orm');
const { 
  properties, 
  appraisals, 
  comparables, 
  adjustments, 
  attachments, 
  marketData,
  users
} = require('../shared/schema');

class DatabaseStorage {
  // User operations
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username) {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(userData) {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }

  async updateUser(id, userData) {
    const result = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  // Property operations
  async getProperty(id) {
    const result = await db.select().from(properties).where(eq(properties.id, id));
    return result[0];
  }
  
  async getProperties(filters = {}) {
    let query = db.select().from(properties);
    
    // Apply filters if they exist
    if (filters.propertyType) {
      query = query.where(eq(properties.propertyType, filters.propertyType));
    }
    
    if (filters.zipCode) {
      query = query.where(eq(properties.zipCode, filters.zipCode));
    }
    
    return await query;
  }
  
  async createProperty(propertyData) {
    const result = await db.insert(properties).values(propertyData).returning();
    return result[0];
  }
  
  async updateProperty(id, propertyData) {
    const result = await db.update(properties)
      .set(propertyData)
      .where(eq(properties.id, id))
      .returning();
    return result[0];
  }
  
  async deleteProperty(id) {
    await db.delete(properties).where(eq(properties.id, id));
    return true;
  }

  // Appraisal operations
  async getAppraisal(id) {
    const result = await db.select().from(appraisals).where(eq(appraisals.id, id));
    return result[0];
  }
  
  async getAppraisalsByProperty(propertyId) {
    return await db.select().from(appraisals).where(eq(appraisals.propertyId, propertyId));
  }
  
  async getAppraisalsByAppraiser(appraiserId) {
    return await db.select().from(appraisals).where(eq(appraisals.appraiserId, appraiserId));
  }
  
  async createAppraisal(appraisalData) {
    const result = await db.insert(appraisals).values(appraisalData).returning();
    return result[0];
  }
  
  async updateAppraisal(id, appraisalData) {
    const result = await db.update(appraisals)
      .set(appraisalData)
      .where(eq(appraisals.id, id))
      .returning();
    return result[0];
  }
  
  async deleteAppraisal(id) {
    await db.delete(appraisals).where(eq(appraisals.id, id));
    return true;
  }

  // Comparable operations
  async getComparable(id) {
    const result = await db.select().from(comparables).where(eq(comparables.id, id));
    return result[0];
  }
  
  async getComparablesByAppraisal(appraisalId) {
    return await db.select().from(comparables).where(eq(comparables.appraisalId, appraisalId));
  }
  
  async createComparable(comparableData) {
    const result = await db.insert(comparables).values(comparableData).returning();
    return result[0];
  }
  
  async updateComparable(id, comparableData) {
    const result = await db.update(comparables)
      .set(comparableData)
      .where(eq(comparables.id, id))
      .returning();
    return result[0];
  }
  
  async deleteComparable(id) {
    await db.delete(comparables).where(eq(comparables.id, id));
    return true;
  }

  // Adjustment operations
  async getAdjustment(id) {
    const result = await db.select().from(adjustments).where(eq(adjustments.id, id));
    return result[0];
  }
  
  async getAdjustmentsByComparable(comparableId) {
    return await db.select().from(adjustments).where(eq(adjustments.comparableId, comparableId));
  }
  
  async createAdjustment(adjustmentData) {
    const result = await db.insert(adjustments).values(adjustmentData).returning();
    return result[0];
  }
  
  async updateAdjustment(id, adjustmentData) {
    const result = await db.update(adjustments)
      .set(adjustmentData)
      .where(eq(adjustments.id, id))
      .returning();
    return result[0];
  }
  
  async deleteAdjustment(id) {
    await db.delete(adjustments).where(eq(adjustments.id, id));
    return true;
  }

  // Attachment operations
  async getAttachment(id) {
    const result = await db.select().from(attachments).where(eq(attachments.id, id));
    return result[0];
  }
  
  async getAttachmentsByAppraisal(appraisalId) {
    return await db.select().from(attachments).where(eq(attachments.appraisalId, appraisalId));
  }
  
  async createAttachment(attachmentData) {
    const result = await db.insert(attachments).values(attachmentData).returning();
    return result[0];
  }
  
  async deleteAttachment(id) {
    await db.delete(attachments).where(eq(attachments.id, id));
    return true;
  }

  // Market data operations
  async getMarketData(id) {
    const result = await db.select().from(marketData).where(eq(marketData.id, id));
    return result[0];
  }
  
  async getMarketDataByZipCode(zipCode) {
    return await db.select().from(marketData).where(eq(marketData.zipCode, zipCode));
  }
  
  async createMarketData(marketDataRecord) {
    const result = await db.insert(marketData).values(marketDataRecord).returning();
    return result[0];
  }
  
  async getMarketDataForProperty(propertyId) {
    // Get property's zip code
    const property = await this.getProperty(propertyId);
    if (!property) return [];
    
    // Fetch market data for the property's zip code
    return await this.getMarketDataByZipCode(property.zipCode);
  }
}

const storage = new DatabaseStorage();

module.exports = { storage };