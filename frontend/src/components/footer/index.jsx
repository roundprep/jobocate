import React from "react";
import Image from 'next/image';
import logo from '@/assets/jobocate_logo.svg';

export const Footer = () => (
  <footer className="bg-white">
    {/* <div className="max-w-7xl 2xl:container mx-auto px-4 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="md:col-span-1 flex flex-col space-y-4">
        <div className="relative w-40 h-10">
          <Image 
            src={logo} 
            alt="Jobocate Logo" 
            fill
            className="object-contain object-left"
            priority
          />
        </div>
        <span className="text-gray-500 text-sm">
          99 10th Drive
          <br />
          Sunnyside, NY 11104
        </span>
        <span className="text-gray-500 text-sm">email@jobocate.com</span>
        <span className="text-gray-500 text-sm">+163-989-9270</span>
      </div>
  
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Navigation</h3>
        <ul className="space-y-1 text-gray-500 text-sm">
          <li>
            <a href="#" className="hover:text-blue-600 transition">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600 transition">
              Jobs
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600 transition">
              Pricing
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600 transition">
              Contact
            </a>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Categories</h3>
        <ul className="space-y-1 text-gray-500 text-sm">
          <li>
            <a href="#" className="hover:text-blue-600 transition">
              Project Management
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600 transition">
              Development
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600 transition">
              Design
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600 transition">
              Marketing
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600 transition">
              Accounting / Finance
            </a>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Information</h3>
        <ul className="space-y-1 text-gray-500 text-sm">
          <li>
            <a href="#" className="hover:text-blue-600 transition">
              Customer Services
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600 transition">
              Licensing
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600 transition">
              Changelog
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600 transition">
              Instruction
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600 transition">
              404
            </a>
          </li>
        </ul>
      </div>
    </div> */}
    <div className="border-t mt-8 py-6 text-center text-gray-400 text-sm">
      © All rights reserved 2025 by{" "}
      <span className="font-semibold tracking-tight" style={{ color: "#ff480e" }}>Jobocate</span>
    </div>
  </footer>
);