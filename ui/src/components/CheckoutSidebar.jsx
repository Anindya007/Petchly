import { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";

// Add this at the top of the file, after the imports
const roomImages = {
    cozyden: "https://images.pexels.com/photos/4587996/pexels-photo-4587996.jpeg",
    deluxesuite: "https://images.pexels.com/photos/4587985/pexels-photo-4587985.jpeg",
    royalpalace: "https://images.pexels.com/photos/4587990/pexels-photo-4587990.jpeg"
  };

const CheckoutSidebar = ({ onCompletePayment }) => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const tax = subtotal * 0.08;
  
  useEffect(() => {
    // Fetch booking data from localStorage
    const bookingData = localStorage.getItem('petHotelBooking');
    
    if (bookingData) {
      try {
        const parsedBooking = JSON.parse(bookingData);
        console.log('Parsed Booking:', parsedBooking.roomName.toLowerCase().replace(/\s+/g, ''));
        // Create cart item from booking data
        const bookingItem = {
          id: parsedBooking.roomId || 1,
          name: parsedBooking.roomName || 'Pet Hotel Room',
          price: parseFloat(parsedBooking.price) || 0,
          quantity: 1,
          image: roomImages[parsedBooking.roomName.toLowerCase().replace(/\s+/g, '')] || roomImages.cozyden
        };
        
        setCartItems([bookingItem]);
      } catch (error) {
        console.error('Error parsing booking data:', error);
        setCartItems([]);
      }
    }
  }, []);
  
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
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