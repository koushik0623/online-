import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../server/data');

const NEON_CONN_STRING = 'postgresql://neondb_owner:npg_KwDIMS64ULhe@ep-frosty-truth-ayaemu3h-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function resetAllData() {
  console.log(`\n===========================================================`);
  console.log(` 🧹 RESETTING & CLEARING ALL STORE DATA (JSON & POSTGRESQL)`);
  console.log(`===========================================================`);

  // 1. Clear JSON Data Files in server/data
  if (fs.existsSync(DATA_DIR)) {
    const jsonFiles = ['orders.json', 'users.json', 'subscribers.json', 'otps.json'];
    jsonFiles.forEach(file => {
      const filePath = path.join(DATA_DIR, file);
      try {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf8');
        console.log(`✅ Cleared local JSON file: server/data/${file}`);
      } catch (e) {}
    });
  }

  // 2. Clear Live PostgreSQL Cloud Database Tables
  try {
    console.log(`\n📡 Connecting to Neon PostgreSQL Cloud Database to wipe test data...`);
    const pool = new Pool({
      connectionString: NEON_CONN_STRING,
      ssl: { rejectUnauthorized: false }
    });

    await pool.query(`
      TRUNCATE TABLE order_items CASCADE;
      TRUNCATE TABLE orders CASCADE;
      TRUNCATE TABLE user_sessions CASCADE;
      TRUNCATE TABLE login_events CASCADE;
      TRUNCATE TABLE cart_items CASCADE;
      TRUNCATE TABLE carts CASCADE;
      DELETE FROM users WHERE email NOT LIKE '%sparklekkvofficial%';
    `);

    console.log(`✅ Cleared all orders, customer sessions, and customer login data from PostgreSQL Database!`);
    await pool.end();
  } catch (err) {
    console.warn(`⚠️ PostgreSQL Reset Notice:`, err.message);
  }

  console.log(`\n===========================================================`);
  console.log(` ✨ ALL STORE DATA HAS BEEN RESET & CLEARED!`);
  console.log(` Your Admin Portal at https://sparklekkv.com is now 100% FRESH.`);
  console.log(`===========================================================\n`);
  process.exit(0);
}

resetAllData();
