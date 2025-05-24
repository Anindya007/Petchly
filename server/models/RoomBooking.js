const mongoose = require('mongoose');

// Function to generate unique reference number
function generateReference() {
  return 'RB' + Date.now().toString().slice(-6) + Math.random().toString(36).slice(-4).toUpperCase();
}

const roomBookingSchema = new mongoose.Schema({
  referenceNumber: {
    type: String,
    unique: true,
    default: generateReference
  },
  petName: {
    type: String,
    required: [true, 'Pet name is required'],
    trim: true,
    minlength: [2, 'Pet name must be at least 2 characters'],
    maxlength: [50, 'Pet name cannot exceed 50 characters']
  },
  petType: {
    type: String,
    required: [true, 'Pet type is required'],
    enum: {
      values: ['dog', 'cat', 'other'],
      message: '{VALUE} is not a valid pet type'
    }
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(v) {
        return v >= new Date(new Date().setHours(0, 0, 0, 0));
      },
      message: 'Start date cannot be in the past'
    }
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(v) {
        return v >= this.startDate;
      },
      message: 'End date must be after or equal to start date'
    }
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  bookingType: {
    type: String,
    required: [true, 'Booking type is required'],
    enum: {
      values: ['nightly', 'hourly'],
      message: '{VALUE} is not a valid booking type'
    }
  },
  roomId: {
    type: Number,
    required: [true, 'Room ID is required']
  },
  roomName: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true
  },
  price: {
    type: String,
    required: [true, 'Price is required']
  },
  priceUnit: {
    type: String,
    required: [true, 'Price unit is required'],
    enum: {
      values: ['night', 'hour'],
      message: '{VALUE} is not a valid price unit'
    }
  },
  ownerName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    match: [/^\d{8}$/, 'Please enter a valid 8-digit phone number'],
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty phone
        return /^[89]\d{7}$/.test(v);
      },
      message: 'Phone number must be 8 digits and start with 8 or 9'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'completed', 'cancelled'],
      message: '{VALUE} is not a valid status'
    },
    default: 'pending'
  },
  totalNights: {
    type: Number,
    default: function() {
      if (this.startDate && this.endDate && this.bookingType === 'nightly') {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
      return 1;
    }
  },
  totalHours: {
    type: Number,
    default: function() {
      if (this.startDate && this.endDate && this.bookingType === 'hourly') {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60));
      }
      return 1;
    }
  },
  totalAmount: {
    type: Number,
    default: function() {
      if (this.bookingType === 'nightly') {
        return parseFloat(this.price) * this.totalNights;
      } else {
        return parseFloat(this.price) * this.totalHours;
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add a pre-save hook to validate the booking dates
roomBookingSchema.pre('save', function(next) {
  if (this.startDate && this.endDate) {
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);
    
    if (endDate < startDate) {
      next(new Error('End date cannot be before start date'));
    }
    
    if (this.bookingType === 'nightly') {
      // Calculate total nights
      const diffTime = Math.abs(endDate - startDate);
      this.totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.totalAmount = parseFloat(this.price) * this.totalNights;
    } else if (this.bookingType === 'hourly') {
      // Calculate total hours
      const diffTime = Math.abs(endDate - startDate);
      this.totalHours = Math.ceil(diffTime / (1000 * 60 * 60));
      this.totalAmount = parseFloat(this.price) * this.totalHours;
    }
  }
  next();
});

module.exports = mongoose.model('RoomBooking', roomBookingSchema);