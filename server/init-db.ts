import { db } from './db';
import { users, properties, appraisals, comparables, adjustments, attachments, marketData } from '../shared/schema';
import { sql } from 'drizzle-orm';

// Function to initialize the database schema
async function initializeDatabase() {
  console.log('Starting database initialization...');
  
  try {
    // Create schemas in order of dependencies
    console.log('Creating database schema...');
    
    // Verify connection
    const result = await db.execute(sql`SELECT NOW()`);
    console.log('Database connection successful.');
    
    // Create schema using drizzle-kit (this is normally done via drizzle-kit migrate command)
    // But we'll execute it here for initial setup
    
    // Sample data for testing
    // Insert a test user
    const [testUser] = await db.insert(users).values({
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123', // In production, this would be hashed
      role: 'appraiser',
      isActive: true
    }).returning();
    
    console.log('Test user created:', testUser);
    
    // Insert a test property
    const propertyData = {
      address: '123 Main Street',
      city: 'Austin',
      state: 'TX',
      zip_code: '78701',
      property_type: 'Single Family',
      year_built: 2005,
      square_feet: 2450,
      bedrooms: 3,
      bathrooms: 2.5,
      lot_size: 8500,
      description: 'Beautiful family home in a desirable neighborhood',
      parcel_number: '10-4567-89',
      zoning: 'Residential (R-1)',
      latitude: 30.267153,
      longitude: -97.743057,
      features: {
        pool: true,
        garage: '2-Car Attached',
        fireplace: true,
        stories: 2
      }
    };
    
    const [testProperty] = await db.insert(properties).values(propertyData).returning();
    
    console.log('Test property created:', testProperty);
    
    // Insert a test appraisal
    const [testAppraisal] = await db.insert(appraisals).values({
      propertyId: testProperty.id,
      appraiserId: testUser.id,
      status: 'Completed',
      purpose: 'Refinance',
      marketValue: 975000,
      inspectionDate: new Date('2024-05-18T00:00:00Z'),
      effectiveDate: new Date('2024-05-20T00:00:00Z'),
      reportType: 'Form 1004',
      clientName: 'First National Bank',
      clientEmail: 'loans@firstnational.example',
      clientPhone: '555-123-4567',
      lenderName: 'First National Bank',
      loanNumber: 'L-12345',
      intendedUse: 'Refinance transaction',
      valuationMethod: 'Sales Comparison Approach',
      scopeOfWork: 'Full appraisal with interior and exterior inspection',
    }).returning();
    
    console.log('Test appraisal created:', testAppraisal);
    
    // Insert test comparables
    const comparableData = [
      {
        appraisalId: testAppraisal.id,
        address: '456 Oak Avenue',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        salePrice: 925000,
        saleDate: new Date('2024-03-15T00:00:00Z'),
        squareFeet: 2350,
        bedrooms: 3,
        bathrooms: 2,
        yearBuilt: 2003,
        propertyType: 'Single Family',
        lotSize: 7500,
        condition: 'Good',
        daysOnMarket: 28,
        source: 'MLS',
        adjustedPrice: 952000,
        adjustmentNotes: 'Adjusted for smaller square footage and lot size',
      },
      {
        appraisalId: testAppraisal.id,
        address: '789 Elm Drive',
        city: 'Austin',
        state: 'TX',
        zipCode: '78704',
        salePrice: 1050000,
        saleDate: new Date('2024-04-02T00:00:00Z'),
        squareFeet: 2650,
        bedrooms: 4,
        bathrooms: 3,
        yearBuilt: 2008,
        propertyType: 'Single Family',
        lotSize: 9000,
        condition: 'Excellent',
        daysOnMarket: 14,
        source: 'MLS',
        adjustedPrice: 985000,
        adjustmentNotes: 'Adjusted for larger square footage and newer construction',
      }
    ];
    
    for (const comparable of comparableData) {
      const [testComparable] = await db.insert(comparables).values(comparable).returning();
      console.log('Test comparable created:', testComparable);
      
      // Add adjustments for this comparable
      const [testAdjustment] = await db.insert(adjustments).values({
        comparableId: testComparable.id,
        category: 'Size',
        description: 'Square Footage Adjustment',
        amount: 15000,
        isPercentage: false,
        notes: 'Adjustment for difference in size'
      }).returning();
      
      console.log('Test adjustment created:', testAdjustment);
    }
    
    // Insert test market data
    const marketDataPoints = [
      {
        location: 'Austin, TX',
        dataType: 'MedianPrice',
        time: 'May 2024',
        value: 550000,
        comparisonValue: 525000,
        percentChange: 4.76,
        source: 'Local MLS',
        notes: 'Monthly median sales price'
      },
      {
        location: 'Austin, TX',
        dataType: 'DaysOnMarket',
        time: 'May 2024',
        value: 32,
        comparisonValue: 35,
        percentChange: -8.57,
        source: 'Local MLS',
        notes: 'Average days on market'
      }
    ];
    
    for (const dataPoint of marketDataPoints) {
      const [marketDataEntry] = await db.insert(marketData).values(dataPoint).returning();
      console.log('Test market data created:', marketDataEntry);
    }
    
    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Execute if this file is run directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization script completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}

export { initializeDatabase };