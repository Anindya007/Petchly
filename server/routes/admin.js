const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Booking = require('../models/Booking');
const RoomBooking = require('../models/roomBooking');

// In-memory admin credentials (replace with database in production)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  // Default password: 'admin123' (hashed by 10 rounds of hashing)
  passwordHash: '$2a$10$UHVxpl03qRTcuE25tegZWOmkz9YaGubywkGEIchm5TShliIEskYAO'
};

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Admin login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Check username
    if (username !== ADMIN_CREDENTIALS.username) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, ADMIN_CREDENTIALS.passwordHash);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: ADMIN_CREDENTIALS.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
});

// Get all bookings
router.get('/bookings', verifyAdminToken, async (req, res) => {
  try {
    // Get both regular bookings and room bookings
    const [bookings, roomBookings] = await Promise.all([
      Booking.find().sort({ createdAt: -1 }),
      RoomBooking.find().sort({ createdAt: -1 })
    ]);

    // Combine and sort all bookings by creation date
    const allBookings = [...bookings, ...roomBookings].sort((a, b) => 
      b.createdAt - a.createdAt
    );

    res.json(allBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// Update booking status
router.put('/bookings/:id/status', verifyAdminToken, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(400).json({ message: 'Failed to update booking' });
  }
});

// Get booking statistics
router.get('/stats', verifyAdminToken, async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Format stats for frontend
    const formattedStats = {
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
      formattedStats.total += stat.count;
    });

    res.json(formattedStats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

module.exports = router;
