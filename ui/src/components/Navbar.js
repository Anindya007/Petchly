import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Pet Hotel', href: '/hotel' },
    { name: 'Virtual Vet', href: '/virtual-vet' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-[#2A3342]">Petchly</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation
              .map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'border-[#2A3342] text-[#2A3342]'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-[#2A3342]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            <Link
              to="/admin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-[#2A3342] hover:bg-[#1F2937] transition-colors duration-200"
            >
              Admin Panel
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#2A3342] hover:text-[#1F2937] focus:outline-none"
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile menu */}
      <div 
        className={`
          md:hidden bg-white transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] shadow-lg overflow-y-auto
          border-r border-gray-200
        `}
      >
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`
                block px-4 py-3 text-base font-medium
                border-l-4 transition-all duration-200 ease-in-out
                hover:bg-gray-50 hover:translate-x-1
                ${isActive(item.href)
                  ? 'border-[#2A3342] text-[#2A3342] bg-[#FDF8F4]'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-[#2A3342]'
                }
              `}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="p-4 mt-2 border-t border-gray-200">
            <Link
              to="/services"
              className="
                block text-center px-6 py-3
                text-base font-medium rounded-full
                text-white bg-[#2A3342]
                hover:bg-[#1F2937] hover:scale-[0.98]
                transform transition-all duration-200 ease-in-out
                shadow-md hover:shadow-lg
              "
              onClick={() => setIsOpen(false)}
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;