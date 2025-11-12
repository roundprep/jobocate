import DashboardLayout from '@/components/layout/DashboardLayout';
import { DocumentTextIcon, ClockIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function CandidateApplications() {
  const applications = [
    {
      id: 1,
      jobTitle: 'Senior Frontend Developer',
      company: 'Tech Innovations Inc.',
      location: 'San Francisco, CA',
      date: '2023-10-15',
      status: 'Applied',
      statusColor: 'bg-blue-100 text-blue-800',
      icon: DocumentTextIcon,
      iconColor: 'text-blue-500',
      description: 'Your application has been submitted and is under review by the hiring team.'
    },
    {
      id: 2,
      jobTitle: 'Full Stack Developer',
      company: 'Digital Creations',
      location: 'Remote',
      date: '2023-10-10',
      status: 'In Review',
      statusColor: 'bg-yellow-100 text-yellow-800',
      icon: ClockIcon,
      iconColor: 'text-yellow-500',
      description: 'Your application is being reviewed by our hiring team. We\'ll be in touch soon.'
    },
    {
      id: 3,
      jobTitle: 'React Developer',
      company: 'Web Solutions LLC',
      location: 'New York, NY',
      date: '2023-10-05',
      status: 'Interview',
      statusColor: 'bg-purple-100 text-purple-800',
      icon: ArrowPathIcon,
      iconColor: 'text-purple-500',
      description: 'You have been selected for an interview. Please check your email for scheduling details.'
    },
    {
      id: 4,
      jobTitle: 'Frontend Engineer',
      company: 'Cloud Systems',
      location: 'Austin, TX',
      date: '2023-09-28',
      status: 'Rejected',
      statusColor: 'bg-red-100 text-red-800',
      icon: XCircleIcon,
      iconColor: 'text-red-500',
      description: 'We appreciate your interest, but we\'ve decided to move forward with other candidates.'
    },
    {
      id: 5,
      jobTitle: 'UI/UX Developer',
      company: 'Design Hub',
      location: 'Seattle, WA',
      date: '2023-09-20',
      status: 'Hired',
      statusColor: 'bg-green-100 text-green-800',
      icon: CheckCircleIcon,
      iconColor: 'text-green-500',
      description: 'Congratulations! Your application has been accepted. Welcome to the team!' 
    }
  ];

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black">My Applications</h1>
          <p className="mt-1 text-sm text-gray-600">Track the status of your job applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {Object.entries(statusCounts).map(([status, count]) => {
            const app = applications.find(a => a.status === status);
            return (
              <div key={status} className="bg-white border border-gray-200 overflow-hidden rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-md p-3 bg-gray-100">
                      <app.icon className="h-6 w-6 text-gray-600" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-600 truncate">{status}</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-black">{count}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Application List */}
        <div className="bg-white border border-gray-200 overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {applications.map((application) => (
              <li key={application.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <h2 className="text-lg font-medium text-black truncate">
                          {application.jobTitle}
                        </h2>
                        <span className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${application.statusColor}`}>
                          {application.status}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0">
                        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mr-6">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 2a4 2 0 00-2 2v.5a.5.5 0 01-1 0V4a3 3 0 016 0v.5a.5.5 0 01-1 0V4a2 2 0 00-2-2z" clipRule="evenodd" />
                            <path d="M7 9a1 1 0 01-1 1H4a1 1 0 00-1 1v4a1 1 0 001 1h12a1 1 0 001-1v-4a1 1 0 00-1-1h-2a1 1 0 01-1-1V7a3 3 0 00-6 0v2z" />
                          </svg>
                          {application.company}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-600 sm:mr-6">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {application.location}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-600">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          Applied on {new Date(application.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        type="button"
                        className="ml-3 inline-flex justify-center rounded-md border border-black py-2 px-4 text-sm font-medium text-black hover:bg-gray-50 focus:outline-none"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {application.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Empty State */}
        {applications.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-black">No applications</h3>
            <p className="mt-1 text-sm text-gray-600">
              Get started by applying to your first job.
            </p>
            <div className="mt-6">
              <a
                href="/jobs"
                className="inline-flex items-center px-4 py-2 border border-black text-sm font-medium rounded-md text-black hover:bg-gray-50 focus:outline-none"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Find Jobs
              </a>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
