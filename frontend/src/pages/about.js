import React from 'react';
import Head from 'next/head';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - Jobocate</title>
        <meta name="description" content="Learn more about Jobocate - The AI-powered job search platform revolutionizing the job market" />
      </Head>

      <div className="relative w-full min-h-screen overflow-y-auto bg-white">
        <Navbar />

        {/* Hero Section */}
        <section className="relative h-[277px] bg-white flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-white/13 to-white/0" />
          
          <div className="relative max-w-[1200px] w-full mx-auto px-8">
            <div className="text-center">
              <h3 className="text-[#1D2445] font-archivo font-semibold text-[17px] mb-4">
                Why Us?
              </h3>
              <h1 className="text-[#1D2445] font-manrope font-bold text-[44px] leading-[56px] capitalize">
                The only job seeker<br />centric platform
              </h1>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-16 bg-white">
          <div className="max-w-[1280px] w-full mx-auto px-8">
            <div className="flex flex-col gap-16">
              
              {/* Why Us Heading */}
              <div className="text-center mb-8">
                <h2 className="text-[#251B18] font-inter font-semibold text-[24px] leading-[34px] mb-4">
                  Where Innovation Meets<br />Your Career
                </h2>
              </div>

              {/* First Row of Cards */}
              <div className="flex flex-wrap justify-center gap-5">
                
                {/* Card 1: Effortless Collaboration & Sharing */}
                <div className="flex-1 min-w-[400px] max-w-[413px] bg-white rounded-2xl border border-[#F9F3F1] overflow-hidden">
                  <div className="bg-[#F5F5F5] rounded-b-2xl p-6 relative min-h-[342px] flex items-center justify-center">
                    <div className="w-full max-w-[325px] bg-white rounded-lg p-5 relative">
                      <h3 className="font-bricolage text-[18px] font-semibold mb-4 text-[#251B18]">Share</h3>
                      <div className="space-y-4">
                        <div className="bg-[#FBFBFB] rounded-lg p-3">
                          <p className="text-[12px] text-[#251B18] mb-2">Share this link</p>
                          <div className="bg-white rounded px-3 py-2 mb-2 text-[#251B18] text-sm truncate">
                            jobocate.com/share/link
                          </div>
                        </div>
                        <div className="bg-[#FBFBFB] rounded-lg p-3">
                          <p className="text-[12px] text-[#251B18] mb-2">Copy link</p>
                        </div>
                        <div className="flex items-center justify-between bg-[#FBFBFB] rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                              <path d="M4 10h12M10 4l6 6-6 6" stroke="#251B18" strokeWidth="2"/>
                            </svg>
                            <span className="text-[12px] text-[#251B18]">Twitter.com/share=link</span>
                          </div>
                          <button className="bg-[#EDEAE9] rounded px-3 py-1 text-[12px] text-[#251B18] font-inter">
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-inter font-semibold text-[24px] leading-[34px] text-[#251B18] mb-4">
                      Effortless Collaboration<br />& Sharing
                    </h3>
                    <p className="font-inter text-[14.5px] leading-[26px] text-[#251B18]">
                      Share opportunities, insights, and updates seamlessly with your network. 
                      Whether you're mentoring or referring, Jobocate keeps collaboration effortless. 
                      🔗 Grow together, faster.
                    </p>
                  </div>
                </div>

                {/* Card 2: AI-Powered Career Guidance */}
                <div className="flex-1 min-w-[400px] max-w-[413px] bg-white rounded-2xl border border-[#F9F3F1] overflow-hidden">
                  <div className="bg-[#F5F5F5] rounded-b-2xl p-6 relative min-h-[340px] flex items-center justify-center">
                    <div className="relative">
                      <div className="w-[112px] h-[47px] bg-white rounded-lg shadow-sm" />
                      <div className="absolute right-0 bottom-0 w-[86px] h-[37px] bg-gradient-to-br from-white/20 to-transparent rounded-lg" />
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-inter font-semibold text-[24px] leading-[34px] text-[#251B18] mb-4">
                      AI-Powered Career<br />Guidance & Feedback
                    </h3>
                    <p className="font-inter text-[14.4px] leading-[26px] text-[#251B18]">
                      Beyond just jobs — Jobocate gives insights on which skills to upgrade, 
                      which roles to target, and how to stand out in your industry. 
                      🎯 Turn your career goals into a clear action plan.
                    </p>
                  </div>
                </div>

                {/* Card 3: Real-Time Job Tracking */}
                <div className="flex-1 min-w-[400px] max-w-[413px] bg-white rounded-2xl border border-[#F9F3F1] overflow-hidden">
                  <div className="bg-[#F5F5F5] rounded-b-2xl p-4 relative min-h-[363px]">
                    <div className="bg-white rounded-lg p-4 flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-[#FF4017]/10 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-[#FF4017] rounded-full" />
                      </div>
                      <p className="font-inter font-semibold text-[24px] text-black">
                        Your job status is active.
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-8 relative">
                      <div className="w-14 h-14 bg-white rounded-full shadow-lg" />
                      <div className="w-14 h-14 bg-white rounded-full shadow-lg" />
                      <div className="w-14 h-14 bg-white rounded-full shadow-lg" />
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-inter font-semibold text-[24px] leading-[34px] text-[#251B18] mb-4">
                      Real-Time Job Tracking
                    </h3>
                    <p className="font-inter text-[14.6px] leading-[26px] text-[#251B18]">
                      Stay updated with every application. From "Applied" to "Interview Scheduled," 
                      Jobocate tracks it all — so you never lose sight of your progress. 
                      📍 Your career journey, clearly visualized.
                    </p>
                  </div>
                </div>
              </div>

              {/* Second Row of Cards */}
              <div className="flex flex-wrap justify-center gap-5">
                
                {/* Large Card: Smart Job Curation */}
                <div className="flex-1 min-w-[600px] max-w-[630px] bg-white rounded-2xl border border-[#F9F3F1] overflow-hidden">
                  <div className="bg-[#F5F5F5] rounded-b-2xl p-10 relative min-h-[436px] flex flex-col items-center justify-center">
                    <div className="w-[308px] bg-white rounded-2xl p-6 mb-6 relative">
                      <div className="absolute top-8 left-12 text-[#FF4017] font-bricolage font-medium text-[17px]">
                        Resume Analysed Successfully
                      </div>
                    </div>
                    <div className="w-8 h-16 flex items-center justify-center text-[#251B18]/20">↓</div>
                    <div className="w-full max-w-[550px] bg-white rounded-2xl p-6">
                      <div className="bg-[#F5F5F5] rounded-xl p-5 flex items-center gap-3 mb-6">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#251B18" opacity="0.6"/>
                        </svg>
                        <p className="text-[#6A6361] font-bricolage font-medium text-[17px]">
                          Curate jobs with our AI just for you
                        </p>
                        <div className="ml-auto">
                          <div className="w-9 h-6 bg-[#FF4017] rounded-full relative">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                          </div>
                        </div>
                      </div>
                      <button className="w-full bg-[#251B18] text-white rounded-xl py-3 flex items-center justify-center gap-2 font-inter font-medium">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                          <path d="M9 5l7 7-7 7" stroke="white" strokeWidth="2"/>
                        </svg>
                        Start Applying
                      </button>
                    </div>
                  </div>
                  <div className="p-6 pl-8">
                    <h3 className="font-inter font-semibold text-[24px] leading-[34px] text-[#251B18] mb-2">
                      Smart Job Curation &<br />One Click Apply
                    </h3>
                    <p className="font-inter text-[14.5px] leading-[26px] text-[#251B18]">
                      Jobocate's AI engine learns from your preferences, career goals, and work history 
                      to handpick the most relevant opportunities — saving hours of scrolling through 
                      irrelevant listings. 💡 It's like having your own digital career assistant.
                    </p>
                  </div>
                </div>

                {/* Large Card: Human + AI Synergy */}
                <div className="flex-1 min-w-[600px] max-w-[630px] bg-white rounded-2xl border border-[#F9F3F1] overflow-hidden">
                  <div className="bg-[#F5F5F5] rounded-t-2xl rounded-b-2xl p-4 relative min-h-[436px]">
                    <div className="bg-[#FBFBFB] rounded-lg p-3 mb-4 flex items-center gap-2">
                      <div className="w-9 h-9 bg-gray-200 rounded-full" />
                      <span className="text-[#5A4A45] font-inter font-medium text-[14.6px]">
                        Meet the intelligence
                      </span>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex gap-2">
                        <button className="bg-white rounded-xl px-4 py-2 flex items-center gap-2 text-[#251B18] text-sm font-inter">
                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                            <path d="M8 2v12M2 8h12" stroke="#251B18" strokeWidth="1.5"/>
                          </svg>
                          Generate Summary
                        </button>
                        <button className="bg-white rounded-xl px-4 py-2 text-[#251B18] text-sm font-inter">
                          Are they a good fit for my job post?
                        </button>
                        <button className="bg-white rounded-xl px-4 py-2 text-[#251B18] text-sm font-inter">
                          Map
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-white rounded-xl px-4 py-2 text-[#251B18] text-sm font-inter">
                          What is their training style?
                        </button>
                        <button className="bg-white rounded-xl px-4 py-2 text-[#251B18] text-sm font-inter">
                          All
                        </button>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white p-4 relative min-h-[194px]">
                      <div className="bg-gradient-to-br from-[#E8E8E8] via-[#E8E8E8] to-transparent rounded-t-2xl p-4 mb-2">
                        <div className="text-[#251B18] text-sm font-inter">Chat interface</div>
                      </div>
                      <div className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-6 bg-[#251B18]" />
                          <input 
                            type="text" 
                            placeholder="Ask anything... Ta" 
                            className="flex-1 bg-transparent text-[#251B18] text-[12.8px] font-inter outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-5 py-2 border-t border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[#251B18] font-inter text-[18px]">Mobile</span>
                            <div className="w-6 h-4 bg-[#CECFD6]/40 rounded-full relative">
                              <div className="absolute left-1 top-1 w-3 h-2 bg-[#8B8B8B] rounded-full" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[#251B18] font-inter text-[18px]">Web</span>
                            <div className="w-6 h-4 bg-[#FF4017] rounded-full relative">
                              <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 pl-8">
                    <h3 className="font-inter font-semibold text-[24px] leading-[34px] text-[#251B18] mb-2">
                      Human + AI Synergy
                    </h3>
                    <p className="font-inter text-[14.5px] leading-[26px] text-[#251B18]">
                      We believe in balance. Our human assistance ensures empathy and precision, 
                      while AI brings unmatched speed and scalability — working together to deliver 
                      the best results. ❤️ Because real growth needs a human touch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="relative py-20 bg-white">
          <div className="max-w-[1200px] w-full mx-auto px-8 text-center">
            <h3 className="text-[#1D2445] font-archivo font-semibold text-[17px] mb-4">
              Be a part in our journey
            </h3>
            <h2 className="text-[#1D2445] font-manrope font-bold text-[44px] leading-[56px] capitalize mb-12">
              The only job seeker<br />centric platform
            </h2>
            
            <div className="relative w-full max-w-[1200px] h-[440px] mx-auto mb-12 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0A]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-[#FF6F00]/80 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg hover:bg-[#FF6F00] transition-all">
                  <svg className="w-8 h-8 ml-1" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
            </div>

            <button className="bg-[#FF480E] text-white px-8 py-3 rounded-lg font-inter font-medium text-[14.6px] inline-flex items-center gap-3 shadow-[inset_0_4px_10px_rgba(255,255,255,0.1),inset_0_-4px_8px_rgba(255,255,255,0.1)] hover:bg-[#ff5a20] transition-all">
              Join Our Community - It's Free
              <span className="w-10 h-9 bg-white rounded-md flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 16 14" fill="none">
                  <path d="M0 7h14M8 0l6 7-6 7" fill="#FF6F00"/>
                </svg>
              </span>
            </button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
