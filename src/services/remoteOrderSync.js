// Real-Time Store Order Sync Service for Sparkle @ KKV Owner Admin Portal

import { recordCloudOrder, fetchCloudOrders } from './neonCloudService';

const LOCAL_STORAGE_REMOTE_KEY = 'SPARKLE_REMOTE_ORDERS_DATABASE';
const OWNER_NOTIFICATION_EMAIL = 'sparklekkvofficial@gmail.com';
const ADMIN_EMAIL = 'support@sparklekkv.com';

/**
 * Saves a new customer order to global store database and sends immediate email notifications
 */
export const saveOrderToGlobalDatabase = async (newOrder) => {
  if (!newOrder || !newOrder.id) return;

  // Direct HTTPS Cloud DB Sync to Neon
  recordCloudOrder(newOrder).catch(() => {});

  try {
    // 1. Update persistent local database
    const localDb = JSON.parse(localStorage.getItem(LOCAL_STORAGE_REMOTE_KEY) || '[]');
    const sparkelOrders = JSON.parse(localStorage.getItem('sparkel_orders') || '[]');

    const mergedMap = new Map();
    [newOrder, ...sparkelOrders, ...localDb].forEach(o => {
      if (o && o.id) mergedMap.set(o.id, o);
    });

    const updatedOrders = Array.from(mergedMap.values());
    localStorage.setItem(LOCAL_STORAGE_REMOTE_KEY, JSON.stringify(updatedOrders));
    localStorage.setItem('sparkel_orders', JSON.stringify(updatedOrders));

    // 2. Dispatch real-time order alerts to owner emails (sparklekkvofficial@gmail.com & support@sparklekkv.com)
    const alertBody = {
      _subject: `💰 NEW ORDER & PAYMENT CONFIRMED: ${newOrder.id} (₹${newOrder.finalAmount || newOrder.cartTotal})`,
      order_id: newOrder.id,
      customer_name: newOrder.customerName || newOrder.shippingAddress?.fullName || 'Customer',
      customer_email: newOrder.email || 'N/A',
      customer_phone: newOrder.shippingAddress?.phone || newOrder.phone || 'N/A',
      total_paid: `₹${newOrder.finalAmount || newOrder.cartTotal}`,
      payment_method: newOrder.paymentMethod || 'Instant Payment',
      order_date: newOrder.createdAt || new Date().toLocaleString(),
      shipping_address: newOrder.shippingAddress ? `${newOrder.shippingAddress.street}, ${newOrder.shippingAddress.city} - ${newOrder.shippingAddress.pincode}` : 'N/A',
      ordered_items: (newOrder.items || []).map(i => `${i.name} (Qty: ${i.quantity}) - ₹${i.price * i.quantity}`).join(' | '),
      message: `🛍️ NEW CUSTOMER ORDER RECEIVED!\n\nOrder ID: ${newOrder.id}\nCustomer: ${newOrder.customerName}\nPhone: ${newOrder.shippingAddress?.phone || newOrder.phone}\nEmail: ${newOrder.email}\nAddress: ${newOrder.shippingAddress?.street}, ${newOrder.shippingAddress?.city} - ${newOrder.shippingAddress?.pincode}\nTotal Paid: ₹${newOrder.finalAmount || newOrder.cartTotal}\nPayment Method: ${newOrder.paymentMethod}`
    };

    fetch(`https://formsubmit.co/ajax/${OWNER_NOTIFICATION_EMAIL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(alertBody)
    }).catch(err => console.log('Owner order notification notice:', err));

    fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(alertBody)
    }).catch(err => console.log('Support order notification notice:', err));

  } catch (e) {
    console.warn('[Order Sync Error]:', e);
  }
};

const TEST_ORDER_IDS = ['ORD-54561', 'ORD-11718', 'ORD-72852', 'ORD-55003', 'ORD-31965', 'ORD-57289', 'ORD-52031', 'ORD-23498', 'ORD-99999', 'ORD-98241', 'ORD-99585', 'ORD-22198', 'ORD-17788', 'ORD-37009', 'ORD-USER-LIVE-900', 'ORD-USERLINK-101', 'ORD-17317', 'ORD-SCANNER-888', 'ORD-KOUSHIK-102', 'ORD-AKASH-101', 'ORD-LIVE-777', 'ORD-TEST-999', 'ORD-54438'];

/**
 * Retrieves all orders from global store database for Admin Portal
 */
export const fetchGlobalDatabaseOrders = () => {
  try {
    const localRemoteDb = JSON.parse(localStorage.getItem(LOCAL_STORAGE_REMOTE_KEY) || '[]');
    const sparkelOrders = JSON.parse(localStorage.getItem('sparkel_orders') || '[]');

    const mergedMap = new Map();
    [...sparkelOrders, ...localRemoteDb].forEach(order => {
      const id = String(order?.id || order?.order_id || order?.orderId || '');
      if (id && !TEST_ORDER_IDS.includes(id)) {
        mergedMap.set(id, { ...order, id });
      }
    });

    return Array.from(mergedMap.values());
  } catch (e) {
    return [];
  }
};
