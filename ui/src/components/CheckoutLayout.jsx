import { ReactNode } from "react";
import CheckoutSidebar from "./CheckoutSidebar";



const CheckoutLayout = ({ children, currentStep }) => {
  return (
    <div className="min-h-screen bg-checkout-bg flex flex-col md:flex-row">
      <div className="flex-1 p-4 md:p-8 lg:p-12 animate-fade-in">
        <div className="max-w-3xl mx-auto">
          {/* Logo */}
          <div className="flex items-center mb-8">
            
            <h1 className="text-2xl font-semibold ml-2 text-checkout-text">
              Checkout
            </h1>
          </div>
          {/* Breadcrumb navigation */}
          <div className="mb-8 hidden md:block">
            <nav className="flex space-x-4">
              {["Customer Details", "Payment", "Confirmation"].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div 
                    className={`flex items-center ${index < currentStep ? "text-checkout-accent" : "text-gray-400"}`}
                  >
                    <span 
                      className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs 
                      ${index < currentStep 
                        ? "bg-checkout-accent text-white" 
                        : index === currentStep
                          ? "bg-checkout-accent/20 text-checkout-accent border border-checkout-accent"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {index < currentStep ? "✓" : index + 1}
                    </span>
                    <span className="text-sm">
                      {step}
                    </span>
                  </div>
                  {index < 2 && (
                    <span className="mx-2 text-gray-300">—</span>
                  )}
                </div>
              ))}
            </nav>
          </div>
          
          {/* Main content */}
          <div className="bg-white rounded-lg shadow-sm border border-checkout-border p-6">
            {children}
          </div>
        </div>
      </div>
      
      {/* Order summary sidebar */}
      <CheckoutSidebar />
    </div>
  );
};

export default CheckoutLayout;