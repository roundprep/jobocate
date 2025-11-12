import { useState } from 'react';
import Link from 'next/link';

const PricingSectionNew = () => {
  const [isYearly, setIsYearly] = useState(true);

  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      button: 'Start 14-day free',
      features: [
        'Offer multiple pricing tiers',
        'Clear Differentiation: Clearly outline',
        'Show different subscription options',
        'Unique Features: Point out the special traits'
      ]
    },
    {
      name: 'Popular',
      price: '$15',
      popular: true,
      button: 'Get Started',
      features: [
        'Show different subscription options',
        'Unique Features: Point out the special traits',
        'Advanced AI Analytics',
        'Automated Workflow'
      ]
    },
    {
      name: 'Pro',
      price: '$56',
      button: 'Get Started',
      features: [
        'Advanced AI Analytics',
        'Automated Workflow',
        'Custom Integrations',
        'Priority Support'
      ]
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm text-gray-600 mb-2">Choose your plan</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
            Flexible Pricing For Every Career Journey.
          </h2>

          {/* Billing Toggle */}
          <div className="flex justify-center items-center gap-4 mb-12">
            <span className={`font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-400'}`}>
              Billed monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-7 bg-gray-300 rounded-full transition-colors"
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  isYearly ? 'translate-x-7 bg-orange-600' : ''
                }`}
              />
            </button>
            <span className={`font-medium ${isYearly ? 'text-orange-600' : 'text-gray-400'}`}>
              Billed yearly
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-gray-900 text-white relative'
                  : 'bg-white border-2 border-gray-200'
              }`}
            >
              {plan.popular && (
                <span className="absolute top-4 right-4 bg-orange-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  Most popular
                </span>
              )}
              
              <h3 className={`text-xl font-bold mb-4 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              <div className={`text-5xl font-bold mb-6 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                {plan.price}
              </div>
              
              <Link href="/signup">
                <button
                  className={`w-full py-3 rounded-lg font-semibold mb-6 transition-colors ${
                    plan.popular
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {plan.button}
                </button>
              </Link>

              <div className="space-y-3">
                <p className={`text-sm font-semibold mb-4 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  Main features
                </p>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className={plan.popular ? 'text-white' : 'text-green-600'}>✓</span>
                    <span className={`text-sm ${plan.popular ? 'text-gray-300' : 'text-gray-600'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSectionNew;