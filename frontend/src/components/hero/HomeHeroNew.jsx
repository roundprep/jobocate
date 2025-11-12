import { useRouter } from 'next/router';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';
import girl from '@/assets/home/home_girl.png';
import boy from '@/assets/home/home_boy.png';

const HomeHeroNew = () => {
  const router = useRouter();

  return (
    <div className="relative py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Left Illustration */}
          <div className="hidden lg:block flex-shrink-0">
            <Image src={girl} alt="Job seeker" width={250} height={350} className="object-contain" />
          </div>

          {/* Center Content */}
          <div className="flex-1 text-center max-w-3xl">
            <p className="text-sm text-gray-500 mb-4">We are your future</p>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-gray-900">AI-Powered Reach.</span>
              <br />
              <span className="text-orange-600">Human-Smart Precision.</span>
              <br />
              <span className="text-gray-900">10x Faster Job Applications</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Our AI-driven platform automates your job search by constantly finding and applying to the right roles—until you land the job
            </p>

            <button
              onClick={() => router.push('/candidate/resume/upload')}
              className="inline-flex items-center gap-3 px-10 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start Applying Now
              <FiArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Illustration */}
          <div className="hidden lg:block flex-shrink-0">
            <Image src={boy} alt="Professional" width={250} height={350} className="object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHeroNew;
