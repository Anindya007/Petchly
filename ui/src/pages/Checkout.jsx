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
    setPaymentData(data);
    // Generate a random order ID for demo purposes
    const generatedOrderId = `ORD-${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`;
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