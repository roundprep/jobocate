'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import logo from '@/assets/advocate_logo.png';
import {
  HomeModernIcon,
  BriefcaseIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  Cog8ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  EnvelopeIcon,
  MicrophoneIcon,
  UserGroupIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

// Catalyst imports
import { SidebarLayout } from '@/components/catalyst/sidebar-layout';
import {
  Sidebar,
  SidebarHeader,
  SidebarBody,
  SidebarFooter,
  SidebarSection,
  SidebarItem,
  SidebarLabel,
  SidebarDivider,
} from '@/components/catalyst/sidebar';
import {
  Navbar,
  NavbarSection,
  NavbarItem,
  NavbarSpacer,
} from '@/components/catalyst/navbar';
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
} from '@/components/catalyst/dropdown';
import { Avatar, AvatarButton } from '@/components/catalyst/avatar';
import { Button } from '@/components/catalyst/button';
import { Badge } from '@/components/catalyst/badge';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save collapsed state to localStorage
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  // Determine dashboard home based on user role
  const dashboardHome = user?.role === 'ROLE_EMPLOYER' 
    ? '/employer/dashboard' 
    : '/candidate/dashboard';

  const handleSignOut = async () => {
    try {
      logout();
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  // Navigation based on user role
  const navigation = user?.role === 'ROLE_EMPLOYER' ? [
    { name: 'Dashboard', href: '/employer/dashboard', icon: HomeModernIcon, current: router.pathname === '/employer/dashboard' },
    { name: 'Jobs', href: '/employer/jobs', icon: BriefcaseIcon, current: router.pathname === '/employer/jobs' },
    { name: 'Applications', href: '/employer/applications', icon: ClipboardDocumentListIcon, current: router.pathname === '/employer/applications' },
  ] : [
    { name: 'Dashboard', href: '/candidate/dashboard', icon: HomeModernIcon, current: router.pathname === '/candidate/dashboard' },
    { name: 'My Applications', href: '/candidate/applications', icon: ClipboardDocumentListIcon, current: router.pathname === '/candidate/applications' },
    { name: 'Matched Jobs', href: '/jobs', icon: BriefcaseIcon, current: router.pathname === '/jobs' },
    { name: 'AI Resume Builder', href: '/candidate/resume-builder', icon: SparklesIcon, current: router.pathname === '/candidate/resume-builder', isPro: true },
    { name: 'AI Cover Letter', href: '/candidate/cover-letter', icon: EnvelopeIcon, current: router.pathname === '/candidate/cover-letter', isPro: true },
    { name: 'Interview Buddy', href: '/candidate/interview-buddy', icon: MicrophoneIcon, current: router.pathname === '/candidate/interview-buddy', isPro: true },
    { name: 'Job Profiles', href: '/candidate/job-profiles', icon: UserGroupIcon, current: router.pathname === '/candidate/job-profiles' },
  ];

  // Get user initials
  const getUserInitials = () => {
    if (user?.name) {
      const names = user.name.split(' ').filter(n => n.length > 0);
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      if (names.length === 1 && names[0].length >= 2) {
        return names[0].substring(0, 2).toUpperCase();
      }
      if (names.length === 1 && names[0].length === 1) {
        return `${names[0][0]}${names[0][0]}`.toUpperCase();
      }
    }
    return 'U';
  };

  return (
    <>
      <SidebarLayout
        navbar={
          <Navbar>
            <NavbarSpacer />
          </Navbar>
        }
        sidebar={
          <Sidebar className={isCollapsed ? 'w-16' : 'w-64'}>
            <SidebarHeader className={isCollapsed ? 'p-2' : ''}>
              <div className={`flex items-center ${isCollapsed ? 'justify-center relative' : 'justify-between'}`}>
                {isCollapsed ? (
                  <>
                    <div className="flex items-center justify-center w-full">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-600 text-white font-bold text-lg">
                        JO
                      </div>
                    </div>
                    <button
                      onClick={toggleSidebar}
                      className="absolute top-2 right-2 p-1 rounded-lg hover:bg-zinc-200 transition-colors"
                      aria-label="Expand sidebar"
                    >
                      <ChevronRightIcon className="h-4 w-4 text-zinc-700" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="relative w-32 h-10">
                      <Image 
                        src={logo} 
                        alt="Jobocate Logo" 
                        fill
                        className="object-contain object-left"
                        priority
                      />
                    </div>
                    <button
                      onClick={toggleSidebar}
                      className="p-1.5 rounded-lg hover:bg-zinc-200 transition-colors"
                      aria-label="Collapse sidebar"
                    >
                      <ChevronLeftIcon className="h-5 w-5 text-zinc-700" />
                    </button>
                  </>
                )}
              </div>
            </SidebarHeader>
            <SidebarBody className={isCollapsed ? 'p-2' : ''}>
              <SidebarSection>
                {navigation.map((item) => (
                  <SidebarItem 
                    key={item.name} 
                    href={item.href} 
                    current={item.current}
                    title={isCollapsed ? item.name : undefined}
                    className={isCollapsed ? 'justify-center' : ''}
                  >
                    <item.icon data-slot="icon" />
                    {!isCollapsed && (
                      <SidebarLabel className="flex items-center gap-2">
                        <span>{item.name}</span>
                        {item.isPro && (
                          <Badge color="amber" className="text-xs">Pro</Badge>
                        )}
                      </SidebarLabel>
                    )}
                  </SidebarItem>
                ))}
              </SidebarSection>
            </SidebarBody>
            <SidebarFooter className={isCollapsed ? 'p-2' : ''}>
              <SidebarSection>
                <SidebarItem 
                  title={isCollapsed ? 'Notifications' : undefined}
                  className={isCollapsed ? 'justify-center' : ''}
                >
                  <BellIcon data-slot="icon" />
                  {!isCollapsed && <SidebarLabel>Notifications</SidebarLabel>}
                </SidebarItem>
                <SidebarDivider />
                <Dropdown>
                  <DropdownButton 
                    as={SidebarItem}
                    className={isCollapsed ? 'justify-center' : ''}
                    title={isCollapsed ? user?.name || 'User' : undefined}
                  >
                    <Avatar 
                      src={user?.picture || null} 
                      initials={getUserInitials()} 
                      alt={user?.name || 'User'} 
                      className="size-6"
                      data-slot="avatar"
                    />
                    {!isCollapsed && <SidebarLabel>{user?.name || 'User'}</SidebarLabel>}
                  </DropdownButton>
                  <DropdownMenu anchor="top end" className="z-[100]">
                    <DropdownItem href={user?.role === 'ROLE_EMPLOYER' ? '/employer/profile' : '/candidate/profile'}>
                      <UserCircleIcon data-slot="icon" />
                      <span>Profile</span>
                    </DropdownItem>
                    <DropdownItem href={user?.role === 'ROLE_EMPLOYER' ? '/employer/settings' : '/candidate/settings'}>
                      <Cog8ToothIcon data-slot="icon" />
                      <span>Settings</span>
                    </DropdownItem>
                    <DropdownItem href={user?.role === 'ROLE_EMPLOYER' ? '/employer/subscription' : '/candidate/subscription'}>
                      <CreditCardIcon data-slot="icon" />
                      <span>Manage Subscription</span>
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem onClick={handleSignOut}>
                      <ArrowRightOnRectangleIcon data-slot="icon" />
                      <span>Sign out</span>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </SidebarSection>
            </SidebarFooter>
          </Sidebar>
        }
        isCollapsed={isCollapsed}
      >
        {children}
      </SidebarLayout>
    </>
  );
}
