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
          <div className="flex-1 text-center max-w-4xl">
            <p className="text-sm mb-6" style={{ color: '#666666' }}>We are your future</p>
            
            <h1 className="font-bold leading-tight mb-6" style={{ fontSize: '50px' }}>
              <span style={{ color: '#0A1128' }}>AI-Powered Reach.</span>
              <br />
              <span style={{ color: '#FF5733' }}>Human-Smart Precision.</span>
              <br />
              <span style={{ color: '#0A1128' }}>10x Faster Job Applications</span>
            </h1>

            <p className="mb-8 max-w-2xl mx-auto" style={{ fontSize: '18px', color: '#666666', lineHeight: '28px' }}>
              Our AI-driven platform automates your job search by constantly finding and applying to the right roles—until you land the job
            </p>

            <button
              onClick={() => router.push('/candidate/resume/upload')}
              className="inline-flex items-center gap-3 px-10 py-4 font-bold rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#0A1128', color: '#FFFFFF', fontSize: '16px' }}
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
