import { useState } from "react";
import CheckoutLayout from "../components/CheckoutLayout";
import ShippingForm from "../components/ShippingForm";
import PaymentForm from "../components/PaymentForm";
import OrderConfirmation from "../components/OrderConfirmation";

const Checkout = () => {
  const [step, setStep] = useState(0);
  const [shippingData, setShippingData] = useState({});
  const [paymentData, setPaymentData] = useState({});
  const [orderId, setOrderId] = useState("");

  const handleShippingSubmit = (data) => {
    setShippingData(data);
    setStep(1);
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = (data) => {
    console.log(data);
    setPaymentData(data);
    // Generate a random order ID for demo purposes
    const referenceNumber = data.bookingReference; // a sample reference number BK082204M557
    
    // Formats the reference number by adding hyphens between transitions of numbers and letters
    // Example: 'BK082204M557' becomes 'B-K-08220-4-M-557'
    const generatedOrderId = referenceNumber.split('').reduce((acc, char, i, arr) => {
      if (i === 0) return char;
      const isCurrentNumber = !isNaN(char);
      const isPrevNumber = !isNaN(arr[i-1]);
      return acc + (isCurrentNumber !== isPrevNumber ? '-' : '') + char;
    }, '');
    setOrderId(generatedOrderId);
    setStep(2);
    window.scrollTo(0, 0);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <ShippingForm onNext={handleShippingSubmit} />;
      case 1:
        return (
          <PaymentForm 
            onBack={() => setStep(0)}
            onNext={handlePaymentSubmit}
          />
        );
      case 2:
        return <OrderConfirmation orderId={orderId} shipping={shippingData} />;
      default:
        return <ShippingForm onNext={handleShippingSubmit} />;
    }
  };

  return <CheckoutLayout currentStep={step}>{renderStep()}</CheckoutLayout>;
};

export default Checkout