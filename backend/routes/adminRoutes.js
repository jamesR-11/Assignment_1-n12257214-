// backend/routes/adminRoutes.js
const express = require('express');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const {
  listUsers, updateUser, deleteUser,
  listAllAttendance, updateAttendance, deleteAttendance
} = require('../controllers/adminController');

const router = express.Router();
router.use(protect, isAdmin);

// Users
router.get('/users', listUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Attendance
router.get('/attendance', listAllAttendance);
router.put('/attendance/:id', updateAttendance);
router.delete('/attendance/:id', deleteAttendance);

module.exports = router;
