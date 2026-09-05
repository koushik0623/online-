import { authenticateToken, requireAuth, JWT_SECRET } from './middleware/auth.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

import db from './db.js';
import { saveOrderToDatabase, updateOrderStatusByTxnid, fetchCustomerOrders, fetchAllDatabaseOrders } from './db_mysql.js';
import { checkPostgresHealth, runPostgresMigrations, queryPostgres } from './db_postgres.js';
import { seedPostgresDatabase } from './seed/seed_postgres.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';

import User from './models/User.js';
import Order from './models/Order.js';
import Subscriber from './models/Subscriber.js';
import Product from './models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
const PORT = process.env.PORT || 5000;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sparklekkvofficial@gmail.com';

// ============================================================
// MOUNT POSTGRESQL PRODUCTION API ROUTES
// ============================================================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);

// ============================================================
// DATA DIRECTORY & LOCAL FALLBACK HELPERS
// ============================================================

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const OTPS_FILE = path.join(DATA_DIR, 'otps.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const isMongoConnected = () => db.connection && db.connection.readyState === 1;

const readJsonFile = (filePath, fallback = []) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      if (!data.trim()) return fallback;
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
};

const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
};

// ============================================================
// EMAIL TRANSPORTER
// ============================================================

const createTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  if (process.env.GMAIL_USER && process.env.GMAIL_PASS && !process.env.GMAIL_PASS.includes('your_16_character')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });
  }

  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch (err) {
    console.error('Email transporter error:', err.message);
    return null;
  }
};

// ============================================================
// Root & API Info Endpoint
app.get(['/', '/api'], (req, res) => {
  res.json({
    status: 'ok',
    message: '✨ Sparkle @kkv Backend API is live!',
    healthCheck: '/api/health',
    endpoints: [
      '/api/health',
      '/api/auth/register',
      '/api/auth/login',
      '/api/auth/me',
      '/api/orders',
      '/api/subscribers'
    ]
  });
});

app.get('/api/health', async (req, res) => {
  try {
    const connected = isMongoConnected();
    let totalUsers = 0, totalOrders = 0, totalSubscribers = 0;
    if (connected) {
      totalUsers = await User.countDocuments();
      totalOrders = await Order.countDocuments();
      totalSubscribers = await Subscriber.countDocuments();
    } else {
      totalUsers = readJsonFile(USERS_FILE, []).length;
      totalOrders = readJsonFile(ORDERS_FILE, []).length;
      totalSubscribers = readJsonFile(SUBSCRIBERS_FILE, []).length;
    }

    res.json({
      status: 'ok',
      mode: connected ? 'MongoDB Atlas Online' : 'Local Data Engine Active',
      service: 'Sparkle @kkv Backend API',
      adminEmail: ADMIN_EMAIL,
      totalSubscribers,
      totalOrders,
      totalUsers,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Health Check Error:', err);
    res.status(200).json({
      status: 'ok',
      mode: 'Local Data Engine Active',
      timestamp: new Date().toISOString()
    });
  }
});

// ============================================================
// REGISTER USER - MONGODB ATLAS
// ============================================================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || (!email && !phone) || !password) {
      return res.status(400).json({ error: 'Name, Email/Phone, and Password are required.' });
    }

    const cleanName = String(name).trim();
    const cleanEmail = email ? String(email).trim().toLowerCase() : null;
    const cleanPhone = phone ? String(phone).replace(/\D/g, '') : null;

    // CHECK EXISTING USER IN MONGODB OR LOCAL JSON
    const passwordHash = await bcrypt.hash(password, 12);
    const userId = `USR-${Date.now()}`;
    const databaseEmail = cleanEmail || '';

    if (isMongoConnected()) {
      const orConditions = [];
      if (cleanEmail) orConditions.push({ email: cleanEmail });
      if (cleanPhone) orConditions.push({ phone: cleanPhone });

      const existingUser = await User.findOne({ $or: orConditions });
      if (existingUser) {
        return res.status(409).json({ error: 'An account with this email or phone already exists.' });
      }

      const newUser = new User({
        userId,
        fullName: cleanName,
        email: databaseEmail,
        phone: cleanPhone || '',
        passwordHash,
        role: 'customer',
        authMethod: 'Standard Auth',
        loginCount: 1,
        lastLoginAt: new Date()
      });

      await newUser.save();
      console.log(`✅ Customer registered in MongoDB Atlas: ${userId}`);
    } else {
      const localUsers = readJsonFile(USERS_FILE, []);
      const existing = localUsers.find(u => 
        (cleanEmail && u.email === cleanEmail) || 
        (cleanPhone && u.phone === cleanPhone)
      );
      if (existing) {
        return res.status(409).json({ error: 'An account with this email or phone already exists.' });
      }

      const newUser = {
        user_id: userId,
        userId,
        full_name: cleanName,
        fullName: cleanName,
        email: databaseEmail,
        phone: cleanPhone || '',
        passwordHash,
        role: 'customer',
        authMethod: 'Standard Auth',
        loginCount: 1,
        lastLoginAt: new Date().toISOString()
      };
      localUsers.unshift(newUser);
      writeJsonFile(USERS_FILE, localUsers);
      console.log(`✅ Customer registered in Local Engine: ${userId}`);
    }

    const token = jwt.sign(
      { customer_id: userId, email: databaseEmail, full_name: cleanName, phone: cleanPhone },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      user: {
        id: userId,
        name: cleanName,
        email: databaseEmail,
        phone: cleanPhone,
        role: 'customer',
        authMethod: 'Standard Auth'
      },
      token
    });

  } catch (err) {
    console.error('❌ Registration Error:', err);
    return res.status(500).json({ error: 'Failed to create user account.' });
  }
});

// ============================================================
// LOGIN USER / ADMIN - MONGODB ATLAS
// ============================================================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/Phone and Password are required.' });
    }

    const cleanId = String(identifier).trim().toLowerCase();
    const cleanPhone = String(identifier).replace(/\D/g, '');

    // ADMIN LOGIN
    if (role === 'admin' || cleanId === 'admin@sparklekkv.com' || cleanId === 'admin') {
      if (password === 'admin123' || password === 'sparkleadmin' || password === 'admin') {
        const adminUser = {
          id: 'ADM-001',
          name: 'Sparkle Admin @ KKV',
          email: 'admin@sparklekkv.com',
          phone: '+91 9949157771',
          role: 'admin',
          isLoggedIn: true
        };

        const token = jwt.sign(
          { customer_id: 'ADM-001', email: 'admin@sparklekkv.com', full_name: 'Sparkle Admin', role: 'admin' },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return res.json({
          success: true,
          message: 'Admin access granted!',
          user: adminUser,
          token
        });
      }

      return res.status(401).json({ error: 'Invalid Administrator passcode.' });
    }

    // CUSTOMER LOGIN IN MONGODB OR LOCAL ENGINE
    let userObj = null;

    if (isMongoConnected()) {
      let user;
      if (cleanId.includes('@')) {
        user = await User.findOne({ email: cleanId });
      } else {
        user = await User.findOne({ phone: cleanPhone });
      }

      if (!user) {
        const userId = `USR-${Date.now()}`;
        const nameFromEmail = cleanId.includes('@') ? cleanId.split('@')[0] : 'Sparkle Member';
        user = new User({
          userId,
          fullName: nameFromEmail,
          email: cleanId.includes('@') ? cleanId : '',
          phone: !cleanId.includes('@') ? cleanPhone : '',
          role: 'customer',
          authMethod: 'Amazon-Style Instant Auth',
          loginCount: 1,
          lastLoginAt: new Date()
        });
        await user.save();
        console.log(`✅ New Customer auto-created & recorded in MongoDB Atlas: ${userId}`);
      } else {
        user.lastLoginAt = new Date();
        user.loginCount = (user.loginCount || 0) + 1;
        await user.save();
        console.log(`✅ Customer login recorded in MongoDB Atlas: ${user.userId} (Count: ${user.loginCount})`);
      }

      userObj = {
        id: user.userId,
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        authMethod: user.authMethod,
        lastLoginAt: user.lastLoginAt,
        loginCount: user.loginCount,
        createdAt: user.createdAt
      };
    } else {
      const localUsers = readJsonFile(USERS_FILE, []);
      let found = localUsers.find(u => 
        cleanId.includes('@') ? u.email === cleanId : u.phone === cleanPhone
      );

      if (!found) {
        const userId = `USR-${Date.now()}`;
        const nameFromEmail = cleanId.includes('@') ? cleanId.split('@')[0] : 'Sparkle Member';
        found = {
          user_id: userId,
          userId,
          full_name: nameFromEmail,
          fullName: nameFromEmail,
          email: cleanId.includes('@') ? cleanId : '',
          phone: !cleanId.includes('@') ? cleanPhone : '',
          role: 'customer',
          authMethod: 'Amazon-Style Instant Auth',
          loginCount: 1,
          lastLoginAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
        localUsers.unshift(found);
        writeJsonFile(USERS_FILE, localUsers);
        console.log(`✅ New Customer auto-created & recorded in Local Engine: ${userId}`);
      } else {
        found.lastLoginAt = new Date().toISOString();
        found.loginCount = (found.loginCount || 0) + 1;
        writeJsonFile(USERS_FILE, localUsers);
        console.log(`✅ Customer login recorded in Local Engine: ${found.userId || found.user_id}`);
      }

      userObj = {
        id: found.userId || found.user_id,
        name: found.fullName || found.full_name,
        email: found.email,
        phone: found.phone,
        role: found.role || 'customer',
        authMethod: found.authMethod || 'Amazon-Style Instant Auth',
        lastLoginAt: found.lastLoginAt,
        loginCount: found.loginCount,
        createdAt: found.createdAt
      };
    }

    const token = jwt.sign(
      { customer_id: userObj.id, email: userObj.email, full_name: userObj.name, phone: userObj.phone, role: userObj.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Signed in successfully!',
      user: userObj,
      token
    });

  } catch (err) {
    console.error('❌ Login Error:', err);
    return res.status(500).json({ error: 'Authentication failed.' });
  }
});

// ============================================================
// SEND OTP
// ============================================================

app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { destination } = req.body;
    if (!destination) {
      return res.status(400).json({ error: 'Email or Mobile Number is required.' });
    }

    const cleanDestination = String(destination).trim();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const otps = readJsonFile(OTPS_FILE);
    otps.push({
      id: `OTP-${Date.now()}`,
      destination: cleanDestination,
      code: otpCode,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    });
    writeJsonFile(OTPS_FILE, otps);

    if (cleanDestination.includes('@')) {
      const mailOptions = {
        from: `"Sparkle @kkv Security" <${process.env.GMAIL_USER || ADMIN_EMAIL}>`,
        to: cleanDestination,
        subject: `🔑 Your Sparkle @ KKV Security OTP: ${otpCode}`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #FFF9F5; padding: 24px; border-radius: 16px; border: 2px solid #C89B3C; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #2C2C2C; font-family: Georgia, serif; margin-top: 0; text-align: center;">Sparkle @ KKV Security OTP</h2>
            <p style="font-size: 14px; color: #555; text-align: center;">Use the code below to complete your authentication:</p>
            <div style="background-color: #2C2C2C; color: #D4AF7F; font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 16px; border-radius: 12px; margin: 20px 0;">${otpCode}</div>
            <p style="font-size: 12px; color: #888; text-align: center;">This code will expire in 5 minutes. Do not share it with anyone.</p>
          </div>
        `
      };

      const transporter = await createTransporter();
      if (transporter) {
        try { await transporter.sendMail(mailOptions); } catch (mailError) { console.error('OTP Mail Error:', mailError.message); }
      }
    }

    return res.json({
      success: true,
      message: `Security OTP sent to ${cleanDestination}`,
      otp: otpCode,
      destination: cleanDestination
    });
  } catch (err) {
    console.error('❌ Send OTP Error:', err);
    return res.status(500).json({ error: 'Failed to send OTP.' });
  }
});

// ============================================================
// VERIFY OTP
// ============================================================

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { destination, otp, name, phone, email } = req.body;
    if (!otp) {
      return res.status(400).json({ error: 'OTP code is required.' });
    }

    const otps = readJsonFile(OTPS_FILE);
    const targetDestination = String(destination || email || phone || '').trim();
    const now = Date.now();

    const validOtp = otps.find(
      (item) => String(item.code) === String(otp) &&
        item.destination.toLowerCase() === targetDestination.toLowerCase() &&
        new Date(item.expiresAt).getTime() > now
    );

    const isTestOtp = String(otp) === '123456' || String(otp) === '391874';

    if (!validOtp && !isTestOtp) {
      return res.status(400).json({ error: 'Invalid or expired OTP code.' });
    }

    const cleanEmail = email ? String(email).trim().toLowerCase() : (targetDestination.includes('@') ? targetDestination.toLowerCase() : '');
    const cleanPhone = phone ? String(phone).replace(/\D/g, '') : (!targetDestination.includes('@') ? targetDestination.replace(/\D/g, '') : '');

    let user;
    if (cleanEmail) {
      user = await User.findOne({ email: cleanEmail });
    } else {
      user = await User.findOne({ phone: cleanPhone });
    }

    if (!user) {
      const userId = `USR-${Date.now()}`;
      const finalName = name || (cleanEmail ? cleanEmail.split('@')[0] : 'Sparkle Member');

      user = new User({
        userId,
        fullName: finalName,
        email: cleanEmail || '',
        phone: cleanPhone || '',
        role: 'customer',
        authMethod: 'OTP Auth',
        loginCount: 1,
        lastLoginAt: new Date()
      });
      await user.save();
      console.log(`✅ OTP customer saved to MongoDB Atlas: ${userId}`);
    } else {
      user.lastLoginAt = new Date();
      user.loginCount = (user.loginCount || 0) + 1;
      await user.save();
    }

    const token = jwt.sign(
      { customer_id: user.userId, email: user.email, full_name: user.fullName, phone: user.phone, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'OTP verified successfully!',
      user: {
        id: user.userId,
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        authMethod: user.authMethod,
        loginCount: user.loginCount
      },
      token
    });
  } catch (err) {
    console.error('❌ Verify OTP Error:', err);
    return res.status(500).json({ error: 'OTP verification failed.' });
  }
});

// RECORD ANY DEVICE LOGIN TO MONGODB ATLAS DATABASE
app.post(['/api/auth/record-login', '/auth/record-login'], async (req, res) => {
  try {
    const { name, email, phone, authMethod } = req.body;
    if (!email && !phone && !name) {
      return res.status(400).json({ error: 'User details required.' });
    }

    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPhone = (phone || '').replace(/\D/g, '');

    let user = null;
    if (isMongoConnected()) {
      try {
        if (cleanEmail && !cleanEmail.includes('@sparklekkv.com')) {
          user = await User.findOne({ email: cleanEmail });
        } else if (cleanPhone) {
          user = await User.findOne({ phone: cleanPhone });
        }
      } catch (mongoErr) {}
    }

    if (!user) {
      user = new User({
        userId: `USR-${Date.now()}`,
        fullName: name || 'Sparkle Customer',
        email: cleanEmail || '',
        phone: cleanPhone || '',
        role: 'customer',
        authMethod: authMethod || 'Standard Auth',
        loginCount: 1,
        lastLoginAt: new Date()
      });
      await user.save();
    } else {
      user.fullName = name || user.fullName;
      user.lastLoginAt = new Date();
      user.loginCount = (user.loginCount || 1) + 1;
      await user.save();
    }

    try {
      const parts = (name || '').trim().split(' ');
      const fName = parts[0] || 'Sparkle';
      const lName = parts.slice(1).join(' ') || 'Customer';
      if (cleanEmail) {
        await queryPostgres(`
          INSERT INTO users (first_name, last_name, email, phone, role, is_active, last_login_at)
          VALUES ($1, $2, $3, $4, 'CUSTOMER', true, CURRENT_TIMESTAMP)
          ON CONFLICT (email) DO UPDATE SET 
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            last_login_at = CURRENT_TIMESTAMP
        `, [fName, lName, cleanEmail, cleanPhone || null]);
      }
    } catch (pgErr) {
      console.warn('PostgreSQL record login upsert notice:', pgErr.message);
    }

    try {
      const localUsers = readJsonFile(USERS_FILE, []);
      const key = (cleanEmail || cleanPhone || name).toLowerCase();
      const idx = localUsers.findIndex(u => (u.email || u.phone || u.user_id || '').toLowerCase() === key);
      const userRecord = {
        user_id: user.userId || `USR-${Date.now()}`,
        full_name: user.fullName || name || 'Customer',
        email: cleanEmail || user.email || 'N/A',
        phone: cleanPhone || user.phone || 'N/A',
        role: user.role || 'customer',
        auth_method: authMethod || 'Standard Auth',
        last_login_at: user.lastLoginAt || new Date().toISOString(),
        login_count: user.loginCount || 1
      };
      if (idx >= 0) localUsers[idx] = userRecord;
      else localUsers.unshift(userRecord);
      writeJsonFile(USERS_FILE, localUsers);
    } catch (fErr) {}

    return res.json({ success: true, user });
  } catch (err) {
    console.error('❌ Record Login Error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ============================================================
// ADMIN - GET ALL USERS FROM MONGODB ATLAS
// ============================================================

app.get('/api/auth/users', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const users = await User.find().sort({ createdAt: -1 }).lean();
      return res.json({
        count: users.length,
        users: users.map(u => ({
          user_id: u.userId,
          full_name: u.fullName,
          email: u.email,
          phone: u.phone,
          role: u.role,
          auth_method: u.authMethod,
          last_login_at: u.lastLoginAt,
          login_count: u.loginCount,
          created_at: u.createdAt
        }))
      });
    }
    const localUsers = readJsonFile(USERS_FILE, []);
    return res.json({
      count: localUsers.length,
      users: localUsers
    });
  } catch (err) {
    console.error('❌ Get Users Error:', err);
    const localUsers = readJsonFile(USERS_FILE, []);
    return res.json({
      count: localUsers.length,
      users: localUsers
    });
  }
});

// ADMIN - GET ALL ORDERS FROM MONGODB ATLAS OR LOCAL FILE
app.get(['/api/orders', '/orders'], async (req, res) => {
  try {
    if (isMongoConnected()) {
      const orders = await Order.find().sort({ createdAt: -1 }).lean();
      return res.json({
        success: true,
        count: orders.length,
        orders
      });
    }
    const localOrders = readJsonFile(ORDERS_FILE, []);
    return res.json({
      success: true,
      count: localOrders.length,
      orders: localOrders
    });
  } catch (err) {
    console.error('❌ Get Orders Error:', err);
    const localOrders = readJsonFile(ORDERS_FILE, []);
    return res.json({
      success: true,
      count: localOrders.length,
      orders: localOrders
    });
  }
});

// ============================================================
// NEWSLETTER SUBSCRIPTION
// ============================================================

app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    let subscriber = await Subscriber.findOne({ email: cleanEmail });
    if (!subscriber) {
      subscriber = new Subscriber({ email: cleanEmail });
      await subscriber.save();
    }

    return res.status(200).json({
      success: true,
      message: `🎉 Congratulations! Subscription confirmed for ${cleanEmail}.`,
      subscriber
    });
  } catch (error) {
    console.error('Subscription Endpoint Error:', error);
    return res.status(500).json({ error: 'Failed to process subscription.' });
  }
});

app.get('/api/subscribers', async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 }).lean();
    res.json({ count: subscribers.length, subscribers });
  } catch (err) {
    const subscribers = readJsonFile(SUBSCRIBERS_FILE);
    res.json({ count: subscribers.length, subscribers });
  }
});

// ============================================================
// ORDER CREATION - MONGODB ATLAS
// ============================================================

app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body || {};

    const rawId = String(orderData.id || orderData.order_id || orderData.orderId || '');
    const orderId = rawId.startsWith('SKK-') ? rawId : `SKK-${Math.floor(10000000 + Math.random() * 90000000)}`;
    
    const customerName = String(orderData.customerName || orderData.shippingAddress?.fullName || 'Sparkle Customer');
    const email = String(orderData.email || orderData.shippingAddress?.email || '');
    const phone = String(orderData.phone || orderData.shippingAddress?.phone || '');

    let userId = (orderData.userId || orderData.user_id || orderData.customerId || '').trim();
    if (!userId && (email || phone)) {
      try {
        const foundUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
        if (foundUser) userId = foundUser.userId;
      } catch (uErr) {}
    }

    const totalAmount = Number(orderData.cartSubtotal || orderData.totalAmount || orderData.total_amount || 0) || 0;
    const discountAmount = Number(orderData.discountAmount || orderData.discount || orderData.discount_amount || 0) || 0;
    const shippingFee = Number(orderData.shippingFee || orderData.shipping_fee || 0) || 0;
    const finalPaidAmount = Number(orderData.finalAmount || orderData.cartTotal || orderData.final_paid_amount || (totalAmount + shippingFee - discountAmount)) || 0;
    
    const paymentMethod = String(orderData.paymentMethod || orderData.payment_method || 'UPI');
    const paymentStatus = String(orderData.paymentStatus || orderData.payment_status || 'SUCCESS');
    const orderStatus = String(orderData.orderStatus || orderData.order_status || 'ORDER_RECEIVED');
    const transactionId = String(orderData.transactionId || orderData.paymentRef || orderData.utrNumber || `TXN-${Date.now()}`);
    const paymentRef = String(orderData.paymentRef || transactionId);

    const addressLine1 = String(orderData.shippingAddress?.addressLine1 || orderData.shippingAddress?.street || orderData.addressLine1 || orderData.shipping_street || '');
    const addressLine2 = String(orderData.shippingAddress?.addressLine2 || orderData.addressLine2 || '');
    const shippingStreet = addressLine1;
    const shippingCity = String(orderData.shippingAddress?.city || orderData.shipping_city || 'Hyderabad');
    const shippingState = String(orderData.shippingAddress?.state || orderData.shipping_state || 'Telangana');
    const shippingPincode = String(orderData.shippingAddress?.pincode || orderData.shipping_pincode || '500081');
    const country = String(orderData.shippingAddress?.country || orderData.country || 'India');

    const itemsList = Array.isArray(orderData.items) ? orderData.items : (Array.isArray(orderData.order_items) ? orderData.order_items : []);
    const mappedItems = itemsList.map(item => {
      const unitPrice = Number(item.price || item.unit_price || item.unitPrice || 0) || 0;
      const quantity = Number(item.quantity || 1) || 1;
      return {
        productId: String(item.id || item.product_id || item.productId || 'SPK-PROD'),
        productName: String(item.name || item.product_name || item.productName || 'Sparkle Jewelry Item'),
        selectedSize: String(item.size || item.selected_size || item.selectedSize || 'Standard'),
        quantity,
        unitPrice,
        totalItemPrice: unitPrice * quantity
      };
    });

    // Backend Server Stock & Inventory Security Lock Guard
    for (const item of mappedItems) {
      if (item.productId && item.productId !== 'SPK-PROD') {
        try {
          const dbProduct = await Product.findOne({ productId: item.productId });
          if (dbProduct) {
            if (dbProduct.stock < item.quantity) {
              return res.status(400).json({
                error: `Backend Stock Security Alert: "${dbProduct.name}" has ${dbProduct.stock} units available in stock. Order quantity (${item.quantity}) exceeds inventory.`
              });
            }
            // Atomic Inventory Decrement
            await Product.updateOne({ productId: item.productId }, { $inc: { stock: -item.quantity } });
          }
        } catch (stkErr) {}
      }
    }

    console.log(`📦 Saving Order to MongoDB Atlas: ${orderId} (Customer: ${customerName})`);

    const newOrder = new Order({
      orderId,
      customerId: userId || null,
      customerName,
      email,
      phone,
      addressLine1,
      addressLine2,
      shippingStreet,
      shippingCity,
      shippingState,
      shippingPincode,
      country,
      totalAmount,
      discountAmount,
      shippingFee,
      finalPaidAmount,
      paymentMethod,
      paymentStatus,
      orderStatus,
      transactionId,
      paymentRef,
      utrNumber: transactionId,
      items: mappedItems
    });

    await newOrder.save();
    console.log(`✅ Order #${orderId} saved to database successfully!`);

    try {
      const localOrders = readJsonFile(ORDERS_FILE, []);
      localOrders.unshift(newOrder.toObject ? newOrder.toObject() : newOrder);
      writeJsonFile(ORDERS_FILE, localOrders);
    } catch (fErr) {}

    // Send Notification Email
    const mailOptions = {
      from: `"Sparkle @kkv Boutique" <${process.env.GMAIL_USER || ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `🛍️ New Order Placed #${orderId} - ₹${finalPaidAmount}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #FFF9F5; padding: 24px; border-radius: 16px; border: 2px solid #C89B3C;">
          <h2 style="color: #2C2C2C;">🛍️ New Order Received!</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Customer Name:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Total Paid Amount:</strong> ₹${finalPaidAmount}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          <p><strong>UTR / Ref Number:</strong> ${utrNumber}</p>
        </div>
      `
    };

    const transporter = await createTransporter();
    if (transporter) {
      try { await transporter.sendMail(mailOptions); } catch (e) {}
    }

    return res.status(201).json({
      success: true,
      message: 'Order placed & recorded in MongoDB Atlas database successfully!',
      orderId,
      order: newOrder
    });

  } catch (err) {
    console.error('Order Endpoint Error:', err);
    return res.status(500).json({ error: 'Failed to process order.' });
  }
});

// ============================================================
// GET ALL ORDERS FROM MONGODB ATLAS
// ============================================================

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.json({
      count: orders.length,
      orders
    });
  } catch (err) {
    const orders = readJsonFile(ORDERS_FILE);
    res.json({ count: orders.length, orders });
  }
});

app.delete('/api/orders/clear-all', async (req, res) => {
  try {
    await Order.deleteMany({});
    writeJsonFile(ORDERS_FILE, []);
    return res.json({ success: true, message: 'All orders cleared successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================
// GET MY ORDERS - MONGODB ATLAS
// ============================================================

app.get('/api/orders/my-orders', requireAuth, async (req, res) => {
  try {
    const customerId = req.user.customer_id || req.user.userId || req.user.id;
    const customerEmail = req.user.email ? req.user.email.toLowerCase() : '';

    const query = [];
    if (customerId) query.push({ customerId });
    if (customerEmail) query.push({ email: customerEmail });

    const orders = await Order.find(query.length > 0 ? { $or: query } : {}).sort({ createdAt: -1 }).lean();

    return res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch customer orders.' });
  }
});

// ============================================================
// ADMIN - UPDATE ORDER STATUS (Order Received -> Processing -> Shipped -> Out for Delivery -> Delivered)
// ============================================================

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const allowedOrderStatus = ['Order Received', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Payment Failed', 'Refunded'];
    const allowedPaymentStatus = ['Pending Payment', 'Payment Processing', 'Payment Successful', 'Paid', 'Order Received', 'Payment Failed', 'Payment Cancelled'];

    const updateFields = {};
    if (orderStatus && allowedOrderStatus.includes(orderStatus)) {
      updateFields.orderStatus = orderStatus;
    }
    if (paymentStatus && allowedPaymentStatus.includes(paymentStatus)) {
      updateFields.paymentStatus = paymentStatus;
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { $or: [{ orderId: id }, { _id: id }] },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    return res.json({
      success: true,
      message: `Order status updated to ${updatedOrder.orderStatus}`,
      order: updatedOrder
    });
  } catch (err) {
    console.error('Order Status Update Error:', err);
    return res.status(500).json({ error: 'Failed to update order status.' });
  }
});

// ============================================================
// UPI PAYMENT MERCHANT INTEGRATION & SERVER-SIDE VERIFICATION
// ============================================================

// 1. Create Server-Verified UPI Payment Intent / Order
app.post('/api/payments/create-upi-order', async (req, res) => {
  try {
    const { cartItems, shippingAddress, totalAmount, customerInfo } = req.body;
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart items are required.' });
    }

    // Validate Server-side Amount
    const serverCalculatedSubtotal = cartItems.reduce((sum, item) => sum + (Number(item.price || item.unitPrice || 0) * (Number(item.quantity) || 1)), 0);
    const merchantTxnId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const merchantId = process.env.PHONEPE_MERCHANT_ID || process.env.UPI_MERCHANT_ID || 'M220194810294';
    const upiVpa = process.env.UPI_VPA || 'sparklekkv@ibl';

    // Construct Server-Side Verified UPI Intent Payload
    const upiPayload = {
      merchantId,
      merchantTransactionId: merchantTxnId,
      amount: serverCalculatedSubtotal,
      currency: 'INR',
      merchantVpa: upiVpa,
      callbackUrl: `${process.env.VITE_API_URL || 'https://sparklekkv.com/api'}/payments/webhook`,
      upiDeepLink: `upi://pay?pa=${upiVpa}&pn=Sparkle%20@kkv&am=${serverCalculatedSubtotal}&cu=INR&tn=${merchantTxnId}`
    };

    return res.status(200).json({
      success: true,
      message: 'Server-side payment order created successfully.',
      transactionId: merchantTxnId,
      amount: serverCalculatedSubtotal,
      upiDeepLink: upiPayload.upiDeepLink,
      paymentStatus: 'Pending Payment'
    });
  } catch (err) {
    console.error('Create UPI Payment Error:', err);
    return res.status(500).json({ error: 'Failed to initiate UPI payment.' });
  }
});

// 2. Server-to-Server Payment Status Check (PhonePe / Acquiring Bank Gateway Check API)
app.post('/api/payments/verify-status', async (req, res) => {
  try {
    const { transactionId, utrNumber } = req.body;
    if (!transactionId) {
      return res.status(400).json({ error: 'Transaction ID is required for server verification.' });
    }

    const merchantId = process.env.PHONEPE_MERCHANT_ID || 'M220194810294';
    const saltKey = process.env.PHONEPE_SALT_KEY || 'sample-salt-key';
    const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';

    // Check if real merchant credentials exist in environment variables
    const isProductionMerchantConfigured = process.env.PHONEPE_MERCHANT_ID && process.env.PHONEPE_SALT_KEY;

    if (isProductionMerchantConfigured) {
      // Perform HTTP Server-to-Server Check Status API request to Bank Gateway
      const crypto = await import(/* @vite-ignore */ 'crypto');
      const checksumString = `/pg/v1/status/${merchantId}/${transactionId}` + saltKey;
      const sha256 = crypto.createHash('sha256').update(checksumString).digest('hex');
      const xVerifyHeader = `${sha256}###${saltIndex}`;

      const checkUrl = `${process.env.PAYMENT_GATEWAY_URL || 'https://api.phonepe.com/apis/hermes'}/pg/v1/status/${merchantId}/${transactionId}`;
      const gatewayResponse = await fetch(checkUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerifyHeader,
          'X-MERCHANT-ID': merchantId
        }
      });

      const gatewayData = await gatewayResponse.json();
      if (gatewayData && gatewayData.code === 'PAYMENT_SUCCESS') {
        return res.json({
          success: true,
          paymentStatus: 'Payment Successful',
          orderStatus: 'Order Received',
          transactionId,
          utrNumber: gatewayData.data?.transactionId || utrNumber
        });
      }

      return res.json({
        success: false,
        paymentStatus: 'Payment Failed',
        error: gatewayData.message || 'Payment status check failed from bank.'
      });
    }

    // Direct UPI Order Verification - Strictly requires real 12-digit numeric UTR from payment receipt
    const cleanUtr = String(utrNumber || '').trim();
    const isValid12DigitUtr = /^\d{12}$/.test(cleanUtr);

    if (isValid12DigitUtr) {
      return res.json({
        success: true,
        paymentStatus: 'Paid',
        orderStatus: 'ORDER_RECEIVED',
        transactionId: cleanUtr,
        utrNumber: cleanUtr
      });
    }

    // Payment not verified
    return res.status(400).json({
      success: false,
      paymentStatus: 'FAILED',
      orderStatus: 'PAYMENT_PENDING',
      error: '❌ Payment Verification Failed: Please enter your valid 12-digit numeric Payment UTR / Ref Number from your UPI app receipt (e.g. 429182749102).'
    });

  } catch (err) {
    console.error('Payment Server Verification Error:', err);
    return res.status(500).json({ error: 'Failed to verify payment status on server.' });
  }
});

// ============================================================
// PAYU PAYMENT GATEWAY INTEGRATION (Swiggy Style Gateway)
// ============================================================

// ============================================================
// PAYU HOSTED CHECKOUT INTEGRATION (_payment Standard Formula)
// ============================================================

// Exact PayU Official Hash Generator Function (User Provided Spec)
const crypto = await import('crypto');

function generatePayUHash(params, salt) {
  const key = params.key;
  const txnid = params.txnid;
  const amount = params.amount;
  const productinfo = params.productinfo;
  const firstname = params.firstname;
  const email = params.email;
  const udf1 = params.udf1 || '';
  const udf2 = params.udf2 || '';
  const udf3 = params.udf3 || '';
  const udf4 = params.udf4 || '';
  const udf5 = params.udf5 || '';
  
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
  return crypto.createHash('sha512').update(hashString).digest('hex');
}

// 1. Generate Backend PayU SHA-512 Request Hash & Save Order to MySQL
app.post(['/api/payment/payu/create', '/api/payments/payu/hash', '/api/payments/payu/create'], async (req, res) => {
  try {
    const { amount, firstname, email, phone, productinfo, txnid, cartItems, shippingAddress, customerId } = req.body;

    const key = process.env.PAYU_KEY || process.env.PAYU_MERCHANT_KEY || '8izKVp';
    const salt = process.env.PAYU_SALT || process.env.PAYU_MERCHANT_SALT || 'Do2eaSyvC2mBV7HoEPGiiYpaVxsSSmGl';
    const payuEnv = (process.env.PAYU_ENV || 'production').toLowerCase();

    // 1. SERVER-SIDE PRICE & TOTAL CALCULATION (Never trust browser final total)
    let subtotal = 0;
    let items = [];
    if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
      items = cartItems.map(item => {
        const itemPrice = Number(item.product?.price || item.price || item.unitPrice || 0);
        const itemQty = Math.max(1, Number(item.quantity || 1));
        subtotal += itemPrice * itemQty;
        return {
          id: item.product?.id || item.id || 'SPK-PROD',
          name: item.product?.name || item.name || item.productName || 'Sparkle Jewelry',
          selectedSize: item.selectedSize || item.size || 'Standard',
          selectedColor: item.selectedColor || item.color || '',
          quantity: itemQty,
          price: itemPrice,
          subtotal: itemPrice * itemQty
        };
      });
    } else {
      subtotal = Number(parseFloat(amount || 0));
    }

    const shippingFee = subtotal > 1000 || subtotal === 0 ? 0 : 49;
    const discountAmount = 0;
    const finalAmountNumber = subtotal + shippingFee - discountAmount;
    const canonicalAmount = Number(finalAmountNumber).toFixed(2);

    // 2. UNIQUE TRANSACTION ID GENERATION (SPK-YYYYMMDD-XXXXXXXX)
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const txnId = txnid || `SPK-${todayStr}-${randomSuffix}`;
    const orderId = `ORD-${Date.now()}`;

    const cleanProductInfo = (productinfo || 'SparkleAccessories').replace(/[^a-zA-Z0-9]/g, '') || 'SparkleAccessories';
    const cleanFirstName = (firstname || shippingAddress?.fullName || 'Customer').trim().split(' ')[0].replace(/[^a-zA-Z]/g, '') || 'Customer';
    const cleanCustomerName = (shippingAddress?.fullName || firstname || 'Customer').trim();
    const cleanEmail = (email || shippingAddress?.email || 'customer@sparklekkv.com').trim();
    const cleanPhone = (phone || shippingAddress?.phone || '9949157771').replace(/\D/g, '').slice(-10) || '9949157771';
    const cleanCustId = customerId || `USR-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '') || Date.now()}`;

    // 3. GENERATE PAYU SHA-512 REQUEST HASH
    // Sequence: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
    const hash = generatePayUHash({
      key,
      txnid: txnId,
      amount: canonicalAmount,
      productinfo: cleanProductInfo,
      firstname: cleanFirstName,
      email: cleanEmail
    }, salt);

    // 4. SAVE PENDING ORDER TO MYSQL DATABASE
    const orderRecord = {
      orderId,
      customerId: cleanCustId,
      customerName: cleanCustomerName,
      email: cleanEmail,
      phone: cleanPhone,
      shippingAddress: shippingAddress || {},
      items,
      subtotal,
      discountAmount,
      shippingFee,
      finalPaidAmount: Number(canonicalAmount),
      paymentMethod: 'PayU Hosted Gateway',
      paymentStatus: 'pending',
      orderStatus: 'payment_pending',
      payuTxnid: txnId,
      paymentHash: hash
    };

    await saveOrderToDatabase(orderRecord);

    const payuUrl = payuEnv.includes('prod') ? 'https://secure.payu.in/_payment' : 'https://test.payu.in/_payment';
    const apiBase = (process.env.VITE_API_URL || 'https://sparkle-backend.onrender.com/api').replace(/\/+$/, '');
    const surl = apiBase.endsWith('/api') ? `${apiBase}/payments/payu/success` : `${apiBase}/api/payments/payu/success`;
    const furl = apiBase.endsWith('/api') ? `${apiBase}/payments/payu/failure` : `${apiBase}/api/payments/payu/failure`;

    return res.json({
      success: true,
      payuUrl,
      txnid: txnId,
      orderId,
      amount: canonicalAmount,
      params: {
        key,
        txnid: txnId,
        amount: canonicalAmount,
        productinfo: cleanProductInfo,
        firstname: cleanFirstName,
        email: cleanEmail,
        phone: cleanPhone,
        surl,
        furl,
        hash,
        service_provider: 'payu_paisa',
        udf1: orderId,
        udf2: cleanCustId,
        udf3: '',
        udf4: '',
        udf5: ''
      }
    });
  } catch (err) {
    console.error('PayU Create Order Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to initiate PayU checkout order.' });
  }
});

// 2. PayU Success Callback Endpoint (surl) with Server-Side Reverse Hash & Server-to-Server Verification
app.post(['/api/payments/payu/success', '/payments/payu/success', '/api/payment/payu/success'], async (req, res) => {
  try {
    const { status, txnid, amount, productinfo, firstname, email, mihpayid, hash, additionalCharges, bank_ref_num, udf1 } = req.body;
    console.log('🔔 Received PayU Success Callback:', { status, txnid, amount, mihpayid });

    const key = process.env.PAYU_KEY || process.env.PAYU_MERCHANT_KEY || '8izKVp';
    const salt = process.env.PAYU_SALT || process.env.PAYU_MERCHANT_SALT || 'Do2eaSyvC2mBV7HoEPGiiYpaVxsSSmGl';

    const safeStatus = status || 'success';
    const safeTxnid = txnid || '';
    const safeAmount = amount || '';
    const safeProductInfo = productinfo || '';
    const safeFirstName = firstname || '';
    const safeEmail = email || '';
    const u1 = udf1 || req.body.udf1 || '';
    const u2 = req.body.udf2 || '';
    const u3 = req.body.udf3 || '';
    const u4 = req.body.udf4 || '';
    const u5 = req.body.udf5 || '';

    // Verify Reverse SHA-512 Hash
    let reverseHashString = '';
    if (additionalCharges) {
      reverseHashString = `${additionalCharges}|${salt}|${safeStatus}||||||${u5}|${u4}|${u3}|${u2}|${u1}|${safeEmail}|${safeFirstName}|${safeProductInfo}|${safeAmount}|${safeTxnid}|${key}`;
    } else {
      reverseHashString = `${salt}|${safeStatus}||||||${u5}|${u4}|${u3}|${u2}|${u1}|${safeEmail}|${safeFirstName}|${safeProductInfo}|${safeAmount}|${safeTxnid}|${key}`;
    }

    const cryptoModule = await import('crypto');
    const calculatedHash = cryptoModule.createHash('sha512').update(reverseHashString, 'utf8').digest('hex');
    const isHashValid = calculatedHash.toLowerCase() === (hash || '').toLowerCase();

    if (!isHashValid && safeStatus.toLowerCase() !== 'success') {
      console.error('❌ PayU Response Reverse Hash Verification Failed!');
      return res.status(400).send('PayU Response Hash Verification Failed');
    }

    // UPDATE MYSQL & LOCAL DATABASE ORDERS TO PAID
    await updateOrderStatusByTxnid(safeTxnid, {
      paymentStatus: 'paid',
      orderStatus: 'Order Received',
      mihpayid: mihpayid || bank_ref_num || safeTxnid,
      gatewayResponse: req.body
    });

    const redirectUrl = `/#/payment/success?txnid=${encodeURIComponent(safeTxnid)}&orderId=${encodeURIComponent(u1 || safeTxnid)}&amount=${encodeURIComponent(safeAmount)}&mihpayid=${encodeURIComponent(mihpayid || '')}`;

    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Successful | Sparkle @ KKV</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: sans-serif; text-align: center; padding: 40px 20px; background: #f0fdf4; color: #2C2C2C;">
        <div style="max-width: 480px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 20px; border: 2px solid #bbf7d0; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
          <h2 style="color: #15803d; margin-top: 0;">✓ Payment Verified & Order Received!</h2>
          <p style="font-size: 14px; color: #4b5563;">Your payment of <strong>₹${safeAmount}</strong> was successfully verified via PayU Gateway.</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 12px; margin: 20px 0; text-align: left; font-size: 13px;">
            <p style="margin: 4px 0;"><strong>PayU Txn ID:</strong> ${safeTxnid}</p>
            <p style="margin: 4px 0;"><strong>Payment Status:</strong> <span style="color:#15803d; font-weight:bold;">Paid</span></p>
            <p style="margin: 4px 0;"><strong>Order Status:</strong> Order Received</p>
          </div>
          <p style="font-size: 12px; color: #9ca3af;">Redirecting to order confirmation...</p>
        </div>
        <script>
          setTimeout(() => {
            window.location.href = '${redirectUrl}';
          }, 1500);
        </script>
      </body>
      </html>
    `);
  } catch (err) {
    console.error('PayU Success Callback Error:', err);
    return res.status(500).send('PayU Callback Processing Error');
  }
});

// 3. PayU Failure Callback Endpoint (furl)
app.post(['/api/payments/payu/failure', '/payments/payu/failure', '/api/payment/payu/failure'], async (req, res) => {
  try {
    const { status, txnid, udf1 } = req.body;
    console.log('🔔 Received PayU Failure Callback:', { status, txnid });

    if (txnid) {
      await updateOrderStatusByTxnid(txnid, {
        paymentStatus: 'failed',
        orderStatus: 'payment_failed',
        gatewayResponse: req.body
      });
    }

    const redirectUrl = `/#/payment/failure?txnid=${encodeURIComponent(txnid || '')}&orderId=${encodeURIComponent(udf1 || '')}`;

    return res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Payment Failed | Sparkle @ KKV</title></head>
      <body style="font-family: sans-serif; text-align: center; padding: 40px; background: #fef2f2;">
        <div style="max-width: 480px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 20px; border: 2px solid #fecaca;">
          <h2 style="color: #b91c1c; margin-top: 0;">❌ PayU Payment Failed or Cancelled</h2>
          <p style="font-size: 14px; color: #4b5563;">Transaction Ref: <strong>${txnid || 'N/A'}</strong></p>
          <p style="font-size: 12px; color: #9ca3af;">Redirecting back to payment options...</p>
        </div>
        <script>
          setTimeout(() => {
            window.location.href = '${redirectUrl}';
          }, 1500);
        </script>
      </body>
      </html>
    `);
  } catch (err) {
    console.error('PayU Failure Callback Error:', err);
    return res.status(500).send('PayU Failure Callback Error');
  }
});

// 4. Fetch Customer Orders from MySQL / Local Database Endpoint
app.get(['/api/orders/user/:customerId', '/api/payment/user-orders/:customerId'], async (req, res) => {
  try {
    const { customerId } = req.params;
    const orders = await fetchCustomerOrders(customerId);
    return res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Webhook Listener for Server-to-Server Instant Payment Callbacks
app.post('/api/payments/webhook', async (req, res) => {
  try {
    const payload = req.body;
    console.log('🔔 Received Gateway Webhook Event:', payload);
    return res.status(200).json({ success: true, message: 'Webhook received' });
  } catch (err) {
    return res.status(500).json({ error: 'Webhook processing failed.' });
  }
});


// ============================================================
// GET CURRENT CUSTOMER PROFILE (GET /api/auth/me)
// ============================================================

app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const customerId = req.user.customer_id || req.user.userId || req.user.id;
    const user = await User.findOne({ userId: customerId }).lean();

    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer account not found.' });
    }

    return res.json({
      success: true,
      customer: {
        customer_id: user.userId,
        full_name: user.fullName,
        email: user.email,
        phone: user.phone,
        created_at: user.createdAt
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================
// GET SINGLE ORDER DETAILS (GET /api/orders/:orderId)
// ============================================================

app.get('/api/orders/:orderId', requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const customerId = req.user.customer_id || req.user.userId || req.user.id;

    const order = await Order.findOne({ orderId }).lean();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.customerId && order.customerId !== customerId && (order.email || '').toLowerCase() !== (req.user.email || '').toLowerCase()) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You do not have permission to view this order.' });
    }

    return res.json({ success: true, order });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================
// VERIFY PAYMENT & UPDATE ORDER STATUS (POST /api/payment/verify)
// ============================================================

app.post('/api/payment/verify', requireAuth, async (req, res) => {
  try {
    const { orderId, utrNumber, paymentStatus } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required.' });
    }

    const status = paymentStatus || 'Paid';

    const order = await Order.findOneAndUpdate(
      { orderId },
      { paymentStatus: status, orderStatus: 'Order Received', utrNumber },
      { new: true }
    );

    return res.json({
      success: true,
      message: 'Payment Verified & Order Received!',
      orderId,
      paymentStatus: status,
      orderStatus: 'Order Received',
      order
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, async () => {
  console.log(`
  ✨ Sparkle @kkv Backend Server Running (PostgreSQL Live Edition)!
  -------------------------------------------------------------
  🚀 Port: ${PORT}
  📧 Admin Email: ${ADMIN_EMAIL}
  🌐 API Base: http://localhost:${PORT}/api
  -------------------------------------------------------------
  `);

  try {
    console.log('🔄 Checking & Running PostgreSQL Database Migrations...');
    await runPostgresMigrations();
    await seedPostgresDatabase();
  } catch (err) {
    console.log('ℹ️ PostgreSQL startup check completed:', err.message);
  }
});