import { useState } from "react";
import { BsCreditCard2Front, BsReceipt } from "react-icons/bs";

const PaymentForm = ({ onBack, onNext }) => {
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format credit card number with spaces
    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "") // Remove existing spaces
        .replace(/(\d{4})/g, "$1 ") // Add space after every 4 digits
        .trim(); // Remove trailing space
      
      setFormData({ ...formData, [name]: formatted });
    } 
    // Format expiry date with slash
    else if (name === "expiry") {
      const cleaned = value.replace(/[^\d]/g, "");
      let formatted = cleaned;
      
      if (cleaned.length > 2) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
      }
      
      setFormData({ ...formData, [name]: formatted });
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleRadioChange = (value) => {
    setPaymentMethod(value);
  };

  const validate = () => {
    const newErrors= {};
    
    if (paymentMethod === "credit_card") {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = "Card number is required";
      } else if (formData.cardNumber.replace(/\s/g, "").length !== 16) {
        newErrors.cardNumber = "Card number should be 16 digits";
      }
      
      if (!formData.cardName.trim()) newErrors.cardName = "Name on card is required";
      
      if (!formData.expiry.trim()) {
        newErrors.expiry = "Expiry date is required";
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
        newErrors.expiry = "Invalid format (MM/YY)";
      }
      
      if (!formData.cvv.trim()) {
        newErrors.cvv = "CVV is required";
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = "CVV should be 3-4 digits";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext({ ...formData, paymentMethod });
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-6 text-checkout-text">Payment Method</h2>
      
      <div className="mb-6">
        <div className="flex flex-col space-y-3">
          <label 
            className={`flex items-center border rounded-lg p-4 cursor-pointer transition-colors ${
              paymentMethod === "credit_card" 
                ? "border-checkout-accent bg-checkout-accent/5" 
                : "border-gray-200"
            }`}
          >
            <input 
              type="radio" 
              name="paymentMethod" 
              id="credit_card" 
              value="credit_card"
              checked={paymentMethod === "credit_card"}
              onChange={() => handleRadioChange("credit_card")}
              className="mr-3 h-4 w-4 text-checkout-accent focus:ring-checkout-accent"
            />
            <BsCreditCard2Front className="h-5 w-5 mr-2 text-checkout-accent" />
            <span>Credit Card</span>
          </label>
          
          <label 
            className={`flex items-center border rounded-lg p-4 cursor-pointer transition-colors ${
              paymentMethod === "invoice" 
                ? "border-checkout-accent bg-checkout-accent/5" 
                : "border-gray-200"
            }`}
          >
            <input 
              type="radio" 
              name="paymentMethod" 
              id="invoice" 
              value="invoice"
              checked={paymentMethod === "invoice"}
              onChange={() => handleRadioChange("invoice")}
              className="mr-3 h-4 w-4 text-checkout-accent focus:ring-checkout-accent"
            />
            <BsReceipt className="h-5 w-5 mr-2 text-checkout-accent" />
            <span>Pay by Invoice</span>
          </label>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {paymentMethod === "credit_card" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                maxLength={19}
                placeholder="1234 5678 9012 3456"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-checkout-accent ${
                  errors.cardNumber ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
                }`}
              />
              {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">Name on Card</label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-checkout-accent ${
                  errors.cardName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
                }`}
              />
              {errors.cardName && <p className="text-sm text-red-500">{errors.cardName}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">Expiration Date</label>
                <input
                  type="text"
                  id="expiry"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-checkout-accent ${
                    errors.expiry ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
                  }`}
                />
                {errors.expiry && <p className="text-sm text-red-500">{errors.expiry}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                <input
                  type="password"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength={4}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-checkout-accent ${
                    errors.cvv ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
                  }`}
                />
                {errors.cvv && <p className="text-sm text-red-500">{errors.cvv}</p>}
              </div>
            </div>
          </div>
        )}
        
        {paymentMethod === "invoice" && (
          <div className="p-4 bg-blue-50 rounded-md text-sm text-blue-800">
            Your order will be processed and an invoice will be sent to your email address. Payment is due within 30 days.
          </div>
        )}
        
        <div className="flex justify-between pt-4">
          <button 
            type="button" 
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-checkout-accent"
          >
            Back to Shipping
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 border bg-blue-700 rounded-md shadow-sm text-sm font-medium text-white bg-checkout-accent hover:bg-checkout-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-checkout-accent"
          >
            Complete Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm