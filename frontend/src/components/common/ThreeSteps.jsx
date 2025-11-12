const ThreeSteps = () => {
  const steps = [
    {
      number: 1,
      title: 'Tell Us What You Want',
      description: 'Set your job preferences—role, location, and goals.'
    },
    {
      number: 2,
      title: 'AI Curates for You',
      description: 'Get a personalized list of jobs that match your vibe.'
    },
    {
      number: 3,
      title: 'Just Tap "Yes"',
      description: 'Approve jobs and our AI applies instantly—no forms, no hassle.'
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-900 mb-16">
          Land Your Next Job In 3 Simple Steps—
          <br />
          Powered By AI..
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-start gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className=\"flex-1 max-w-sm\">
              <div className=\"bg-gray-900 rounded-2xl p-8 text-white shadow-lg transform transition hover:scale-105\">
                <div className=\"w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-xl font-bold mb-6\">
                  {step.number}
                </div>
                <h3 className=\"text-xl font-bold mb-3\">{step.title}</h3>
                <p className=\"text-gray-300\">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className=\"flex justify-center\">
          <div className=\"w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center\">
            <svg className=\"w-8 h-8 text-white\" fill=\"currentColor\" viewBox=\"0 0 20 20\">
              <path d=\"M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z\" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeSteps;
