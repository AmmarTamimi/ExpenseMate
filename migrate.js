const path = require('path');
// Force dotenv to load the exact .env.local file from the project root
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

const { MongoClient } = require('mongodb');
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

// --- Configuration ---
const MONGO_URI = process.env.MONGODB_URI;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 🛑 STOP IF VARIABLES ARE MISSING
if (!MONGO_URI) {
  console.error("❌ ERROR: MONGODB_URI is missing from .env.local");
  process.exit(1);
}
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ ERROR: Supabase credentials missing from .env.local");
  process.exit(1);
}

console.log("✅ Environment variables loaded successfully!");
console.log("📡 Connecting to MongoDB Atlas...");

// Now it is safe to initialize
const mongoClient = new MongoClient(MONGO_URI);
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Maps to link old Mongo ObjectIds to new Supabase UUIDs
const userIdMap = new Map();
const categoryIdMap = new Map();

// ... (Keep the rest of your migrate() function exactly the same) ...

async function migrate() {
  console.log('🚀 Starting Migration...');
  
  try {
    await mongoClient.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = mongoClient.db('expense-tracker'); // Change this if your DB name is different

    // ==========================================
    // 1. MIGRATE USERS
    // ==========================================
    console.log('⏳ Migrating Users...');
    const users = await db.collection('users').find({}).toArray();
    
    for (const user of users) {
      const newId = randomUUID();
      userIdMap.set(user._id.toString(), newId);

      const { error } = await supabase.from('users').insert({
        id: newId,
        first_name: user.firstName || 'Unknown',
        last_name: user.lastName || 'User',
        email: user.email,
        password: user.password,
        created_at: user.createdAt || new Date().toISOString(),
      });

      if (error) {
        if (error.code === '23505') { // Postgres unique violation (email exists)
            console.log(`⚠️ User ${user.email} already exists, skipping.`);
        } else {
            console.error(`❌ Failed to insert user ${user.email}:`, error);
        }
      }
    }
    console.log(`✅ Migrated ${users.length} Users.`);

    // ==========================================
    // 2. MIGRATE CATEGORIES
    // ==========================================
    console.log('⏳ Migrating Categories...');
    const categories = await db.collection('categories').find({}).toArray();
    
    for (const cat of categories) {
      const newCatId = randomUUID();
      categoryIdMap.set(cat._id.toString(), newCatId);
      
      const newUserId = userIdMap.get(cat.userId.toString());

      if (!newUserId) continue; // Skip if user wasn't migrated

      const { error } = await supabase.from('categories').insert({
        id: newCatId,
        user_id: newUserId,
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
      const newUserId = userIdMap.get(t.userId.toString());
      const newCatId = categoryIdMap.get(t.catId.toString());

      if (!newUserId || !newCatId) {
          console.log(`⚠️ Skipping transaction: Missing mapped User or Category.`);
          continue;
      }

      const { error } = await supabase.from('transactions').insert({
        user_id: newUserId,
        category_id: newCatId,
        amount: t.amount,
        type: t.type,
        date: t.date,
        note: t.note || '',
        created_at: t.createdAt || new Date().toISOString(),
      });

      if (error) console.error(`❌ Failed to insert transaction:`, error.message);
    }
    console.log(`✅ Migrated ${transactions.length} Transactions.`);

    // ==========================================
    // 4. MIGRATE BUDGETS (If you have them)
    // ==========================================
    // Note: If you haven't built budgets in Mongo yet, this will just be empty
    const budgets = await db.collection('budgets').find({}).toArray();
    if (budgets.length > 0) {
        console.log('⏳ Migrating Budgets...');
        for (const b of budgets) {
            const newUserId = userIdMap.get(b.userId.toString());
            const newCatId = categoryIdMap.get(b.catId.toString());

            if (!newUserId || !newCatId) continue;

            await supabase.from('budgets').insert({
                user_id: newUserId,
                category_id: newCatId,
                limit_amount: b.limit,
                month: b.month
            });
        }
        console.log(`✅ Migrated ${budgets.length} Budgets.`);
    }

    console.log('🎉 Migration Complete!');

  } catch (err) {
    console.error('❌ Migration Failed:', err);
  } finally {
    await mongoClient.close();
  }
}

migrate();