import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import logo from '@/assets/jobocate_logo.svg';

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleDashboardClick = (e) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    
    const dashboardPath = user.role === 'ROLE_EMPLOYER' 
      ? '/employer/dashboard' 
      : '/candidate/dashboard';
    
    router.push(dashboardPath);
  };
  
  const handleLogout = () => {
    logout();
    setMobileOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                JOBOCATE
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/about"
              className="text-gray-700 font-semibold hover:text-orange-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="/jobs"
              className="text-gray-700 font-semibold hover:text-orange-600 transition-colors"
            >
              Jobs
            </Link>
            <Link
              href="/pricing"
              className="text-gray-700 font-semibold hover:text-orange-600 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 font-semibold hover:text-orange-600 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Right Side - Auth Button */}
          <div className="hidden md:flex items-center">
            {user ? (
              <button
                onClick={handleDashboardClick}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold hover:shadow-lg transition-all"
              >
                Dashboard
              </button>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold hover:shadow-lg transition-all"
              >
                Log In / Sign Up
              </Link>
            )}
          </div>
          
          {/* Hamburger for mobile */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-700 hover:text-orange-600 focus:outline-none"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Open mobile menu"
            >
              <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 bg-white rounded-lg shadow-lg py-4 px-6 flex flex-col space-y-4 animate-slide-down">
            <Link href="/about" className="text-gray-700 font-medium hover:text-orange-600 transition-colors" onClick={() => setMobileOpen(false)}>About</Link>
            <Link href="/jobs" className="text-gray-700 font-medium hover:text-orange-600 transition-colors" onClick={() => setMobileOpen(false)}>Jobs</Link>
            <Link href="/pricing" className="text-gray-700 font-medium hover:text-orange-600 transition-colors" onClick={() => setMobileOpen(false)}>Pricing</Link>
            <Link href="/contact" className="text-gray-700 font-medium hover:text-orange-600 transition-colors" onClick={() => setMobileOpen(false)}>Contact</Link>
            {user ? (
              <>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    handleDashboardClick(e);
                    setMobileOpen(false);
                  }}
                  className="w-full px-4 py-3 text-center rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition-colors"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="w-full px-4 py-2 text-center rounded-lg text-red-600 font-semibold hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="px-4 py-2.5 rounded-lg bg-gray-100 text-gray-800 font-medium text-center hover:bg-gray-200 transition-colors" 
                onClick={() => setMobileOpen(false)}
              >
                Log In / Sign Up
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}


