// const path = require('path');
// // Force dotenv to load the exact .env.local file from the project root
// require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

// const { MongoClient } = require('mongodb');
// const { createClient } = require('@supabase/supabase-js');
// const { randomUUID } = require('crypto');

// // --- Configuration ---
// const MONGO_URI = process.env.MONGODB_URI;
// const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// if (!MONGO_URI || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
//   console.error("❌ ERROR: Missing environment variables in .env.local");
//   process.exit(1);
// }

// console.log("✅ Environment variables loaded successfully!");

// const mongoClient = new MongoClient(MONGO_URI);
// const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// const userIdMap = new Map();
// const categoryIdMap = new Map();

// async function migrate() {
//   console.log('🚀 Starting Migration...');
  
//   try {
//     await mongoClient.connect();
//     console.log('✅ Connected to MongoDB');
    
//     // 1. DOUBLE CHECK YOUR DATABASE NAME HERE
//     const db = mongoClient.db('test'); 
    
//     // Diagnostic: Let's see what collections actually exist
//     const collections = await db.listCollections().toArray();
//     console.log("📂 Found Collections:", collections.map(c => c.name));
//     if (collections.length === 0) {
//         console.log("⚠️ No collections found. Is your database name correct?");
//     }

//     // ==========================================
//     // 1. MIGRATE USERS
//     // ==========================================
//     console.log('⏳ Migrating Users...');
//     const users = await db.collection('users').find({}).toArray();
    
//     for (const user of users) {
//       const newId = randomUUID();
//       userIdMap.set(user._id.toString(), newId);

//       const { error } = await supabase.from('users').insert({
//         id: newId,
//         first_name: user.firstName || 'Unknown',
//         last_name: user.lastName || 'User',
//         email: user.email,
//         password: user.password,
//         created_at: user.createdAt || new Date().toISOString(),
//       });

//       if (error && error.code !== '23505') {
//         console.error(`❌ Failed to insert user ${user.email}:`, error.message);
//       }
//     }
//     console.log(`✅ Migrated ${users.length} Users.`);

//     // ==========================================
//     // 2. MIGRATE CATEGORIES
//     // ==========================================
//     console.log('⏳ Migrating Categories...');
//     const categories = await db.collection('categories').find({}).toArray();
    
//     for (const cat of categories) {
//       const newCatId = randomUUID();
//       categoryIdMap.set(cat._id.toString(), newCatId);
      
//       // Handle different possible field names in your DB
//       const oldUserId = (cat.userId || cat.user_id)?.toString();
//       const newUserId = userIdMap.get(oldUserId);

//       if (!newUserId) continue; 

//       const { error } = await supabase.from('categories').insert({
//         id: newCatId,
//         user_id: newUserId,
//         name: cat.name,
//         type: cat.type,
//       });

//       if (error) console.error(`❌ Failed to insert category ${cat.name}:`, error.message);
//     }
//     console.log(`✅ Migrated ${categories.length} Categories.`);

//     // ==========================================
//     // 3. MIGRATE TRANSACTIONS
//     // ==========================================
//     console.log('⏳ Migrating Transactions...');
//     const transactions = await db.collection('transactions').find({}).toArray();
    
//     for (const t of transactions) {
//       const oldUserId = (t.userId || t.user_id)?.toString();
//       const oldCatId = (t.catId || t.categoryId)?.toString();
      
//       const newUserId = userIdMap.get(oldUserId);
//       const newCatId = categoryIdMap.get(oldCatId);

//       if (!newUserId || !newCatId) {
//           console.log(`⚠️ Skipping transaction: Missing mapped User or Category.`);
//           continue;
//       }

//       const { error } = await supabase.from('transactions').insert({
//         user_id: newUserId,
//         category_id: newCatId,
//         amount: t.amount,
//         type: t.type,
//         date: t.date,
//         note: t.note || '',
//         created_at: t.createdAt || new Date().toISOString(),
//       });

//       if (error) console.error(`❌ Failed to insert transaction:`, error.message);
//     }
//     console.log(`✅ Migrated ${transactions.length} Transactions.`);

//     // ==========================================
//     // 4. MIGRATE BUDGETS (If you have them)
//     // ==========================================
//     const budgets = await db.collection('budgets').find({}).toArray();
//     if (budgets.length > 0) {
//         console.log('⏳ Migrating Budgets...');
//         for (const b of budgets) {
//             const oldUserId = (b.userId || b.user_id)?.toString();
//             const oldCatId = (b.catId || b.categoryId)?.toString();
            
//             const newUserId = userIdMap.get(oldUserId);
//             const newCatId = categoryIdMap.get(oldCatId);

//             if (!newUserId || !newCatId) continue;

//             await supabase.from('budgets').insert({
//                 user_id: newUserId,
//                 category_id: newCatId,
//                 limit_amount: b.limit,
//                 month: b.month
//             });
//         }
//         console.log(`✅ Migrated ${budgets.length} Budgets.`);
//     }

//     console.log('🎉 Migration Complete!');

//   } catch (err) {
//     console.error('❌ Migration Failed:', err);
//   } finally {
//     await mongoClient.close();
//   }
// }

// migrate();























































const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

const { MongoClient } = require('mongodb');
const { createClient } = require('@supabase/supabase-js');

const MONGO_URI = process.env.MONGODB_URI;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!MONGO_URI || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ ERROR: Missing environment variables in .env.local");
  process.exit(1);
}

const mongoClient = new MongoClient(MONGO_URI);
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function migrate() {
  console.log('🚀 Starting Migration...');
  
  try {
    await mongoClient.connect();
    const db = mongoClient.db('test'); // Make sure this is your actual DB name

    // ==========================================
    // 1. MIGRATE USERS
    // ==========================================
    console.log('⏳ Migrating Users...');
    const users = await db.collection('users').find({}).toArray();
    
    for (const user of users) {
      // Use the Mongo _id instead of a random UUID!
      const originalId = user._id.toString();

      const { error } = await supabase.from('users').upsert({
        id: originalId,
        first_name: user.firstName || 'Unknown',
        last_name: user.lastName || 'User',
        email: user.email,
        password: user.password,
      });

      if (error) {
        console.error(`❌ Failed to insert user ${user.email}:`, error.message);
      }
    }
    console.log(`✅ Migrated ${users.length} Users.`);

    // ==========================================
    // 2. MIGRATE CATEGORIES
    // ==========================================
    console.log('⏳ Migrating Categories...');
    const categories = await db.collection('categories').find({}).toArray();
    
    for (const cat of categories) {
      const originalCatId = cat._id.toString();
      const originalUserId = (cat.userId || cat.user_id)?.toString();

      const { error } = await supabase.from('categories').upsert({
        id: originalCatId,
        user_id: originalUserId,
        name: cat.name,
        type: cat.type,
      });

      if (error) console.error(`❌ Failed to insert category ${cat.name}:`, error.message);
    }
    console.log(`✅ Migrated ${categories.length} Categories.`);

    // ==========================================
    // 3. MIGRATE TRANSACTIONS
    // ==========================================
    console.log('⏳ Migrating Transactions...');
    const transactions = await db.collection('transactions').find({}).toArray();
    
    for (const t of transactions) {
      const originalUserId = (t.userId || t.user_id)?.toString();
      const originalCatId = (t.catId || t.categoryId)?.toString();

      const { error } = await supabase.from('transactions').upsert({
        id: t._id.toString(),
        user_id: originalUserId,
        category_id: originalCatId,
        amount: t.amount,
        type: t.type,
        date: t.date,
        note: t.note || '',
      });

      if (error) console.error(`❌ Failed to insert transaction ${t._id}:`, error.message);
    }
    console.log(`✅ Migrated ${transactions.length} Transactions.`);

    // ==========================================
    // 4. MIGRATE BUDGETS
    // ==========================================
    const budgets = await db.collection('budgets').find({}).toArray();
    console.log('⏳ Migrating Budgets...');
    for (const b of budgets) {
        const originalUserId = (b.userId || b.user_id)?.toString();
        const originalCatId = (b.catId || b.categoryId)?.toString();

        const { error } = await supabase.from('budgets').upsert({
            id: b._id.toString(),
            user_id: originalUserId,
            category_id: originalCatId,
            limit_amount: b.limit || b.monthlyLimit, // Handle both field names
            month: b.month
        });
        if (error) console.error(`❌ Failed to insert budget:`, error.message);
    }
    console.log(`✅ Migrated ${budgets.length} Budgets.`);

    console.log('🎉 Migration Complete!');

  } catch (err) {
    console.error('❌ Migration Failed:', err);
  } finally {
    await mongoClient.close();
  }
}

migrate();