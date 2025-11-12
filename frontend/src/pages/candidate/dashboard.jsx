import CandidateLayout from '@/components/layout/CandidateLayout';
import { useAuth } from '@/context/AuthContext';

export default function CandidateDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome back, {user?.name || 'Candidate'}!</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Your Job Matches</h2>
        <p className="text-gray-600">You have 3 new job matches based on your profile.</p>
        
        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-900 mb-3">Recommended Jobs</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((job) => (
              <div key={job} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">Senior Frontend Developer</h4>
                    <p className="text-sm text-gray-600">Tech Company Inc. • Remote</p>
                  </div>
                  <button className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

CandidateDashboard.getLayout = function getLayout(page) {
  return <CandidateLayout>{page}</CandidateLayout>;
};
