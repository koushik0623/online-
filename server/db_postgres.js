import pg from 'pg';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pool = null;
let isPostgresConnected = false;

export function getPostgresPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_KwDIMS64ULhe@ep-frosty-truth-ayaemu3h-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';
    
    // Check SSL configuration for cloud providers like Supabase / Neon / Render
    const useSSL = connectionString.includes('sslmode=require') || connectionString.includes('neon.tech') || connectionString.includes('amazonaws.com') || connectionString.includes('render.com') || connectionString.includes('supabase.co');

    pool = new Pool({
      connectionString,
      ssl: useSSL ? { rejectUnauthorized: false } : false,
      max: 20, // Connection pool limit
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      console.error('⚠️ Unexpected PostgreSQL pool client error:', err.message);
      isPostgresConnected = false;
    });
  }
  return pool;
}

export const checkPostgresHealth = async () => {
  try {
    const poolInstance = getPostgresPool();
    const res = await poolInstance.query('SELECT NOW() as current_time, current_database() as db_name');
    isPostgresConnected = true;
    return {
      connected: true,
      time: res.rows[0].current_time,
      database: res.rows[0].db_name
    };
  } catch (error) {
    isPostgresConnected = false;
    return {
      connected: false,
      error: error.message
    };
  }
};

export async function queryPostgres(text, params = []) {
  try {
    const poolInstance = getPostgresPool();
    const start = Date.now();
    const res = await poolInstance.query(text, params);
    const duration = Date.now() - start;
    isPostgresConnected = true;
    return { success: true, rows: res.rows, rowCount: res.rowCount, duration };
  } catch (error) {
    console.error('❌ PostgreSQL Query Error:', error.message, '| SQL:', text);
    return { success: false, error: error.message, rows: [], rowCount: 0 };
  }
}

export async function withTransaction(callback) {
  const poolInstance = getPostgresPool();
  const client = await poolInstance.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return { success: true, result };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ PostgreSQL Transaction Error:', error.message);
    return { success: false, error: error.message };
  } finally {
    client.release();
  }
}

export async function runPostgresMigrations() {
  try {
    const migrationPath = path.join(__dirname, 'migrations', '001_initial_schema.sql');
    if (!fs.existsSync(migrationPath)) {
      console.warn('⚠️ Migration SQL file not found at:', migrationPath);
      return false;
    }
    const sql = fs.readFileSync(migrationPath, 'utf8');
    const poolInstance = getPostgresPool();
    await poolInstance.query(sql);
    console.log('✅ PostgreSQL Database Schema & Migration Applied Successfully!');
    isPostgresConnected = true;
    return true;
  } catch (error) {
    console.error('⚠️ PostgreSQL Migration Failed / Waiting for DB Connection:', error.message);
    isPostgresConnected = false;
    return false;
  }
}

export const isPostgresLive = () => isPostgresConnected;

export default {
  getPostgresPool,
  queryPostgres,
  withTransaction,
  runPostgresMigrations,
  checkPostgresHealth,
  isPostgresLive
};
