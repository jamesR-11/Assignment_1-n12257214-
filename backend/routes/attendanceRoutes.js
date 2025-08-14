const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getMyAttendance,
  markLogin,
  markLogout,
} = require('../controllers/attendanceController');

const router = express.Router();

router.get('/my', protect, getMyAttendance);


router.post('/login', protect, markLogin);
router.post('/logout', protect, markLogout);

module.exports = router; 
