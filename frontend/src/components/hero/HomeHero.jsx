"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiSearch, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import AOS from "aos";
import "aos/dist/aos.css";

import girl from "@/assets/home/home_girl.png";
import boy from "@/assets/home/home_boy.png";

// Features and stats data
const FEATURES = [
  "Curated job queue",
  "AI auto-apply + resume match",
  "Human QA accuracy",
  "Live tracking & insights",
];

const STATS = [
  { number: "5,000+", label: "Subscribers Target (Year 1)" },
  { number: "35%+", label: "Avg. Interview Invite Rate" },
  { number: "24 Hrs", label: "Platinum SLA Response Time" },
  { number: "50+", label: "Partner Organizations" },
];

// Component for left/right images
const ImageContainer = ({ src, alt }) => (
  <div className="relative h-[500px] w-full max-w-[400px] overflow-hidden">
    <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 0, 25vw" className="object-cover" priority />
  </div>
);

// Component for each stat with AOS animation
const StatItem = ({ number, label, delay }) => (
  <div className="p-4 text-center" data-aos="fade-up" data-aos-delay={delay}>
    <div className="text-3xl font-bold text-gray-900">{number}</div>
    <div className="text-gray-600 text-sm">{label}</div>
  </div>
);

// Component for each feature with AOS animation
const FeatureItem = ({ text, delay }) => (
  <div className="flex items-center justify-center" data-aos="fade-up" data-aos-delay={delay}>
    <FiCheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
    <span className="text-gray-700">{text}</span>
  </div>
);

const HomeHero = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true, // animation runs only once
    });
  }, []);

  // Search submit handler (commented out for now)
  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   const query = searchQuery.trim();
  //   if (query) {
  //     // Redirect to jobs page with search query
  //     router.push(`/jobs?search=${encodeURIComponent(query)}`);
  //   }
  // };

  return (
    <div className="relative py-16 bg-white">
      <div className="max-w-7xl 2xl:container mx-auto px-4 sm:px-6 lg:px-16 flex items-center">
        {/* Left Image */}
        <div className="hidden lg:block w-1/4" data-aos="fade-right">
          <ImageContainer src={girl} alt="Jobocate candidate" />
        </div>

        {/* Center Content */}
        <div className="w-full lg:w-1/2 px-4 sm:px-8">
          <div className="max-w-2xl mx-auto text-center" data-aos="fade-up">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800 mb-6">
              <span className="w-2 h-2 bg-black rounded-full mr-2" />
              AI + Human Job Application Platform
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Approve Your Job Queue Today — Get Noticed by Top Employers
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
              Jobocate Assist blends AI auto-apply with human QA and coaching to cut your job search time.
              We tailor resumes, apply on your behalf, and track outcomes—so you focus on interviews, not paperwork.
            </p>

            {/* Search Form */}
            <form
              // onSubmit={handleSearch} 
              className="max-w-xl mx-auto"
              data-aos="zoom-in"
            >
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Job title, skills, or company"
                    aria-label="Search for jobs"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-4 bg-black hover:bg-gray-900 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Find Jobs
                  <FiArrowRight className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* Features */}
            <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 mb-10">
              {FEATURES.map((feature, index) => (
                <FeatureItem key={index} text={feature} delay={index * 100} />
              ))}
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-gray-200 pt-6">
              {STATS.map((stat, index) => (
                <StatItem key={index} number={stat.number} label={stat.label} delay={index * 150} />
              ))}
            </div> */}
          </div>
        </div>

        {/* Right Image */}
        <div className="hidden lg:block w-1/4" data-aos="fade-left">
          <ImageContainer src={boy} alt="Jobocate candidate" />
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
