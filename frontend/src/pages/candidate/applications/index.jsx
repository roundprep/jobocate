import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import SEO from '@/components/seo/SEO';
import { getMyApplications, retryApplication, cancelApplication, processApplicationQueue } from '@/services/api';
import { toast } from 'react-toastify';

export default function MyApplications() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [processingId, setProcessingId] = useState(null);
  const [processingQueue, setProcessingQueue] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      const filters = statusFilter !== 'all' ? { status: statusFilter.toUpperCase() } : {};
      const response = await getMyApplications(filters);
      setApplications(response.data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessQueue = async () => {
    setProcessingQueue(true);
    try {
      const response = await processApplicationQueue(10);
      toast.success(`Processed ${response.data.processed} applications!`);
      fetchApplications();
    } catch (error) {
      toast.error(error.message || 'Failed to process queue');
    } finally {
      setProcessingQueue(false);
    }
  };

  const handleRetry = async (applicationId) => {
    setProcessingId(applicationId);
    try {
      await retryApplication(applicationId);
      toast.success('Application queued for retry');
      fetchApplications();
    } catch (error) {
      toast.error(error.message || 'Failed to retry application');
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (applicationId) => {
    if (!confirm('Are you sure you want to cancel this application?')) return;
    
    setProcessingId(applicationId);
    try {
      await cancelApplication(applicationId);
      toast.success('Application cancelled');
      setApplications(apps => apps.filter(app => app._id !== applicationId));
    } catch (error) {
      toast.error(error.message || 'Failed to cancel application');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      QUEUED: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'QUEUED':
        return '⏳';
      case 'PROCESSING':
        return '⚙️';
      case 'COMPLETED':
        return '✅';
      case 'FAILED':
        return '❌';
      default:
        return '📋';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const queuedCount = applications.filter(app => app.status === 'QUEUED').length;

  return (
    <>
      <SEO
        title="My Applications - Application Queue | JobOcate"
        description="Track and manage your job applications powered by AI"
      />
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    My Applications
                  </h1>
                  <p className="text-xl text-gray-600">
                    {applications.length} total application{applications.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {queuedCount > 0 && (
                  <button
                    onClick={handleProcessQueue}
                    disabled={processingQueue}
                    className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-50"
                  >
                    {processingQueue ? 'Processing...' : `Process Queue (${queuedCount})`}
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                {['all', 'queued', 'processing', 'completed', 'failed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      statusFilter === status
                        ? 'bg-orange-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No applications yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Queue applications from your interested jobs to get started
                </p>
                <button
                  onClick={() => router.push('/candidate/interested')}
                  className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
                >
                  View Interested Jobs
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {applications.map((application) => {
                  const job = application.jobId;
                  return (
                    <div
                      key={application._id}
                      className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-gray-900">
                              {job.title}
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(application.status)}`}>
                              {getStatusIcon(application.status)} {application.status}
                            </span>
                          </div>
                          <p className="text-lg text-gray-700 mb-1">
                            {job.companyName}
                          </p>
                          <p className="text-gray-600">
                            {job.location} • {job.jobType}
                          </p>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="mb-4 text-sm text-gray-600">
                        <p>Queued: {new Date(application.queuedAt).toLocaleString()}</p>
                        {application.processedAt && (
                          <p>Processed: {new Date(application.processedAt).toLocaleString()}</p>
                        )}
                        {application.completedAt && (
                          <p>Completed: {new Date(application.completedAt).toLocaleString()}</p>
                        )}
                      </div>

                      {/* Cover Letter Preview */}
                      {application.generatedCoverLetter && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">AI-Generated Cover Letter:</h4>
                          <p className="text-gray-700 text-sm whitespace-pre-wrap line-clamp-4">
                            {application.generatedCoverLetter}
                          </p>
                          <button
                            onClick={() => router.push(`/candidate/applications/${application._id}`)}
                            className="text-orange-600 hover:text-orange-700 text-sm font-medium mt-2"
                          >
                            View Full Letter →
                          </button>
                        </div>
                      )}

                      {/* Error Message */}
                      {application.status === 'FAILED' && application.errorMessage && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <h4 className="font-semibold text-red-900 mb-2">Error:</h4>
                          <p className="text-red-800 text-sm">{application.errorMessage}</p>
                          {application.retryCount > 0 && (
                            <p className="text-red-600 text-xs mt-1">Retry attempts: {application.retryCount}</p>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-4">
                        <button
                          onClick={() => router.push(`/jobs/${job._id}`)}
                          className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          View Job
                        </button>
                        
                        {application.status === 'FAILED' && (
                          <button
                            onClick={() => handleRetry(application._id)}
                            disabled={processingId === application._id}
                            className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
                          >
                            Retry
                          </button>
                        )}
                        
                        {(application.status === 'QUEUED' || application.status === 'FAILED') && (
                          <button
                            onClick={() => handleCancel(application._id)}
                            disabled={processingId === application._id}
                            className="px-6 py-3 bg-red-100 text-red-800 font-semibold rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
