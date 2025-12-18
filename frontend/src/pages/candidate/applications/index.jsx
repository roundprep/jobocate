import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { API_URL } from '@/config/api';

const STATUSES = {
  pending: { label: 'Applied', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  submitted: { label: 'Submitted', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  reviewing: { label: 'Reviewing', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  interviewed: { label: 'Interviewed', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
};

export default function ApplicationsDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, [statusFilter, searchQuery]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const params = new URLSearchParams();
      if (statusFilter.length > 0) {
        statusFilter.forEach(status => params.append('status', status));
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`${API_URL}/api/job-tracker/applications?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/job-tracker/applications/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const groupedByStatus = applications.reduce((acc, app) => {
    const status = app.status || 'pending';
    if (!acc[status]) acc[status] = [];
    acc[status].push(app);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Applications</h1>
            <button
              onClick={() => router.push('/candidate/job-tracker/ingest')}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Add Job
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800">
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Total</div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.total}</div>
              </div>
              {Object.entries(stats.byStatus || {}).slice(0, 3).map(([status, count]) => (
                <div key={status} className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">{STATUSES[status]?.label || status}</div>
                  <div className="text-2xl font-bold text-zinc-900 dark:text-white">{count}</div>
                </div>
              ))}
            </div>
          )}

          {/* Filters and View Toggle */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-lg ${viewMode === 'kanban' ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Kanban View */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-6 gap-4 overflow-x-auto">
            {Object.keys(STATUSES).map((status) => (
              <div key={status} className="min-w-[280px]">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">
                    {STATUSES[status].label}
                  </h3>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {(groupedByStatus[status] || []).length}
                  </span>
                </div>
                <div className="space-y-3">
                  {(groupedByStatus[status] || []).map((app) => (
                    <ApplicationCard
                      key={app._id}
                      application={app}
                      onClick={() => router.push(`/candidate/applications/${app._id}`)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {applications.map((app) => (
                <ApplicationListItem
                  key={app._id}
                  application={app}
                  onClick={() => router.push(`/candidate/applications/${app._id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ApplicationCard({ application, onClick }) {
  const job = application.jobId || {};
  const status = application.status || 'pending';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <h4 className="font-semibold text-zinc-900 dark:text-white mb-1">{job.title || 'Untitled'}</h4>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{job.companyName || 'Unknown'}</p>
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full ${STATUSES[status]?.color || ''}`}>
          {STATUSES[status]?.label || status}
        </span>
        {application.matchScore && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {application.matchScore}% match
          </span>
        )}
      </div>
    </motion.div>
  );
}

function ApplicationListItem({ application, onClick }) {
  const job = application.jobId || {};
  const status = application.status || 'pending';

  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
      onClick={onClick}
      className="p-4 cursor-pointer flex items-center justify-between"
    >
      <div className="flex-1">
        <h4 className="font-semibold text-zinc-900 dark:text-white">{job.title || 'Untitled'}</h4>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{job.companyName || 'Unknown'} • {job.location || 'N/A'}</p>
      </div>
      <div className="flex items-center gap-4">
        {application.matchScore && (
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {application.matchScore}% match
          </span>
        )}
        <span className={`text-xs px-3 py-1 rounded-full ${STATUSES[status]?.color || ''}`}>
          {STATUSES[status]?.label || status}
        </span>
      </div>
    </motion.div>
  );
}
