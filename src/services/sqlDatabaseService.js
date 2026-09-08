// SQL Database Connector & Logger Service for Sparkle @ KKV Store
import { apiFetch } from './apiConfig';

const SQL_USERS_STORAGE_KEY = 'SPARKLE_SQL_USERS_DB';
const SQL_ORDERS_STORAGE_KEY = 'SPARKLE_SQL_ORDERS_DB';
const SQL_ITEMS_STORAGE_KEY = 'SPARKLE_SQL_ITEMS_DB';

/**
 * Logs a user login event into the SQL Users table
 */
export const logUserLoginToSQL = (user) => {
  if (!user || (!user.email && !user.name && !user.phone)) return;

  // Post live login event to backend server so all devices see the customer on Admin Dashboard
  apiFetch('/api/auth/record-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: user.name || user.full_name || 'Sparkle Customer',
      email: user.email,
      phone: user.phone,
      authMethod: user.authMethod || 'Cross-Device Login'
    })
  }).catch(() => {});

  try {
    const users = JSON.parse(localStorage.getItem(SQL_USERS_STORAGE_KEY) || '[]');
    const cleanId = String(user.email || user.phone || user.name || '').toLowerCase();
    const existingIndex = users.findIndex(u => 
      (u.email && u.email.toLowerCase() === cleanId) || 
      (u.phone && u.phone === user.phone) ||
      (u.user_id && u.user_id === user.id)
    );

    const timestamp = new Date().toISOString();

    if (existingIndex >= 0) {
      users[existingIndex].last_login_at = timestamp;
      users[existingIndex].login_count = (users[existingIndex].login_count || 1) + 1;
      users[existingIndex].full_name = user.name || users[existingIndex].full_name;
      users[existingIndex].phone = user.phone || users[existingIndex].phone;
      users[existingIndex].role = user.role || users[existingIndex].role;
    } else {
      const newUser = {
        user_id: user.id || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        full_name: user.name || 'Sparkle Customer',
        email: user.email || 'N/A',
        phone: user.phone || 'N/A',
        role: user.role || 'customer',
        auth_method: user.authMethod || 'Standard Auth',
        last_login_at: timestamp,
        login_count: 1,
        created_at: timestamp
      };
      users.unshift(newUser);
    }

    localStorage.setItem(SQL_USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('[SQL DB Logger Warning]:', e);
  }
};

/**
 * Retrieves all SQL logged-in users
 */
/**
 * Retrieves all SQL logged-in users with automatic fallback
 */
export const getSQLLoggedInUsers = () => {
  try {
    const sqlUsers = JSON.parse(localStorage.getItem(SQL_USERS_STORAGE_KEY) || '[]');
    const registeredUsers = JSON.parse(localStorage.getItem('sparkle_registered_users') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('sparkel_user') || 'null');

    const map = new Map();

    const processUser = (u) => {
      if (!u) return;
      const key = String(u.email || u.phone || u.name || u.full_name || '').toLowerCase().trim();
      if (!key || key.includes('admin@sparklekkv.com')) return;

      const record = {
        user_id: u.user_id || u.id || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        full_name: u.full_name || u.name || 'Sparkle Customer',
        email: u.email || 'N/A',
        phone: u.phone || 'N/A',
        role: u.role || 'customer',
        auth_method: u.auth_method || u.authMethod || 'Standard Auth',
        last_login_at: u.last_login_at || u.lastLoginAt || u.authDate || new Date().toISOString(),
        login_count: u.login_count || u.loginCount || 1
      };
      map.set(key, record);
    };

    sqlUsers.forEach(processUser);
    registeredUsers.forEach(processUser);
    if (currentUser) processUser(currentUser);

    return Array.from(map.values());
  } catch (e) {
    return [];
  }
};

/**
 * Syncs a new customer order and item breakdown to SQL Orders and Order_Items tables
 */
export const syncOrderToSQLDatabase = async (order) => {
  if (!order || !order.id) return;

  try {
    const orders = JSON.parse(localStorage.getItem(SQL_ORDERS_STORAGE_KEY) || '[]');
    const items = JSON.parse(localStorage.getItem(SQL_ITEMS_STORAGE_KEY) || '[]');

    const existingOrderIndex = orders.findIndex(o => o.order_id === order.id);

    const orderRecord = {
      order_id: order.id,
      customer_name: order.customerName || order.shippingAddress?.fullName || 'Customer',
      email: order.email || order.shippingAddress?.email || 'N/A',
      phone: order.phone || order.shippingAddress?.phone || 'N/A',
      total_amount: order.cartSubtotal || order.totalAmount || order.finalAmount || 0,
      discount_amount: order.discountAmount || 0,
      final_paid_amount: order.finalAmount || order.cartTotal || 0,
      payment_method: order.paymentMethod || 'PhonePe',
      payment_status: order.paymentStatus || 'Paid',
      order_status: order.orderStatus || 'Order Received',
      utr_number: order.utrNumber || 'N/A',
      tracking_number: order.trackingNumber || 'N/A',
      shipping_street: order.shippingAddress?.street || 'Madhapur',
      shipping_city: order.shippingAddress?.city || 'Hyderabad',
      shipping_pincode: order.shippingAddress?.pincode || '500081',
      estimated_delivery_date: order.estimatedDeliveryDate || 'Within 7 Business Days',
      created_at: order.createdAt || new Date().toISOString()
    };

    if (existingOrderIndex >= 0) {
      orders[existingOrderIndex] = orderRecord;
    } else {
      orders.unshift(orderRecord);
    }

    localStorage.setItem(SQL_ORDERS_STORAGE_KEY, JSON.stringify(orders));

    // Save items breakdown
    if (Array.isArray(order.items)) {
      order.items.forEach(item => {
        const itemRecord = {
          item_id: `ITM-${Math.floor(10000 + Math.random() * 90000)}`,
          order_id: order.id,
          product_id: item.id || 'SPK-PROD',
          product_name: item.name || 'Jewelry Item',
          selected_size: item.size || item.selectedSize || 'Standard',
          quantity: item.quantity || 1,
          unit_price: item.price || 0,
          total_item_price: (item.price || 0) * (item.quantity || 1)
        };
        items.unshift(itemRecord);
      });
      localStorage.setItem(SQL_ITEMS_STORAGE_KEY, JSON.stringify(items));
    }

    // Send Order & Items directly to backend Express server to store in MySQL database
    try {
      await apiFetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
    } catch (apiErr) {
      console.warn('[Backend MySQL Order Post Notice]:', apiErr);
    }

  } catch (e) {
    console.warn('[SQL Order Sync Warning]:', e);
  }
};

/**
 * Retrieves all SQL orders with automatic sync from store orders
 */
export const getSQLOrders = () => {
  try {
    let orders = JSON.parse(localStorage.getItem(SQL_ORDERS_STORAGE_KEY) || '[]');
    if (!Array.isArray(orders) || orders.length === 0) {
      const liveStoreOrders = JSON.parse(localStorage.getItem('sparkel_orders') || '[]');
      if (Array.isArray(liveStoreOrders) && liveStoreOrders.length > 0) {
        liveStoreOrders.forEach(o => syncOrderToSQLDatabase(o));
        orders = JSON.parse(localStorage.getItem(SQL_ORDERS_STORAGE_KEY) || '[]');
      }
    }
    return orders;
  } catch (e) {
    return [];
  }
};

/**
 * Retrieves all SQL order items with automatic sync
 */
/**
 * Retrieves all SQL order items with automatic sync
 */
export const getSQLOrderItems = () => {
  try {
    return JSON.parse(localStorage.getItem(SQL_ITEMS_STORAGE_KEY) || '[]');
  } catch (e) {
    return [];
  }
};

/**
 * Retrieves all SQL Catalog products
 */
export const getSQLProducts = () => {
  return [
    { product_id: 'SPK-HC-001', product_name: 'Plumeria flower claw clip', category: 'Clips', price: 99, stock: 12, available_sizes: 'Standard', is_best_seller: true },
    { product_id: 'SPK-HC-002', product_name: 'Claw Clips', category: 'Clips', price: 99, stock: 10, available_sizes: 'Standard', is_best_seller: true },
    { product_id: 'SPK-BG-501', product_name: 'Royal Kundan Gold Bangle Set', category: 'Bangles', price: 1299, stock: 15, available_sizes: '2*4, 2*6, 2*8', is_best_seller: true },
    { product_id: 'SPK-BG-502', product_name: 'Traditional Temple Kada Bangles', category: 'Bangles', price: 999, stock: 20, available_sizes: '2*4, 2*6, 2*8', is_best_seller: false },
    { product_id: 'SPK-BG-503', product_name: 'Antique Matte Gold Peacock Bangle', category: 'Bangles', price: 1499, stock: 8, available_sizes: '2*4, 2*6, 2*8', is_best_seller: true },
    { product_id: 'SPK-BG-504', product_name: 'Pearl & Emerald Studded Bangles', category: 'Bangles', price: 899, stock: 25, available_sizes: '2*4, 2*6, 2*8', is_best_seller: false },
    { product_id: 'SPK-BG-505', product_name: 'Designer Oxidised Silver Bangle Set', category: 'Bangles', price: 699, stock: 30, available_sizes: '2*4, 2*6, 2*8', is_best_seller: false },
    { product_id: 'SPK-NC-101', product_name: 'Matte Gold Antique Choker Set', category: 'Necklace Sets', price: 1899, stock: 10, available_sizes: 'Standard', is_best_seller: true },
    { product_id: 'SPK-CH-301', product_name: 'Satellite Chain 18K Gold Plated', category: 'Chains', price: 499, stock: 0, available_sizes: 'Standard', is_best_seller: true },
    { product_id: 'SPK-BR-401', product_name: 'Adjustable Gold Plated Kada Bracelet', category: 'Bracelets', price: 599, stock: 40, available_sizes: 'Standard', is_best_seller: true },
    { product_id: 'SPK-ER-201', product_name: 'Kundan Chandbali Earrings', category: 'Ear Rings', price: 499, stock: 35, available_sizes: 'Standard', is_best_seller: true }
  ];
};

/**
 * Generates an executable .sql file backup dump for MSSQL / MySQL / PostgreSQL / SQLite
 */
export const generateSQLDumpScript = () => {
  const users = getSQLLoggedInUsers();
  const orders = getSQLOrders();
  const items = getSQLOrderItems();
  const products = getSQLProducts();

  let sql = `-- Sparkle @ KKV Store SQL Database Export Dump\n`;
  sql += `-- Exported Date: ${new Date().toLocaleString()}\n\n`;

  sql += `-- 1. STORE CATALOG PRODUCTS DUMP\n`;
  products.forEach(p => {
    sql += `INSERT INTO products (product_id, product_name, category, price, stock, available_sizes) VALUES ('${p.product_id}', '${p.product_name.replace(/'/g, "''")}', '${p.category}', ${p.price}, ${p.stock}, '${p.available_sizes}');\n`;
  });

  sql += `\n-- 2. USERS DATA DUMP\n`;
  users.forEach(u => {
    sql += `INSERT INTO users (user_id, full_name, email, phone, role, auth_method, last_login_at, login_count) VALUES ('${u.user_id}', '${u.full_name.replace(/'/g, "''")}', '${u.email}', '${u.phone}', '${u.role}', '${u.auth_method}', '${u.last_login_at}', ${u.login_count || 1});\n`;
  });

  sql += `\n-- 3. ORDERS DATA DUMP\n`;
  orders.forEach(o => {
    sql += `INSERT INTO orders (order_id, customer_name, email, phone, total_amount, discount_amount, final_paid_amount, payment_method, payment_status, order_status, shipping_street, shipping_city, shipping_pincode) VALUES ('${o.order_id}', '${o.customer_name.replace(/'/g, "''")}', '${o.email}', '${o.phone}', ${o.total_amount}, ${o.discount_amount}, ${o.final_paid_amount}, '${o.payment_method}', '${o.payment_status}', '${o.order_status}', '${(o.shipping_street || '').replace(/'/g, "''")}', '${o.shipping_city || ''}', '${o.shipping_pincode || ''}');\n`;
  });

  sql += `\n-- 4. ORDER ITEMS DUMP\n`;
  items.forEach(i => {
    sql += `INSERT INTO order_items (order_id, product_id, product_name, selected_size, quantity, unit_price, total_item_price) VALUES ('${i.order_id}', '${i.product_id}', '${i.product_name.replace(/'/g, "''")}', '${i.selected_size}', ${i.quantity}, ${i.unit_price}, ${i.total_item_price});\n`;
  });

  return sql;
};
