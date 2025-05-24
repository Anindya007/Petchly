import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('adminToken');
    
    // Show success message
    toast.success('Logged out successfully');
    
    // Redirect to login page
    navigate('/admin/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded-full bg-[#2A3342] text-white rounded hover:bg-[#1F2937] transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      Logout
    </button>
  );
};

export default AdminLogout;