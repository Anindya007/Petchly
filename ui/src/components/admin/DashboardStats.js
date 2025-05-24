import React from 'react';
import AdminLogout from './AdminLogout';

function DashboardStats({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {/* Total Bookings */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.total || 0}</dd>
        </div>
      </div>

      {/* Pending */}
      <div className="bg-yellow-50 overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-yellow-800 truncate">Pending</dt>
          <dd className="mt-1 text-3xl font-semibold text-yellow-900">{stats.pending || 0}</dd>
        </div>
      </div>

      {/* Confirmed */}
      <div className="bg-green-50 overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-green-800 truncate">Confirmed</dt>
          <dd className="mt-1 text-3xl font-semibold text-green-900">{stats.confirmed || 0}</dd>
        </div>
      </div>

      {/* Completed */}
      <div className="bg-blue-50 overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-blue-800 truncate">Completed</dt>
          <dd className="mt-1 text-3xl font-semibold text-blue-900">{stats.completed || 0}</dd>
        </div>
      </div>

      {/* Cancelled */}
      <div className="bg-red-50 overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-red-800 truncate">Cancelled</dt>
          <dd className="mt-1 text-3xl font-semibold text-red-900">{stats.cancelled || 0}</dd>
        </div>
      </div>
      <AdminLogout />
    </div>

    
  );
}

export default DashboardStats; 