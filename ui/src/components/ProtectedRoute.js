import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin token exists in localStorage
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
    
    // In a real application, you would validate the token with the server
    // For now, we'll just check if it exists and implement a basic expiration check
    try {
      // Simple check to see if token is valid JSON
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      
      // Check if token is expired
      if (tokenData.exp && tokenData.exp * 1000 < Date.now()) {
        // Token expired
        localStorage.removeItem('adminToken');
        toast.error('Your session has expired. Please login again.');
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Invalid token format:', error);
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;