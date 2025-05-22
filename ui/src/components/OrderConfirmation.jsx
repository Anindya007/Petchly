import { FaCheck } from "react-icons/fa";

const OrderConfirmation = ({ orderId, shipping }) => {
  return (
    <div className="text-center py-8 animate-fade-in">
      <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <FaCheck className="h-6 w-6 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-semibold mb-2 text-checkout-text">Thank You for Your Order!</h2>
      <p className="text-gray-600 mb-6">
        We've received your order and are processing it now.
      </p>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-8 inline-block">
        <p className="text-sm text-gray-500">Order Reference</p>
        <p className="text-lg font-medium">{orderId}</p>
      </div>
      
      <div className="text-left mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="font-medium mb-3">Order Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h4>
            <p className="text-sm">
              {shipping.firstName} {shipping.lastName}<br />
              {shipping.address}<br />
              {shipping.city}, {shipping.state} {shipping.zipCode}<br />
              {shipping.country === "US" ? "United States" : shipping.country}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h4>
            <p className="text-sm">
              Email: {shipping.email}<br />
              {shipping.phone && `Phone: ${shipping.phone}`}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <button 
          onClick={() => window.location.href = "/"} 
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </button>

      </div>
      
      <p className="text-xs text-gray-500 mt-8">
        A confirmation email has been sent to {shipping.email}
      </p>
    </div>
  );
};

export default OrderConfirmation;