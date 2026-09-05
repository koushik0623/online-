import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

console.log('\n============================================================');
console.log('   💎 SPARKLE @ KKV NEON POSTGRESQL LIVE DATABASE VIEWER    ');
console.log('============================================================\n');

async function viewDatabase() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.log('⚠️ DATABASE_URL not found in .env file.');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
  });

  try {
    console.log('🐘 1. NEON CLOUD POSTGRESQL USERS TABLE (`users`)\n');
    const usersRes = await pool.query('SELECT id, first_name, last_name, email, phone, role, created_at, last_login_at FROM users ORDER BY created_at DESC');
    console.log(`👤 Total Users Registered in Neon: ${usersRes.rows.length}`);
    if (usersRes.rows.length > 0) {
      console.table(usersRes.rows.map(u => ({
        ID: u.id,
        Name: `${u.first_name || ''} ${u.last_name || ''}`.trim(),
        Email: u.email || 'N/A',
        Phone: u.phone || 'N/A',
        Role: u.role,
        LastLogin: u.last_login_at ? new Date(u.last_login_at).toLocaleString() : 'N/A'
      })));
    }

    console.log('\n------------------------------------------------------------');
    console.log('📦 2. NEON CLOUD POSTGRESQL ORDERS TABLE (`orders`)\n');
    const ordersRes = await pool.query('SELECT id, order_number, total_amount, currency, payment_status, order_status, payment_method, created_at FROM orders ORDER BY created_at DESC');
    console.log(`🛍️ Total Orders Placed in Neon: ${ordersRes.rows.length}`);
    if (ordersRes.rows.length > 0) {
      console.table(ordersRes.rows.map(o => ({
        OrderID: o.order_number || o.id,
        Amount: `${o.currency || 'INR'} ₹${o.total_amount}`,
        PaymentStatus: o.payment_status,
        OrderStatus: o.order_status,
        Method: o.payment_method,
        Date: new Date(o.created_at).toLocaleString()
      })));
    }

    console.log('\n------------------------------------------------------------');
    console.log('💳 3. NEON CLOUD POSTGRESQL PAYMENTS TABLE (`payments`)\n');
    const paymentsRes = await pool.query('SELECT id, gateway, transaction_id, amount, status, payment_method, created_at FROM payments ORDER BY created_at DESC');
    console.log(`💳 Total Payment Transactions: ${paymentsRes.rows.length}`);
    if (paymentsRes.rows.length > 0) {
      console.table(paymentsRes.rows.map(p => ({
        TxnID: p.transaction_id || p.id,
        Gateway: p.gateway,
        Amount: `₹${p.amount}`,
        Status: p.status,
        Method: p.payment_method,
        Date: new Date(p.created_at).toLocaleString()
      })));
    }

    console.log('\n------------------------------------------------------------');
    console.log('🛍️ 4. NEON CLOUD POSTGRESQL PRODUCTS SUMMARY (`products`)\n');
    const prodsRes = await pool.query('SELECT id, name, sku, price, stock_quantity, is_active FROM products LIMIT 10');
    console.log(`💎 Sample Products in Catalog: ${prodsRes.rows.length}`);
    if (prodsRes.rows.length > 0) {
      console.table(prodsRes.rows.map(pr => ({
        SKU: pr.sku,
        Name: pr.name,
        Price: `₹${pr.price}`,
        Stock: pr.stock_quantity,
        Active: pr.is_active
      })));
    }

  } catch (err) {
    console.error('❌ Error querying Neon PostgreSQL:', err.message);
  } finally {
    await pool.end();
  }

  console.log('\n============================================================');
  console.log('✨ NEON POSTGRESQL LIVE INSPECTION COMPLETE!');
  console.log('============================================================\n');
  process.exit(0);
}

viewDatabase();
