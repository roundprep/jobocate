import DashboardLayout from '@/components/layout/DashboardLayout';
import { ChartBarIcon, ClockIcon, CheckCircleIcon, CurrencyDollarIcon, BriefcaseIcon, UserIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CandidateDashboard() {
  const stats = [
    { 
      id: 1, 
      name: 'Applications Sent', 
      value: '12', 
      icon: CheckCircleIcon, 
      change: '+20%', 
      changeType: 'positive',
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    { 
      id: 2, 
      name: 'Interviews', 
      value: '3', 
      icon: ClockIcon, 
      change: '+2', 
      changeType: 'positive',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    { 
      id: 3, 
      name: 'Jobs Saved', 
      value: '8', 
      icon: ChartBarIcon, 
      change: '+3', 
      changeType: 'positive',
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    { 
      id: 4, 
      name: 'Avg. Salary', 
      value: '$65,000', 
      icon: CurrencyDollarIcon, 
      change: '+5%', 
      changeType: 'positive',
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
  ];

  const recentApplications = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      status: 'In Review',
      date: '2023-06-15',
      salary: '$90,000 - $120,000',
      type: 'Full-time',
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      company: 'DesignHub',
      status: 'Interview',
      date: '2023-06-10',
      salary: '$80,000 - $100,000',
      type: 'Full-time',
    },
    {
      id: 3,
      title: 'React Developer',
      company: 'WebSolutions',
      status: 'Applied',
      date: '2023-06-05',
      salary: '$85,000 - $110,000',
      type: 'Remote',
    },
  ];

  const recommendedJobs = [
    {
      id: 1,
      title: 'Full Stack Developer',
      company: 'DevTeam Inc.',
      location: 'Remote',
      salary: '$95,000 - $125,000',
      type: 'Full-time',
      posted: '2 days ago',
    },
    {
      id: 2,
      title: 'Frontend Engineer',
      company: 'WebCraft',
      location: 'New York, NY',
      salary: '$100,000 - $130,000',
      type: 'Full-time',
      posted: '1 week ago',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8 sm:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl font-bold ">Welcome back, John! 👋</h1>
              <p className="mt-3 text-lg ">Check your job application status and find your next opportunity</p>
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/jobs"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg bg-black text-white  hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-200"
                >
                  <BriefcaseIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Browse Jobs
                </Link>
                <Link
                  href="/candidate/profile"
                  className="inline-flex items-center justify-center px-6 py-3 border border-white/30 text-base font-medium rounded-lg text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-colors duration-200"
                >
                  <UserIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white overflow-hidden rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-5">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} aria-hidden="true" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-text/80">{stat.name}</p>
                    <p className="mt-1 text-2xl font-semibold text-text">{stat.value}</p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.changeType === 'positive' ? (
                          <svg className="-ml-1 mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="-ml-1 mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {stat.change} from last month
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Applications */}
          <div className="bg-white shadow overflow-hidden rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-text">Recent Applications</h3>
              <p className="mt-1 text-sm text-text/70">Your most recent job applications</p>
            </div>
            <div className="divide-y divide-gray-100">
              {recentApplications.map((application) => (
                <div key={application.id} className="px-5 py-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-primary-600 truncate">{application.title}</h4>
                      <p className="mt-1 text-sm text-text/80">{application.company}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-text/80">
                          {application.type}
                        </span>
                        <span className="text-text/40">•</span>
                        <span className="text-text/60">{application.salary}</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        application.status === 'In Review' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : application.status === 'Interview' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {application.status}
                      </span>
                      <p className="mt-1 text-xs text-text/60 text-right">
                        Applied on {application.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 text-right">
              <Link 
                href="/candidate/applications" 
                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
              >
                View all applications
                <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="bg-white dark:bg-dark-800 shadow overflow-hidden rounded-xl border border-gray-100 dark:border-dark-700 transition-all duration-300 hover:shadow-md">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-dark-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended for You</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Jobs that match your profile</p>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-dark-700">
              {recommendedJobs.map((job) => (
                <div key={job.id} className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors duration-150">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-primary-600 dark:text-primary-400">{job.title}</h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{job.company} • {job.location}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400">
                          {job.type}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-gray-500 dark:text-gray-400">{job.salary}</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex flex-col items-end">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{job.posted}</span>
                      <button
                        type="button"
                        className="mt-2 inline-flex text-white items-center px-3 cursor-pointer py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm  bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 dark:bg-dark-900/30 px-5 py-3 border-t border-gray-100 dark:border-dark-700 text-right">
              <Link 
                href="/jobs" 
                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
              >
                Browse all jobs
                <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Interviews</h3>
            <p className="mt-1 text-sm text-gray-500">Your scheduled interviews</p>
          </div>
          <div className="bg-white overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming interviews</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by applying to jobs.</p>
                <div className="mt-6">
                  <Link
                    href="/jobs"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <BriefcaseIcon
                     className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Browse Jobs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
