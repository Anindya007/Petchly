const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const RoomBooking = require('../models/roomBooking');

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
    // Get both normal bookings and room bookings
    const [bookings, roomBookings] = await Promise.all([
      Booking.find(),
      RoomBooking.find()
    ]);

    console.log('📚 Retrieved bookings:', bookings.length);
    console.log('📚 Retrieved room bookings:', roomBookings.length);

    // Combine both types of bookings
    const allBookings = {
      serviceBookings: bookings,
      roomBookings: roomBookings
    };

    res.json(allBookings);
  } catch (error) {
    console.error('❌ Error fetching bookings:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
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


// Create room booking
router.post('/room', async (req, res) => {
  try {
    console.log('📝 Received room booking data:', req.body);

    // Validate required fields for room booking (excluding 'ownerName', 'email', 'phone')
    const requiredFields = ['petName', 'petType', 'roomId', 'roomName', 'startDate', 'endDate', 'bookingType', 'price', 'priceUnit'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log('❌ Missing fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Create room booking
    const roomBooking = new RoomBooking(req.body);
    console.log('📋 Attempting to save room booking:', roomBooking);

    // Save room booking
    const savedRoomBooking = await roomBooking.save();
    console.log('✅ Room booking saved successfully:', savedRoomBooking);

    res.status(201).json({
      success: true,
      message: 'Room booking created successfully',
      booking: savedRoomBooking
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
      message: 'An error occurred while creating the room booking',
      error: error.message
    });
  }
});

// Get all room bookings
router.get('/room', async (req, res) => {
  try {
    const roomBookings = await RoomBooking.find();
    console.log('📚 Retrieved room bookings:', roomBookings.length);
    res.json(roomBookings);
  } catch (error) {
    console.error('❌ Error fetching room bookings:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update room booking status
router.patch('/room/:id/confirm', async (req, res) => {
  console.log('🔄 Received request to confirm room booking:', req.params.id);
  try {
    const bookingId = req.params.id;
    console.log('🔄 Attempting to confirm room booking:', bookingId);

    const roomBooking = await RoomBooking.findOne({ referenceNumber: bookingId });
    if (!roomBooking) {
      console.log('❌ Room booking not found:', bookingId);
      return res.status(404).json({
        success: false,
        message: 'Room booking not found'
      });
    }

    // Check if the booking is already confirmed
    if (roomBooking.status !== 'pending') {
      console.log('⚠️ Room booking is not in pending status:', roomBooking.status);
      return res.status(400).json({
        success: false,
        message: `Room booking cannot be confirmed. Current status: ${roomBooking.status}`
      });
    }

    // Update the booking status to confirmed
    roomBooking.status = 'confirmed';
    const updatedRoomBooking = await roomBooking.save();
    console.log('✅ Room booking confirmed successfully:', updatedRoomBooking);

    res.json({
      success: true,
      message: 'Room booking confirmed successfully',
      booking: updatedRoomBooking
    });

  } catch (error) {
    console.error('❌ Error confirming room booking:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while confirming the room booking',
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
};

module.exports = router;
