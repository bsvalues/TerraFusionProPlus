const { eq, and, desc } = require('drizzle-orm');
const { db } = require('./db');
const schema = require('../shared/schema');

// Extract schema objects
const {
  users,
  properties,
  appraisals,
  comparables,
  adjustments,
  attachments,
  marketData
} = schema;

class DatabaseStorage {
  // User operations
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByUsername(username) {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async createUser(insertUser) {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(id, userData) {
    const result = await db.update(users).set(userData).where(eq(users.id, id)).returning();
    return result.length > 0 ? result[0] : undefined;
  }

  // Property operations
  async getProperty(id) {
    const result = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getProperties(filters = {}) {
    let query = db.select().from(properties);

    if (filters) {
      if (filters.propertyType) {
        query = query.where(eq(properties.propertyType, filters.propertyType));
      }
      
      if (filters.city) {
        query = query.where(eq(properties.city, filters.city));
      }
      
      if (filters.state) {
        query = query.where(eq(properties.state, filters.state));
      }
      
      if (filters.zipCode) {
        query = query.where(eq(properties.zipCode, filters.zipCode));
      }
    }
    
    query = query.orderBy(desc(properties.createdAt));
    
    return query;
  }

  async createProperty(insertProperty) {
    const result = await db.insert(properties).values(insertProperty).returning();
    return result[0];
  }

  async updateProperty(id, propertyData) {
    const result = await db.update(properties).set(propertyData).where(eq(properties.id, id)).returning();
    return result.length > 0 ? result[0] : undefined;
  }

  async deleteProperty(id) {
    // First check if the property exists
    const property = await this.getProperty(id);
    if (!property) {
      return false;
    }
    
    // Check if there are any appraisals for this property
    const propertyAppraisals = await this.getAppraisalsByProperty(id);
    
    if (propertyAppraisals.length > 0) {
      // If there are appraisals, we should not allow deletion
      // In a real application, you might want to implement cascading deletion or soft deletion
      return false;
    }
    
    const result = await db.delete(properties).where(eq(properties.id, id)).returning();
    return result.length > 0;
  }

  // Appraisal operations
  async getAppraisal(id) {
    const result = await db.select().from(appraisals).where(eq(appraisals.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getAppraisalsByProperty(propertyId) {
    return db.select().from(appraisals).where(eq(appraisals.propertyId, propertyId));
  }

  async getAppraisalsByAppraiser(appraiserId) {
    return db.select().from(appraisals).where(eq(appraisals.appraiserId, appraiserId));
  }

  async createAppraisal(insertAppraisal) {
    const result = await db.insert(appraisals).values(insertAppraisal).returning();
    return result[0];
  }

  async updateAppraisal(id, appraisalData) {
    const result = await db.update(appraisals).set(appraisalData).where(eq(appraisals.id, id)).returning();
    return result.length > 0 ? result[0] : undefined;
  }

  async deleteAppraisal(id) {
    // First check if the appraisal exists
    const appraisal = await this.getAppraisal(id);
    if (!appraisal) {
      return false;
    }
    
    // In a real application, you would likely need to delete related records first
    // or use cascading deletes in the database
    
    // Delete any comparables associated with this appraisal
    const appraisalComparables = await this.getComparablesByAppraisal(id);
    for (const comparable of appraisalComparables) {
      await this.deleteComparable(comparable.id);
    }
    
    // Delete any attachments associated with this appraisal
    const appraisalAttachments = await this.getAttachmentsByAppraisal(id);
    for (const attachment of appraisalAttachments) {
      await this.deleteAttachment(attachment.id);
    }
    
    const result = await db.delete(appraisals).where(eq(appraisals.id, id)).returning();
    return result.length > 0;
  }

  // Comparable operations
  async getComparable(id) {
    const result = await db.select().from(comparables).where(eq(comparables.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getComparablesByAppraisal(appraisalId) {
    return db.select().from(comparables).where(eq(comparables.appraisalId, appraisalId));
  }

  async createComparable(insertComparable) {
    const result = await db.insert(comparables).values(insertComparable).returning();
    return result[0];
  }

  async updateComparable(id, comparableData) {
    const result = await db.update(comparables).set(comparableData).where(eq(comparables.id, id)).returning();
    return result.length > 0 ? result[0] : undefined;
  }

  async deleteComparable(id) {
    // First check if the comparable exists
    const comparable = await this.getComparable(id);
    if (!comparable) {
      return false;
    }
    
    // Delete any adjustments associated with this comparable
    const comparableAdjustments = await this.getAdjustmentsByComparable(id);
    for (const adjustment of comparableAdjustments) {
      await this.deleteAdjustment(adjustment.id);
    }
    
    const result = await db.delete(comparables).where(eq(comparables.id, id)).returning();
    return result.length > 0;
  }

  // Adjustment operations
  async getAdjustment(id) {
    const result = await db.select().from(adjustments).where(eq(adjustments.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getAdjustmentsByComparable(comparableId) {
    return db.select().from(adjustments).where(eq(adjustments.comparableId, comparableId));
  }

  async createAdjustment(insertAdjustment) {
    const result = await db.insert(adjustments).values(insertAdjustment).returning();
    return result[0];
  }

  async updateAdjustment(id, adjustmentData) {
    const result = await db.update(adjustments).set(adjustmentData).where(eq(adjustments.id, id)).returning();
    return result.length > 0 ? result[0] : undefined;
  }

  async deleteAdjustment(id) {
    const result = await db.delete(adjustments).where(eq(adjustments.id, id)).returning();
    return result.length > 0;
  }

  // Attachment operations
  async getAttachment(id) {
    const result = await db.select().from(attachments).where(eq(attachments.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getAttachmentsByAppraisal(appraisalId) {
    return db.select().from(attachments).where(eq(attachments.appraisalId, appraisalId));
  }

  async createAttachment(insertAttachment) {
    const result = await db.insert(attachments).values(insertAttachment).returning();
    return result[0];
  }

  async deleteAttachment(id) {
    const result = await db.delete(attachments).where(eq(attachments.id, id)).returning();
    return result.length > 0;
  }

  // Market data operations
  async getMarketData(id) {
    const result = await db.select().from(marketData).where(eq(marketData.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getMarketDataByZipCode(zipCode) {
    return db.select().from(marketData).where(eq(marketData.zipCode, zipCode));
  }

  async createMarketData(insertMarketData) {
    const result = await db.insert(marketData).values(insertMarketData).returning();
    return result[0];
  }

  async getMarketDataForProperty(propertyId) {
    // First get the property to get its zip code
    const property = await this.getProperty(propertyId);
    if (!property) {
      return [];
    }
    
    // Then get market data for that zip code
    return this.getMarketDataByZipCode(property.zipCode);
  }
}

const storage = new DatabaseStorage();

module.exports = {
  storage
};