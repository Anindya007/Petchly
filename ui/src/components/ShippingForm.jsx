import { useState } from "react";

const ShippingForm = ({ onNext, inputRef }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US"
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-6 text-checkout-text">Shipping Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              ref={inputRef}
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-checkout-accent ${
                errors.firstName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
            />
            {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-checkout-accent ${
                errors.lastName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
            />
            {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-checkout-accent ${
                errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number (optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-checkout-accent"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-checkout-accent ${
              errors.address ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2 col-span-2 md:col-span-1">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-checkout-accent ${
                errors.city ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
            />
            {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-checkout-accent ${
                errors.state ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
            />
            {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
              ZIP Code
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-checkout-accent ${
                errors.zipCode ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
            />
            {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
          </div>
          
          <div className="space-y-2 col-span-2 md:col-span-1">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-checkout-accent"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            className="px-4 py-2 border bg-blue-500 text-white rounded-md shadow-sm text-sm font-medium bg-checkout-accent hover:bg-checkout-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-checkout-accent"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;