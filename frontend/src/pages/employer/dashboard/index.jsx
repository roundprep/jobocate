import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  BriefcaseIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import EmployerLayout from '@/components/layout/EmployerLayout';

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Sample data - replace with actual data from your API
  const stats = [
    { name: 'Total Jobs Posted', value: '24', icon: BriefcaseIcon, change: '+12%', changeType: 'increase' },
    { name: 'Applications', value: '142', icon: DocumentTextIcon, change: '+8%', changeType: 'increase' },
    { name: 'Active Candidates', value: '89', icon: UsersIcon, change: '+5%', changeType: 'increase' },
    { name: 'Interview Scheduled', value: '12', icon: CalendarIcon, change: '+2', changeType: 'neutral' },
  ];

  const recentJobs = [
    { id: 1, title: 'Senior React Developer', status: 'Active', applications: 42, date: '2023-11-15' },
    { id: 2, title: 'UX/UI Designer', status: 'Draft', applications: 0, date: '2023-11-10' },
    { id: 3, title: 'Product Manager', status: 'Closed', applications: 38, date: '2023-11-05' },
  ];

  const recentActivities = [
    { id: 1, type: 'application', message: 'New application received for Senior React Developer', time: '2 hours ago' },
    { id: 2, type: 'job', message: 'You posted a new job: Full Stack Developer', time: '1 day ago' },
    { id: 3, type: 'message', message: 'You have 3 unread messages from candidates', time: '2 days ago' },
  ];

  return (
    <EmployerLayout>
      <Head>
        <title>Employer Dashboard | Jobocate</title>
        <meta name="description" content="Manage your job postings and candidates" />
      </Head>

      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          {/* Stats */}
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.name}
                  className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
                >
                  <dt>
                    <div className="absolute rounded-md bg-orange-500 p-3">
                      <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
                  </dt>
                  <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <p
                      className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {stat.change}
                    </p>
                  </dd>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Recent Jobs */}
            <div className="lg:col-span-2">
              <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Jobs</h3>
                    <Link href="/employer/jobs" className="text-sm font-medium text-orange-600 hover:text-orange-500">
                      View all
                    </Link>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Job Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applications
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              job.status === 'Active' ? 'bg-green-100 text-green-800' :
                              job.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {job.applications} {job.applications === 1 ? 'application' : 'applications'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(job.date).toISOString().split('T')[0].split('-').reverse().join('/')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/employer/jobs/${job.id}`} className="text-orange-600 hover:text-orange-900">
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <Link
                    href="/employer/jobs/post"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Post a New Job
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Activity</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {recentActivities.map((activity, activityIdx) => (
                        <li key={activity.id}>
                          <div className="relative pb-8">
                            {activityIdx !== recentActivities.length - 1 ? (
                              <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span
                                  className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                    activity.type === 'application' ? 'bg-green-500' :
                                    activity.type === 'job' ? 'bg-blue-500' : 'bg-purple-500'
                                  }`}
                                >
                                  {activity.type === 'application' ? (
                                    <DocumentTextIcon className="h-5 w-5 text-white" aria-hidden="true" />
                                  ) : activity.type === 'job' ? (
                                    <BriefcaseIcon className="h-5 w-5 text-white" aria-hidden="true" />
                                  ) : (
                                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" aria-hidden="true" />
                                  )}
                                </span>
                              </div>
                              <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                <div>
                                  <p className="text-sm text-gray-800">
                                    {activity.message}
                                  </p>
                                </div>
                                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                  <time dateTime={activity.time}>{activity.time}</time>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6">
                    <Link
                      href="/employer/activity"
                      className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      View all activity
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Quick Actions</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Link
                      href="/employer/jobs/post"
                      className="flex flex-col items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-6 text-center hover:bg-gray-50"
                    >
                      <BriefcaseIcon className="h-8 w-8 text-orange-500" aria-hidden="true" />
                      <span className="mt-2 block text-sm font-medium text-gray-900">Post a Job</span>
                    </Link>
                    <Link
                      href="/employer/candidates"
                      className="flex flex-col items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-6 text-center hover:bg-gray-50"
                    >
                      <UsersIcon className="h-8 w-8 text-orange-500" aria-hidden="true" />
                      <span className="mt-2 block text-sm font-medium text-gray-900">Browse Candidates</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EmployerLayout>
  );
}
