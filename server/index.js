import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Make groq available to routes
app.locals.groq = groq;

// Connect to MongoDB with improved error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/petchly')
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📚 Database Name: ${mongoose.connection.name}`);
    console.log(`🔌 Host: ${mongoose.connection.host}`);
    console.log(`🚪 Port: ${mongoose.connection.port}`);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Routes
import bookingRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Start server
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle server errors
process.on('unhandledRejection', (err) => {
  console.log('❌ UNHANDLED REJECTION! Shutting down...');
  console.error('Error:', err);
  server.close(() => {
    process.exit(1);
  });
});
