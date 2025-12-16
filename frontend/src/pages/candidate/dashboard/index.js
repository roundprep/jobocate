import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProfileCompletionBanner from '@/components/profile/ProfileCompletionBanner';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  BriefcaseIcon,
  CalendarIcon,
  BookmarkIcon,
  EyeIcon,
  SparklesIcon,
  PlusIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowRightIcon,
  FireIcon,
  CheckCircleIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/catalyst/button';
import Link from 'next/link';

// Animation variants for specific Bento Grid feel
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

export default function CandidateDashboard() {
  const { user, loading: authLoading } = useAuth();
  const userName = user?.name?.split(' ')[0] || 'there';
  const [timePeriod, setTimePeriod] = useState('Last week');

  const timePeriods = ['Last week', 'Last month', 'All time'];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Enhanced stats with more visual flair
  const stats = [
    {
      id: 1,
      name: 'Total Applications',
      value: '12',
      change: '+4',
      changeType: 'positive',
      icon: BriefcaseIcon,
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50 dark:bg-blue-900/10',
      text: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 2,
      name: 'Interviews',
      value: '3',
      change: '+2',
      changeType: 'positive',
      icon: CalendarIcon,
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/10',
      text: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      id: 3,
      name: 'Profile Views',
      value: '48',
      change: '+12%',
      changeType: 'positive',
      icon: EyeIcon,
      color: 'violet',
      gradient: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50 dark:bg-violet-900/10',
      text: 'text-violet-600 dark:text-violet-400'
    },
    {
      id: 4,
      name: 'Response Rate',
      value: '25%',
      change: '+5%',
      changeType: 'positive',
      icon: ChartBarIcon,
      color: 'amber',
      gradient: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50 dark:bg-amber-900/10',
      text: 'text-amber-600 dark:text-amber-400'
    },
  ];

  const recentApplications = [
    {
      id: 3000,
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      status: 'In Review',
      date: '2024-05-09',
      logo: 'TC',
      matchScore: 94,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: 3001,
      title: 'UI/UX Designer',
      company: 'DesignHub',
      status: 'Interview',
      date: '2024-05-05',
      logo: 'DH',
      matchScore: 87,
      color: 'bg-purple-100 text-purple-700'
    },
    {
      id: 3002,
      title: 'React Developer',
      company: 'WebSolutions',
      status: 'Applied',
      date: '2024-04-28',
      logo: 'WS',
      matchScore: 91,
      color: 'bg-emerald-100 text-emerald-700'
    },
  ];

  const upcomingTasks = [
    { id: 1, title: 'Interview with DesignHub', time: 'Tomorrow, 2:00 PM', type: 'interview', icon: CalendarIcon },
    { id: 2, title: 'Complete Tech Assessment', time: 'Due in 2 days', type: 'task', icon: CheckCircleIcon },
  ];

  if (authLoading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Dashboard | Jobocate</title>
      </Head>
      <DashboardLayout>
        <div className="min-h-full pb-10 bg-gray-50 dark:bg-zinc-900">
          <div className="max-w-[1920px] px-6 sm:px-8 lg:px-10 pt-8">

            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10"
            >
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight font-display">
                  {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">{userName}</span>
                </h1>
                <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">
                  Ready to land your dream job? Here's your daily briefing.
                </p>
              </div>

              <div className="flex bg-white dark:bg-zinc-800 p-1.5 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
                {timePeriods.map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimePeriod(period)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      timePeriod === period
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Profile Banner */}
            <div className="mb-10">
              <ProfileCompletionBanner />
            </div>

            {/* Bento Grid Layout */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-12 gap-6"
            >
              {/* Stats Row - Spans full width on mobile, 3 cols each on desktop */}
              {stats.map((stat) => (
                <motion.div
                  key={stat.id}
                  variants={itemVariants}
                  className="col-span-1 md:col-span-6 lg:col-span-3"
                  whileHover={{ y: -5 }}
                >
                  <div className="group relative overflow-hidden bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-[0.08] rounded-bl-full group-hover:scale-110 transition-transform duration-500`} />

                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl ${stat.bg} ${stat.text}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className={`flex items-center text-sm font-semibold ${stat.changeType === 'positive' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {stat.changeType === 'positive' ? <ArrowUpIcon className="w-3 h-3 mr-1" /> : <ArrowDownIcon className="w-3 h-3 mr-1" />}
                        {stat.change}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-1">{stat.name}</h3>
                      <p className="text-3xl font-bold text-zinc-900 dark:text-white font-display">{stat.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Main Content Area - Left Column (8 cols) */}
              <div className="col-span-1 md:col-span-12 lg:col-span-8 space-y-6">

                {/* Analytics / Chart Section */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-display">Application Activity</h3>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm">Your application timeline over the last 30 days</p>
                    </div>
                    <Button href="/candidate/applications" variant="outline" className="gap-2">
                      View Report <ArrowRightIcon className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Placeholder for Chart - using a visual representation */}
                  <div className="h-64 w-full bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl flex items-end justify-between px-6 pb-6 pt-10 gap-2 relative overflow-hidden group">
                    {/* Faux bars */}
                    {[35, 55, 40, 70, 45, 90, 65, 85, 45, 60, 75, 50].map((height, i) => (
                      <div key={i} className="w-full bg-indigo-100 dark:bg-indigo-900/30 rounded-t-lg relative group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/40 transition-colors duration-300">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.8, delay: i * 0.05 }}
                          className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg opacity-80"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Applications List */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-display">Recent Applications</h3>
                    <Link href="/candidate/applications" className="text-sm font-medium text-primary-600 hover:text-primary-700">View All</Link>
                  </div>

                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {recentApplications.map((app) => (
                      <div key={app.id} className="p-4 sm:p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-700 text-zinc-600 dark:text-zinc-300 shadow-inner">
                            {app.logo}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-zinc-900 dark:text-white group-hover:text-primary-600 transition-colors truncate">{app.title}</h4>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">{app.company} • Applied {app.date}</p>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Match Score */}
                            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                              <FireIcon className="w-3.5 h-3.5" /> {app.matchScore}%
                            </div>

                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                              app.status === 'Interview' 
                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                                : app.status === 'In Review'
                                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                            }`}>
                              {app.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

              </div>

              {/* Sidebar Content Area - Right Column (4 cols) */}
              <div className="col-span-1 md:col-span-12 lg:col-span-4 space-y-6">

                {/* Premium / Quick Actions Card */}
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                  {/* Abstract shapes */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400 opacity-10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <SparklesIcon className="w-5 h-5 text-amber-300" />
                      <span className="font-bold text-indigo-100 uppercase text-xs tracking-wider">AI Copilot</span>
                    </div>

                    <h3 className="text-2xl font-bold mb-2 font-display">Boost your chances</h3>
                    <p className="text-indigo-100 mb-6 text-sm leading-relaxed">
                      Use our AI tools to optimize your resume and generate tailored cover letters.
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <Link href="/candidate/resume-builder" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center transition-colors">
                        <div className="bg-white text-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg">
                          <BoltIcon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold block text-white">Resume AI</span>
                      </Link>
                      <Link href="/candidate/cover-letter" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center transition-colors">
                        <div className="bg-white text-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg">
                          <BookmarkIcon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold block text-white">Cover Letter</span>
                      </Link>
                    </div>

                    <Link href="/jobs" className="mt-4 block w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-center text-sm hover:shadow-lg transition-all hover:scale-[1.02]">
                      Browse Matched Jobs
                    </Link>
                  </div>
                </motion.div>

                {/* Upcoming Schedule */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 font-display">Up Next</h3>

                  <div className="space-y-4">
                    {upcomingTasks.map((task) => (
                      <div key={task.id} className="flex gap-4">
                        <div className={`w-12 flex flex-col items-center justify-center rounded-xl ${
                          task.type === 'interview' 
                            ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                        }`}>
                          <task.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-zinc-900 dark:text-white text-sm">{task.title}</h4>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">{task.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <Link href="/calendar" className="flex items-center justify-center text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                      View Calendar <ArrowRightIcon className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
