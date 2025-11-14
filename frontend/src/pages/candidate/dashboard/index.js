import DashboardLayout from '@/components/layout/DashboardLayout';
import ProfileCompletionBanner from '@/components/profile/ProfileCompletionBanner';
import { 
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/catalyst/table';
import { Button } from '@/components/catalyst/button';
import { Link } from '@/components/catalyst/link';
import { Badge } from '@/components/catalyst/badge';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const userName = user?.name || 'there';
  const [timePeriod, setTimePeriod] = useState('Last week');
  
  const timePeriods = ['Last week', 'Last two weeks', 'Last month', 'Last quarter'];
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const stats = [
    { 
      id: 1, 
      name: 'Applications sent', 
      value: '12', 
      change: '+4.5%',
      changeType: 'positive'
    },
    { 
      id: 2, 
      name: 'Interviews scheduled', 
      value: '3', 
      change: '+2',
      changeType: 'positive'
    },
    { 
      id: 3, 
      name: 'Jobs saved', 
      value: '8', 
      change: '+3',
      changeType: 'positive'
    },
    { 
      id: 4, 
      name: 'Profile views', 
      value: '24', 
      change: '+21.2%',
      changeType: 'positive'
    },
  ];

  const recentApplications = [
    {
      id: 3000,
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      status: 'In Review',
      date: '2024-05-09',
      salary: '$90,000 - $120,000',
      type: 'Full-time',
      logo: 'TC',
    },
    {
      id: 3001,
      title: 'UI/UX Designer',
      company: 'DesignHub',
      status: 'Interview',
      date: '2024-05-05',
      salary: '$80,000 - $100,000',
      type: 'Full-time',
      logo: 'DH',
    },
    {
      id: 3002,
      title: 'React Developer',
      company: 'WebSolutions',
      status: 'Applied',
      date: '2024-04-28',
      salary: '$85,000 - $110,000',
      type: 'Remote',
      logo: 'WS',
    },
    {
      id: 3003,
      title: 'Full Stack Developer',
      company: 'DevTeam Inc.',
      status: 'In Review',
      date: '2024-04-23',
      salary: '$95,000 - $125,000',
      type: 'Full-time',
      logo: 'DT',
    },
    {
      id: 3004,
      title: 'Frontend Engineer',
      company: 'WebCraft',
      status: 'Interview',
      date: '2024-04-18',
      salary: '$100,000 - $130,000',
      type: 'Full-time',
      logo: 'WC',
    },
    {
      id: 3005,
      title: 'Software Engineer',
      company: 'CodeBase',
      status: 'Applied',
      date: '2024-04-14',
      salary: '$88,000 - $115,000',
      type: 'Remote',
      logo: 'CB',
    },
    {
      id: 3006,
      title: 'Product Designer',
      company: 'DesignStudio',
      status: 'In Review',
      date: '2024-04-10',
      salary: '$85,000 - $105,000',
      type: 'Full-time',
      logo: 'DS',
    },
    {
      id: 3007,
      title: 'Backend Developer',
      company: 'ServerStack',
      status: 'Applied',
      date: '2024-04-06',
      salary: '$92,000 - $120,000',
      type: 'Full-time',
      logo: 'SS',
    },
    {
      id: 3008,
      title: 'DevOps Engineer',
      company: 'CloudTech',
      status: 'Interview',
      date: '2024-04-03',
      salary: '$110,000 - $140,000',
      type: 'Remote',
      logo: 'CT',
    },
    {
      id: 3009,
      title: 'Mobile Developer',
      company: 'AppWorks',
      status: 'In Review',
      date: '2024-03-29',
      salary: '$90,000 - $118,000',
      type: 'Full-time',
      logo: 'AW',
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusBadge = (status) => {
    const styles = {
      'In Review': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
      'Interview': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
      'Applied': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    };
    return styles[status] || styles['Applied'];
  };

  return (
    <DashboardLayout>
      <div className="py-8">
        <ProfileCompletionBanner />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
            {getGreeting()}, {userName}
          </h1>
        </div>

        {/* Time Period Selector */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            {timePeriods.map((period) => (
              <Button
                key={period}
                onClick={() => setTimePeriod(period)}
                color={timePeriod === period ? 'dark/zinc' : undefined}
                outline={timePeriod !== period}
                plain={timePeriod !== period}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>

        {/* Overview Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-white mb-6">Overview</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div 
                key={stat.id} 
                className="rounded-lg border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900"
              >
                <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                  {stat.name}
                </dt>
                <dd className="flex items-baseline justify-between">
                  <div className="text-2xl font-semibold text-zinc-950 dark:text-white">
                    {stat.value}
                  </div>
                  <div className={`flex items-baseline text-sm font-semibold ${
                    stat.changeType === 'positive' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.changeType === 'positive' ? (
                      <ArrowUpIcon className="h-4 w-4 mr-0.5" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 mr-0.5" />
                    )}
                    {stat.change}
                  </div>
                </dd>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  from {timePeriod.toLowerCase()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications Table */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-white mb-4">Recent applications</h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Application</TableHeader>
                <TableHeader>Company</TableHeader>
                <TableHeader>Position</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Salary</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentApplications.slice(0, 5).map((application) => (
                <TableRow key={application.id} href={`/candidate/applications/${application.id}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-semibold text-sm">
                        {application.logo}
                      </div>
                      <div>
                        <div className="text-sm font-medium">#{application.id}</div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">{formatDate(application.date)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{application.company}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{application.title}</div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">{application.type}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge color={application.status === 'Interview' ? 'blue' : application.status === 'In Review' ? 'yellow' : 'zinc'}>
                      {application.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{application.salary}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Link href="/candidate/applications" className="text-sm font-medium text-sky-600 dark:text-sky-400">
              View all applications →
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
