import express from 'express';
import { registerUser, loginUser, getUserProfile, logoutUser } from '../services/authService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Helper to extract client details for user session tracking
const getClientInfo = (req) => ({
  ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
  userAgent: req.headers['user-agent'] || '',
  device: req.headers['user-agent']?.includes('Mobile') ? 'Mobile Device' : 'Desktop',
  browser: req.headers['user-agent']?.includes('Chrome') ? 'Chrome' : (req.headers['user-agent']?.includes('Safari') ? 'Safari' : 'Browser'),
  os: req.headers['user-agent']?.includes('Windows') ? 'Windows' : (req.headers['user-agent']?.includes('Android') ? 'Android' : 'OS')
});

router.post('/register', async (req, res) => {
  try {
    const { name, firstName, lastName, email, phone, password } = req.body;
    let cleanFirst = firstName;
    let cleanLast = lastName;

    if (!cleanFirst && name) {
      const parts = name.trim().split(' ');
      cleanFirst = parts[0];
      cleanLast = parts.slice(1).join(' ');
    }

    const result = await registerUser({
      firstName: cleanFirst,
      lastName: cleanLast,
      email,
      phone,
      password
    });

    if (!result.success) {
      return res.status(result.statusCode || 400).json({ error: result.error });
    }

    res.status(201).json(result);
  } catch (err) {
    console.error('Auth Register Route Error:', err);
    res.status(500).json({ error: 'Server error during user registration.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, phone, identifier, password } = req.body;
    const reqInfo = getClientInfo(req);

    let cleanEmail = email;
    let cleanPhone = phone;

    if (!cleanEmail && !cleanPhone && identifier) {
      if (typeof identifier === 'string' && identifier.includes('@')) {
        cleanEmail = identifier;
      } else {
        cleanPhone = identifier;
      }
    }

    const result = await loginUser({ email: cleanEmail, phone: cleanPhone, password, reqInfo });
    if (!result.success) {
      return res.status(result.statusCode || 401).json({ error: result.error });
    }

    res.json(result);
  } catch (err) {
    console.error('Auth Login Route Error:', err);
    res.status(500).json({ error: 'Server error during authentication.' });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await getUserProfile(req.user.id);
    if (!result.success) {
      return res.status(result.statusCode || 404).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    console.error('Auth Me Route Error:', err);
    res.status(500).json({ error: 'Server error fetching profile.' });
  }
});

router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const result = await logoutUser(req.user.id, token ? token.slice(-20) : null);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error during logout.' });
  }
});

export default router;
