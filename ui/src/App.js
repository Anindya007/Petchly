import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import BookingModal from './components/BookingModal';
import AdminDashboard from './components/admin/AdminDashboard';
import ChatBot from './components/ChatBot';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PetHotel from './pages/PetHotel';
import VideoConference from './pages/VideoConference';
//import IframeComponent from './pages/iframe'; // Import the IframeComponent

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleBooking = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotel" element={<PetHotel />} />
          <Route path="/book" element={
            <Services 
              onBookService={handleBooking}
              showBookingForm={true}
            />
          } />
          <Route 
            path="/services" 
            element={<Services onBookService={handleBooking} />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/virtual-vet" element={<VideoConference/>} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
        <ChatBot />

        {/* Modal at root level */}
        <BookingModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          service={selectedService}
        />
      </div>
    </Router>
  );
}

export default App;
