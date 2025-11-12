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

      {/* Features Grid - Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-orange-600">Jobocate</span>?
            </h2>
            <p className="text-xl text-gray-600">
              We're different because we put job seekers first
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl blur opacity-20 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-white p-10 rounded-3xl border border-gray-200">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-5xl mb-6 shadow-lg">
                  🔗
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Effortless Collaboration
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Share opportunities, insights, and updates seamlessly with your network. 
                  Whether you're mentoring or referring, Jobocate keeps collaboration effortless. 
                  Grow together, faster.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl blur opacity-20 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-white p-10 rounded-3xl border border-gray-200">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-5xl mb-6 shadow-lg">
                  🎯
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  AI-Powered Career Guidance
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Beyond just jobs — Jobocate gives insights on which skills to upgrade, 
                  which roles to target, and how to stand out in your industry. 
                  Turn your career goals into a clear action plan.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl blur opacity-20 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-white p-10 rounded-3xl border border-gray-200">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-5xl mb-6 shadow-lg">
                  📍
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Real-Time Job Tracking
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Stay updated with every application. From "Applied" to "Interview Scheduled," 
                  Jobocate tracks it all — so you never lose sight of your progress. 
                  Your career journey, clearly visualized.
                </p>
              </div>
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
