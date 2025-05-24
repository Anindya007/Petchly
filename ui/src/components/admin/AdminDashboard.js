import React, { useState, useEffect } from 'react';
import BookingList from './BookingList';
import BookingDetails from './BookingDetails';
import DashboardStats from './DashboardStats';
import ExportBookings from './ExportBookings';
import BookingCalendar from './BookingCalendar';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('list'); // 'list' or 'calendar'

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5001/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Authentication failed. Please login again.');
          localStorage.removeItem('adminToken');
          return;
        }
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5001/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Authentication failed. Please login again.');
          localStorage.removeItem('adminToken');
          return;
        }
        throw new Error('Failed to fetch statistics');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch statistics');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setView(view === 'list' ? 'calendar' : 'list')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {view === 'list' ? 'Calendar View' : 'List View'}
              </button>
              <ExportBookings bookings={bookings} />
              
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <DashboardStats stats={stats} />
        

        {view === 'list' ? (
          <>
            {/* Search and Filter */}
            <div className="mt-6 flex space-x-4">
              <input
                type="text"
                placeholder="Search bookings..."
                className="flex-1 rounded-md border border-gray-300 px-4 py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-md border border-gray-300 px-4 py-2"
              >
                <option value="all">All Bookings</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Booking Grid */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <BookingList 
                  bookings={bookings.filter(booking => 
                    (filter === 'all' || booking.status === filter) &&
                    (searchTerm === '' || 
                      booking.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      booking.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      booking.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                  )}
                  onSelectBooking={setSelectedBooking}
                  loading={loading}
                />
              </div>
              <div className="lg:col-span-2">
                {selectedBooking ? (
                  <BookingDetails 
                    booking={selectedBooking}
                    onStatusUpdate={async (newStatus) => {
                      try {
                        const token = localStorage.getItem('adminToken');
                        const response = await fetch(`http://localhost:5001/api/admin/bookings/${selectedBooking._id}/status`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({ status: newStatus }),
                        });
                        if (response.ok) {
                          toast.success('Status updated successfully');
                          fetchBookings();
                          fetchStats();
                        }
                      } catch (error) {
                        toast.error('Failed to update status');
                      }
                    }}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                    Select a booking to view details
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="mt-6">
            <BookingCalendar 
              bookings={bookings}
              onSelectBooking={setSelectedBooking}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
