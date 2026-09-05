import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { queryPostgres } from '../db_postgres.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const readJsonUsers = () => {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      return data ? JSON.parse(data) : [];
    }
  } catch (e) {}
  return [];
};

const writeJsonUsers = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (e) {}
};

const JWT_SECRET = process.env.JWT_SECRET || 'sparkle_kkv_secure_jwt_secret_key_2026';

export async function registerUser({ firstName, lastName, email, phone, password, role = 'CUSTOMER' }) {
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
  const cleanFirstName = firstName ? firstName.trim() : (cleanEmail ? cleanEmail.split('@')[0] : 'Sparkle');
  const cleanLastName = lastName ? lastName.trim() : '';
  const cleanRole = (role || 'CUSTOMER').toUpperCase();
  const dbRole = ['CUSTOMER', 'ADMIN', 'SUPER_ADMIN'].includes(cleanRole) ? cleanRole : 'CUSTOMER';

  if (!cleanEmail && !cleanPhone) {
    return { success: false, statusCode: 400, error: 'Email or phone number is required.' };
  }
  if (!password || password.length < 6) {
    return { success: false, statusCode: 400, error: 'Password must be at least 6 characters long.' };
  }

  // 1. Try PostgreSQL
  const existing = await queryPostgres(
    'SELECT id, email, phone FROM users WHERE (email = $1 AND email != \'\') OR (phone = $2 AND phone != \'\')',
    [cleanEmail, cleanPhone]
  );

  if (existing.success) {
    if (existing.rows.length > 0) {
      return { success: false, statusCode: 409, error: 'An account with this email or phone number already exists.' };
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const insertRes = await queryPostgres(`
      INSERT INTO users (first_name, last_name, email, phone, password_hash, role, is_active, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6, true, false)
      RETURNING id, first_name, last_name, email, phone, role, created_at
    `, [cleanFirstName, cleanLastName, cleanEmail, cleanPhone, passwordHash, dbRole]);

    if (insertRes.success && insertRes.rows.length > 0) {
      const user = insertRes.rows[0];
      await queryPostgres('INSERT INTO login_events (user_id, event_type, success) VALUES ($1, \'ACCOUNT_CREATED\', true)', [user.id]);
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      return {
        success: true,
        user: {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`.trim(),
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        token
      };
    }
  }

  // 2. Fallback to Local JSON Engine if PostgreSQL offline
  const localUsers = readJsonUsers();
  const duplicate = localUsers.find(u => (cleanEmail && u.email === cleanEmail) || (cleanPhone && u.phone === cleanPhone));
  if (duplicate) {
    return { success: false, statusCode: 409, error: 'An account with this email or phone number already exists.' };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    user_id: `USR-${Date.now()}`,
    full_name: `${cleanFirstName} ${cleanLastName}`.trim() || 'Sparkle Customer',
    first_name: cleanFirstName,
    last_name: cleanLastName,
    email: cleanEmail,
    phone: cleanPhone,
    password_hash: passwordHash,
    role: role.toLowerCase(),
    auth_method: 'Standard Auth',
    login_count: 1,
    created_at: new Date().toISOString()
  };

  localUsers.unshift(newUser);
  writeJsonUsers(localUsers);

  const token = jwt.sign({ id: newUser.user_id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
  return {
    success: true,
    user: {
      id: newUser.user_id,
      name: newUser.full_name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role
    },
    token
  };
}

export async function loginUser({ email, phone, password, reqInfo = {} }) {
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  const cleanPhone = phone ? phone.replace(/\D/g, '') : '';

  if ((!cleanEmail && !cleanPhone) || !password) {
    return { success: false, statusCode: 400, error: 'Email/Phone and Password are required.' };
  }

  // 1. Try PostgreSQL
  const userRes = await queryPostgres(
    'SELECT * FROM users WHERE (email = $1 AND email != \'\') OR (phone = $2 AND phone != \'\')',
    [cleanEmail, cleanPhone]
  );

  if (userRes.success && userRes.rows.length > 0) {
    const user = userRes.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (isPasswordValid && user.is_active) {
      await queryPostgres('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      return {
        success: true,
        user: {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`.trim(),
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        token
      };
    }
  }

  // 2. Fallback to Local JSON Engine if PostgreSQL offline
  const localUsers = readJsonUsers();
  const user = localUsers.find(u => (cleanEmail && u.email === cleanEmail) || (cleanPhone && u.phone === cleanPhone));

  if (!user) {
    return { success: false, statusCode: 401, error: 'Invalid email/phone or password.' };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash || '');
  if (!isPasswordValid) {
    return { success: false, statusCode: 401, error: 'Invalid email/phone or password.' };
  }

  user.last_login_at = new Date().toISOString();
  user.login_count = (user.login_count || 1) + 1;
  writeJsonUsers(localUsers);

  const token = jwt.sign({ id: user.user_id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  return {
    success: true,
    user: {
      id: user.user_id,
      name: user.full_name || user.name || 'Sparkle Customer',
      email: user.email,
      phone: user.phone,
      role: user.role
    },
    token
  };
}

export async function getUserProfile(userId) {
  const res = await queryPostgres(
    'SELECT id, first_name, last_name, email, phone, role, is_active, email_verified, phone_verified, created_at, last_login_at FROM users WHERE id = $1',
    [userId]
  );
  if (res.success && res.rows.length > 0) {
    const u = res.rows[0];
    return {
      success: true,
      user: {
        id: u.id,
        name: `${u.first_name} ${u.last_name}`.trim(),
        email: u.email,
        phone: u.phone,
        role: u.role
      }
    };
  }

  const localUsers = readJsonUsers();
  const u = localUsers.find(user => user.user_id === userId || user.id === userId);
  if (u) {
    return {
      success: true,
      user: {
        id: u.user_id || u.id,
        name: u.full_name || u.name,
        email: u.email,
        phone: u.phone,
        role: u.role
      }
    };
  }

  return { success: false, statusCode: 404, error: 'User not found.' };
}

export async function logoutUser(userId, tokenHash) {
  return { success: true, message: 'Logged out successfully.' };
}

export default {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser
};
