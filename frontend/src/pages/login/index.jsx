import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import logo from '@/assets/advocate_logo.png';
import { Input, InputGroup } from '@/components/catalyst/input';
import { Button } from '@/components/catalyst/button';
import { Field, FieldGroup, Label } from '@/components/catalyst/fieldset';
import { Link } from '@/components/catalyst/link';
import { Checkbox, CheckboxField } from '@/components/catalyst/checkbox';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, user } = useAuth();

  // Check for error in URL query params
  useEffect(() => {
    const { error: errorParam } = router.query;
    if (errorParam) {
      const errorMessages = {
        missing_auth_data: 'Authentication failed. Please try logging in again.',
        auth_processing_failed: 'There was an error processing your authentication. Please try again.',
        google_auth_failed: 'Google authentication failed. Please try again.',
        no_user_data: 'Unable to retrieve user data. Please try again.',
      };
      setError(errorMessages[errorParam] || 'An error occurred during authentication. Please try again.');
      
      // Clear the error from URL
      router.replace('/login', undefined, { shallow: true });
    }
  }, [router.query]);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      const redirectPath = user.role === 'ROLE_EMPLOYER' 
        ? '/employer/dashboard' 
        : '/candidate/dashboard';
      router.push(redirectPath);
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Redirect based on user role
      const userRole = JSON.parse(localStorage.getItem('user') || '{}')?.role;
      const redirectPath = userRole === 'ROLE_EMPLOYER' 
        ? '/employer/dashboard' 
        : '/candidate/dashboard';
      router.push(redirectPath);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const { API_URL } = require('@/config/api');
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const handleLinkedInLogin = () => {
    const { API_URL } = require('@/config/api');
    window.location.href = `${API_URL}/api/auth/linkedin`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Log In - Jobocate</title>
        <meta name="description" content="Log in to your Jobocate account" />
      </Head>

      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-4">
            <div className="relative w-40 h-12 mx-auto">
              <Image 
                src={logo} 
                alt="Advocate Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600">Log in to continue your job search</p>
        </div>

        {/* Main Card */}
        <div className="w-full">
            
            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                onClick={handleGoogleLogin}
                outline
                className="w-full justify-center"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" data-slot="icon">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <Button
                onClick={handleLinkedInLogin}
                outline
                className="w-full justify-center"
              >
                <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24" data-slot="icon">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Continue with LinkedIn
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </Field>

                <Field>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                  />
                </Field>

                <div className="flex items-center justify-between">
                  <CheckboxField>
                    <Checkbox name="remember" defaultChecked />
                    <label htmlFor="remember" className="text-sm text-zinc-950 dark:text-white">
                      Remember me
                    </label>
                  </CheckboxField>
                  <Link href="/forgot-password" className="text-sm font-semibold text-sky-600 dark:text-sky-400">
                    Forgot password?
                  </Link>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg border border-transparent bg-blue-600 px-4 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:px-3 sm:py-1.5 sm:text-sm"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                      </span>
                    ) : (
                      'Log In'
                    )}
                  </button>
                </div>
              </FieldGroup>
            </form>

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup">
                <span className="font-bold text-orange-600 hover:text-orange-700 cursor-pointer">
                  Sign up for free →
                </span>
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link href="/">
              <span className="text-gray-500 hover:text-gray-700 cursor-pointer text-sm">
                ← Back to home
              </span>
            </Link>
          </div>
          </div>
        </div>

        {/* Right Side - Branding */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 p-12 items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10 text-white max-w-lg">
            <h2 className="text-5xl font-bold mb-6">
              Land Your Dream Job Faster
            </h2>
            <p className="text-xl mb-8 text-white/90">
              AI-powered job search that gets you 10x more interviews. Stop applying manually, start interviewing.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg">AI-optimized resumes for every job</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg">Auto-apply to 1000s of jobs</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg">Track applications in one place</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
