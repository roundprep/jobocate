"use client";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";

export default function PricingSection() {
  const [isMonthToMonth, setIsMonthToMonth] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const plans = [
    {
      name: "Basic",
      tagline: "The best way to start your journey",
      priceMonthly: "Free",
      priceYearly: "Free",
      buttonText: "Start for Free",
      features: [
        "AI-based resume builder",
        "Free difference analysis",
        "Free access to resume builder",
        "Create resume by following instructions",
        "Purchase of Course of Guided Sessions",
      ],
    },
    {
      name: "Standard",
      tagline: "The best way to optimize your career",
      priceMonthly: "$15",
      priceYearly: "$150",
      buttonText: "Get Started",
      tag: "Most Popular",
      features: [
        "AI-based resume builder",
        "Free difference analysis",
        "AI-based resume builder for your career",
        "Create resume by following instructions",
        "Access to interview simulators",
      ],
    },
    {
      name: "Premium",
      tagline: "The best way to accelerate your career",
      priceMonthly: "$24",
      priceYearly: "$240",
      buttonText: "Get Started",
      features: [
        "AI-based resume builder",
        "Automated deadline",
        "Free difference analysis",
        "Talent integration",
        "Career support",
        "Best-suited benefits",
      ],
    },
  ];

  // Separate the plans into main plans and personalized plan
  const mainPlans = plans.filter((plan) => plan.name !== "Personalized");
  const personalizedPlan = plans.find((plan) => plan.name === "Personalized");

  return (
    <section className="w-full py-20 bg-gray-50">
      <div className="text-center mb-12 px-4">
        <h4 className="text-sm font-semibold text-gray-500 mb-2">
          Choose your plan
        </h4>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Flexible Pricing For Every Career Journey
        </h2>

        {/* Billing Toggle - Only for main plans */}
        <div className="flex justify-center items-center gap-3 mt-4">
          <span
            className={
              !isMonthToMonth ? "text-gray-800 font-medium" : "text-gray-400"
            }
          >
            6-Month Commitment
          </span>
          <button
            onClick={() => setIsMonthToMonth(!isMonthToMonth)}
            className="relative w-16 h-8 flex items-center bg-gray-300 cursor-pointer rounded-full transition-all duration-300"
          >
            <span
              className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                isMonthToMonth ? "translate-x-8 bg-orange-500" : ""
              }`}
            ></span>
          </button>
          <span
            className={
              isMonthToMonth ? "text-orange-600 font-medium" : "text-gray-400"
            }
          >
            Month-to-Month
          </span>
        </div>
      </div>

      {/* Main Pricing Cards - Silver, Gold, Platinum */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 mb-16">
        {mainPlans.map((plan, index) => (
          <div
            key={index}
            data-aos="fade-up"
            data-aos-delay={index * 100}
            className={`relative flex flex-col justify-between rounded-3xl p-8 shadow-lg border transition-all duration-300 hover:scale-105 ${
              plan.tag
                ? "bg-gradient-to-br from-gray-500 to-gray-900 text-white shadow-2xl border-transparent"
                : "bg-white border-gray-200 hover:shadow-xl"
            }`}
          >
            {plan.tag && (
              <span className="absolute top-4 right-4 text-xs bg-white text-orange-500 px-3 py-1 rounded-full font-semibold shadow-md">
                {plan.tag}
              </span>
            )}

            <div>
              <h3
                className={`text-lg font-semibold mb-2 ${
                  plan.tag ? "text-white" : "text-gray-900"
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`text-4xl font-bold mb-2 ${
                  plan.tag ? "text-white" : "text-gray-900"
                }`}
              >
                {isMonthToMonth ? plan.priceMonthToMonth : plan.priceCommitment}
              </p>
              <p
                className={`text-sm mb-6 ${
                  plan.tag ? "text-orange-100" : "text-gray-500"
                }`}
              >
                Includes {plan.inclusions}
              </p>
              <Link href="/promo">
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-all cursor-pointer ${
                    plan.tag
                      ? "bg-white text-orange-500 hover:bg-gray-100"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </Link>
              <hr
                className={`my-6 ${
                  plan.tag ? "border-white/40" : "border-gray-200"
                }`}
              />

              <h4
                className={`text-sm font-semibold mb-4 ${
                  plan.tag ? "text-white" : "text-gray-700"
                }`}
              >
                Main Features
              </h4>
              <ul className="space-y-3 text-sm">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span
                      className={`text-green-400 text-lg ${
                        plan.tag ? "text-white" : "text-green-500"
                      }`}
                    >
                      ✓
                    </span>
                    <span className={plan.tag ? "text-white" : "text-gray-800"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Personalized Plan Card - Full width below */}
      <div className="max-w-7xl mx-auto px-4">
        <div
          className="relative flex flex-col rounded-3xl p-8 shadow-2xl border border-transparent bg-gradient-to-br from-gray-500 to-gray-900 text-white"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">
                  {personalizedPlan.name}
                </h3>
                <p className="text-5xl font-bold mb-2">
                  {personalizedPlan.priceCommitment}
                </p>
                <p className="text-gray-200 mb-6">
                  Includes {personalizedPlan.inclusions}
                </p>
                <Link href="/promo">
                <button className="bg-white text-gray-900 cursor-pointer hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all">
                  {personalizedPlan.buttonText}
                </button>
                </Link>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-4">Premium Features</h4>
                <ul className="space-y-3 text-sm">
                  {personalizedPlan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-orange-400 text-lg">✓</span>
                      <span className="text-gray-100">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
