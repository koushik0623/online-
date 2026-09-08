// Direct HTTPS Neon Cloud Database Connector for Sparkle @ KKV Live Store
// Enables real-time cross-device customer login & order sync on deployed domains (sparklekkv.com)

const NEON_SQL_ENDPOINT = 'https://ep-frosty-truth-ayaemu3h-pooler.c-5.us-east-2.aws.neon.tech/sql';
const NEON_CONN_STRING = 'postgresql://neondb_owner:npg_KwDIMS64ULhe@ep-frosty-truth-ayaemu3h-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';

/**
 * Executes raw SQL query directly on Neon Cloud PostgreSQL Database via HTTPS REST API
 */
export const queryNeonSQL = async (queryText) => {
  try {
    const response = await fetch(NEON_SQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Neon-Connection-String': NEON_CONN_STRING
      },
      body: JSON.stringify({ query: queryText })
    });

    if (!response.ok) {
      throw new Error(`Neon SQL API HTTP ${response.status}`);
    }

    const data = await response.json();
    return data && data.rows ? data.rows : [];
  } catch (err) {
    console.warn('[Neon Cloud Sync Warning]:', err.message);
    return [];
  }
};

/**
 * Records or updates a customer login event directly into Neon Cloud Database
 */
export const recordCloudUserLogin = async (user) => {
  if (!user || (!user.email && !user.name && !user.phone)) return;

  const email = (user.email || '').replace(/'/g, "''");
  const name = (user.name || user.full_name || 'Sparkle Customer').replace(/'/g, "''");
  const phone = (user.phone || '').replace(/'/g, "''");
  const role = (user.role || 'customer').toUpperCase();

  const sql = `
    INSERT INTO users (first_name, last_name, email, phone, role, password_hash, last_login_at, created_at)
    VALUES ('${name}', '', '${email || 'customer@sparklekkv.com'}', '${phone || 'N/A'}', '${role}', '$2b$10$default', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (email) 
    DO UPDATE SET last_login_at = CURRENT_TIMESTAMP, phone = COALESCE(EXCLUDED.phone, users.phone);
  `;

  await queryNeonSQL(sql);
};

/**
 * Fetches all customer accounts and live login records from Neon Cloud Database
 */
export const fetchCloudUsers = async () => {
  const sql = `
    SELECT 
      id as user_id, 
      first_name || ' ' || last_name as full_name, 
      email, 
      phone, 
      LOWER(role) as role, 
      'Neon Cloud Auth' as auth_method, 
      COALESCE(last_login_at, created_at) as last_login_at,
      created_at
    FROM users 
    WHERE email NOT LIKE '%sparklekkvofficial%'
    ORDER BY COALESCE(last_login_at, created_at) DESC;
  `;

  const rows = await queryNeonSQL(sql);
  return rows && rows.length > 0 ? rows : [];
};

/**
 * Records a customer order into Neon Cloud Database
 */
export const recordCloudOrder = async (order) => {
  if (!order || !order.id) return;

  const orderId = String(order.id).replace(/'/g, "''");
  const customerName = (order.customerName || order.shippingAddress?.fullName || 'Customer').replace(/'/g, "''");
  const email = (order.email || order.shippingAddress?.email || 'customer@sparklekkv.com').replace(/'/g, "''");
  const phone = (order.phone || order.shippingAddress?.phone || 'N/A').replace(/'/g, "''");
  const totalAmount = Number(order.finalAmount || order.cartTotal || order.totalAmount || 0);
  const paymentMethod = (order.paymentMethod || 'PhonePe').replace(/'/g, "''");
  const street = (order.shippingAddress?.street || 'Madhapur').replace(/'/g, "''");
  const city = (order.shippingAddress?.city || 'Hyderabad').replace(/'/g, "''");
  const pincode = (order.shippingAddress?.pincode || '500081').replace(/'/g, "''");

  const sqlOrder = `
    INSERT INTO orders (order_number, total_amount, subtotal, payment_status, order_status, payment_method, created_at)
    VALUES ('${orderId}', ${totalAmount}, ${totalAmount}, 'PAID', 'CONFIRMED', '${paymentMethod}', CURRENT_TIMESTAMP)
    ON CONFLICT (order_number) DO NOTHING;
  `;

  await queryNeonSQL(sqlOrder);
};

/**
 * Fetches all live customer orders from Neon Cloud Database
 */
export const fetchCloudOrders = async () => {
  const sql = `
    SELECT 
      order_number as id, 
      order_number as order_id, 
      total_amount as finalAmount, 
      total_amount as cartTotal, 
      payment_status as paymentStatus, 
      order_status as orderStatus, 
      payment_method as paymentMethod, 
      created_at as createdAt 
    FROM orders 
    ORDER BY created_at DESC;
  `;

  const rows = await queryNeonSQL(sql);
  return rows && rows.length > 0 ? rows : [];
};

