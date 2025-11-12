import React from 'react';
import Head from 'next/head';
import { Navbar } from '../components/navbar';
import { Footer } from '../components/footer';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="bg-white">
      <Head>
        <title>Jobocate - AI-Powered Job Search | 10x Faster Applications</title>
        <meta name="description" content="Stop applying for weeks. Start interviewing in days. AI-powered job search with smart matching, auto-apply, and interview coaching." />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-purple-50 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 text-center z-10">
          {/* Social Proof Badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white"></div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-lg">★★★★★</span>
              <span className="text-sm text-gray-600 ml-2">Loved by 100,000+ users</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Stop Applying for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Weeks</span>
            <br />
            Start Interviewing in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">Days</span>
          </h1>

          {/* Tagline */}
          <div className="mb-8 space-y-2">
            <p className="text-2xl md:text-3xl font-bold text-gray-700">
              AI-Powered Reach. Human-Smart Precision.
            </p>
            <p className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-600">
              10x Faster Job Applications
            </p>
          </div>

          {/* Sub headline */}
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Jobocate finds high-match roles, tailors your resume & cover letter, auto-applies, 
            and coaches you live - so you move from submit to scheduled fast.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/signup">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <span className="relative z-10">Get Started - It's Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
            <button className="px-8 py-4 bg-white text-gray-900 font-semibold text-lg rounded-xl border-2 border-gray-300 hover:border-orange-500 transition-all duration-300 hover:shadow-lg">
              Watch Demo →
            </button>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-gray-900">1.6M+</p>
              <p className="text-sm text-gray-600">Applications Sent</p>
            </div>
            <div className="w-px bg-gray-300"></div>
            <div>
              <p className="text-4xl font-bold text-gray-900">58K+</p>
              <p className="text-sm text-gray-600">Interviews Landed</p>
            </div>
            <div className="w-px bg-gray-300"></div>
            <div>
              <p className="text-4xl font-bold text-orange-600">32x</p>
              <p className="text-sm text-gray-600">Faster Results</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Companies */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600 mb-8 font-semibold">
            Our users get hired by top companies worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
            {['Google', 'Microsoft', 'Meta', 'Amazon', 'Netflix', 'Spotify', 'Stripe', 'Coinbase'].map((company) => (
              <div key={company} className="text-2xl font-bold text-gray-700">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              How Jobocate Works in <span className="text-orange-600">3 Simple Steps</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From upload to interview in minutes, not months
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative bg-white p-8 rounded-2xl border-2 border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-6">
                  1
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Your Resume</h3>
                <p className="text-gray-600 mb-6">
                  Simply upload or create a resume from one of our AI-powered templates inside the app.
                </p>
                <div className="h-48 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl flex items-center justify-center">
                  <svg className="w-24 h-24 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative bg-white p-8 rounded-2xl border-2 border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-6">
                  2
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Set Job Preferences</h3>
                <p className="text-gray-600 mb-6">
                  Define your ideal roles, skills, salary range, and location to ensure the best job matches.
                </p>
                <div className="h-48 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center">
                  <svg className="w-24 h-24 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative bg-white p-8 rounded-2xl border-2 border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-6">
                  3
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Applies Automatically</h3>
                <p className="text-gray-600 mb-6">
                  Our AI customizes and sends personalized applications to thousands of relevant jobs - landing interviews 32x faster.
                </p>
                <div className="h-48 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center">
                  <svg className="w-24 h-24 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Get Hired <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">FAST</span>
            </h2>
            <p className="text-xl text-gray-600">
              Powered by cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'AI Resume Builder',
                description: 'AI generates ATS-optimized resumes for each job application, based on your skills and experience.',
                icon: '📄',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'AI Cover Letter',
                description: 'AI generates personalized cover letters for each job application, increasing your chances of getting hired.',
                icon: '✉️',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Auto Apply',
                description: 'Let AI apply to thousands of jobs for you automatically. Save time and get hired faster.',
                icon: '⚡',
                gradient: 'from-orange-500 to-red-500'
              },
              {
                title: 'Smart Job Matching',
                description: 'AI analyzes thousands of jobs and only applies to roles that match your skills and preferences.',
                icon: '🎯',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Interview Buddy',
                description: 'Get real-time interview help and answers to interview questions with our AI coach.',
                icon: '💬',
                gradient: 'from-indigo-500 to-purple-500'
              },
              {
                title: 'Application Tracking',
                description: 'Track all your applications in one place. From "Applied" to "Interview Scheduled".',
                icon: '📊',
                gradient: 'from-pink-500 to-rose-500'
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-300`}></div>
                <div className="relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-transparent transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center text-4xl mb-6 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">
            See Real <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Results</span> with Jobocate
          </h2>
          <p className="text-xl text-gray-300 mb-16 max-w-2xl mx-auto">
            Join thousands who've transformed their job search
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '58K+', label: 'Interviews Landed' },
              { number: '1.6M+', label: 'Applications Sent' },
              { number: '94%', label: 'User Satisfaction' },
              { number: '17x', label: 'Faster Path to Interviews' }
            ].map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
                <p className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                  {stat.number}
                </p>
                <p className="text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent <span className="text-orange-600">Pricing</span>
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your job search goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-orange-300 transition-all duration-300 hover:shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-gray-600 mb-6">Perfect for getting started</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  'AI Resume Builder',
                  'Resume Score Analyzer',
                  'Basic Cover Letters',
                  '10 Auto Applications/month',
                  'Job Search Tools'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 bg-gray-100 text-gray-900 font-semibold rounded-xl hover:bg-gray-200 transition-all">
                Get Started Free
              </button>
            </div>

            {/* Pro Plan - Popular */}
            <div className="relative transform md:scale-105 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl blur opacity-50"></div>
              <div className="relative bg-white p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <p className="text-gray-600 mb-6">Triple your interview chances!</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-600">/month</span>
                  <span className="ml-2 text-sm text-gray-500 line-through">$35</span>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
                  <p className="text-sm font-semibold text-orange-700">
                    ⚡ 250 auto applies/month · Only $0.12 per application
                  </p>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    'Everything in Free',
                    '250 Auto Applications/month',
                    'AI-Optimized Resumes',
                    'Tailored Cover Letters',
                    'Priority Job Matching',
                    'Interview Preparation',
                    'Email Support'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  Get Started with Pro
                </button>
              </div>
            </div>

            {/* Scale Plan */}
            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-gray-900">Scale</h3>
                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full">50% OFF</span>
              </div>
              <p className="text-gray-600 mb-6">Dominate your job search!</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$59</span>
                <span className="text-gray-600">/month</span>
                <span className="ml-2 text-sm text-gray-500 line-through">$95</span>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-6">
                <p className="text-sm font-semibold text-purple-700">
                  🚀 1000 auto applies/month · Only $0.06 per application
                </p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  'Everything in Pro',
                  '1000 Auto Applications/month',
                  'Advanced AI Optimization',
                  'Interview Buddy (Real-time)',
                  'Resume Translator',
                  'Priority Support',
                  'Career Coaching'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all">
                Get Started with Scale
              </button>
            </div>
          </div>

          <p className="text-center text-gray-600 mt-12">
            All plans include a 7-day money-back guarantee
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Join <span className="text-orange-600">100,000+</span> Job Seekers
            </h2>
            <p className="text-xl text-gray-600">
              Who've already found their dream careers with Jobocate
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Got a job in a week using the application kit and interview help. SO GLAD I SUBSCRIBED!!",
                name: "Jessica G.",
                role: "Software Engineer",
                avatar: "👩‍💻",
                rating: 5
              },
              {
                quote: "AIApply transformed my job hunt. I landed a $180k/year job after prepping with the platform.",
                name: "Michael P.",
                role: "Product Manager",
                avatar: "👨‍💼",
                rating: 5
              },
              {
                quote: "Was job hunting for months until I found Jobocate. Finally, a tool that does the tedious work for me!",
                name: "Sarah K.",
                role: "Marketing Manager",
                avatar: "👩‍🎨",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 text-center z-10">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
            Join 100,000+ job seekers using AI to get hired faster. Start your journey today—completely free!
          </p>
          <Link href="/signup">
            <button className="px-12 py-5 bg-white text-orange-600 font-bold text-xl rounded-xl shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300">
              Get Started - It's Free →
            </button>
          </Link>
          <p className="text-white/80 mt-6">No credit card required • Cancel anytime</p>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
