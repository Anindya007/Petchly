import React, { useState } from 'react';
import Modal from './Modal';
import { toast } from 'react-toastify';

function BookingModal({ isOpen, onClose, service }) {
  const [formData, setFormData] = useState({
    petName: '',
    petType: '',
    ownerName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    notes: ''
  });

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 21; hour++) {
      for (let minute of ['00', '30']) {
        if (hour === 21 && minute === '30') continue;
        const formattedHour = hour.toString().padStart(2, '0');
        slots.push(`${formattedHour}:${minute}`);
      }
    }
    return slots;
  };

  const handleSubmit = async () => {
    
    
    try {
      const response = await fetch('http://localhost:5001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          serviceId: service.id,
          serviceName: service.name,
          price: service.price,
          status: 'pending'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Booking created successfully! Reference: ${data.booking.referenceNumber}`);
        onClose();
        setFormData({
          petName: '',
          petType: '',
          ownerName: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          notes: ''
        });

        return data.booking.referenceNumber;
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create booking. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 sm:p-8">
        <h3 className="text-2xl font-bold text-[#2A3342] mb-6">
          Book {service?.name}
        </h3>
        <form className="space-y-6">
          {/* Pet Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#2A3342]">Pet Information</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.petName}
                onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#2A3342] focus:border-[#2A3342]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.petType}
                onChange={(e) => setFormData({ ...formData, petType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#2A3342] focus:border-[#2A3342]"
                required
              >
                <option value="">Select pet type</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Owner Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#2A3342]">Owner Information</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#2A3342] focus:border-[#2A3342]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#2A3342] focus:border-[#2A3342]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#2A3342] focus:border-[#2A3342]"
                required
              />
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#2A3342]">Appointment Details</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#2A3342] focus:border-[#2A3342]"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#2A3342] focus:border-[#2A3342]"
                required
              >
                <option value="">Select a time</option>
                {generateTimeSlots().map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-500">
                Operating hours: 9:00 AM - 9:00 PM
              </p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#2A3342] focus:border-[#2A3342]"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2A3342]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                const referenceNumber = await handleSubmit();
                if (!referenceNumber){
                  return;
                }
                // Save booking details to localStorage
                                
            localStorage.setItem('booking', JSON.stringify({              
              serviceId: service.id,
              serviceName: service.name,
              price: service.price,
              referenceNumber: referenceNumber
            }));
                window.location.href = '/checkout';
              }}
              className="px-6 py-2 border border-transparent rounded-full text-white bg-[#2A3342] hover:bg-[#1F2937] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2A3342]"
            >
              Proceed to Checkout
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default BookingModal;