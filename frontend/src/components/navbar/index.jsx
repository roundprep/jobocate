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
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl 2xl:container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src={logo} 
                alt="Jobocate Logo" 
                width={180}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {/* <Link
              href="/jobs"
              className="relative text-gray-700 font-medium transition hover:text-blue-600 after:block after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-teal-400 hover:after:w-full after:transition-all after:duration-300"
            >
              Jobs
            </Link> */}
            {/* <Link
              href="/contact"
              className="relative text-gray-700 font-medium transition hover:text-blue-600 after:block after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-teal-400 hover:after:w-full after:transition-all after:duration-300"
            >
              Contact Us
            </Link> */}
            {/* <Link
              href="/blogs"
              className="relative text-gray-700 font-medium transition hover:text-blue-600 after:block after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-teal-400 hover:after:w-full after:transition-all after:duration-300"
            >
              Blogs
            </Link> */}
            {user ? (
              <button
                onClick={handleDashboardClick}
                className="ml-4 px-6 py-2.5 rounded-lg bg-black text-white font-semibold shadow hover:scale-105 transition whitespace-nowrap hover:bg-gray-800"
              >
                Dashboard
              </button>
            ) : (
              <Link
                href="/promo"
                className="ml-4 px-6 py-2.5 rounded-lg bg-black text-white font-semibold shadow hover:scale-105 transition whitespace-nowrap hover:bg-gray-800"
              >
                Login
              </Link>
            )}
          </div>
          
          {/* Hamburger for mobile */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
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
            {/* <Link href="/jobs" className="text-gray-700 font-medium hover:text-blue-600 transition" onClick={() => setMobileOpen(false)}>Jobs</Link> */}
            {/* <Link href="/contact" className="text-gray-700 font-medium hover:text-blue-600 transition" onClick={() => setMobileOpen(false)}>Contact Us</Link> */}
            {/* <Link href="/blogs" className="text-gray-700 font-medium hover:text-blue-600 transition" onClick={() => setMobileOpen(false)}>Blogs</Link> */}
            {user ? (
              <>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    handleDashboardClick(e);
                    setMobileOpen(false);
                  }}
                  className="w-full px-4 py-3 text-center rounded-lg bg-black text-white font-semibold shadow hover:scale-105 transition hover:bg-gray-800"
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
                href="/promo" 
                className="px-4 py-2 rounded-full bg-black text-white font-semibold shadow hover:scale-105 transition text-center" 
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}


