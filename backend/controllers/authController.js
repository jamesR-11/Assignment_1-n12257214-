const User = require('../models/User');
const Attendance = require('../models/Attendance');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // match model
const DEV_DIAG = process.env.DEBUG_ERRORS === 'true';

const makeToken = (id) => {
  if (!process.env.JWT_SECRET) {
    const err = new Error('Missing JWT_SECRET');
    err.code = 'JWT_SECRET_MISSING';
    throw err;
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/** POST /api/auth/register */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });

    let token;
    try { token = makeToken(user.id); }
    catch (e) { console.error('[register] token error:', e); return res.status(500).json({ message: 'Server config error (JWT)' }); }

    return res.status(201).json({ id: user.id, name: user.name, email: user.email, token });
  } catch (error) {
    console.error('[register] error:', error);
    return res.status(500).json({ message: DEV_DIAG ? error.message : 'Server error during register' });
  }
};

/** POST /api/auth/login */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    let ok = false;
    try { ok = await bcrypt.compare(password, user.password); }
    catch (e) { console.error('[login] compare error:', e); return res.status(500).json({ message: 'Password compare error' }); }

    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

    // Try attendance write, but do NOT break login on failure
    try {
      await Attendance.create({
        userId: user._id,
        loginAt: new Date(),
        userAgent: req.headers['user-agent'],
        ip: req.ip,
      });
    } catch (attErr) {
      console.error('[attendance] create login row failed:', attErr);
    }

    let token;
    try { token = makeToken(user.id); }
    catch (e) { console.error('[login] token error:', e); return res.status(500).json({ message: 'Server config error (JWT)' }); }

    return res.json({ id: user.id, name: user.name, email: user.email, token });
  } catch (error) {
    console.error('[login] error:', error);
    return res.status(500).json({ message: DEV_DIAG ? error.message : 'Server error during login' });
  }
};

/** GET /api/auth/profile */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (error) {
    console.error('[profile] error:', error);
    return res.status(500).json({ message: DEV_DIAG ? error.message : 'Server error fetching profile' });
  }
};

/** PUT /api/auth/profile */
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name ?? user.name;
    user.email = req.body.email ?? user.email;
    if (req.body.password) user.password = req.body.password;

    const updated = await user.save();

    let token;
    try { token = makeToken(updated.id); }
    catch (e) { console.error('[updateProfile] token error:', e); return res.status(500).json({ message: 'Server config error (JWT)' }); }

    return res.json({ id: updated.id, name: updated.name, email: updated.email, token });
  } catch (error) {
    console.error('[updateProfile] error:', error);
    return res.status(500).json({ message: DEV_DIAG ? error.message : 'Server error updating profile' });
  }
};

/** POST /api/auth/logout */
const logoutUser = async (req, res) => {
  try {
    try {
      await Attendance.findOneAndUpdate(
        { userId: req.user.id, logoutAt: null },
        { logoutAt: new Date() },
        { sort: { loginAt: -1 } }
      );
    } catch (attErr) {
      console.error('[attendance] stamp logoutAt failed:', attErr);
    }
    return res.json({ message: 'Logged out' });
  } catch (err) {
    console.error('[logout] error:', err);
    return res.status(500).json({ message: DEV_DIAG ? err.message : 'Server error during logout' });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateUserProfile, logoutUser };
