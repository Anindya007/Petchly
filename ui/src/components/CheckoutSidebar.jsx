import { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";

// Add this at the top of the file, after the imports
const roomImages = {
    cozyden: "https://images.pexels.com/photos/4587996/pexels-photo-4587996.jpeg",
    deluxesuite: "https://images.pexels.com/photos/4587985/pexels-photo-4587985.jpeg",
    royalpalace: "https://images.pexels.com/photos/4587990/pexels-photo-4587990.jpeg"
  };

const serviceImages = {
  'Basic Grooming': 'https://images.pexels.com/photos/6816860/pexels-photo-6816860.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Full Grooming': 'https://images.pexels.com/photos/5731866/pexels-photo-5731866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Spa Package': 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
};
const CheckoutSidebar = ({ onCompletePayment }) => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const tax = subtotal * 0.08;
  
  useEffect(() => {
    // Fetch booking data from localStorage
    const bookingData = localStorage.getItem('booking');
    
    if (bookingData) {
      try {
        const parsedBooking = JSON.parse(bookingData);
        console.log('Parsed Booking:', parsedBooking);

        // Calculate total amount for room bookings
        const totalAmount = parsedBooking.roomId ? calculateTotal(parsedBooking) : parseFloat(parsedBooking.price) || 0;

        // Create cart item from booking data
        const bookingItem = {
          id: parsedBooking.roomId || parsedBooking.serviceId,
          name: parsedBooking.roomName || parsedBooking.serviceName,
          price: totalAmount,
          image: parsedBooking.roomId 
            ? roomImages[parsedBooking.roomName?.toLowerCase().replace(/\s+/g, '')] || roomImages.cozyden
            : serviceImages[parsedBooking.serviceName],
          roomId: parsedBooking.roomId, // Add this line to include roomId in the cart item
        };
        
        setCartItems([bookingItem]);
      } catch (error) {
        console.error('Error parsing booking data:', error);
        setCartItems([]);
      }
    }
  }, []);

  const calculateTotal = (parsedBooking) => {
    let totalAmount = 0;
    if (parsedBooking.startDate && parsedBooking.endDate) {
      const startDate = new Date(parsedBooking.startDate);
      const endDate = new Date(parsedBooking.endDate);
      
      if (endDate < startDate) {
        console.error('End date cannot be before start date');
        return 0;
      }
      
      if (parsedBooking.bookingType === 'nightly') {
        // Calculate total nights
        const diffTime = Math.abs(endDate - startDate);
        const totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        totalAmount = parseFloat(parsedBooking.price) * totalNights;
      } else if (parsedBooking.bookingType === 'hourly') {
        // Calculate total hours
        const diffTime = Math.abs(endDate - startDate);
        const totalHours = Math.ceil(diffTime / (1000 * 60 * 60));
        totalAmount = parseFloat(parsedBooking.price) * totalHours;
      }
    }
    return totalAmount; // Return the total amount calculated above ;
  }
  
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.price), 0);
    setSubtotal(total);
  }, [cartItems]);

  const handleCompletePayment = () => {
    if (onCompletePayment) {
      onCompletePayment();
    }
  };

  return (
    <div className="w-full md:w-[400px] bg-white border-l border-checkout-border p-6 md:p-8 animate-fade-in">
      <h2 className="text-lg font-medium mb-4 flex items-center">
        <FaShoppingCart className="mr-2 h-5 w-5" />
        Order Summary
      </h2>
      
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex space-x-3">
            <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-checkout-text">{item.name}</p>
              <div className="flex flex-col mt-1">
                {item.roomId ? (
                  <>
                    <p className="text-xs text-gray-500">
                      ${(item.price / Math.ceil(Math.abs(new Date(JSON.parse(localStorage.getItem('booking')).endDate) - new Date(JSON.parse(localStorage.getItem('booking')).startDate)) / (1000 * 60 * 60 * 24))).toFixed(2)} per night
                    </p>
                    <p className="text-xs text-gray-500">
                      {Math.ceil(Math.abs(new Date(JSON.parse(localStorage.getItem('booking')).endDate) - new Date(JSON.parse(localStorage.getItem('booking')).startDate)) / (1000 * 60 * 60 * 24))} nights
                    </p>
                  </>
                ) : null}
                <p className="text-sm font-medium">Total: ${item.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="h-[1px] w-full bg-gray-200 my-6"></div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Subtotal</span>
          <span className="text-sm font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Tax</span>
          <span className="text-sm font-medium">${tax.toFixed(2)}</span>
        </div>
        
        <div className="h-[1px] w-full bg-gray-200 my-4"></div>
        
        <div className="flex justify-between">
          <span className="text-base font-medium">Total</span>
          <span className="text-base font-bold">${(subtotal + tax).toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mt-8">
        <button 
          onClick={handleCompletePayment}
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Complete Payment
        </button>
        <p className="text-xs text-gray-500 text-center mt-4">
          By completing this purchase, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default CheckoutSidebar;