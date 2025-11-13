import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

const AuthSuccess = () => {
  const router = useRouter();
  const { setAuthData } = useAuth();

  useEffect(() => {
    const processAuth = () => {
      console.log('🔵 [Auth Success] Page loaded');
      console.log('🔵 [Auth Success] Full URL:', window.location.href);
      console.log('🔵 [Auth Success] Search params:', window.location.search);
      
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const userString = urlParams.get('user');
      
      console.log('🔵 [Auth Success] Token received:', token ? `Yes (length: ${token.length})` : 'No');
      console.log('🔵 [Auth Success] Token preview:', token ? `${token.substring(0, 30)}...` : 'N/A');
      console.log('🔵 [Auth Success] User string received:', userString ? `Yes (length: ${userString.length})` : 'No');
      console.log('🔵 [Auth Success] User string preview:', userString ? `${userString.substring(0, 100)}...` : 'N/A');
      
      // Log all URL parameters
      console.log('🔵 [Auth Success] All URL params:');
      urlParams.forEach((value, key) => {
        console.log(`  - ${key}: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
      });
  
      if (token && userString) {
        try {
          console.log('🔵 [Auth Success] Parsing user data...');
          const user = JSON.parse(decodeURIComponent(userString));
          console.log('🔵 [Auth Success] Parsed user:', user);
          
          // Store token and user data
          console.log('🔵 [Auth Success] Storing token and user in localStorage...');
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          console.log('🔵 [Auth Success] Data stored successfully');
          
          // Update auth context if available
          if (setAuthData) {
            console.log('🔵 [Auth Success] Updating auth context...');
            setAuthData({ token, user });
            console.log('🔵 [Auth Success] Auth context updated');
          } else {
            console.warn('⚠️ [Auth Success] setAuthData function not available');
          }
          
          // Redirect to dashboard
          console.log('🔵 [Auth Success] Redirecting to dashboard...');
          router.push('/candidate/dashboard');
        } catch (error) {
          console.error('❌ [Auth Success] Error processing auth:', error);
          console.error('❌ [Auth Success] Error stack:', error.stack);
          router.push('/login?error=auth_processing_failed');
        }
      } else {
        console.error('❌ [Auth Success] Missing auth data');
        console.error('❌ [Auth Success] Token present:', !!token);
        console.error('❌ [Auth Success] User string present:', !!userString);
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
