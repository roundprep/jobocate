import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

const AuthSuccess = () => {
  const router = useRouter();
  const { setAuthData } = useAuth();

  useEffect(() => {
    const processAuth = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const userString = urlParams.get('user');

      if (token && userString) {
        try {
          const user = JSON.parse(decodeURIComponent(userString));
          
          // Store token and user data
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          // Update auth context if available
          if (setAuthData) {
            setAuthData({ token, user });
          }
          
          // Redirect to dashboard
          router.push('/candidate/dashboard');
        } catch (error) {
          console.error('Error processing auth:', error);
          router.push('/login?error=auth_processing_failed');
        }
      } else {
        router.push('/login?error=missing_auth_data');
      }
    };

    processAuth();
  }, [router, setAuthData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600 mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing sign in...</h2>
        <p className="text-gray-600">Please wait while we set up your account</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
