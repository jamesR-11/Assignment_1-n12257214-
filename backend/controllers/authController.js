const User = require('../models/User');
const Attendance = require('../models/Attendance');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

/** POST /api/auth/register */
const registerUser = async (req, res) => {
  const { name, email, password } = req.body || {};
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    return res
      .status(201)
      .json({ id: user.id, name: user.name, email: user.email, token: generateToken(user.id) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/** POST /api/auth/login */
const loginUser = async (req, res) => {
  const { email, password } = req.body || {};
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

    // Record login timestamp
    await Attendance.create({
      userId: user._id,
      loginAt: new Date(),
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/** GET /api/auth/profile */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
    return res.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      token: generateToken(updated.id),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/** POST /api/auth/logout */
const logoutUser = async (req, res) => {
  try {
    await Attendance.findOneAndUpdate(
      { userId: req.user.id, logoutAt: null },
      { logoutAt: new Date() },
      { sort: { loginAt: -1 } }
    );
    return res.json({ message: 'Logged out' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile,
  logoutUser,
};
