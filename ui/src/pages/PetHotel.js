import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPaw, FaHotel, FaWifi, FaUtensils, FaVideo, FaHeart, FaBone, FaBath, FaTemperatureLow, FaTimes } from 'react-icons/fa';

// Add this at the top of the file, after the imports
const roomImages = {
  cozyDen: "https://images.pexels.com/photos/4587996/pexels-photo-4587996.jpeg",
  deluxeSuite: "https://images.pexels.com/photos/4587985/pexels-photo-4587985.jpeg",
  royalPalace: "https://images.pexels.com/photos/4587990/pexels-photo-4587990.jpeg"
};

function PetHotel() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingType, setBookingType] = useState('nightly');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hotelFeatures = [
    {
      icon: <FaHotel className="w-6 h-6" />,
      title: "Luxury Suites",
      description: "Spacious, climate-controlled rooms for maximum comfort"
    },
    {
      icon: <FaUtensils className="w-6 h-6" />,
      title: "Gourmet Meals",
      description: "Premium pet food and treats served daily"
    },
    {
      icon: <FaPaw className="w-6 h-6" />,
      title: "Playtime",
      description: "Supervised play sessions in our dedicated play areas"
    },
    {
      icon: <FaVideo className="w-6 h-6" />,
      title: "24/7 Monitoring",
      description: "Round-the-clock care and video surveillance"
    },
    {
      icon: <FaWifi className="w-6 h-6" />,
      title: "Pet Webcam",
      description: "Check on your pet anytime through our webcam service"
    },
    {
      icon: <FaHeart className="w-6 h-6" />,
      title: "Special Care",
      description: "Personalized attention and medical care if needed"
    }
  ];

  
  
  // Then modify the roomTypes array to use these images
  const roomTypes = [
      {
        id: 1,
        name: "Cozy Den",
        nightPrice: "49",
        hourlyPrice: "8",
        image: roomImages.cozyDen,
        features: [
          "Comfortable pet bed",
          "Climate controlled",
          "Basic toys",
          "2 meals/day",
          "Daily cleaning"
        ],
        petSize: "Small pets (up to 20 lbs)",
        description: "A snug, comfortable space perfect for small pets who enjoy cozy environments"
      },
      {
        id: 2,
        name: "Deluxe Suite",
        nightPrice: "79",
        hourlyPrice: "12",
        image: roomImages.deluxeSuite,
        features: [
          "Spacious play area",
          "Premium pet bed",
          "Toy selection",
          "3 meals/day",
          "Window view",
          "Daily grooming"
        ],
        petSize: "Medium pets (20-50 lbs)",
        description: "A roomy suite with dedicated play space and premium amenities"
      },
      {
        id: 3,
        name: "Royal Palace",
        nightPrice: "129",
        hourlyPrice: "20",
        image: roomImages.royalPalace,
        features: [
          "Extra large suite",
          "Luxury orthopedic bed",
          "Premium toys",
          "4 meals/day",
          "24/7 Webcam",
          "Private play area",
          "Spa services"
        ],
        petSize: "Large pets (50+ lbs)",
        description: "The ultimate in pet luxury with maximum space and premium services"
      }
  ];

  const openBookingModal = (room = null) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeBookingModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  // Booking Form Component
  const BookingForm = () => {
    const [formData, setFormData] = useState({
      petName: '',
      petType: 'dog',
      startDate: '',
      endDate: '',
      specialRequests: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Create booking data object with all required information
      const bookingData = {
        ...formData,
        bookingType,
        roomId: selectedRoom?.id || '',
        roomName: selectedRoom?.name || '',
        price: bookingType === 'nightly' ? selectedRoom?.nightPrice : selectedRoom?.hourlyPrice,
        priceUnit: bookingType === 'nightly' ? 'night' : 'hour'
      };
      
      // Store booking data in localStorage to access it on checkout page
      localStorage.setItem('petHotelBooking', JSON.stringify(bookingData));
      
      // Navigate to checkout
      window.location.href = '/checkout';
    };

    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#2A3342]">Book a Stay</h2>
          <button
            onClick={closeBookingModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Booking Type</label>
              <select 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A3342] focus:ring-[#2A3342]"
                value={bookingType}
                onChange={(e) => setBookingType(e.target.value)}
              >
                <option value="nightly">Nightly Stay</option>
                <option value="hourly">Hourly Care</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Room Type</label>
              <input 
                type="text" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A3342] focus:ring-[#2A3342]"
                value={selectedRoom?.name || 'Select a room'}
                readOnly
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Pet Name</label>
              <input 
                type="text" 
                name="petName"
                value={formData.petName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A3342] focus:ring-[#2A3342]"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Pet Type</label>
              <select 
                name="petType"
                value={formData.petType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A3342] focus:ring-[#2A3342]"
              >
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {bookingType === 'nightly' ? 'Check-in Date' : 'Start Date & Time'}
              </label>
              <input 
                type={bookingType === 'nightly' ? 'date' : 'datetime-local'} 
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A3342] focus:ring-[#2A3342]"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {bookingType === 'nightly' ? 'Check-out Date' : 'End Date & Time'}
              </label>
              <input 
                type={bookingType === 'nightly' ? 'date' : 'datetime-local'} 
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A3342] focus:ring-[#2A3342]"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Special Requests</label>
            <textarea 
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows="3" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A3342] focus:ring-[#2A3342]"
            ></textarea>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Price:</span>
              <span className="text-xl font-bold text-[#2A3342]">
                ${bookingType === 'nightly' ? selectedRoom?.nightPrice : selectedRoom?.hourlyPrice}
                <span className="text-sm text-gray-600">/{bookingType === 'nightly' ? 'night' : 'hour'}</span>
              </span>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#2A3342] text-white py-3 rounded-full hover:bg-[#1F2937] transition-colors duration-300"
          >
            Book Now
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <div className="relative h-[600px]">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.pexels.com/photos/6131165/pexels-photo-6131165.jpeg"
            alt="Pet Hotel"
          />
          <div className="absolute inset-0 bg-[#2A3342]/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex flex-col justify-center items-center h-full text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Luxury Pet Hotel
            </h1>
            <p className="mt-6 text-xl text-white max-w-3xl">
              A 5-star resort experience for your furry family members
            </p>
            <div className="mt-10">
              <button
                onClick={() => openBookingModal()}
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#2A3342] hover:bg-[#1F2937] transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-[#FDF8F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#2A3342]">Premium Pet Care Features</h2>
            <p className="mt-4 text-xl text-gray-600">Everything your pet needs for a comfortable stay</p>
          </div>
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {hotelFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-center text-[#2A3342] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#2A3342] mb-2 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room Types Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#2A3342]">Luxury Accommodations</h2>
            <p className="mt-4 text-xl text-gray-600">Choose the perfect room for your pet</p>
          </div>
          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
            {roomTypes.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 flex flex-col h-full"
              >
                <div className="relative h-64">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-2xl font-bold text-[#2A3342] mb-2">{room.name}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-2xl font-bold text-[#2A3342]">
                        ${room.nightPrice}<span className="text-sm text-gray-600">/night</span>
                      </p>
                      <p className="text-lg text-[#2A3342]">
                        ${room.hourlyPrice}<span className="text-sm text-gray-600">/hour</span>
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{room.description}</p>
                  <p className="text-[#2A3342] font-medium mb-4">{room.petSize}</p>
                  <ul className="space-y-2 mb-6 flex-grow">
                    {room.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <FaPaw className="w-4 h-4 mr-2 text-[#2A3342]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => openBookingModal(room)}
                    className="w-full bg-[#2A3342] text-white py-3 rounded-full hover:bg-[#1F2937] transition-colors duration-300"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="animate-modal-appear">
            <BookingForm />
          </div>
        </div>
      )}
    </div>
  );
}

// Add these styles to your CSS
const styles = `
@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-modal-appear {
  animation: modalAppear 0.3s ease-out forwards;
}
`;

export default PetHotel;