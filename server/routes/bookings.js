const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Create booking
router.post('/', async (req, res) => {
  try {
    console.log('📝 Received booking data:', req.body);

    // Validate required fields
    const requiredFields = ['petName', 'petType', 'ownerName', 'email', 'phone', 'serviceId', 'serviceName', 'date', 'time'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log('❌ Missing fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Create booking
    const booking = new Booking(req.body);
    console.log('📋 Attempting to save booking:', booking);

    // Save booking
    const savedBooking = await booking.save();
    console.log('✅ Booking saved successfully:', savedBooking);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: savedBooking
    });

  } catch (error) {
    console.error('❌ Server Error:', error);
    
    if (error.name === 'ValidationError') {
      console.log('❌ Validation Error:', error.errors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the booking',
      error: error.message
    });
  }
});

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    console.log('📚 Retrieved bookings:', bookings.length);
    res.json(bookings);
  } catch (error) {
    console.error('❌ Error fetching bookings:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update booking status to confirmed
router.patch('/:id/confirm', async (req, res) => {
  console.log('🔄 Received request to confirm booking:', req.params.id);
  try {
    const bookingId = req.params.id;
    console.log('🔄 Attempting to confirm booking:', bookingId);

    // Find the booking and check if it exists
const booking = await Booking.findOne({ referenceNumber: bookingId });
    if (!booking) {
      console.log('❌ Booking not found:', bookingId);
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if the booking is already confirmed
    if (booking.status !== 'pending') {
      console.log('⚠️ Booking is not in pending status:', booking.status);
      return res.status(400).json({
        success: false,
        message: `Booking cannot be confirmed. Current status: ${booking.status}`
      });
    }

    // Update the booking status to confirmed
    booking.status = 'confirmed';
    const updatedBooking = await booking.save();
    console.log('✅ Booking confirmed successfully:', updatedBooking);

    res.json({
      success: true,
      message: 'Booking confirmed successfully',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('❌ Error confirming booking:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while confirming the booking',
      error: error.message
    });
  }
});

// AI Assistant route for pet care advice
router.post('/ai-assistant', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required'
      });
    }
    
    console.log('🤖 Received AI assistant prompt:', prompt);
    
    // Import groq from the main server file
    const { groq } = req.app.locals;
    
    if (!groq) {
      console.error('❌ Groq client not available');
      return res.status(500).json({
        success: false,
        message: 'AI service is currently unavailable'
      });
    }
    const refinement = `Please respond only to questions or topics related to professional pet grooming, 
    luxury pet hotels, and virtual veterinary services. For any other topic, 
    politely decline to answer and redirect the conversation to these specific pet services.Among pet grooming services, we offer a wide range of options,
    only basic grooming,full grooming and spa packages.If virtual veterinary services are mentioned by the user,
    then always mention about Mr. John Doe and his expertise. And try to keep the response as concise as possible.`;
    // Use the getGroqChatCompletion function
    const completion = await getGroqChatCompletion(groq, prompt + refinement);
    
    console.log('✅ AI response generated successfully');
    
    res.json({
      success: true,
      response: completion.choices[0].message.content
    });
    
  } catch (error) {
    console.error('❌ AI Assistant Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request',
      error: error.message
    });
  }
});

async function getGroqChatCompletion(groq,userInput) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: userInput, // Use user input here
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}

module.exports = router;
