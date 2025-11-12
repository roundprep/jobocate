import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  HomeIcon,
  BriefcaseIcon,
  UserIcon,
  DocumentTextIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);



  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      // Remove the access token from local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      
      // If you're using any auth context or state, you should update it here
      // For example: authContext.signOut();
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  const navigation = [
    { name: 'Dashboard', href: '/candidate/dashboard', icon: HomeIcon, current: router.pathname === '/candidate/dashboard' },
    { name: 'My Profile', href: '/candidate/profile', icon: UserIcon, current: router.pathname === '/candidate/profile' },
    { name: 'My Applications', href: '/candidate/applications', icon: DocumentTextIcon, current: router.pathname === '/candidate/applications' },
    { name: 'Find Jobs', href: '/jobs', icon: BriefcaseIcon, current: router.pathname === '/jobs' },
    { name: 'Settings', href: '/candidate/settings', icon: Cog6ToothIcon, current: router.pathname === '/candidate/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-200">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
          <div className="flex h-16 items-center justify-between px-6 bg-white shadow-sm">
            <Link href="/">
            <div className="text-white font-bold text-xl cursor-pointer">Jobocate</div>
            </Link>
            <button
              type="button"
              className="rounded-md text-white hover:text-gray-300"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <nav className="mt-5 px-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  item.current
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-dark-700 dark:hover:text-white'
                }`}
              >
                <item.icon
                  className={`mr-3 h-6 w-6 flex-shrink-0 ${
                    item.current ? 'text-primary-500' : 'text-text/60 group-hover:text-primary-500'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex h-16 flex-shrink-0 items-center px-6 bg-white border-b border-gray-100">
            <Link href="/">
            <h1 className="text-[#ff480e] text-3xl font-extrabold cursor-pointer tracking-tight">Jobocate</h1>
            </Link>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 bg-white px-2 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    item.current
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-text/80 hover:bg-background-secondary hover:text-text'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-6 w-6 flex-shrink-0 ${
                      item.current ? 'text-primary-500' : 'text-text/60 group-hover:text-primary-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow-sm transition-colors duration-200 border-b border-gray-100">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              {/* Search bar can be added here if needed */}
            </div>
            <div className="ml-4 flex items-center lg:ml-6 space-x-4">
             
              <button
                type="button"
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
              >
                <BellIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    id="user-menu-button"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      <UserIcon className="h-5 w-5" />
                    </div>
                  </button>
                </div>

                {/* Profile dropdown */}
                {isProfileOpen && (
                  <div 
                    ref={profileRef}
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" 
                    role="menu" 
                    aria-orientation="vertical" 
                    aria-labelledby="user-menu-button" 
                    tabIndex="-1"
                  >
                    <Link 
                      href="/candidate
                      /profile" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <UserCircleIcon className="mr-3 h-5 w-5 text-gray-500" />
                      Profile
                    </Link>
                    <Link 
                      href="/candidate/settings" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-500" />
                      Settings
                    </Link>
                    <button
                      type="button"
                      className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={handleSignOut}
                    >
                      <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-500" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
