import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { interviewApi } from '@/lib/interview-api';
import { resumeApi } from '@/lib/resume-api';
import { API_URL } from '@/config/api';
import { toast } from 'react-toastify';
import {
  MicrophoneIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  PlayIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ClipboardDocumentIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const MODES = [
  {
    id: 'PRACTICE',
    name: 'Practice Mode',
    description: 'Mock interviews with mic capture, real-time transcription, and AI coaching',
    icon: MicrophoneIcon,
    color: 'primary',
  },
  {
    id: 'CONSENT',
    name: 'Consent Mode',
    description: 'Same as Practice, but with explicit permission confirmation and visible indicator',
    icon: ShieldCheckIcon,
    color: 'accent',
  },
  {
    id: 'LIVE_NOTES',
    name: 'Live Notes Mode',
    description: 'No audio capture; manually type interviewer questions and receive structured coaching',
    icon: DocumentTextIcon,
    color: 'primary',
  },
];

const ROLE_FAMILIES = [
  { id: 'SWE_BACKEND', name: 'Software Engineering (Backend)' },
  { id: 'DEVOPS_CLOUD', name: 'DevOps / Cloud' },
  { id: 'PM', name: 'Product Management' },
  { id: 'DATA', name: 'Data Science / Analytics' },
];

const SENIORITY_LEVELS = [
  { id: 'INTERN', name: 'Intern' },
  { id: 'JUNIOR', name: 'Junior' },
  { id: 'MID', name: 'Mid-level' },
  { id: 'SENIOR', name: 'Senior' },
  { id: 'STAFF', name: 'Staff' },
  { id: 'PRINCIPAL', name: 'Principal' },
  { id: 'MANAGER', name: 'Manager' },
];

const INTERVIEW_TYPES = [
  { id: 'BEHAVIORAL', name: 'Behavioral' },
  { id: 'TECHNICAL', name: 'Technical' },
  { id: 'SYSTEM_DESIGN', name: 'System Design' },
  { id: 'CODING', name: 'Coding' },
  { id: 'CASE', name: 'Case Study' },
  { id: 'MIXED', name: 'Mixed' },
];

export default function InterviewBuddyWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  
  // Form state
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [pastedJD, setPastedJD] = useState('');
  const [showPasteJD, setShowPasteJD] = useState(false);
  const [roleTitle, setRoleTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [roleFamily, setRoleFamily] = useState('SWE_BACKEND');
  const [seniority, setSeniority] = useState('MID');
  const [interviewType, setInterviewType] = useState('MIXED');
  const [selectedMode, setSelectedMode] = useState(null);
  const [jobSearchQuery, setJobSearchQuery] = useState('');

  useEffect(() => {
    loadResumes();
    loadJobs();
  }, []);

  const loadResumes = async () => {
    try {
      const data = await resumeApi.getAll();
      // Backend returns array directly, not wrapped in object
      const resumesArray = Array.isArray(data) ? data : (data.resumes || []);
      setResumes(resumesArray);
    } catch (error) {
      console.error('Failed to load resumes:', error);
      toast.error('Failed to load resumes');
    }
  };

  const loadJobs = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/api/job-tracker/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        const uniqueJobs = [];
        const jobIds = new Set();
        (data.applications || []).forEach((app) => {
          if (app.jobId && !jobIds.has(app.jobId._id || app.jobId)) {
            jobIds.add(app.jobId._id || app.jobId);
            uniqueJobs.push({
              _id: app.jobId._id || app.jobId,
              title: app.jobId?.title || app.job?.title || 'Unknown',
              companyName: app.jobId?.companyName || app.job?.companyName || 'Unknown',
            });
          }
        });
        setJobs(uniqueJobs);
      }
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }
  };

  const handleCreateSession = async () => {
    if (!selectedMode) {
      toast.error('Please select a mode');
      return;
    }

    if (!selectedResume && selectedJobs.length === 0 && !pastedJD.trim()) {
      toast.error('Please select a resume or provide at least one job description');
      return;
    }

    if (!roleTitle.trim()) {
      toast.error('Please enter a role title');
      return;
    }

    setLoading(true);
    try {
      const sessionData = {
        mode: selectedMode,
        resumeVersionId: selectedResume?.id || selectedResume?._id,
        jobDescriptionIds: selectedJobs.map((j) => j._id || j.id),
        pastedJD: pastedJD.trim() || undefined,
        roleTitle: roleTitle.trim(),
        companyName: companyName.trim() || undefined,
        roleFamily,
        seniority,
        interviewType,
        skipRequirements: false,
      };

      const session = await interviewApi.createSession(sessionData);
      toast.success('Session created successfully!');
      
      router.push(`/candidate/interview-buddy/session/${session._id}`);
    } catch (error) {
      console.error('Failed to create session:', error);
      toast.error(error.message || 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  const toggleJobSelection = (job) => {
    setSelectedJobs((prev) => {
      const exists = prev.find((j) => j._id === job._id);
      if (exists) {
        return prev.filter((j) => j._id !== job._id);
      }
      return [...prev, job];
    });
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
    job.companyName.toLowerCase().includes(jobSearchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <Head>
        <title>Interview Buddy - Jobocate</title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2 font-display">
              Interview Buddy
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Practice interviews with AI coaching and real-time feedback
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              {/* Background connector line */}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-zinc-200 dark:bg-zinc-800 z-0" />
              
              {[
                { num: 1, label: 'Setup', desc: 'Resume & Job' },
                { num: 2, label: 'Configure', desc: 'Role & Type' },
                { num: 3, label: 'Mode', desc: 'Select Mode' },
              ].map((s, index) => {
                const isActive = step === s.num;
                const isCompleted = step > s.num;
                const isUpcoming = step < s.num;
                
                return (
                  <div key={s.num} className="flex flex-col items-center flex-1 relative z-10">
                    {/* Step Circle */}
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                        isActive
                          ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30 scale-110'
                          : isCompleted
                          ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-zinc-300 dark:border-zinc-700 text-zinc-400 bg-white dark:bg-zinc-800'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircleIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      ) : (
                        <span className={`font-bold text-sm ${isActive ? 'text-white' : ''}`}>
                          {s.num}
                        </span>
                      )}
                    </div>
                    
                    {/* Step Label */}
                    <div className="mt-3 text-center">
                      <div
                        className={`text-sm font-semibold transition-colors ${
                          isActive
                            ? 'text-primary-600 dark:text-primary-400'
                            : isCompleted
                            ? 'text-zinc-700 dark:text-zinc-300'
                            : 'text-zinc-500 dark:text-zinc-500'
                        }`}
                      >
                        {s.label}
                      </div>
                      <div
                        className={`text-xs mt-0.5 transition-colors ${
                          isActive
                            ? 'text-primary-500 dark:text-primary-500'
                            : 'text-zinc-400 dark:text-zinc-500'
                        }`}
                      >
                        {s.desc}
                      </div>
                    </div>
                    
                    {/* Progress line to next step */}
                    {index < 2 && (
                      <div className="absolute top-6 left-[60%] right-[-40%] h-0.5 z-0">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isCompleted
                              ? 'bg-primary-500'
                              : 'bg-zinc-200 dark:bg-zinc-800'
                          }`}
                          style={{
                            width: isCompleted ? '100%' : isActive ? '50%' : '0%',
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 1: Resume & Job Selection */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-8"
              >
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-6">
                  Select Resume & Job Description
                </h2>

                {/* Resume Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2.5 uppercase tracking-wider">
                    Resume (Optional if job description provided)
                  </label>
                  {resumes.length === 0 ? (
                    <div className="p-4 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl text-center">
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">No resumes found. Create one in the Resume Builder.</p>
                    </div>
                  ) : (
                    <select
                      value={selectedResume?.id || selectedResume?._id || ''}
                      onChange={(e) => {
                        const resumeId = e.target.value;
                        if (resumeId) {
                          const resume = resumes.find((r) => (r.id || r._id) === resumeId);
                          setSelectedResume(resume || null);
                        } else {
                          setSelectedResume(null);
                        }
                      }}
                      className="w-full h-14 px-4 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white transition-all duration-200 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 hover:border-zinc-400 dark:hover:border-zinc-600"
                    >
                      <option value="">Select a resume (optional)</option>
                      {resumes.map((resume) => (
                        <option key={resume.id || resume._id} value={resume.id || resume._id}>
                          {resume.name || 'Untitled Resume'}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Job Selection */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                      Job Description
                    </label>
                    <button
                      onClick={() => setShowPasteJD(!showPasteJD)}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
                    >
                      <ClipboardDocumentIcon className="w-4 h-4" />
                      {showPasteJD ? 'Select from tracker' : 'Paste JD text'}
                    </button>
                  </div>

                  {showPasteJD ? (
                    <div>
                      <textarea
                        value={pastedJD}
                        onChange={(e) => setPastedJD(e.target.value)}
                        placeholder="Paste job description text here..."
                        rows={8}
                        className="w-full px-4 py-3 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all duration-200 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 hover:border-zinc-400 dark:hover:border-zinc-600 resize-none"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="relative mb-4">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                          type="text"
                          placeholder="Search jobs from your tracker..."
                          value={jobSearchQuery}
                          onChange={(e) => setJobSearchQuery(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all duration-200 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 hover:border-zinc-400 dark:hover:border-zinc-600"
                        />
                      </div>
                      {jobs.length === 0 ? (
                        <div className="p-6 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl text-center">
                          <p className="text-zinc-500 dark:text-zinc-400">No jobs in your tracker. Add jobs to your application tracker first.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                          {filteredJobs.length === 0 ? (
                            <p className="text-center text-zinc-500 dark:text-zinc-400 py-4">No jobs found matching your search.</p>
                          ) : (
                            filteredJobs.map((job) => {
                              const isSelected = selectedJobs.some((j) => j._id === job._id);
                              return (
                                <button
                                  key={job._id}
                                  onClick={() => toggleJobSelection(job)}
                                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                                    isSelected
                                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-sm'
                                      : 'border-zinc-200 dark:border-zinc-700 hover:border-primary-300 dark:hover:border-primary-700 bg-white dark:bg-zinc-900'
                                  }`}
                                >
                                  <div className="font-semibold text-zinc-900 dark:text-white">
                                    {job.title}
                                  </div>
                                  <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                    {job.companyName}
                                  </div>
                                </button>
                              );
                            })
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedResume && selectedJobs.length === 0 && !pastedJD.trim()}
                    className="px-8 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    Next
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Role Configuration */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-8"
              >
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-6">
                  Configure Role & Interview Type
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2.5 uppercase tracking-wider">
                      Role Title *
                    </label>
                    <input
                      type="text"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full h-14 px-4 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all duration-200 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 hover:border-zinc-400 dark:hover:border-zinc-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2.5 uppercase tracking-wider">
                      Company Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="w-full h-14 px-4 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all duration-200 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 hover:border-zinc-400 dark:hover:border-zinc-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2.5 uppercase tracking-wider">
                        Role Family
                      </label>
                      <select
                        value={roleFamily}
                        onChange={(e) => setRoleFamily(e.target.value)}
                        className="w-full h-14 px-4 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white transition-all duration-200 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 hover:border-zinc-400 dark:hover:border-zinc-600"
                      >
                        {ROLE_FAMILIES.map((rf) => (
                          <option key={rf.id} value={rf.id}>
                            {rf.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2.5 uppercase tracking-wider">
                        Seniority Level
                      </label>
                      <select
                        value={seniority}
                        onChange={(e) => setSeniority(e.target.value)}
                        className="w-full h-14 px-4 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white transition-all duration-200 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 hover:border-zinc-400 dark:hover:border-zinc-600"
                      >
                        {SENIORITY_LEVELS.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2.5 uppercase tracking-wider">
                        Interview Type
                      </label>
                      <select
                        value={interviewType}
                        onChange={(e) => setInterviewType(e.target.value)}
                        className="w-full h-14 px-4 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white transition-all duration-200 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 hover:border-zinc-400 dark:hover:border-zinc-600"
                      >
                        {INTERVIEW_TYPES.map((it) => (
                          <option key={it.id} value={it.id}>
                            {it.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 font-semibold transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!roleTitle.trim()}
                    className="px-8 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    Next
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Mode Selection */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-8"
              >
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-6">
                  Select Interview Mode
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {MODES.map((mode) => {
                    const Icon = mode.icon;
                    const isSelected = selectedMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setSelectedMode(mode.id)}
                        className={`p-6 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg shadow-primary-500/10'
                            : 'border-zinc-200 dark:border-zinc-700 hover:border-primary-300 dark:hover:border-primary-700 bg-white dark:bg-zinc-900'
                        }`}
                      >
                        <Icon
                          className={`w-10 h-10 mb-4 transition-colors ${
                            isSelected
                              ? 'text-primary-500'
                              : 'text-zinc-400 dark:text-zinc-500'
                          }`}
                        />
                        <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-2">
                          {mode.name}
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {mode.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 font-semibold transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCreateSession}
                    disabled={!selectedMode || loading}
                    className="px-8 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <PlayIcon className="w-5 h-5" />
                        Start Session
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
