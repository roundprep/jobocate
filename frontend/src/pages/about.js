import React from 'react';
import Head from 'next/head';
import { Navbar } from '../components/navbar';
import { Footer } from '../components/footer';
import Link from 'next/link';

const About = () => {
  return (
    <div className="bg-white">
      <Head>
        <title>About Us - Jobocate | Revolutionizing Job Search with AI</title>
        <meta name="description" content="Learn how Jobocate is transforming the job search experience with AI-powered tools" />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-orange-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative container mx-auto px-4 text-center z-10">
          <div className="inline-block bg-orange-100 text-orange-600 px-6 py-2 rounded-full font-semibold mb-6">
            Our Mission
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
            The Only <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Job Seeker</span><br />
            Centric Platform
          </h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Where Innovation Meets Your Career. We're revolutionizing job search by combining 
            <span className="font-bold text-orange-600"> AI-Powered Reach</span>, 
            <span className="font-bold text-purple-600"> Human-Smart Precision</span>, and 
            <span className="font-bold text-blue-600"> 10x Faster Results</span>
          </p>
        </div>
      </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Effortless Collaboration
                </h3>
                <p className="text-gray-600">
                  Share opportunities, insights, and updates seamlessly with your network. 
                  Jobocate keeps collaboration effortless. 🔗 Grow together, faster.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  AI-Powered Guidance
                </h3>
                <p className="text-gray-600">
                  Get insights on which skills to upgrade and roles to target. 
                  🎯 Turn your career goals into a clear action plan.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Real-Time Tracking
                </h3>
                <p className="text-gray-600">
                  Stay updated with every application. From "Applied" to "Interview Scheduled." 
                  📍 Your career journey, clearly visualized.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* More Features */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Smart Job Curation &<br />One Click Apply
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Jobocate's AI engine learns from your preferences, career goals, and work history 
                  to handpick the most relevant opportunities — saving hours of scrolling.
                </p>
                <p className="text-gray-600">
                  💡 It's like having your own digital career assistant.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8 mb-6">
                  <p className="text-center text-orange-600 font-semibold mb-4">
                    Resume Analyzed Successfully ✓
                  </p>
                  <div className="h-2 bg-orange-200 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-orange-500 rounded-full"></div>
                  </div>
                </div>
                <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition">
                  Start Applying →
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* Human + AI Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Human + AI Synergy
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              We believe in balance. Our human assistance ensures empathy and precision, 
              while AI brings unmatched speed and scalability.
            </p>
            <p className="text-2xl">❤️ Because real growth needs a human touch.</p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to revolutionize your job search?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who've already found their dream careers with Jobocate
            </p>
            <button className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-50 transition shadow-lg">
              Get Started - It's Free
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
