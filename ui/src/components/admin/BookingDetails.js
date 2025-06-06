import React from 'react';
import StatusUpdate from './StatusUpdate';

function BookingDetails({ booking, onStatusUpdate }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium text-gray-900">Booking Details</h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Reference Number</dt>
            <dd className="mt-1 text-sm text-gray-900">{booking.referenceNumber}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1">
              <StatusUpdate 
                currentStatus={booking.status} 
                onStatusUpdate={onStatusUpdate}
              />
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Pet Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{booking.petName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Pet Type</dt>
            <dd className="mt-1 text-sm text-gray-900">{booking.petType}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Service</dt>
            <dd className="mt-1 text-sm text-gray-900">{booking.serviceName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Price</dt>
            <dd className="mt-1 text-sm text-gray-900">{booking.price}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Date</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(booking.date).toLocaleDateString()}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Time</dt>
            <dd className="mt-1 text-sm text-gray-900">{booking.time}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Owner Details</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <p>{booking.ownerName}</p>
              <p>{booking.email}</p>
              <p>{booking.phone}</p>
            </dd>
          </div>
          {booking.notes && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Notes</dt>
              <dd className="mt-1 text-sm text-gray-900">{booking.notes}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}

export default BookingDetails;
