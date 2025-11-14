'use client'

import { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config/api';
import { 
  SparklesIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  CameraIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/catalyst/button';
import { Field, FieldGroup, Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { Textarea } from '@/components/catalyst/textarea';
import { Badge } from '@/components/catalyst/badge';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/catalyst/table';
import { Checkbox, CheckboxField } from '@/components/catalyst/checkbox';
import { toast } from 'react-toastify';
import RichTextEditor from '@/components/resume/RichTextEditor';
import ResumeStepper from '@/components/resume/ResumeStepper';
import TemplateSettings from '@/components/resume/TemplateSettings';
import { 
  PhotoIcon,
  UserIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  TrophyIcon,
  UserGroupIcon,
  PaintBrushIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  LightBulbIcon,
  FolderIcon,
  BookOpenIcon,
  PuzzlePieceIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// Import template images - these will be used once images are added to the assets folder
// For now, we'll use a fallback system that shows placeholders if images don't exist
// To add images: Extract images from PDF and save them as:
// - frontend/src/assets/resume-templates/modern.png
// - frontend/src/assets/resume-templates/professional.png
// - frontend/src/assets/resume-templates/creative.png
// - frontend/src/assets/resume-templates/minimal.png
// - frontend/src/assets/resume-templates/executive.png
// - frontend/src/assets/resume-templates/ats-friendly.png

const WIZARD_STEPS = {
  TEMPLATE: 'template',
  UPLOAD_OR_NEW: 'upload-or-new',
  EDITOR: 'editor', // New unified editor with tabs
  PERSONAL: 'personal',
  SUMMARY: 'summary',
  SKILLS: 'skills',
  EXPERIENCE: 'experience',
  EDUCATION: 'education',
  CERTIFICATIONS: 'certifications',
  REFERENCES: 'references',
  COMPLETE: 'complete',
};

const EDITOR_TABS = {
  OVERVIEW: 'overview',
  CONTENT: 'content',
  CUSTOMIZE: 'customize',
  LINKS: 'links',
};

// Template images configuration
// To add images: Extract images from PDF and save them to:
// frontend/public/resume-templates/modern.png (or .jpg, .webp)
// Then update the preview paths below
const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, contemporary design perfect for tech and creative roles',
    preview: '/resume-templates/modern.png', // Path in public folder
    color: 'blue',
    category: 'Popular',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Traditional, formal layout ideal for corporate positions',
    preview: '/resume-templates/professional.png',
    color: 'zinc',
    category: 'Classic',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and unique design for designers and artists',
    preview: '/resume-templates/creative.png',
    color: 'purple',
    category: 'Creative',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant, focuses on content',
    preview: '/resume-templates/minimal.png',
    color: 'gray',
    category: 'Simple',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated layout for senior positions',
    preview: '/resume-templates/executive.png',
    color: 'indigo',
    category: 'Executive',
  },
  {
    id: 'ats-friendly',
    name: 'ATS Friendly',
    description: 'Optimized for applicant tracking systems',
    preview: '/resume-templates/ats-friendly.png',
    color: 'green',
    category: 'ATS',
  },
];

export default function AIResumeBuilder() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(WIZARD_STEPS.TEMPLATE);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [uploadMethod, setUploadMethod] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResume, setCurrentResume] = useState(null);
  const [showPreviousResumes, setShowPreviousResumes] = useState(false);
  const [previousResumes, setPreviousResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  const [resumeData, setResumeData] = useState({
    name: 'My Resume',
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    photo: '', // Photo URL
    summary: '',
    profileSummary: '', // Profile Summary section
    skills: [],
    technicalSkills: [], // Separate technical skills
    experience: [],
    education: [],
    certifications: [],
    references: [], // Professional references
    projects: [],
    languages: [],
    interests: [],
    courses: [],
    awards: [],
    organizations: [],
    publications: [],
    declaration: '',
    custom: [],
  });

  // Template customization
  const [templateSettings, setTemplateSettings] = useState({
    colorScheme: 'blue', // blue, green, purple, orange, red, indigo
    fontFamily: 'inter', // inter, roboto, playfair, lato, montserrat
    fontSize: 'medium', // small, medium, large
  });
  
  const [showTemplateSettings, setShowTemplateSettings] = useState(false);
  const [currentEditorStep, setCurrentEditorStep] = useState('personal');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [activeTab, setActiveTab] = useState(EDITOR_TABS.CONTENT);
  const [editingSection, setEditingSection] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null); // Track which index is being edited
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [selectedBlockType, setSelectedBlockType] = useState(null);
  const [showResumeNameModal, setShowResumeNameModal] = useState(false);
  const [resumeNameInput, setResumeNameInput] = useState('');
  const [addedSections, setAddedSections] = useState(['personal']); // Only personal info by default
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    summary: false,
    profileSummary: false,
    skills: false,
    experience: false,
    education: false,
    certifications: false,
    references: false,
    languages: false,
    interests: false,
    projects: false,
    courses: false,
    awards: false,
    organizations: false,
    publications: false,
    declaration: false,
    custom: false,
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [currentTechnicalSkill, setCurrentTechnicalSkill] = useState('');
  const [currentExperience, setCurrentExperience] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    responsibilities: '', // Rich text
  });
  const [currentEducation, setCurrentEducation] = useState({
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    gpa: '',
    description: '',
  });
  const [currentCertification, setCurrentCertification] = useState({
    name: '',
    issuer: '',
    date: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
  });
  const [currentReference, setCurrentReference] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    relationship: '',
  });
  const [currentLanguage, setCurrentLanguage] = useState({
    language: '',
    proficiency: 'Native',
  });
  const [currentProject, setCurrentProject] = useState({
    name: '',
    description: '',
    technologies: '',
    url: '',
    startDate: '',
    endDate: '',
  });
  const [currentInterest, setCurrentInterest] = useState('');
  const [currentCourse, setCurrentCourse] = useState({
    name: '',
    provider: '',
    date: '',
    certificateUrl: '',
  });
  const [currentAward, setCurrentAward] = useState({
    title: '',
    issuer: '',
    date: '',
    description: '',
  });
  const [currentOrganization, setCurrentOrganization] = useState({
    name: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  const [currentPublication, setCurrentPublication] = useState({
    title: '',
    publisher: '',
    date: '',
    url: '',
    description: '',
  });
  const [currentCustom, setCurrentCustom] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    fetchPreviousResumes();
  }, []);

  useEffect(() => {
    if (user && currentResume && (
      currentStep === WIZARD_STEPS.PERSONAL || 
      currentStep === WIZARD_STEPS.SUMMARY ||
      currentStep === WIZARD_STEPS.SKILLS ||
      currentStep === WIZARD_STEPS.EXPERIENCE ||
      currentStep === WIZARD_STEPS.EDUCATION
    )) {
      setResumeData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        location: prev.location || user.location || '',
        summary: prev.summary || user.summary || '',
        skills: prev.skills.length > 0 ? prev.skills : (user.skills || []),
        experience: prev.experience.length > 0 ? prev.experience : (user.experience || []),
        education: prev.education.length > 0 ? prev.education : (user.education || []),
      }));
    }
  }, [user, currentStep, currentResume]);
  
  // Update currentEditorStep when currentStep changes
  useEffect(() => {
    if ([
      WIZARD_STEPS.PERSONAL,
      WIZARD_STEPS.SUMMARY,
      WIZARD_STEPS.SKILLS,
      WIZARD_STEPS.EXPERIENCE,
      WIZARD_STEPS.EDUCATION,
      WIZARD_STEPS.CERTIFICATIONS,
      WIZARD_STEPS.REFERENCES,
    ].includes(currentStep)) {
      setCurrentEditorStep(currentStep);
    }
  }, [currentStep]);

  // Helper function to determine which sections should be added based on resume data
  const determineAddedSections = (data) => {
    const sections = ['personal']; // Always include personal
    
    // Check each section for data
    if (data.summary && data.summary.trim()) sections.push('summary');
    if (data.profileSummary && data.profileSummary.trim()) sections.push('profileSummary');
    if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) sections.push('skills');
    if (data.experience && Array.isArray(data.experience) && data.experience.length > 0) sections.push('experience');
    if (data.education && Array.isArray(data.education) && data.education.length > 0) sections.push('education');
    if (data.certifications && Array.isArray(data.certifications) && data.certifications.length > 0) sections.push('certifications');
    if (data.references && Array.isArray(data.references) && data.references.length > 0) sections.push('references');
    if (data.languages && Array.isArray(data.languages) && data.languages.length > 0) sections.push('languages');
    if (data.interests && Array.isArray(data.interests) && data.interests.length > 0) sections.push('interests');
    if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) sections.push('projects');
    if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) sections.push('courses');
    if (data.awards && Array.isArray(data.awards) && data.awards.length > 0) sections.push('awards');
    if (data.organizations && Array.isArray(data.organizations) && data.organizations.length > 0) sections.push('organizations');
    if (data.publications && Array.isArray(data.publications) && data.publications.length > 0) sections.push('publications');
    if (data.declaration && data.declaration.trim()) sections.push('declaration');
    if (data.custom && Array.isArray(data.custom) && data.custom.length > 0) sections.push('custom');
    
    return sections;
  };

  const fetchPreviousResumes = async () => {
    setLoadingResumes(true);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/resume-builder`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPreviousResumes(data);
      }
    } catch (error) {
      console.error('Error fetching previous resumes:', error);
    } finally {
      setLoadingResumes(false);
    }
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    setCurrentStep(WIZARD_STEPS.UPLOAD_OR_NEW);
  };

  const handleMethodSelect = (method) => {
    setUploadMethod(method);
    // Don't auto-create, let user proceed manually
  };

  const handleFileUpload = async () => {
    if (!resumeFile || !selectedTemplate) {
      toast.error('Please select a file and template');
      return;
    }

    // Show modal to get resume name if not already provided
    if (!resumeNameInput.trim()) {
      setShowResumeNameModal(true);
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('template', selectedTemplate);
      formData.append('name', resumeNameInput.trim() || 'My Resume');

      const response = await fetch(`${API_URL}/api/resume-builder/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentResume(data);
        
        const resumeDataToSet = {
          name: data.name || resumeNameInput.trim() || 'My Resume',
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          website: data.website || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          summary: data.summary || '',
          profileSummary: data.profileSummary || '',
          skills: data.skills || [],
          experience: data.experience || [],
          education: data.education || [],
          certifications: data.certifications || [],
          references: data.references || [],
          projects: data.projects || [],
          languages: data.languages || [],
          interests: data.interests || [],
          courses: data.courses || [],
          awards: data.awards || [],
          organizations: data.organizations || [],
          publications: data.publications || [],
          declaration: data.declaration || '',
          custom: data.custom || [],
        };
        
        setResumeData(resumeDataToSet);
        
        // Determine which sections should be added based on the loaded data
        const sectionsToAdd = determineAddedSections(resumeDataToSet);
        setAddedSections(sectionsToAdd);
        
        setShowResumeNameModal(false);
        setResumeNameInput('');
        setCurrentStep(WIZARD_STEPS.EDITOR);
        toast.success('Resume uploaded and parsed successfully!');
        // Refresh previous resumes list
        fetchPreviousResumes();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to upload resume');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Error uploading resume');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateNew = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a template');
      return;
    }

    // Show modal to get resume name
    if (!resumeNameInput.trim()) {
      setShowResumeNameModal(true);
      return;
    }

    setIsGenerating(true);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to create a resume');
        setIsGenerating(false);
        return;
      }

      const requestBody = {
        template: selectedTemplate,
        name: resumeNameInput.trim() || 'My Resume',
        importFromProfile: true,
      };

      console.log('Creating resume with:', { template: selectedTemplate, name: requestBody.name });
      console.log('API URL:', `${API_URL}/api/resume-builder`);

      const response = await fetch(`${API_URL}/api/resume-builder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status, response.statusText);

      if (response.ok) {
        let data;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            data = await response.json();
            console.log('Resume data received:', data);
          } else {
            const responseText = await response.text();
            console.error('Unexpected content type. Response:', responseText);
            throw new Error('Server returned non-JSON response');
          }
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          throw new Error('Invalid response from server');
        }

        // Handle both _id and id formats from backend
        const resumeId = data._id || data.id;
        console.log('Resume created with ID:', resumeId);
        
        setCurrentResume({
          ...data,
          id: resumeId,
          _id: resumeId,
        });
        const resumeDataToSet = {
          name: data.name || resumeNameInput.trim() || 'My Resume',
          fullName: data.fullName || user?.name || '',
          email: data.email || user?.email || '',
          phone: data.phone || user?.phone || '',
          location: data.location || user?.location || '',
          website: data.website || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          summary: data.summary || user?.summary || '',
          profileSummary: data.profileSummary || '',
          skills: data.skills || user?.skills || [],
          experience: data.experience || user?.experience || [],
          education: data.education || user?.education || [],
          certifications: data.certifications || [],
          references: data.references || [],
          projects: data.projects || [],
          languages: data.languages || [],
          interests: data.interests || [],
          courses: data.courses || [],
          awards: data.awards || [],
          organizations: data.organizations || [],
          publications: data.publications || [],
          declaration: data.declaration || '',
          custom: data.custom || [],
        };
        
        setResumeData(resumeDataToSet);
        
        // Determine which sections should be added based on the loaded data
        const sectionsToAdd = determineAddedSections(resumeDataToSet);
        setAddedSections(sectionsToAdd);
        
        setShowResumeNameModal(false);
        setResumeNameInput('');
        setCurrentStep(WIZARD_STEPS.EDITOR);
        toast.success('Resume created successfully!');
        // Refresh previous resumes list
        fetchPreviousResumes();
      } else {
        let errorMessage = 'Failed to create resume';
        try {
          const responseText = await response.text();
          console.error('Error response text:', responseText);
          if (responseText) {
            try {
              const errorData = JSON.parse(responseText);
              errorMessage = errorData.message || errorData.error || errorMessage;
              if (errorData.errors) {
                // Handle validation errors
                const validationErrors = Array.isArray(errorData.errors) 
                  ? errorData.errors.join(', ')
                  : Object.values(errorData.errors).flat().join(', ');
                errorMessage = validationErrors || errorMessage;
              }
            } catch (parseError) {
              // Response is not JSON, use as-is
              errorMessage = responseText || errorMessage;
            }
          }
        } catch (e) {
          // If we can't read the response, use status text
          errorMessage = response.statusText || errorMessage;
          console.error('Error reading error response:', e);
        }
        console.error('Error response:', response.status, errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating resume:', error);
      toast.error(error.message || 'Error creating resume. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateSection = async (section) => {
    if (!currentResume) return;

    setIsGenerating(true);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/resume-builder/${currentResume._id || currentResume.id}/regenerate-section`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ section }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (section === 'summary') {
          setResumeData(prev => ({ ...prev, summary: data.content }));
        } else if (section === 'profileSummary') {
          setResumeData(prev => ({ ...prev, profileSummary: data.content }));
        } else if (section === 'skills') {
          const skills = data.content.split(',').map(s => s.trim()).filter(Boolean);
          setResumeData(prev => ({ ...prev, skills }));
        }
        
        toast.success(`${section} regenerated successfully!`);
      } else {
        const error = await response.json();
        toast.error(error.message || `Failed to regenerate ${section}`);
      }
    } catch (error) {
      console.error(`Error regenerating ${section}:`, error);
      toast.error(`Error regenerating ${section}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!currentResume) {
      toast.error('No resume to save');
      return;
    }

    setIsGenerating(true);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/resume-builder/${currentResume._id || currentResume.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(resumeData),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentResume(data);
        toast.success('Resume saved successfully!');
        // Stay in editor, don't redirect to complete
        // Refresh previous resumes list
        fetchPreviousResumes();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save resume');
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error('Error saving resume');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!currentResume) return;

    setIsGenerating(true);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/resume-builder/${currentResume._id || currentResume.id}/generate-pdf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentResume(prev => ({ ...prev, pdfUrl: data.pdfUrl }));
        toast.success('PDF generated successfully!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error generating PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewPDF = async () => {
    if (!currentResume) return;

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const resumeId = currentResume._id || currentResume.id;
      const pdfUrl = `${API_URL}/api/resume-builder/${resumeId}/pdf`;

      const response = await fetch(pdfUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      // Clean up the blob URL after a delay
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Error viewing PDF:', error);
      toast.error('Failed to view PDF. Please try again.');
    }
  };

  const handleDownloadPDF = async () => {
    if (!currentResume) return;

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const resumeId = currentResume._id || currentResume.id;
      const pdfUrl = `${API_URL}/api/resume-builder/${resumeId}/pdf`;

      const response = await fetch(pdfUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${resumeId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    }
  };

  const handleDeleteResume = async (id) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/resume-builder/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setPreviousResumes(prev => prev.filter(resume => (resume.id || resume._id) !== id));
        toast.success('Resume deleted successfully');
        // If we deleted the current resume, reset
        if (currentResume && (currentResume._id === id || currentResume.id === id)) {
          setCurrentResume(null);
          setCurrentStep(WIZARD_STEPS.TEMPLATE);
        }
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete resume');
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Error deleting resume');
    }
  };

  const handleEditResume = async (resume) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const resumeId = resume.id || resume._id;
      const response = await fetch(`${API_URL}/api/resume-builder/${resumeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentResume(data);
        setSelectedTemplate(data.template);
        
        const resumeDataToSet = {
          name: data.name || 'My Resume',
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          website: data.website || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          summary: data.summary || '',
          profileSummary: data.profileSummary || '',
          skills: data.skills || [],
          experience: data.experience || [],
          education: data.education || [],
          certifications: data.certifications || [],
          references: data.references || [],
          projects: data.projects || [],
          languages: data.languages || [],
          interests: data.interests || [],
          courses: data.courses || [],
          awards: data.awards || [],
          organizations: data.organizations || [],
          publications: data.publications || [],
          declaration: data.declaration || '',
          custom: data.custom || [],
        };
        
        setResumeData(resumeDataToSet);
        
        // Determine which sections should be added based on the loaded data
        const sectionsToAdd = determineAddedSections(resumeDataToSet);
        setAddedSections(sectionsToAdd);
        
        // Expand sections that have data
        const expandedToSet = {
          personal: true,
          summary: !!data.summary,
          profileSummary: !!data.profileSummary,
          skills: (data.skills && data.skills.length > 0),
          experience: (data.experience && data.experience.length > 0),
          education: (data.education && data.education.length > 0),
          certifications: (data.certifications && data.certifications.length > 0),
          references: (data.references && data.references.length > 0),
          languages: (data.languages && data.languages.length > 0),
          interests: (data.interests && data.interests.length > 0),
          projects: (data.projects && data.projects.length > 0),
          courses: (data.courses && data.courses.length > 0),
          awards: (data.awards && data.awards.length > 0),
          organizations: (data.organizations && data.organizations.length > 0),
          publications: (data.publications && data.publications.length > 0),
          declaration: !!data.declaration,
          custom: (data.custom && data.custom.length > 0),
        };
        setExpandedSections(expandedToSet);
        
        setCurrentStep(WIZARD_STEPS.EDITOR);
        setShowPreviousResumes(false);
        toast.success('Resume loaded for editing');
      } else {
        toast.error('Failed to load resume');
      }
    } catch (error) {
      console.error('Error loading resume:', error);
      toast.error('Error loading resume');
    }
  };

  const handleViewResumePDF = async (resume) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const resumeId = resume.id || resume._id;
      const pdfUrl = `${API_URL}/api/resume-builder/${resumeId}/pdf`;

      const response = await fetch(pdfUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Error viewing PDF:', error);
      toast.error('Failed to view PDF. Please try again.');
    }
  };

  const addExperience = () => {
    if (!currentExperience.title || !currentExperience.company) {
      toast.error('Please fill in title and company');
      return;
    }
    setResumeData(prev => ({
      ...prev,
      experience: [...(prev.experience || []), { ...currentExperience }],
    }));
    setCurrentExperience({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      responsibilities: '',
    });
    toast.success('Experience added!');
  };

  const addCertification = () => {
    if (!currentCertification.name || !currentCertification.issuer) {
      toast.error('Please fill in certification name and issuer');
      return;
    }
    setResumeData(prev => ({
      ...prev,
      certifications: [...(prev.certifications || []), { ...currentCertification }],
    }));
    setCurrentCertification({
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
    });
    toast.success('Certification added!');
  };

  const addReference = () => {
    if (!currentReference.name || !currentReference.email) {
      toast.error('Please fill in reference name and email');
      return;
    }
    setResumeData(prev => ({
      ...prev,
      references: [...(prev.references || []), { ...currentReference }],
    }));
    setCurrentReference({
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      relationship: '',
    });
    toast.success('Reference added!');
  };

  const addTechnicalSkill = () => {
    if (currentTechnicalSkill.trim()) {
      setResumeData(prev => ({
        ...prev,
        technicalSkills: [...(prev.technicalSkills || []), currentTechnicalSkill.trim()],
      }));
      setCurrentTechnicalSkill('');
    }
  };

  const addEducation = () => {
    if (!currentEducation.degree || !currentEducation.institution) {
      toast.error('Please fill in degree and institution');
      return;
    }
    setResumeData(prev => ({
      ...prev,
      education: [...(prev.education || []), { ...currentEducation }],
    }));
    setCurrentEducation({
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: '',
    });
    toast.success('Education added!');
  };

  const addLanguage = () => {
    if (!currentLanguage.language) {
      toast.error('Please fill in language');
      return;
    }
    setResumeData(prev => ({
      ...prev,
      languages: [...(prev.languages || []), { ...currentLanguage }],
    }));
    setCurrentLanguage({ language: '', proficiency: 'Native' });
    toast.success('Language added!');
  };

  const addProject = () => {
    if (!currentProject.name) {
      toast.error('Please fill in project name');
      return;
    }
    setResumeData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), { ...currentProject }],
    }));
    setCurrentProject({ name: '', description: '', technologies: '', url: '', startDate: '', endDate: '' });
    toast.success('Project added!');
  };

  const addInterest = () => {
    if (!currentInterest.trim()) {
      toast.error('Please enter an interest');
      return;
    }
    setResumeData(prev => ({
      ...prev,
      interests: [...(prev.interests || []), currentInterest.trim()],
    }));
    setCurrentInterest('');
    toast.success('Interest added!');
  };

  const addCourse = () => {
    if (!currentCourse.name) {
      toast.error('Please fill in course name');
      return;
    }
    setResumeData(prev => ({
      ...prev,
      courses: [...(prev.courses || []), { ...currentCourse }],
    }));
    setCurrentCourse({ name: '', provider: '', date: '', certificateUrl: '' });
    toast.success('Course added!');
  };

  const addAward = () => {
    if (!currentAward.title) {
      toast.error('Please fill in award title');
      return;
    }
    setResumeData(prev => ({
      ...prev,
      awards: [...(prev.awards || []), { ...currentAward }],
    }));
    setCurrentAward({ title: '', issuer: '', date: '', description: '' });
    toast.success('Award added!');
  };

  const addOrganization = () => {
    if (!currentOrganization.name) {
      toast.error('Please fill in organization name');
      return;
    }
    setResumeData(prev => ({
      ...prev,
      organizations: [...(prev.organizations || []), { ...currentOrganization }],
    }));
    setCurrentOrganization({ name: '', role: '', startDate: '', endDate: '', description: '' });
    toast.success('Organization added!');
  };

  const addPublication = () => {
    if (!currentPublication.title) {
      toast.error('Please fill in publication title');
      return;
    }
    setResumeData(prev => ({
      ...prev,
      publications: [...(prev.publications || []), { ...currentPublication }],
    }));
    setCurrentPublication({ title: '', publisher: '', date: '', url: '', description: '' });
    toast.success('Publication added!');
  };

  const addCustom = () => {
    if (!currentCustom.title) {
      toast.error('Please fill in custom section title');
      return;
    }
    setResumeData(prev => ({
      ...prev,
      custom: [...(prev.custom || []), { ...currentCustom }],
    }));
    setCurrentCustom({ title: '', content: '' });
    toast.success('Custom section added!');
  };

  const addSkill = () => {
    if (currentSkill.trim()) {
      setResumeData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), currentSkill.trim()],
      }));
      setCurrentSkill('');
    }
  };
  
  // Step navigation helpers
  const handleStepClick = (stepId) => {
    if (currentResume) {
      setCurrentStep(stepId);
      setCurrentEditorStep(stepId);
    }
  };
  
  const handleNextStep = () => {
    const steps = [
      WIZARD_STEPS.PERSONAL,
      WIZARD_STEPS.SUMMARY,
      WIZARD_STEPS.SKILLS,
      WIZARD_STEPS.EXPERIENCE,
      WIZARD_STEPS.EDUCATION,
      WIZARD_STEPS.CERTIFICATIONS,
      WIZARD_STEPS.REFERENCES,
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep);
      setCurrentEditorStep(nextStep);
    }
  };
  
  const handlePreviousStep = () => {
    const steps = [
      WIZARD_STEPS.PERSONAL,
      WIZARD_STEPS.SUMMARY,
      WIZARD_STEPS.SKILLS,
      WIZARD_STEPS.EXPERIENCE,
      WIZARD_STEPS.EDUCATION,
      WIZARD_STEPS.CERTIFICATIONS,
      WIZARD_STEPS.REFERENCES,
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1];
      setCurrentStep(prevStep);
      setCurrentEditorStep(prevStep);
    }
  };
  
  const markStepComplete = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId]);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case WIZARD_STEPS.TEMPLATE: return 'Choose Your Template';
      case WIZARD_STEPS.UPLOAD_OR_NEW: return uploadMethod === 'upload' ? 'Upload Your Resume' : 'Create New Resume';
      case WIZARD_STEPS.EDITOR: return 'Edit Your Resume';
      case WIZARD_STEPS.COMPLETE: return 'Resume Complete!';
      default: return 'Resume Builder';
    }
  };

  const getProgress = () => {
    const steps = [
      WIZARD_STEPS.TEMPLATE,
      WIZARD_STEPS.UPLOAD_OR_NEW,
      WIZARD_STEPS.PERSONAL_INFO,
      WIZARD_STEPS.SUMMARY,
      WIZARD_STEPS.EXPERIENCE,
      WIZARD_STEPS.EDUCATION,
      WIZARD_STEPS.SKILLS,
      WIZARD_STEPS.PREVIEW,
    ];
    const currentIndex = steps.indexOf(currentStep);
    return currentIndex >= 0 ? Math.round(((currentIndex + 1) / steps.length) * 100) : 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Live Preview Component - FlowCV Style - Full Width with Template Customization
  const LivePreview = ({ templateSettings = { colorScheme: 'blue', fontFamily: 'inter' } }) => {
    // Color scheme mapping
    const colorSchemes = {
      blue: { primary: 'text-blue-600', border: 'border-blue-600', bg: 'bg-blue-50' },
      green: { primary: 'text-green-600', border: 'border-green-600', bg: 'bg-green-50' },
      purple: { primary: 'text-purple-600', border: 'border-purple-600', bg: 'bg-purple-50' },
      orange: { primary: 'text-orange-600', border: 'border-orange-600', bg: 'bg-orange-50' },
      red: { primary: 'text-red-600', border: 'border-red-600', bg: 'bg-red-50' },
      indigo: { primary: 'text-indigo-600', border: 'border-indigo-600', bg: 'bg-indigo-50' },
    };

    // Font family mapping
    const fontFamilies = {
      inter: 'font-sans',
      roboto: 'font-sans',
      playfair: 'font-serif',
      lato: 'font-sans',
      montserrat: 'font-sans',
    };

    const colors = colorSchemes[templateSettings.colorScheme] || colorSchemes.blue;
    const fontClass = fontFamilies[templateSettings.fontFamily] || fontFamilies.inter;
    
    // Format date and timestamp
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    return (
      <div className={`h-full w-full bg-white overflow-y-auto ${fontClass}`}>
        <div className="sticky top-0 bg-white border-b border-zinc-200 px-6 py-4 z-10 w-full">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-zinc-950">Live Preview</h3>
              {currentResume && (
                <div className="mt-1 space-y-0.5">
                  <p className="text-xs font-medium text-zinc-700">{resumeData.name || currentResume.name || 'My Resume'}</p>
                  {currentResume.createdAt && (
                    <p className="text-xs text-zinc-500">{formatDate(currentResume.createdAt)}</p>
                  )}
                </div>
              )}
            </div>
            <Badge color="zinc" className="text-xs capitalize">{selectedTemplate || 'modern'}</Badge>
          </div>
        </div>
        <div className="h-full w-full overflow-y-auto">
          {/* Resume Preview Content - Full Width of Panel, No Padding Constraints */}
          <div className="w-full px-8 py-8 space-y-6">
              {/* Header */}
              <div className={`border-b ${colors.border} pb-4 w-full`}>
                {resumeData.photo && (
                  <div className="mb-4">
                    <img src={resumeData.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                  </div>
                )}
                <h1 className={`text-2xl font-bold ${colors.primary} mb-2 text-left`}>
                  {resumeData.fullName || 'Your Name'}
                </h1>
                <div className="flex flex-wrap gap-2 text-sm text-zinc-600 text-left">
                  {resumeData.email && <span>{resumeData.email}</span>}
                  {resumeData.phone && <span>• {resumeData.phone}</span>}
                  {resumeData.location && <span>• {resumeData.location}</span>}
                  {resumeData.website && <span>• {resumeData.website}</span>}
                  {resumeData.linkedin && <span>• LinkedIn</span>}
                  {resumeData.github && <span>• GitHub</span>}
                </div>
              </div>

              {/* Summary */}
              {resumeData.summary && (
                <div>
                  <h2 className={`text-lg font-semibold ${colors.primary} mb-2`}>Professional Summary</h2>
                  <div 
                    className="text-sm text-zinc-600 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: resumeData.summary }}
                  />
                </div>
              )}

              {/* Profile Summary */}
              {resumeData.profileSummary && (
                <div>
                  <h2 className={`text-lg font-semibold ${colors.primary} mb-2`}>Profile Summary</h2>
                  <div 
                    className="text-sm text-zinc-600 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: resumeData.profileSummary }}
                  />
                </div>
              )}

              {/* Skills */}
              {resumeData.skills && resumeData.skills.length > 0 && (
                <div>
                  <h2 className={`text-lg font-semibold ${colors.primary} mb-2`}>Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, idx) => (
                      <Badge key={idx} color="zinc" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Skills */}
              {resumeData.technicalSkills && resumeData.technicalSkills.length > 0 && (
                <div>
                  <h2 className={`text-lg font-semibold ${colors.primary} mb-2`}>Technical Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.technicalSkills.map((skill, idx) => (
                      <Badge key={idx} color="green" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {resumeData.certifications && resumeData.certifications.length > 0 && (
                <div>
                  <h2 className={`text-lg font-semibold ${colors.primary} mb-3`}>Certifications</h2>
                  <div className="space-y-2">
                    {resumeData.certifications.map((cert, idx) => (
                      <div key={idx}>
                        <p className="font-semibold text-zinc-950">{cert.name}</p>
                        <p className="text-sm text-zinc-600">{cert.issuer}</p>
                        {cert.date && <p className="text-xs text-zinc-500">{cert.date}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Professional References */}
              {resumeData.references && resumeData.references.length > 0 && (
                <div>
                  <h2 className={`text-lg font-semibold ${colors.primary} mb-3`}>Professional References</h2>
                  <div className="space-y-2">
                    {resumeData.references.map((ref, idx) => (
                      <div key={idx}>
                        <p className="font-semibold text-zinc-950">{ref.name}</p>
                        <p className="text-sm text-zinc-600">{ref.title} at {ref.company}</p>
                        {ref.email && <p className="text-xs text-zinc-500">{ref.email}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Professional Experience */}
              {resumeData.experience && resumeData.experience.length > 0 && (
                <div>
                  <h2 className={`text-lg font-semibold ${colors.primary} mb-3`}>Professional Experience</h2>
                  <div className="space-y-4">
                    {resumeData.experience.map((exp, idx) => (
                      <div key={idx}>
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <p className="font-semibold text-zinc-950">{exp.title}</p>
                            <p className="text-sm text-zinc-600">{exp.company}</p>
                          </div>
                          <span className="text-xs text-zinc-500">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate || 'Present'}
                          </span>
                        </div>
                        {exp.responsibilities && (
                          <div 
                            className="text-sm text-zinc-600 mt-1 leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: exp.responsibilities }}
                          />
                        )}
                        {exp.description && (
                          <p className="text-sm text-zinc-600 mt-1 leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {resumeData.education && resumeData.education.length > 0 && (
                <div>
                  <h2 className={`text-lg font-semibold ${colors.primary} mb-3`}>Education</h2>
                  <div className="space-y-2">
                    {resumeData.education.map((edu, idx) => (
                      <div key={idx}>
                        <p className="font-semibold text-zinc-950">{edu.degree}</p>
                        <p className="text-sm text-zinc-600">{edu.institution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>AI Resume Builder | Jobocate</title>
        <meta name="description" content="Build professional resumes with AI" />
      </Head>
      <DashboardLayout>
        <div className="min-h-screen bg-white">
          {/* Simplified Header - FlowCV Style - Full Width */}
          <div className="bg-white border-b border-zinc-200 sticky top-0 z-50 w-full">
            <div className="w-full px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {currentStep !== WIZARD_STEPS.TEMPLATE && currentStep !== WIZARD_STEPS.COMPLETE && (
                    <Button
                      onClick={() => {
                        if (currentStep === WIZARD_STEPS.UPLOAD_OR_NEW) {
                          setCurrentStep(WIZARD_STEPS.TEMPLATE);
                        } else {
                          setCurrentStep(prev => {
                            const steps = [
                              WIZARD_STEPS.TEMPLATE,
                              WIZARD_STEPS.UPLOAD_OR_NEW,
                              WIZARD_STEPS.PERSONAL_INFO,
                              WIZARD_STEPS.SUMMARY,
                              WIZARD_STEPS.EXPERIENCE,
                              WIZARD_STEPS.EDUCATION,
                              WIZARD_STEPS.SKILLS,
                              WIZARD_STEPS.PREVIEW,
                            ];
                            const currentIndex = steps.indexOf(prev);
                            return currentIndex > 0 ? steps[currentIndex - 1] : WIZARD_STEPS.TEMPLATE;
                          });
                        }
                      }}
                      plain
                      className="text-zinc-600 hover:text-zinc-950"
                    >
                      <ArrowLeftIcon className="h-5 w-5" />
                    </Button>
                  )}
                  <div>
                    <h1 className="text-xl font-semibold text-zinc-950">Resume Builder</h1>
                    {currentStep !== WIZARD_STEPS.TEMPLATE && currentStep !== WIZARD_STEPS.COMPLETE && (
                      <p className="text-xs text-zinc-500 mt-0.5">{getStepTitle()}</p>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                {currentStep !== WIZARD_STEPS.TEMPLATE && currentStep !== WIZARD_STEPS.UPLOAD_OR_NEW && currentResume && (
                  <div className="flex items-center gap-2">
                    {/* Template Settings Button */}
                    <Button
                      onClick={() => setShowTemplateSettings(true)}
                      outline
                      className="text-sm"
                      title="Template Settings"
                    >
                      <PaintBrushIcon className="h-4 w-4" />
                    </Button>
                    {currentResume?.pdfUrl && (
                      <>
                        <Button
                          onClick={handleViewPDF}
                          outline
                          className="text-sm"
                        >
                          <EyeIcon className="h-4 w-4" />
                          Preview
                        </Button>
                        <Button
                          onClick={handleDownloadPDF}
                          outline
                          className="text-sm"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                          Download
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={handleSave}
                      color="blue"
                      className="text-sm"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <ArrowPathIcon className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Resume'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Full Width */}
          <div className="w-full">
            {/* Previous Resumes Section - Only show on template step - Full Width */}
            {currentStep === WIZARD_STEPS.TEMPLATE && (
              <div className="mb-8 px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-[1920px] mx-auto pt-8">
                  {/* View Previous Resumes Card */}
                  <div 
                    className="rounded-lg border border-zinc-200 bg-white p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setShowPreviousResumes(!showPreviousResumes)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-zinc-950">View Previous Resumes</h3>
                          <p className="text-sm text-zinc-600 mt-1">
                            {previousResumes.length} {previousResumes.length === 1 ? 'resume' : 'resumes'} generated
                          </p>
                        </div>
                      </div>
                      <ChevronRightIcon 
                        className={`h-5 w-5 text-zinc-400 transition-transform ${showPreviousResumes ? 'rotate-90' : ''}`} 
                      />
                    </div>
                  </div>

                  {/* Start New Resume Card */}
                  <div className="rounded-lg border border-zinc-200 bg-white p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <PlusIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-zinc-950">Create New Resume</h3>
                        <p className="text-sm text-zinc-600 mt-1">Start building a new resume from scratch</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Previous Resumes Table */}
                {showPreviousResumes && (
                  <div className="bg-white rounded-lg border border-zinc-200 shadow-sm mb-8 max-w-[1920px] mx-auto">
                    <div className="p-6 border-b border-zinc-200">
                      <h3 className="text-lg font-semibold text-zinc-950">Previous Resumes</h3>
                    </div>
                    {loadingResumes ? (
                      <div className="p-8 text-center">
                        <ArrowPathIcon className="h-6 w-6 animate-spin text-zinc-400 mx-auto" />
                        <p className="text-sm text-zinc-600 mt-2">Loading resumes...</p>
                      </div>
                    ) : previousResumes.length === 0 ? (
                      <div className="p-8 text-center">
                        <DocumentTextIcon className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
                        <p className="text-sm text-zinc-600">No resumes generated yet</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableHeader>Name</TableHeader>
                            <TableHeader>Template</TableHeader>
                            <TableHeader>Created</TableHeader>
                            <TableHeader>Actions</TableHeader>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {previousResumes.map((resume) => (
                            <TableRow key={resume.id || resume._id}>
                              <TableCell className="font-medium text-zinc-950">
                                {resume.name || 'Untitled Resume'}
                              </TableCell>
                              <TableCell>
                                <Badge color="zinc" className="capitalize">
                                  {resume.template || 'N/A'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-zinc-600">
                                {formatDate(resume.createdAt)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {resume.pdfUrl && (
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewResumePDF(resume);
                                      }}
                                      plain
                                      className="text-blue-600 hover:text-blue-700"
                                    >
                                      <EyeIcon className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditResume(resume);
                                    }}
                                    plain
                                    className="text-zinc-600 hover:text-zinc-700"
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteResume(resume.id || resume._id);
                                    }}
                                    plain
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Template Selection Step - FlowCV Style - Full Width */}
            {currentStep === WIZARD_STEPS.TEMPLATE && (
              <div className="w-full px-6 py-12">
                <div className="mb-12 text-center">
                  <h2 className="text-4xl font-bold text-zinc-950 mb-4">Choose Your Resume Template</h2>
                  <p className="text-xl text-zinc-600 max-w-2xl mx-auto">Select a professional template that matches your style and industry</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1920px] mx-auto">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      className={`group cursor-pointer rounded-3xl border-2 transition-all duration-300 overflow-hidden bg-white shadow-sm hover:shadow-2xl ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 shadow-2xl ring-4 ring-blue-100 scale-[1.03]'
                          : 'border-zinc-200 hover:border-blue-400 hover:shadow-xl'
                      }`}
                    >
                      {/* Template Preview - Much Larger */}
                      <div className="relative h-[420px] bg-gradient-to-br from-zinc-50 to-zinc-100 overflow-hidden">
                        {/* Placeholder background - always shown */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                          <div className="text-center p-8">
                            <DocumentTextIcon className="h-24 w-24 text-zinc-400 mx-auto mb-6" />
                            <div className="space-y-3">
                              <div className="h-3 bg-zinc-300 rounded w-56 mx-auto"></div>
                              <div className="h-3 bg-zinc-300 rounded w-48 mx-auto"></div>
                              <div className="h-3 bg-zinc-300 rounded w-52 mx-auto"></div>
                              <div className="h-3 bg-zinc-300 rounded w-44 mx-auto"></div>
                            </div>
                          </div>
                        </div>
                        {/* Template image - overlays placeholder if loaded successfully */}
                        {template.preview && (
                          <div className="relative w-full h-full">
                            <img
                              src={template.preview}
                              alt={`${template.name} template preview`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                // Hide image on error, placeholder will show
                                e.target.style.display = 'none';
                              }}
                              onLoad={(e) => {
                                // Hide placeholder when image loads successfully
                                const placeholder = e.target.parentElement?.previousElementSibling;
                                if (placeholder) {
                                  placeholder.style.display = 'none';
                                }
                              }}
                            />
                          </div>
                        )}
                        {selectedTemplate === template.id && (
                          <div className="absolute top-5 right-5 z-10">
                            <div className="bg-blue-500 rounded-full p-2.5 shadow-xl ring-4 ring-white">
                              <CheckCircleIcon className="h-7 w-7 text-white" />
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      {/* Template Info */}
                      <div className="p-7 bg-white">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-zinc-950 mb-2">{template.name}</h3>
                            <p className="text-sm text-zinc-600 leading-relaxed mb-3">{template.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge color={template.color} className="text-xs font-semibold px-3 py-1">
                            {template.category}
                          </Badge>
                          {selectedTemplate === template.id && (
                            <span className="text-sm font-semibold text-blue-600 flex items-center gap-1">
                              <CheckCircleIcon className="h-4 w-4" />
                              Selected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload or New Step - Full Width */}
            {currentStep === WIZARD_STEPS.UPLOAD_OR_NEW && (
              <div className="w-full px-6 py-12">
                <div className="max-w-4xl mx-auto">
                  <div className="mb-12 text-center">
                    <h2 className="text-4xl font-bold text-zinc-950 mb-4">How would you like to start?</h2>
                    <p className="text-xl text-zinc-600">Choose the option that works best for you</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    {/* Upload Option */}
                    <div
                      onClick={() => handleMethodSelect('upload')}
                      className={`group relative cursor-pointer rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
                        uploadMethod === 'upload'
                          ? 'border-blue-500 bg-blue-50 shadow-2xl ring-4 ring-blue-100 scale-[1.02]'
                          : 'border-zinc-200 hover:border-blue-400 hover:shadow-xl bg-white'
                      }`}
                    >
                      <div className="p-10">
                        <div className="flex flex-col items-center text-center">
                          <div className={`p-5 rounded-2xl mb-6 transition-all duration-300 ${
                            uploadMethod === 'upload' ? 'bg-blue-100 scale-110' : 'bg-zinc-100 group-hover:bg-blue-50 group-hover:scale-105'
                          }`}>
                            <CloudArrowUpIcon className={`h-14 w-14 ${
                              uploadMethod === 'upload' ? 'text-blue-600' : 'text-zinc-600 group-hover:text-blue-600'
                            }`} />
                          </div>
                          <h3 className="text-2xl font-bold text-zinc-950 mb-3">Upload Existing Resume</h3>
                          <p className="text-base text-zinc-600 mb-6 leading-relaxed">We'll extract and enhance your information automatically using AI</p>
                          {uploadMethod === 'upload' && (
                            <Badge color="blue" className="text-sm font-semibold px-4 py-1.5">
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Selected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Start Fresh Option */}
                    <div
                      onClick={() => !isGenerating && handleMethodSelect('new')}
                      className={`group relative cursor-pointer rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
                        uploadMethod === 'new'
                          ? 'border-blue-500 bg-blue-50 shadow-2xl ring-4 ring-blue-100 scale-[1.02]'
                          : 'border-zinc-200 hover:border-blue-400 hover:shadow-xl bg-white'
                      } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="p-10">
                        <div className="flex flex-col items-center text-center">
                          <div className={`p-5 rounded-2xl mb-6 transition-all duration-300 ${
                            uploadMethod === 'new' ? 'bg-blue-100 scale-110' : 'bg-zinc-100 group-hover:bg-blue-50 group-hover:scale-105'
                          }`}>
                            {isGenerating ? (
                              <ArrowPathIcon className="h-14 w-14 text-blue-600 animate-spin" />
                            ) : (
                              <SparklesIcon className={`h-14 w-14 ${
                                uploadMethod === 'new' ? 'text-blue-600' : 'text-zinc-600 group-hover:text-blue-600'
                              }`} />
                            )}
                          </div>
                          <h3 className="text-2xl font-bold text-zinc-950 mb-3">
                            {isGenerating ? 'Creating Resume...' : 'Start Fresh'}
                          </h3>
                          <p className="text-base text-zinc-600 mb-6 leading-relaxed">
                            {isGenerating 
                              ? 'Setting up your resume with AI assistance' 
                              : 'Build from scratch with AI-powered suggestions'
                            }
                          </p>
                          {uploadMethod === 'new' && !isGenerating && (
                            <Badge color="blue" className="text-sm font-semibold px-4 py-1.5">
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Selected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                {/* Upload Section */}
                {uploadMethod === 'upload' && (
                  <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-zinc-950 mb-2">Upload Your Resume</h3>
                      <p className="text-sm text-zinc-500">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
                    </div>
                    
                    <FieldGroup>
                      <Field>
                        <Label htmlFor="resume-upload">Select Resume File</Label>
                        <div className="mt-2">
                          <input
                            id="resume-upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-zinc-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
                          />
                        </div>
                        {resumeFile && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2">
                              <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                              <span className="text-sm font-medium text-zinc-950">{resumeFile.name}</span>
                              <span className="text-xs text-zinc-500">
                                ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                          </div>
                        )}
                      </Field>
                    </FieldGroup>

                    <div className="mt-6 flex gap-3">
                      <Button
                        onClick={() => setUploadMethod(null)}
                        outline
                      >
                        <ChevronLeftIcon data-slot="icon" className="h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        onClick={() => {
                          if (!resumeNameInput.trim()) {
                            setShowResumeNameModal(true);
                          } else {
                            handleFileUpload();
                          }
                        }}
                        color="blue"
                        disabled={!resumeFile || uploading}
                        className="flex-1"
                      >
                        {uploading ? (
                          <>
                            <ArrowPathIcon data-slot="icon" className="h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            Upload & Continue
                            <ChevronRightIcon data-slot="icon" className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Start Fresh Section */}
                {uploadMethod === 'new' && !isGenerating && (
                  <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-zinc-950 mb-2">Create New Resume</h3>
                      <p className="text-sm text-zinc-500">
                        We'll import your profile information and help you build a professional resume
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <SparklesIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-zinc-950 mb-1">What we'll import:</p>
                          <ul className="text-sm text-zinc-600 space-y-1 list-disc list-inside">
                            <li>Your personal information (name, email, phone)</li>
                            <li>Professional summary</li>
                            <li>Skills and experience</li>
                            <li>Education history</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => setUploadMethod(null)}
                        outline
                      >
                        <ChevronLeftIcon data-slot="icon" className="h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        onClick={() => {
                          if (!resumeNameInput.trim()) {
                            setShowResumeNameModal(true);
                          } else {
                            handleCreateNew();
                          }
                        }}
                        color="blue"
                        disabled={isGenerating}
                        className="flex-1"
                      >
                        {isGenerating ? (
                          <>
                            <ArrowPathIcon data-slot="icon" className="h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            Create Resume
                            <ChevronRightIcon data-slot="icon" className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Loading State for Start Fresh */}
                {uploadMethod === 'new' && isGenerating && (
                  <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
                    <div className="text-center py-8">
                      <ArrowPathIcon className="h-12 w-12 mx-auto mb-4 text-blue-500 animate-spin" />
                      <h3 className="text-lg font-semibold text-zinc-950 mb-2">Creating Your Resume...</h3>
                      <p className="text-sm text-zinc-500">Please wait while we set up your resume</p>
                    </div>
                  </div>
                )}
                </div>
              </div>
            )}

            {/* New Tabbed Editor - Like FlowCV */}
            {currentStep === WIZARD_STEPS.EDITOR && currentResume && (
              <div className="w-full h-[calc(100vh-120px)] flex flex-col">
                {/* Top Tabs Navigation */}
                <div className="bg-white border-b border-zinc-200 px-6">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveTab(EDITOR_TABS.OVERVIEW)}
                      className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === EDITOR_TABS.OVERVIEW
                          ? 'border-pink-500 text-pink-600'
                          : 'border-transparent text-zinc-600 hover:text-zinc-950'
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab(EDITOR_TABS.CONTENT)}
                      className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === EDITOR_TABS.CONTENT
                          ? 'border-pink-500 text-pink-600'
                          : 'border-transparent text-zinc-600 hover:text-zinc-950'
                      }`}
                    >
                      Content
                    </button>
                    <button
                      onClick={() => setActiveTab(EDITOR_TABS.CUSTOMIZE)}
                      className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === EDITOR_TABS.CUSTOMIZE
                          ? 'border-pink-500 text-pink-600'
                          : 'border-transparent text-zinc-600 hover:text-zinc-950'
                      }`}
                    >
                      Customize
                    </button>
                    <button
                      onClick={() => setActiveTab(EDITOR_TABS.LINKS)}
                      className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === EDITOR_TABS.LINKS
                          ? 'border-pink-500 text-pink-600'
                          : 'border-transparent text-zinc-600 hover:text-zinc-950'
                      }`}
                    >
                      Links
                    </button>
                  </div>
                </div>
                
                {/* Editor Content - Split Screen */}
                <div className="flex-1 grid grid-cols-3 overflow-hidden">
                  {/* Left Sidebar - Section Cards */}
                  <div className="col-span-1 overflow-y-auto bg-zinc-50 border-r border-zinc-200 p-4 space-y-4">
                    {/* Content Tab - Show Section Cards */}
                    {activeTab === EDITOR_TABS.CONTENT && (
                      <>
                        {/* Personal Information Card */}
                        <div className="bg-white rounded-lg border border-zinc-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-zinc-950">Personal Information</h3>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditingSection(editingSection === 'personal' ? null : 'personal')}
                                className="p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 transition-colors"
                              >
                                <PencilIcon className="h-4 w-4 text-pink-600" />
                              </button>
                              <button
                                onClick={() => setExpandedSections(prev => ({ ...prev, personal: !prev.personal }))}
                                className="p-1 hover:bg-zinc-100 rounded transition-colors"
                              >
                                {expandedSections.personal ? (
                                  <ChevronUpIcon className="h-4 w-4 text-zinc-600" />
                                ) : (
                                  <ChevronDownIcon className="h-4 w-4 text-zinc-600" />
                                )}
                              </button>
                            </div>
                          </div>
                          
                          {expandedSections.personal && (
                            <div className="space-y-3">
                              {editingSection === 'personal' ? (
                                <FieldGroup>
                                  <Field>
                                    <Label>Full Name</Label>
                                    <Input
                                      value={resumeData.fullName}
                                      onChange={(e) => setResumeData(prev => ({ ...prev, fullName: e.target.value }))}
                                      placeholder="Your Name"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Job Title</Label>
                                    <Input
                                      value={resumeData.jobTitle || ''}
                                      onChange={(e) => setResumeData(prev => ({ ...prev, jobTitle: e.target.value }))}
                                      placeholder="Job Title"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Email</Label>
                                    <Input
                                      type="email"
                                      value={resumeData.email}
                                      onChange={(e) => setResumeData(prev => ({ ...prev, email: e.target.value }))}
                                      placeholder="email@example.com"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Phone</Label>
                                    <Input
                                      value={resumeData.phone}
                                      onChange={(e) => setResumeData(prev => ({ ...prev, phone: e.target.value }))}
                                      placeholder="+1 (555) 123-4567"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Location</Label>
                                    <Input
                                      value={resumeData.location}
                                      onChange={(e) => setResumeData(prev => ({ ...prev, location: e.target.value }))}
                                      placeholder="City, State"
                                    />
                                  </Field>
                                  <div className="flex gap-2">
                                    <Button onClick={() => setEditingSection(null)} outline size="sm">
                                      Save
                                    </Button>
                                    <Button onClick={() => setEditingSection(null)} plain size="sm">
                                      Cancel
                                    </Button>
                                  </div>
                                </FieldGroup>
                              ) : (
                                <div className="space-y-2">
                                  <div>
                                    <p className="font-semibold text-zinc-950">{resumeData.fullName || 'Your Name'}</p>
                                    <p className="text-sm text-zinc-600">{resumeData.jobTitle || 'Job Title'}</p>
                                  </div>
                                  <div className="space-y-1 text-sm text-zinc-600">
                                    {resumeData.email && (
                                      <div className="flex items-center gap-2">
                                        <EnvelopeIcon className="h-4 w-4" />
                                        <span>{resumeData.email}</span>
                                      </div>
                                    )}
                                    {resumeData.phone && (
                                      <div className="flex items-center gap-2">
                                        <PhoneIcon className="h-4 w-4" />
                                        <span>{resumeData.phone}</span>
                                      </div>
                                    )}
                                    {resumeData.location && (
                                      <div className="flex items-center gap-2">
                                        <MapPinIcon className="h-4 w-4" />
                                        <span>{resumeData.location}</span>
                                      </div>
                                    )}
                                  </div>
                                  {resumeData.photo && (
                                    <div className="mt-3">
                                      <img src={resumeData.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Profile/Summary Card - Only show if added */}
                        {addedSections.includes('summary') && (
                        <div className="bg-white rounded-lg border border-zinc-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <UserIcon className="h-4 w-4 text-zinc-600" />
                              <h3 className="text-sm font-semibold text-zinc-950">Profile</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="text-xs text-zinc-600 hover:text-zinc-950 flex items-center gap-1">
                                <PencilIcon className="h-3 w-3" />
                                Edit Heading
                              </button>
                              <button
                                onClick={() => setExpandedSections(prev => ({ ...prev, summary: !prev.summary }))}
                                className="p-1 hover:bg-zinc-100 rounded transition-colors"
                              >
                                {expandedSections.summary ? (
                                  <ChevronUpIcon className="h-4 w-4 text-zinc-600" />
                                ) : (
                                  <ChevronDownIcon className="h-4 w-4 text-zinc-600" />
                                )}
                              </button>
                            </div>
                          </div>
                          
                          {expandedSections.summary && (
                            <div className="space-y-2">
                              {editingSection === 'summary' ? (
                                <RichTextEditor
                                  value={typeof resumeData.summary === 'string' ? resumeData.summary : ''}
                                  onChange={(value) => setResumeData(prev => ({ ...prev, summary: value }))}
                                  placeholder="Write your professional summary..."
                                />
                              ) : (
                                <div className="space-y-2">
                                  {resumeData.summary ? (
                                    <div 
                                      className="text-sm text-zinc-600 prose prose-sm max-w-none"
                                      dangerouslySetInnerHTML={{ __html: resumeData.summary }}
                                    />
                                  ) : (
                                    <p className="text-sm text-zinc-400 italic">No profile summary yet</p>
                                  )}
                                  <Button
                                    onClick={() => setEditingSection('summary')}
                                    plain
                                    size="sm"
                                    className="text-xs"
                                  >
                                    <PencilIcon className="h-3 w-3" />
                                    Edit
                                  </Button>
                                </div>
                              )}
                              {editingSection === 'summary' && (
                                <div className="flex gap-2 mt-2">
                                  <Button onClick={() => setEditingSection(null)} outline size="sm">
                                    Save
                                  </Button>
                                  <Button onClick={() => setEditingSection(null)} plain size="sm">
                                    Cancel
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        )}

                        {/* Profile Summary Card - Only show if added */}
                        {addedSections.includes('profileSummary') && (
                        <div className="bg-white rounded-lg border border-zinc-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <UserIcon className="h-4 w-4 text-zinc-600" />
                              <h3 className="text-sm font-semibold text-zinc-950">Profile Summary</h3>
                            </div>
                            <button
                              onClick={() => setExpandedSections(prev => ({ ...prev, profileSummary: !prev.profileSummary }))}
                              className="p-1 hover:bg-zinc-100 rounded transition-colors"
                            >
                              {expandedSections.profileSummary ? (
                                <ChevronUpIcon className="h-4 w-4 text-zinc-600" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4 text-zinc-600" />
                              )}
                            </button>
                          </div>
                          
                          {expandedSections.profileSummary && (
                            <div className="space-y-2">
                              {editingSection === 'profileSummary' ? (
                                <>
                                  <RichTextEditor
                                    value={typeof resumeData.profileSummary === 'string' ? resumeData.profileSummary : ''}
                                    onChange={(value) => setResumeData(prev => ({ ...prev, profileSummary: value }))}
                                    placeholder="Write your profile summary..."
                                  />
                                  <div className="flex items-center gap-2">
                                    <Button
                                      onClick={() => {
                                        if (currentResume) {
                                          handleRegenerateSection('profileSummary');
                                        } else {
                                          toast.error('Please create a resume first');
                                        }
                                      }}
                                      disabled={isGenerating}
                                      plain
                                      size="sm"
                                      className="text-xs flex items-center gap-1"
                                    >
                                      <SparklesIcon className="h-3 w-3 text-blue-600" />
                                      {isGenerating ? 'Generating...' : 'Generate with AI'}
                                    </Button>
                                    {resumeData.profileSummary && (
                                      <Button
                                        onClick={() => {
                                          if (currentResume) {
                                            handleRegenerateSection('profileSummary');
                                          } else {
                                            toast.error('Please create a resume first');
                                          }
                                        }}
                                        disabled={isGenerating}
                                        plain
                                        size="sm"
                                        className="text-xs flex items-center gap-1"
                                      >
                                        <ArrowPathIcon className="h-3 w-3 text-blue-600" />
                                        {isGenerating ? 'Rewriting...' : 'Rewrite with AI'}
                                      </Button>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <div className="space-y-2">
                                  {resumeData.profileSummary ? (
                                    <div 
                                      className="text-sm text-zinc-600 prose prose-sm max-w-none"
                                      dangerouslySetInnerHTML={{ __html: resumeData.profileSummary }}
                                    />
                                  ) : (
                                    <p className="text-sm text-zinc-400 italic">No profile summary yet</p>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <Button
                                      onClick={() => setEditingSection('profileSummary')}
                                      plain
                                      size="sm"
                                      className="text-xs"
                                    >
                                      <PencilIcon className="h-3 w-3" />
                                      Edit
                                    </Button>
                                    {currentResume && (
                                      <>
                                        {!resumeData.profileSummary ? (
                                          <Button
                                            onClick={() => handleRegenerateSection('profileSummary')}
                                            disabled={isGenerating}
                                            plain
                                            size="sm"
                                            className="text-xs flex items-center gap-1"
                                          >
                                            <SparklesIcon className="h-3 w-3 text-blue-600" />
                                            {isGenerating ? 'Generating...' : 'Generate with AI'}
                                          </Button>
                                        ) : (
                                          <Button
                                            onClick={() => handleRegenerateSection('profileSummary')}
                                            disabled={isGenerating}
                                            plain
                                            size="sm"
                                            className="text-xs flex items-center gap-1"
                                          >
                                            <ArrowPathIcon className="h-3 w-3 text-blue-600" />
                                            {isGenerating ? 'Rewriting...' : 'Rewrite with AI'}
                                          </Button>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                              {editingSection === 'profileSummary' && (
                                <div className="flex gap-2 mt-2">
                                  <Button onClick={() => setEditingSection(null)} outline size="sm">
                                    Save
                                  </Button>
                                  <Button onClick={() => setEditingSection(null)} plain size="sm">
                                    Cancel
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        )}

                        {/* Skills Card - Only show if added */}
                        {addedSections.includes('skills') && (
                        <div className="bg-white rounded-lg border border-zinc-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-zinc-950">Skills</h3>
                            <button
                              onClick={() => setExpandedSections(prev => ({ ...prev, skills: !prev.skills }))}
                              className="p-1 hover:bg-zinc-100 rounded transition-colors"
                            >
                              {expandedSections.skills ? (
                                <ChevronUpIcon className="h-4 w-4 text-zinc-600" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4 text-zinc-600" />
                              )}
                            </button>
                          </div>
                          
                          {expandedSections.skills && (
                            <div className="space-y-2">
                              {editingSection === 'skills' ? (
                                <RichTextEditor
                                  value={Array.isArray(resumeData.skills) ? resumeData.skills.join('\n') : (resumeData.skills || '')}
                                  onChange={(value) => {
                                    const tempDiv = document.createElement('div');
                                    tempDiv.innerHTML = value;
                                    const textContent = tempDiv.textContent || tempDiv.innerText || '';
                                    const skillsArray = textContent.split('\n').filter(s => s.trim());
                                    setResumeData(prev => ({ ...prev, skills: skillsArray }));
                                  }}
                                  placeholder="Enter your skills, one per line..."
                                />
                              ) : (
                                <div className="space-y-2">
                                  {Array.isArray(resumeData.skills) && resumeData.skills.length > 0 ? (
                                    <ul className="space-y-1">
                                      {resumeData.skills.map((skill, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm text-zinc-600">
                                          <div className="w-1 h-1 rounded-full bg-zinc-400" />
                                          <span>{skill}</span>
                                          <button
                                            onClick={() => {
                                              setResumeData(prev => ({
                                                ...prev,
                                                skills: prev.skills.filter((_, i) => i !== idx),
                                              }));
                                            }}
                                            className="ml-auto opacity-0 group-hover:opacity-100 hover:text-red-600"
                                          >
                                            <XMarkIcon className="h-3 w-3" />
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-sm text-zinc-400 italic">No skills added yet</p>
                                  )}
                                  <Button
                                    onClick={() => setEditingSection('skills')}
                                    plain
                                    size="sm"
                                    className="text-xs"
                                  >
                                    <PencilIcon className="h-3 w-3" />
                                    Edit
                                  </Button>
                                </div>
                              )}
                              {editingSection === 'skills' && (
                                <div className="flex gap-2 mt-2">
                                  <Button onClick={() => setEditingSection(null)} outline size="sm">
                                    Save
                                  </Button>
                                  <Button onClick={() => setEditingSection(null)} plain size="sm">
                                    Cancel
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        )}

                        {/* Professional Experience Card - Only show if added */}
                        {addedSections.includes('experience') && (
                        <div className="bg-white rounded-lg border border-zinc-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-zinc-950">Professional Experience</h3>
                            <button
                              onClick={() => setExpandedSections(prev => ({ ...prev, experience: !prev.experience }))}
                              className="p-1 hover:bg-zinc-100 rounded transition-colors"
                            >
                              {expandedSections.experience ? (
                                <ChevronUpIcon className="h-4 w-4 text-zinc-600" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4 text-zinc-600" />
                              )}
                            </button>
                          </div>
                          
                          {expandedSections.experience && (
                            <div className="space-y-3">
                              {resumeData.experience && resumeData.experience.length > 0 ? (
                                <div className="space-y-2">
                                  {resumeData.experience.map((exp, idx) => (
                                    <div key={idx} className="flex items-start gap-2 p-2 bg-zinc-50 rounded border border-zinc-200">
                                      <div className="w-1 h-full bg-zinc-300 rounded" />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-zinc-950">{exp.title} at {exp.company}</p>
                                        <p className="text-xs text-zinc-500">
                                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => {
                                            setCurrentExperience(exp);
                                            setEditingIndex(idx);
                                            setEditingSection('experience');
                                          }}
                                          className="p-1 hover:bg-zinc-200 rounded"
                                        >
                                          <PencilIcon className="h-3 w-3 text-zinc-600" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setResumeData(prev => ({
                                              ...prev,
                                              experience: prev.experience.filter((_, i) => i !== idx),
                                            }));
                                          }}
                                          className="p-1 hover:bg-zinc-200 rounded"
                                        >
                                          <TrashIcon className="h-3 w-3 text-red-600" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-zinc-400 italic">No experience added yet</p>
                              )}
                              {editingSection === 'experience' ? (
                                <FieldGroup>
                                  <Field>
                                    <Label>Job Title</Label>
                                    <Input
                                      value={currentExperience.title}
                                      onChange={(e) => setCurrentExperience(prev => ({ ...prev, title: e.target.value }))}
                                      placeholder="Software Engineer"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Company</Label>
                                    <Input
                                      value={currentExperience.company}
                                      onChange={(e) => setCurrentExperience(prev => ({ ...prev, company: e.target.value }))}
                                      placeholder="Company Name"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Location</Label>
                                    <Input
                                      value={currentExperience.location}
                                      onChange={(e) => setCurrentExperience(prev => ({ ...prev, location: e.target.value }))}
                                      placeholder="City, State"
                                    />
                                  </Field>
                                  <div className="grid grid-cols-2 gap-2">
                                    <Field>
                                      <Label>Start Date</Label>
                                      <Input
                                        type="month"
                                        value={currentExperience.startDate}
                                        onChange={(e) => setCurrentExperience(prev => ({ ...prev, startDate: e.target.value }))}
                                      />
                                    </Field>
                                    <Field>
                                      <Label>End Date</Label>
                                      <Input
                                        type="month"
                                        value={currentExperience.endDate}
                                        onChange={(e) => setCurrentExperience(prev => ({ ...prev, endDate: e.target.value }))}
                                        placeholder="Leave empty if current"
                                      />
                                    </Field>
                                  </div>
                                  <Field>
                                    <CheckboxField>
                                      <Checkbox
                                        checked={currentExperience.current}
                                        onChange={(checked) => setCurrentExperience(prev => ({ ...prev, current: checked }))}
                                      />
                                      <Label>I currently work here</Label>
                                    </CheckboxField>
                                  </Field>
                                  <Field>
                                    <Label>Responsibilities</Label>
                                    <RichTextEditor
                                      value={currentExperience.responsibilities || ''}
                                      onChange={(value) => setCurrentExperience(prev => ({ ...prev, responsibilities: value }))}
                                      placeholder="Describe your key responsibilities and achievements..."
                                    />
                                  </Field>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => {
                                        if (currentExperience.title && currentExperience.company) {
                                          if (editingIndex !== null && editingIndex >= 0) {
                                            setResumeData(prev => ({
                                              ...prev,
                                              experience: prev.experience.map((e, i) => i === editingIndex ? currentExperience : e),
                                            }));
                                          } else {
                                            addExperience();
                                          }
                                          setCurrentExperience({
                                            title: '',
                                            company: '',
                                            location: '',
                                            startDate: '',
                                            endDate: '',
                                            current: false,
                                            responsibilities: '',
                                          });
                                          setEditingIndex(null);
                                          setEditingSection(null);
                                        }
                                      }}
                                      outline
                                      size="sm"
                                    >
                                      {editingIndex !== null ? 'Update' : 'Add'}
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setCurrentExperience({
                                          title: '',
                                          company: '',
                                          location: '',
                                          startDate: '',
                                          endDate: '',
                                          current: false,
                                          responsibilities: '',
                                        });
                                        setEditingIndex(null);
                                        setEditingSection(null);
                                      }}
                                      plain
                                      size="sm"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </FieldGroup>
                              ) : (
                                <Button
                                  onClick={() => {
                                    setCurrentExperience({
                                      title: '',
                                      company: '',
                                      location: '',
                                      startDate: '',
                                      endDate: '',
                                      current: false,
                                      responsibilities: '',
                                    });
                                    setEditingIndex(null);
                                    setEditingSection('experience');
                                  }}
                                  outline
                                  size="sm"
                                  className="w-full"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                  Add Entry
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        )}

                        {/* Education Card - Only show if added */}
                        {addedSections.includes('education') && (
                        <div className="bg-white rounded-lg border border-zinc-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-zinc-950">Education</h3>
                            <button
                              onClick={() => setExpandedSections(prev => ({ ...prev, education: !prev.education }))}
                              className="p-1 hover:bg-zinc-100 rounded transition-colors"
                            >
                              {expandedSections.education ? (
                                <ChevronUpIcon className="h-4 w-4 text-zinc-600" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4 text-zinc-600" />
                              )}
                            </button>
                          </div>
                          
                          {expandedSections.education && (
                            <div className="space-y-3">
                              {resumeData.education && resumeData.education.length > 0 ? (
                                <div className="space-y-2">
                                  {resumeData.education.map((edu, idx) => (
                                    <div key={idx} className="flex items-start gap-2 p-2 bg-zinc-50 rounded border border-zinc-200">
                                      <div className="w-1 h-full bg-zinc-300 rounded" />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-zinc-950">{edu.degree}</p>
                                        <p className="text-xs text-zinc-500">{edu.institution}</p>
                                        {edu.startDate && (
                                          <p className="text-xs text-zinc-400">
                                            {edu.startDate} - {edu.endDate || 'Present'}
                                          </p>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => {
                                            setCurrentEducation(edu);
                                            setEditingIndex(idx);
                                            setEditingSection('education');
                                          }}
                                          className="p-1 hover:bg-zinc-200 rounded"
                                        >
                                          <PencilIcon className="h-3 w-3 text-zinc-600" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setResumeData(prev => ({
                                              ...prev,
                                              education: prev.education.filter((_, i) => i !== idx),
                                            }));
                                          }}
                                          className="p-1 hover:bg-zinc-200 rounded"
                                        >
                                          <TrashIcon className="h-3 w-3 text-red-600" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-zinc-400 italic">No education added yet</p>
                              )}
                              {editingSection === 'education' ? (
                                <FieldGroup>
                                  <Field>
                                    <Label>Degree</Label>
                                    <Input
                                      value={currentEducation.degree}
                                      onChange={(e) => setCurrentEducation(prev => ({ ...prev, degree: e.target.value }))}
                                      placeholder="Bachelor of Science"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Institution</Label>
                                    <Input
                                      value={currentEducation.institution}
                                      onChange={(e) => setCurrentEducation(prev => ({ ...prev, institution: e.target.value }))}
                                      placeholder="University Name"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Location</Label>
                                    <Input
                                      value={currentEducation.location}
                                      onChange={(e) => setCurrentEducation(prev => ({ ...prev, location: e.target.value }))}
                                      placeholder="City, State"
                                    />
                                  </Field>
                                  <div className="grid grid-cols-2 gap-2">
                                    <Field>
                                      <Label>Start Date</Label>
                                      <Input
                                        type="month"
                                        value={currentEducation.startDate}
                                        onChange={(e) => setCurrentEducation(prev => ({ ...prev, startDate: e.target.value }))}
                                      />
                                    </Field>
                                    <Field>
                                      <Label>End Date</Label>
                                      <Input
                                        type="month"
                                        value={currentEducation.endDate}
                                        onChange={(e) => setCurrentEducation(prev => ({ ...prev, endDate: e.target.value }))}
                                        placeholder="Leave empty if ongoing"
                                      />
                                    </Field>
                                  </div>
                                  <Field>
                                    <Label>GPA (Optional)</Label>
                                    <Input
                                      value={currentEducation.gpa}
                                      onChange={(e) => setCurrentEducation(prev => ({ ...prev, gpa: e.target.value }))}
                                      placeholder="3.8/4.0"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Description</Label>
                                    <RichTextEditor
                                      value={currentEducation.description || ''}
                                      onChange={(value) => setCurrentEducation(prev => ({ ...prev, description: value }))}
                                      placeholder="Additional details about your education..."
                                    />
                                  </Field>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => {
                                        if (currentEducation.degree && currentEducation.institution) {
                                          if (editingIndex !== null && editingIndex >= 0) {
                                            // Update existing entry
                                            setResumeData(prev => ({
                                              ...prev,
                                              education: prev.education.map((e, i) => i === editingIndex ? currentEducation : e),
                                            }));
                                          } else {
                                            // Add new entry
                                            addEducation();
                                          }
                                          setCurrentEducation({
                                            degree: '',
                                            institution: '',
                                            location: '',
                                            startDate: '',
                                            endDate: '',
                                            gpa: '',
                                            description: '',
                                          });
                                          setEditingIndex(null);
                                          setEditingSection(null);
                                        }
                                      }}
                                      outline
                                      size="sm"
                                    >
                                      {editingIndex !== null ? 'Update' : 'Add'}
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setCurrentEducation({
                                          degree: '',
                                          institution: '',
                                          location: '',
                                          startDate: '',
                                          endDate: '',
                                          gpa: '',
                                          description: '',
                                        });
                                        setEditingIndex(null);
                                        setEditingSection(null);
                                      }}
                                      plain
                                      size="sm"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </FieldGroup>
                              ) : (
                                <Button
                                  onClick={() => {
                                    setCurrentEducation({
                                      degree: '',
                                      institution: '',
                                      location: '',
                                      startDate: '',
                                      endDate: '',
                                      gpa: '',
                                      description: '',
                                    });
                                    setEditingIndex(null);
                                    setEditingSection('education');
                                  }}
                                  outline
                                  size="sm"
                                  className="w-full"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                  Add Entry
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        )}

                        {/* Certifications Card - Only show if added */}
                        {addedSections.includes('certifications') && (
                        <div className="bg-white rounded-lg border border-zinc-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-zinc-950">Certifications</h3>
                            <button
                              onClick={() => setExpandedSections(prev => ({ ...prev, certifications: !prev.certifications }))}
                              className="p-1 hover:bg-zinc-100 rounded transition-colors"
                            >
                              {expandedSections.certifications ? (
                                <ChevronUpIcon className="h-4 w-4 text-zinc-600" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4 text-zinc-600" />
                              )}
                            </button>
                          </div>
                          
                          {expandedSections.certifications && (
                            <div className="space-y-3">
                              {resumeData.certifications && resumeData.certifications.length > 0 ? (
                                <div className="space-y-2">
                                  {resumeData.certifications.map((cert, idx) => (
                                    <div key={idx} className="flex items-start gap-2 p-2 bg-zinc-50 rounded border border-zinc-200">
                                      <div className="w-1 h-full bg-zinc-300 rounded" />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-zinc-950">{cert.name}</p>
                                        <p className="text-xs text-zinc-500">{cert.issuer}</p>
                                        {cert.date && (
                                          <p className="text-xs text-zinc-400">{cert.date}</p>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => {
                                            setCurrentCertification(cert);
                                            setEditingIndex(idx);
                                            setEditingSection('certifications');
                                          }}
                                          className="p-1 hover:bg-zinc-200 rounded"
                                        >
                                          <PencilIcon className="h-3 w-3 text-zinc-600" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setResumeData(prev => ({
                                              ...prev,
                                              certifications: prev.certifications.filter((_, i) => i !== idx),
                                            }));
                                          }}
                                          className="p-1 hover:bg-zinc-200 rounded"
                                        >
                                          <TrashIcon className="h-3 w-3 text-red-600" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-zinc-400 italic">No certifications added yet</p>
                              )}
                              {editingSection === 'certifications' ? (
                                <FieldGroup>
                                  <Field>
                                    <Label>Certification Name</Label>
                                    <Input
                                      value={currentCertification.name}
                                      onChange={(e) => setCurrentCertification(prev => ({ ...prev, name: e.target.value }))}
                                      placeholder="AWS Certified Solutions Architect"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Issuer</Label>
                                    <Input
                                      value={currentCertification.issuer}
                                      onChange={(e) => setCurrentCertification(prev => ({ ...prev, issuer: e.target.value }))}
                                      placeholder="Amazon Web Services"
                                    />
                                  </Field>
                                  <div className="grid grid-cols-2 gap-2">
                                    <Field>
                                      <Label>Date</Label>
                                      <Input
                                        type="month"
                                        value={currentCertification.date}
                                        onChange={(e) => setCurrentCertification(prev => ({ ...prev, date: e.target.value }))}
                                      />
                                    </Field>
                                    <Field>
                                      <Label>Expiry Date (Optional)</Label>
                                      <Input
                                        type="month"
                                        value={currentCertification.expiryDate}
                                        onChange={(e) => setCurrentCertification(prev => ({ ...prev, expiryDate: e.target.value }))}
                                      />
                                    </Field>
                                  </div>
                                  <Field>
                                    <Label>Credential ID (Optional)</Label>
                                    <Input
                                      value={currentCertification.credentialId}
                                      onChange={(e) => setCurrentCertification(prev => ({ ...prev, credentialId: e.target.value }))}
                                      placeholder="ABC123456"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Credential URL (Optional)</Label>
                                    <Input
                                      type="url"
                                      value={currentCertification.credentialUrl}
                                      onChange={(e) => setCurrentCertification(prev => ({ ...prev, credentialUrl: e.target.value }))}
                                      placeholder="https://..."
                                    />
                                  </Field>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => {
                                        if (currentCertification.name && currentCertification.issuer) {
                                          if (editingIndex !== null && editingIndex >= 0) {
                                            setResumeData(prev => ({
                                              ...prev,
                                              certifications: prev.certifications.map((c, i) => i === editingIndex ? currentCertification : c),
                                            }));
                                          } else {
                                            addCertification();
                                          }
                                          setCurrentCertification({
                                            name: '',
                                            issuer: '',
                                            date: '',
                                            expiryDate: '',
                                            credentialId: '',
                                            credentialUrl: '',
                                          });
                                          setEditingIndex(null);
                                          setEditingSection(null);
                                        }
                                      }}
                                      outline
                                      size="sm"
                                    >
                                      {editingIndex !== null ? 'Update' : 'Add'}
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setCurrentCertification({
                                          name: '',
                                          issuer: '',
                                          date: '',
                                          expiryDate: '',
                                          credentialId: '',
                                          credentialUrl: '',
                                        });
                                        setEditingIndex(null);
                                        setEditingSection(null);
                                      }}
                                      plain
                                      size="sm"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </FieldGroup>
                              ) : (
                                <Button
                                  onClick={() => {
                                    setCurrentCertification({
                                      name: '',
                                      issuer: '',
                                      date: '',
                                      expiryDate: '',
                                      credentialId: '',
                                      credentialUrl: '',
                                    });
                                    setEditingIndex(null);
                                    setEditingSection('certifications');
                                  }}
                                  outline
                                  size="sm"
                                  className="w-full"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                  Add Entry
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        )}

                        {/* References Card - Only show if added */}
                        {addedSections.includes('references') && (
                        <div className="bg-white rounded-lg border border-zinc-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-zinc-950">References</h3>
                            <button
                              onClick={() => setExpandedSections(prev => ({ ...prev, references: !prev.references }))}
                              className="p-1 hover:bg-zinc-100 rounded transition-colors"
                            >
                              {expandedSections.references ? (
                                <ChevronUpIcon className="h-4 w-4 text-zinc-600" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4 text-zinc-600" />
                              )}
                            </button>
                          </div>
                          
                          {expandedSections.references && (
                            <div className="space-y-3">
                              {resumeData.references && resumeData.references.length > 0 ? (
                                <div className="space-y-2">
                                  {resumeData.references.map((ref, idx) => (
                                    <div key={idx} className="flex items-start gap-2 p-2 bg-zinc-50 rounded border border-zinc-200">
                                      <div className="w-1 h-full bg-zinc-300 rounded" />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-zinc-950">{ref.name}</p>
                                        <p className="text-xs text-zinc-500">{ref.title} at {ref.company}</p>
                                        {ref.email && (
                                          <p className="text-xs text-zinc-400">{ref.email}</p>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => {
                                            setCurrentReference(ref);
                                            setEditingIndex(idx);
                                            setEditingSection('references');
                                          }}
                                          className="p-1 hover:bg-zinc-200 rounded"
                                        >
                                          <PencilIcon className="h-3 w-3 text-zinc-600" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setResumeData(prev => ({
                                              ...prev,
                                              references: prev.references.filter((_, i) => i !== idx),
                                            }));
                                          }}
                                          className="p-1 hover:bg-zinc-200 rounded"
                                        >
                                          <TrashIcon className="h-3 w-3 text-red-600" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-zinc-400 italic">No references added yet</p>
                              )}
                              {editingSection === 'references' ? (
                                <FieldGroup>
                                  <Field>
                                    <Label>Name</Label>
                                    <Input
                                      value={currentReference.name}
                                      onChange={(e) => setCurrentReference(prev => ({ ...prev, name: e.target.value }))}
                                      placeholder="John Doe"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Title</Label>
                                    <Input
                                      value={currentReference.title}
                                      onChange={(e) => setCurrentReference(prev => ({ ...prev, title: e.target.value }))}
                                      placeholder="Senior Manager"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Company</Label>
                                    <Input
                                      value={currentReference.company}
                                      onChange={(e) => setCurrentReference(prev => ({ ...prev, company: e.target.value }))}
                                      placeholder="Company Name"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Email</Label>
                                    <Input
                                      type="email"
                                      value={currentReference.email}
                                      onChange={(e) => setCurrentReference(prev => ({ ...prev, email: e.target.value }))}
                                      placeholder="john@example.com"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Phone (Optional)</Label>
                                    <Input
                                      value={currentReference.phone}
                                      onChange={(e) => setCurrentReference(prev => ({ ...prev, phone: e.target.value }))}
                                      placeholder="+1 (555) 123-4567"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Relationship (Optional)</Label>
                                    <Input
                                      value={currentReference.relationship}
                                      onChange={(e) => setCurrentReference(prev => ({ ...prev, relationship: e.target.value }))}
                                      placeholder="Former Manager"
                                    />
                                  </Field>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => {
                                        if (currentReference.name && currentReference.email) {
                                          if (editingIndex !== null && editingIndex >= 0) {
                                            setResumeData(prev => ({
                                              ...prev,
                                              references: prev.references.map((r, i) => i === editingIndex ? currentReference : r),
                                            }));
                                          } else {
                                            addReference();
                                          }
                                          setCurrentReference({
                                            name: '',
                                            title: '',
                                            company: '',
                                            email: '',
                                            phone: '',
                                            relationship: '',
                                          });
                                          setEditingIndex(null);
                                          setEditingSection(null);
                                        }
                                      }}
                                      outline
                                      size="sm"
                                    >
                                      {editingIndex !== null ? 'Update' : 'Add'}
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setCurrentReference({
                                          name: '',
                                          title: '',
                                          company: '',
                                          email: '',
                                          phone: '',
                                          relationship: '',
                                        });
                                        setEditingIndex(null);
                                        setEditingSection(null);
                                      }}
                                      plain
                                      size="sm"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </FieldGroup>
                              ) : (
                                <Button
                                  onClick={() => {
                                    setCurrentReference({
                                      name: '',
                                      title: '',
                                      company: '',
                                      email: '',
                                      phone: '',
                                      relationship: '',
                                    });
                                    setEditingIndex(null);
                                    setEditingSection('references');
                                  }}
                                  outline
                                  size="sm"
                                  className="w-full"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                  Add Entry
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        )}

                        {/* Languages Card - Only show if added */}
                        {addedSections.includes('languages') && (
                        <div className="bg-white rounded-lg border border-zinc-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-zinc-950">Languages</h3>
                            <button
                              onClick={() => setExpandedSections(prev => ({ ...prev, languages: !prev.languages }))}
                              className="p-1 hover:bg-zinc-100 rounded transition-colors"
                            >
                              {expandedSections.languages ? (
                                <ChevronUpIcon className="h-4 w-4 text-zinc-600" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4 text-zinc-600" />
                              )}
                            </button>
                          </div>
                          
                          {expandedSections.languages && (
                            <div className="space-y-3">
                              {resumeData.languages && resumeData.languages.length > 0 ? (
                                <div className="space-y-2">
                                  {resumeData.languages.map((lang, idx) => (
                                    <div key={idx} className="flex items-start gap-2 p-2 bg-zinc-50 rounded border border-zinc-200">
                                      <div className="w-1 h-full bg-zinc-300 rounded" />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-zinc-950">{lang.language}</p>
                                        <p className="text-xs text-zinc-500">{lang.proficiency}</p>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => {
                                            setCurrentLanguage(lang);
                                            setEditingIndex(idx);
                                            setEditingSection('languages');
                                          }}
                                          className="p-1 hover:bg-zinc-200 rounded"
                                        >
                                          <PencilIcon className="h-3 w-3 text-zinc-600" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setResumeData(prev => ({
                                              ...prev,
                                              languages: prev.languages.filter((_, i) => i !== idx),
                                            }));
                                          }}
                                          className="p-1 hover:bg-zinc-200 rounded"
                                        >
                                          <TrashIcon className="h-3 w-3 text-red-600" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-zinc-400 italic">No languages added yet</p>
                              )}
                              {editingSection === 'languages' ? (
                                <FieldGroup>
                                  <Field>
                                    <Label>Language</Label>
                                    <Input
                                      value={currentLanguage.language}
                                      onChange={(e) => setCurrentLanguage(prev => ({ ...prev, language: e.target.value }))}
                                      placeholder="English"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Proficiency</Label>
                                    <select
                                      value={currentLanguage.proficiency}
                                      onChange={(e) => setCurrentLanguage(prev => ({ ...prev, proficiency: e.target.value }))}
                                      className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                                    >
                                      <option value="Native">Native</option>
                                      <option value="Fluent">Fluent</option>
                                      <option value="Conversational">Conversational</option>
                                      <option value="Basic">Basic</option>
                                    </select>
                                  </Field>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => {
                                        if (currentLanguage.language) {
                                          if (editingIndex !== null && editingIndex >= 0) {
                                            setResumeData(prev => ({
                                              ...prev,
                                              languages: prev.languages.map((l, i) => i === editingIndex ? currentLanguage : l),
                                            }));
                                          } else {
                                            addLanguage();
                                          }
                                          setCurrentLanguage({ language: '', proficiency: 'Native' });
                                          setEditingIndex(null);
                                          setEditingSection(null);
                                        }
                                      }}
                                      outline
                                      size="sm"
                                    >
                                      {editingIndex !== null ? 'Update' : 'Add'}
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setCurrentLanguage({ language: '', proficiency: 'Native' });
                                        setEditingIndex(null);
                                        setEditingSection(null);
                                      }}
                                      plain
                                      size="sm"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </FieldGroup>
                              ) : (
                                <Button
                                  onClick={() => {
                                    setCurrentLanguage({ language: '', proficiency: 'Native' });
                                    setEditingIndex(null);
                                    setEditingSection('languages');
                                  }}
                                  outline
                                  size="sm"
                                  className="w-full"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                  Add Entry
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        )}

                        {/* Interests Card - Only show if added */}
                        {addedSections.includes('interests') && (
                        <div className="bg-white rounded-lg border border-zinc-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-zinc-950">Interests</h3>
                            <button
                              onClick={() => setExpandedSections(prev => ({ ...prev, interests: !prev.interests }))}
                              className="p-1 hover:bg-zinc-100 rounded transition-colors"
                            >
                              {expandedSections.interests ? (
                                <ChevronUpIcon className="h-4 w-4 text-zinc-600" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4 text-zinc-600" />
                              )}
                            </button>
                          </div>
                          
                          {expandedSections.interests && (
                            <div className="space-y-3">
                              {resumeData.interests && resumeData.interests.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {resumeData.interests.map((interest, idx) => (
                                    <div key={idx} className="flex items-center gap-1 px-2 py-1 bg-zinc-100 rounded text-sm">
                                      <span>{interest}</span>
                                      <button
                                        onClick={() => {
                                          setResumeData(prev => ({
                                            ...prev,
                                            interests: prev.interests.filter((_, i) => i !== idx),
                                          }));
                                        }}
                                        className="ml-1 hover:text-red-600"
                                      >
                                        <XMarkIcon className="h-3 w-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-zinc-400 italic">No interests added yet</p>
                              )}
                              {editingSection === 'interests' ? (
                                <FieldGroup>
                                  <Field>
                                    <Label>Interest</Label>
                                    <Input
                                      value={currentInterest}
                                      onChange={(e) => setCurrentInterest(e.target.value)}
                                      placeholder="Photography"
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          if (currentInterest.trim()) {
                                            addInterest();
                                          }
                                        }
                                      }}
                                    />
                                  </Field>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => {
                                        if (currentInterest.trim()) {
                                          addInterest();
                                        }
                                      }}
                                      outline
                                      size="sm"
                                    >
                                      Add
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setCurrentInterest('');
                                        setEditingSection(null);
                                      }}
                                      plain
                                      size="sm"
                                    >
                                      Done
                                    </Button>
                                  </div>
                                </FieldGroup>
                              ) : (
                                <Button
                                  onClick={() => setEditingSection('interests')}
                                  outline
                                  size="sm"
                                  className="w-full"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                  Add Interest
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        )}

                        {/* Projects Card - Only show if added */}
                        {addedSections.includes('projects') && (
                        <div className="bg-white rounded-lg border border-zinc-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-zinc-950">Projects</h3>
                            <button
                              onClick={() => setExpandedSections(prev => ({ ...prev, projects: !prev.projects }))}
                              className="p-1 hover:bg-zinc-100 rounded transition-colors"
                            >
                              {expandedSections.projects ? (
                                <ChevronUpIcon className="h-4 w-4 text-zinc-600" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4 text-zinc-600" />
                              )}
                            </button>
                          </div>
                          
                          {expandedSections.projects && (
                            <div className="space-y-3">
                              {resumeData.projects && resumeData.projects.length > 0 ? (
                                <div className="space-y-2">
                                  {resumeData.projects.map((project, idx) => (
                                    <div key={idx} className="flex items-start gap-2 p-2 bg-zinc-50 rounded border border-zinc-200">
                                      <div className="w-1 h-full bg-zinc-300 rounded" />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-zinc-950">{project.name}</p>
                                        {project.technologies && (
                                          <p className="text-xs text-zinc-500">{project.technologies}</p>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => {
                                            setCurrentProject(project);
                                            setEditingIndex(idx);
                                            setEditingSection('projects');
                                          }}
                                          className="p-1 hover:bg-zinc-200 rounded"
                                        >
                                          <PencilIcon className="h-3 w-3 text-zinc-600" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setResumeData(prev => ({
                                              ...prev,
                                              projects: prev.projects.filter((_, i) => i !== idx),
                                            }));
                                          }}
                                          className="p-1 hover:bg-zinc-200 rounded"
                                        >
                                          <TrashIcon className="h-3 w-3 text-red-600" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-zinc-400 italic">No projects added yet</p>
                              )}
                              {editingSection === 'projects' ? (
                                <FieldGroup>
                                  <Field>
                                    <Label>Project Name</Label>
                                    <Input
                                      value={currentProject.name}
                                      onChange={(e) => setCurrentProject(prev => ({ ...prev, name: e.target.value }))}
                                      placeholder="E-commerce Platform"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Description</Label>
                                    <RichTextEditor
                                      value={currentProject.description || ''}
                                      onChange={(value) => setCurrentProject(prev => ({ ...prev, description: value }))}
                                      placeholder="Describe your project..."
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Technologies</Label>
                                    <Input
                                      value={currentProject.technologies}
                                      onChange={(e) => setCurrentProject(prev => ({ ...prev, technologies: e.target.value }))}
                                      placeholder="React, Node.js, MongoDB"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>URL (Optional)</Label>
                                    <Input
                                      type="url"
                                      value={currentProject.url}
                                      onChange={(e) => setCurrentProject(prev => ({ ...prev, url: e.target.value }))}
                                      placeholder="https://..."
                                    />
                                  </Field>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => {
                                        if (currentProject.name) {
                                          if (editingIndex !== null && editingIndex >= 0) {
                                            setResumeData(prev => ({
                                              ...prev,
                                              projects: prev.projects.map((p, i) => i === editingIndex ? currentProject : p),
                                            }));
                                          } else {
                                            addProject();
                                          }
                                          setCurrentProject({ name: '', description: '', technologies: '', url: '', startDate: '', endDate: '' });
                                          setEditingIndex(null);
                                          setEditingSection(null);
                                        }
                                      }}
                                      outline
                                      size="sm"
                                    >
                                      {editingIndex !== null ? 'Update' : 'Add'}
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setCurrentProject({ name: '', description: '', technologies: '', url: '', startDate: '', endDate: '' });
                                        setEditingIndex(null);
                                        setEditingSection(null);
                                      }}
                                      plain
                                      size="sm"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </FieldGroup>
                              ) : (
                                <Button
                                  onClick={() => {
                                    setCurrentProject({ name: '', description: '', technologies: '', url: '', startDate: '', endDate: '' });
                                    setEditingIndex(null);
                                    setEditingSection('projects');
                                  }}
                                  outline
                                  size="sm"
                                  className="w-full"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                  Add Entry
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        )}

                        {/* Courses Card - Only show if added */}
                        {addedSections.includes('courses') && (
                        <div className="bg-white rounded-lg border border-zinc-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-zinc-950">Courses</h3>
                            <button
                              onClick={() => setExpandedSections(prev => ({ ...prev, courses: !prev.courses }))}
                              className="p-1 hover:bg-zinc-100 rounded transition-colors"
                            >
                              {expandedSections.courses ? (
                                <ChevronUpIcon className="h-4 w-4 text-zinc-600" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4 text-zinc-600" />
                              )}
                            </button>
                          </div>
                          
                          {expandedSections.courses && (
                            <div className="space-y-3">
                              {resumeData.courses && resumeData.courses.length > 0 ? (
                                <div className="space-y-2">
                                  {resumeData.courses.map((course, idx) => (
                                    <div key={idx} className="flex items-start gap-2 p-2 bg-zinc-50 rounded border border-zinc-200">
                                      <div className="w-1 h-full bg-zinc-300 rounded" />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-zinc-950">{course.name}</p>
                                        <p className="text-xs text-zinc-500">{course.provider}</p>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => {
                                            setCurrentCourse(course);
                                            setEditingIndex(idx);
                                            setEditingSection('courses');
                                          }}
                                          className="p-1 hover:bg-zinc-200 rounded"
                                        >
                                          <PencilIcon className="h-3 w-3 text-zinc-600" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setResumeData(prev => ({
                                              ...prev,
                                              courses: prev.courses.filter((_, i) => i !== idx),
                                            }));
                                          }}
                                          className="p-1 hover:bg-zinc-200 rounded"
                                        >
                                          <TrashIcon className="h-3 w-3 text-red-600" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-zinc-400 italic">No courses added yet</p>
                              )}
                              {editingSection === 'courses' ? (
                                <FieldGroup>
                                  <Field>
                                    <Label>Course Name</Label>
                                    <Input
                                      value={currentCourse.name}
                                      onChange={(e) => setCurrentCourse(prev => ({ ...prev, name: e.target.value }))}
                                      placeholder="Machine Learning Specialization"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Provider</Label>
                                    <Input
                                      value={currentCourse.provider}
                                      onChange={(e) => setCurrentCourse(prev => ({ ...prev, provider: e.target.value }))}
                                      placeholder="Coursera"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Date</Label>
                                    <Input
                                      type="month"
                                      value={currentCourse.date}
                                      onChange={(e) => setCurrentCourse(prev => ({ ...prev, date: e.target.value }))}
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Certificate URL (Optional)</Label>
                                    <Input
                                      type="url"
                                      value={currentCourse.certificateUrl}
                                      onChange={(e) => setCurrentCourse(prev => ({ ...prev, certificateUrl: e.target.value }))}
                                      placeholder="https://..."
                                    />
                                  </Field>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => {
                                        if (currentCourse.name) {
                                          if (editingIndex !== null && editingIndex >= 0) {
                                            setResumeData(prev => ({
                                              ...prev,
                                              courses: prev.courses.map((c, i) => i === editingIndex ? currentCourse : c),
                                            }));
                                          } else {
                                            addCourse();
                                          }
                                          setCurrentCourse({ name: '', provider: '', date: '', certificateUrl: '' });
                                          setEditingIndex(null);
                                          setEditingSection(null);
                                        }
                                      }}
                                      outline
                                      size="sm"
                                    >
                                      {editingIndex !== null ? 'Update' : 'Add'}
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setCurrentCourse({ name: '', provider: '', date: '', certificateUrl: '' });
                                        setEditingIndex(null);
                                        setEditingSection(null);
                                      }}
                                      plain
                                      size="sm"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </FieldGroup>
                              ) : (
                                <Button
                                  onClick={() => {
                                    setCurrentCourse({ name: '', provider: '', date: '', certificateUrl: '' });
                                    setEditingIndex(null);
                                    setEditingSection('courses');
                                  }}
                                  outline
                                  size="sm"
                                  className="w-full"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                  Add Entry
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        )}

                        {/* Awards Card - Only show if added */}
                        {addedSections.includes('awards') && (
                        <div className="bg-white rounded-lg border border-zinc-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-zinc-950">Awards</h3>
                            <button
                              onClick={() => setExpandedSections(prev => ({ ...prev, awards: !prev.awards }))}
                              className="p-1 hover:bg-zinc-100 rounded transition-colors"
                            >
                              {expandedSections.awards ? (
                                <ChevronUpIcon className="h-4 w-4 text-zinc-600" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4 text-zinc-600" />
                              )}
                            </button>
                          </div>
                          
                          {expandedSections.awards && (
                            <div className="space-y-3">
                              {resumeData.awards && resumeData.awards.length > 0 ? (
                                <div className="space-y-2">
                                  {resumeData.awards.map((award, idx) => (
                                    <div key={idx} className="flex items-start gap-2 p-2 bg-zinc-50 rounded border border-zinc-200">
                                      <div className="w-1 h-full bg-zinc-300 rounded" />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-zinc-950">{award.title}</p>
                                        <p className="text-xs text-zinc-500">{award.issuer}</p>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => {
                                            setCurrentAward(award);
                                            setEditingIndex(idx);
                                            setEditingSection('awards');
                                          }}
                                          className="p-1 hover:bg-zinc-200 rounded"
                                        >
                                          <PencilIcon className="h-3 w-3 text-zinc-600" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setResumeData(prev => ({
                                              ...prev,
                                              awards: prev.awards.filter((_, i) => i !== idx),
                                            }));
                                          }}
                                          className="p-1 hover:bg-zinc-200 rounded"
                                        >
                                          <TrashIcon className="h-3 w-3 text-red-600" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-zinc-400 italic">No awards added yet</p>
                              )}
                              {editingSection === 'awards' ? (
                                <FieldGroup>
                                  <Field>
                                    <Label>Award Title</Label>
                                    <Input
                                      value={currentAward.title}
                                      onChange={(e) => setCurrentAward(prev => ({ ...prev, title: e.target.value }))}
                                      placeholder="Best Student Award"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Issuer</Label>
                                    <Input
                                      value={currentAward.issuer}
                                      onChange={(e) => setCurrentAward(prev => ({ ...prev, issuer: e.target.value }))}
                                      placeholder="University Name"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Date</Label>
                                    <Input
                                      type="month"
                                      value={currentAward.date}
                                      onChange={(e) => setCurrentAward(prev => ({ ...prev, date: e.target.value }))}
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Description (Optional)</Label>
                                    <Textarea
                                      value={currentAward.description}
                                      onChange={(e) => setCurrentAward(prev => ({ ...prev, description: e.target.value }))}
                                      placeholder="Additional details..."
                                    />
                                  </Field>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => {
                                        if (currentAward.title) {
                                          if (editingIndex !== null && editingIndex >= 0) {
                                            setResumeData(prev => ({
                                              ...prev,
                                              awards: prev.awards.map((a, i) => i === editingIndex ? currentAward : a),
                                            }));
                                          } else {
                                            addAward();
                                          }
                                          setCurrentAward({ title: '', issuer: '', date: '', description: '' });
                                          setEditingIndex(null);
                                          setEditingSection(null);
                                        }
                                      }}
                                      outline
                                      size="sm"
                                    >
                                      {editingIndex !== null ? 'Update' : 'Add'}
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setCurrentAward({ title: '', issuer: '', date: '', description: '' });
                                        setEditingIndex(null);
                                        setEditingSection(null);
                                      }}
                                      plain
                                      size="sm"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </FieldGroup>
                              ) : (
                                <Button
                                  onClick={() => {
                                    setCurrentAward({ title: '', issuer: '', date: '', description: '' });
                                    setEditingIndex(null);
                                    setEditingSection('awards');
                                  }}
                                  outline
                                  size="sm"
                                  className="w-full"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                  Add Entry
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        )}

                        {/* Organizations Card - Only show if added */}
                        {addedSections.includes('organizations') && (
                        <div className="bg-white rounded-lg border border-zinc-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-zinc-950">Organizations</h3>
                            <button
                              onClick={() => setExpandedSections(prev => ({ ...prev, organizations: !prev.organizations }))}
                              className="p-1 hover:bg-zinc-100 rounded transition-colors"
                            >
                              {expandedSections.organizations ? (
                                <ChevronUpIcon className="h-4 w-4 text-zinc-600" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4 text-zinc-600" />
                              )}
                            </button>
                          </div>
                          
                          {expandedSections.organizations && (
                            <div className="space-y-3">
                              {resumeData.organizations && resumeData.organizations.length > 0 ? (
                                <div className="space-y-2">
                                  {resumeData.organizations.map((org, idx) => (
                                    <div key={idx} className="flex items-start gap-2 p-2 bg-zinc-50 rounded border border-zinc-200">
                                      <div className="w-1 h-full bg-zinc-300 rounded" />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-zinc-950">{org.name}</p>
                                        <p className="text-xs text-zinc-500">{org.role}</p>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => {
                                            setCurrentOrganization(org);
                                            setEditingIndex(idx);
                                            setEditingSection('organizations');
                                          }}
                                          className="p-1 hover:bg-zinc-200 rounded"
                                        >
                                          <PencilIcon className="h-3 w-3 text-zinc-600" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setResumeData(prev => ({
                                              ...prev,
                                              organizations: prev.organizations.filter((_, i) => i !== idx),
                                            }));
                                          }}
                                          className="p-1 hover:bg-zinc-200 rounded"
                                        >
                                          <TrashIcon className="h-3 w-3 text-red-600" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-zinc-400 italic">No organizations added yet</p>
                              )}
                              {editingSection === 'organizations' ? (
                                <FieldGroup>
                                  <Field>
                                    <Label>Organization Name</Label>
                                    <Input
                                      value={currentOrganization.name}
                                      onChange={(e) => setCurrentOrganization(prev => ({ ...prev, name: e.target.value }))}
                                      placeholder="Red Cross"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Role</Label>
                                    <Input
                                      value={currentOrganization.role}
                                      onChange={(e) => setCurrentOrganization(prev => ({ ...prev, role: e.target.value }))}
                                      placeholder="Volunteer"
                                    />
                                  </Field>
                                  <div className="grid grid-cols-2 gap-2">
                                    <Field>
                                      <Label>Start Date</Label>
                                      <Input
                                        type="month"
                                        value={currentOrganization.startDate}
                                        onChange={(e) => setCurrentOrganization(prev => ({ ...prev, startDate: e.target.value }))}
                                      />
                                    </Field>
                                    <Field>
                                      <Label>End Date</Label>
                                      <Input
                                        type="month"
                                        value={currentOrganization.endDate}
                                        onChange={(e) => setCurrentOrganization(prev => ({ ...prev, endDate: e.target.value }))}
                                      />
                                    </Field>
                                  </div>
                                  <Field>
                                    <Label>Description (Optional)</Label>
                                    <Textarea
                                      value={currentOrganization.description}
                                      onChange={(e) => setCurrentOrganization(prev => ({ ...prev, description: e.target.value }))}
                                      placeholder="Your contributions..."
                                    />
                                  </Field>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => {
                                        if (currentOrganization.name) {
                                          if (editingIndex !== null && editingIndex >= 0) {
                                            setResumeData(prev => ({
                                              ...prev,
                                              organizations: prev.organizations.map((o, i) => i === editingIndex ? currentOrganization : o),
                                            }));
                                          } else {
                                            addOrganization();
                                          }
                                          setCurrentOrganization({ name: '', role: '', startDate: '', endDate: '', description: '' });
                                          setEditingIndex(null);
                                          setEditingSection(null);
                                        }
                                      }}
                                      outline
                                      size="sm"
                                    >
                                      {editingIndex !== null ? 'Update' : 'Add'}
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setCurrentOrganization({ name: '', role: '', startDate: '', endDate: '', description: '' });
                                        setEditingIndex(null);
                                        setEditingSection(null);
                                      }}
                                      plain
                                      size="sm"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </FieldGroup>
                              ) : (
                                <Button
                                  onClick={() => {
                                    setCurrentOrganization({ name: '', role: '', startDate: '', endDate: '', description: '' });
                                    setEditingIndex(null);
                                    setEditingSection('organizations');
                                  }}
                                  outline
                                  size="sm"
                                  className="w-full"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                  Add Entry
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        )}

                        {/* Publications Card - Only show if added */}
                        {addedSections.includes('publications') && (
                        <div className="bg-white rounded-lg border border-zinc-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-zinc-950">Publications</h3>
                            <button
                              onClick={() => setExpandedSections(prev => ({ ...prev, publications: !prev.publications }))}
                              className="p-1 hover:bg-zinc-100 rounded transition-colors"
                            >
                              {expandedSections.publications ? (
                                <ChevronUpIcon className="h-4 w-4 text-zinc-600" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4 text-zinc-600" />
                              )}
                            </button>
                          </div>
                          
                          {expandedSections.publications && (
                            <div className="space-y-3">
                              {resumeData.publications && resumeData.publications.length > 0 ? (
                                <div className="space-y-2">
                                  {resumeData.publications.map((pub, idx) => (
                                    <div key={idx} className="flex items-start gap-2 p-2 bg-zinc-50 rounded border border-zinc-200">
                                      <div className="w-1 h-full bg-zinc-300 rounded" />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-zinc-950">{pub.title}</p>
                                        <p className="text-xs text-zinc-500">{pub.publisher}</p>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => {
                                            setCurrentPublication(pub);
                                            setEditingIndex(idx);
                                            setEditingSection('publications');
                                          }}
                                          className="p-1 hover:bg-zinc-200 rounded"
                                        >
                                          <PencilIcon className="h-3 w-3 text-zinc-600" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setResumeData(prev => ({
                                              ...prev,
                                              publications: prev.publications.filter((_, i) => i !== idx),
                                            }));
                                          }}
                                          className="p-1 hover:bg-zinc-200 rounded"
                                        >
                                          <TrashIcon className="h-3 w-3 text-red-600" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-zinc-400 italic">No publications added yet</p>
                              )}
                              {editingSection === 'publications' ? (
                                <FieldGroup>
                                  <Field>
                                    <Label>Title</Label>
                                    <Input
                                      value={currentPublication.title}
                                      onChange={(e) => setCurrentPublication(prev => ({ ...prev, title: e.target.value }))}
                                      placeholder="Research Paper Title"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Publisher</Label>
                                    <Input
                                      value={currentPublication.publisher}
                                      onChange={(e) => setCurrentPublication(prev => ({ ...prev, publisher: e.target.value }))}
                                      placeholder="Journal Name"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Date</Label>
                                    <Input
                                      type="month"
                                      value={currentPublication.date}
                                      onChange={(e) => setCurrentPublication(prev => ({ ...prev, date: e.target.value }))}
                                    />
                                  </Field>
                                  <Field>
                                    <Label>URL (Optional)</Label>
                                    <Input
                                      type="url"
                                      value={currentPublication.url}
                                      onChange={(e) => setCurrentPublication(prev => ({ ...prev, url: e.target.value }))}
                                      placeholder="https://..."
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Description (Optional)</Label>
                                    <Textarea
                                      value={currentPublication.description}
                                      onChange={(e) => setCurrentPublication(prev => ({ ...prev, description: e.target.value }))}
                                      placeholder="Additional details..."
                                    />
                                  </Field>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => {
                                        if (currentPublication.title) {
                                          if (editingIndex !== null && editingIndex >= 0) {
                                            setResumeData(prev => ({
                                              ...prev,
                                              publications: prev.publications.map((p, i) => i === editingIndex ? currentPublication : p),
                                            }));
                                          } else {
                                            addPublication();
                                          }
                                          setCurrentPublication({ title: '', publisher: '', date: '', url: '', description: '' });
                                          setEditingIndex(null);
                                          setEditingSection(null);
                                        }
                                      }}
                                      outline
                                      size="sm"
                                    >
                                      {editingIndex !== null ? 'Update' : 'Add'}
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setCurrentPublication({ title: '', publisher: '', date: '', url: '', description: '' });
                                        setEditingIndex(null);
                                        setEditingSection(null);
                                      }}
                                      plain
                                      size="sm"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </FieldGroup>
                              ) : (
                                <Button
                                  onClick={() => {
                                    setCurrentPublication({ title: '', publisher: '', date: '', url: '', description: '' });
                                    setEditingIndex(null);
                                    setEditingSection('publications');
                                  }}
                                  outline
                                  size="sm"
                                  className="w-full"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                  Add Entry
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        )}

                        {/* Declaration Card - Only show if added */}
                        {addedSections.includes('declaration') && (
                        <div className="bg-white rounded-lg border border-zinc-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-zinc-950">Declaration</h3>
                            <button
                              onClick={() => setExpandedSections(prev => ({ ...prev, declaration: !prev.declaration }))}
                              className="p-1 hover:bg-zinc-100 rounded transition-colors"
                            >
                              {expandedSections.declaration ? (
                                <ChevronUpIcon className="h-4 w-4 text-zinc-600" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4 text-zinc-600" />
                              )}
                            </button>
                          </div>
                          
                          {expandedSections.declaration && (
                            <div className="space-y-2">
                              {editingSection === 'declaration' ? (
                                <RichTextEditor
                                  value={resumeData.declaration || ''}
                                  onChange={(value) => setResumeData(prev => ({ ...prev, declaration: value }))}
                                  placeholder="I hereby declare that the information provided is true and correct..."
                                />
                              ) : (
                                <div className="space-y-2">
                                  {resumeData.declaration ? (
                                    <div 
                                      className="text-sm text-zinc-600 prose prose-sm max-w-none"
                                      dangerouslySetInnerHTML={{ __html: resumeData.declaration }}
                                    />
                                  ) : (
                                    <p className="text-sm text-zinc-400 italic">No declaration added yet</p>
                                  )}
                                  <Button
                                    onClick={() => setEditingSection('declaration')}
                                    plain
                                    size="sm"
                                    className="text-xs"
                                  >
                                    <PencilIcon className="h-3 w-3" />
                                    Edit
                                  </Button>
                                </div>
                              )}
                              {editingSection === 'declaration' && (
                                <div className="flex gap-2 mt-2">
                                  <Button onClick={() => setEditingSection(null)} outline size="sm">
                                    Save
                                  </Button>
                                  <Button onClick={() => setEditingSection(null)} plain size="sm">
                                    Cancel
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        )}

                        {/* Custom Card - Only show if added */}
                        {addedSections.includes('custom') && (
                        <div className="bg-white rounded-lg border border-zinc-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-zinc-950">Custom Section</h3>
                            <button
                              onClick={() => setExpandedSections(prev => ({ ...prev, custom: !prev.custom }))}
                              className="p-1 hover:bg-zinc-100 rounded transition-colors"
                            >
                              {expandedSections.custom ? (
                                <ChevronUpIcon className="h-4 w-4 text-zinc-600" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4 text-zinc-600" />
                              )}
                            </button>
                          </div>
                          
                          {expandedSections.custom && (
                            <div className="space-y-3">
                              {resumeData.custom && resumeData.custom.length > 0 ? (
                                <div className="space-y-2">
                                  {resumeData.custom.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-2 p-2 bg-zinc-50 rounded border border-zinc-200">
                                      <div className="w-1 h-full bg-zinc-300 rounded" />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-zinc-950">{item.title}</p>
                                        {item.content && (
                                          <p className="text-xs text-zinc-500 line-clamp-2">{item.content}</p>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => {
                                            setCurrentCustom(item);
                                            setEditingIndex(idx);
                                            setEditingSection('custom');
                                          }}
                                          className="p-1 hover:bg-zinc-200 rounded"
                                        >
                                          <PencilIcon className="h-3 w-3 text-zinc-600" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setResumeData(prev => ({
                                              ...prev,
                                              custom: prev.custom.filter((_, i) => i !== idx),
                                            }));
                                          }}
                                          className="p-1 hover:bg-zinc-200 rounded"
                                        >
                                          <TrashIcon className="h-3 w-3 text-red-600" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-zinc-400 italic">No custom sections added yet</p>
                              )}
                              {editingSection === 'custom' ? (
                                <FieldGroup>
                                  <Field>
                                    <Label>Section Title</Label>
                                    <Input
                                      value={currentCustom.title}
                                      onChange={(e) => setCurrentCustom(prev => ({ ...prev, title: e.target.value }))}
                                      placeholder="Custom Section Title"
                                    />
                                  </Field>
                                  <Field>
                                    <Label>Content</Label>
                                    <RichTextEditor
                                      value={currentCustom.content || ''}
                                      onChange={(value) => setCurrentCustom(prev => ({ ...prev, content: value }))}
                                      placeholder="Enter your custom content..."
                                    />
                                  </Field>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => {
                                        if (currentCustom.title) {
                                          if (editingIndex !== null && editingIndex >= 0) {
                                            setResumeData(prev => ({
                                              ...prev,
                                              custom: prev.custom.map((c, i) => i === editingIndex ? currentCustom : c),
                                            }));
                                          } else {
                                            addCustom();
                                          }
                                          setCurrentCustom({ title: '', content: '' });
                                          setEditingIndex(null);
                                          setEditingSection(null);
                                        }
                                      }}
                                      outline
                                      size="sm"
                                    >
                                      {editingIndex !== null ? 'Update' : 'Add'}
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setCurrentCustom({ title: '', content: '' });
                                        setEditingIndex(null);
                                        setEditingSection(null);
                                      }}
                                      plain
                                      size="sm"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </FieldGroup>
                              ) : (
                                <Button
                                  onClick={() => {
                                    setCurrentCustom({ title: '', content: '' });
                                    setEditingIndex(null);
                                    setEditingSection('custom');
                                  }}
                                  outline
                                  size="sm"
                                  className="w-full"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                  Add Entry
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        )}
                        
                        {/* Add Content Button - Opens Modal to Select Block Type */}
                        <button 
                          onClick={() => setShowAddBlockModal(true)}
                          className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2"
                        >
                          <PlusIcon className="h-5 w-5" />
                          Add Content
                        </button>
                        
                        {/* Block Type Selection Modal - Grid Layout */}
                        <Transition appear show={showAddBlockModal} as={Fragment}>
                          <Dialog as="div" className="relative z-50" onClose={() => setShowAddBlockModal(false)}>
                            <Transition.Child
                              as={Fragment}
                              enter="ease-out duration-300"
                              enterFrom="opacity-0"
                              enterTo="opacity-100"
                              leave="ease-in duration-200"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <div className="fixed inset-0 bg-black/30" />
                            </Transition.Child>

                            <div className="fixed inset-0 overflow-y-auto">
                              <div className="flex min-h-full items-center justify-center p-4">
                                <Transition.Child
                                  as={Fragment}
                                  enter="ease-out duration-300"
                                  enterFrom="opacity-0 scale-95"
                                  enterTo="opacity-100 scale-100"
                                  leave="ease-in duration-200"
                                  leaveFrom="opacity-100 scale-100"
                                  leaveTo="opacity-0 scale-95"
                                >
                                  <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                                    {/* Header */}
                                    <div className="flex items-center justify-between p-6 border-b border-zinc-200">
                                      <div className="flex items-center gap-4">
                                        <h2 className="text-2xl font-bold text-purple-900">Add content</h2>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm text-zinc-600">Quick start:</span>
                                          <button className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2 text-sm font-medium">
                                            <CloudArrowUpIcon className="h-4 w-4" />
                                            Import Resume
                                          </button>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => setShowAddBlockModal(false)}
                                        className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                                      >
                                        <XMarkIcon className="h-5 w-5 text-zinc-600" />
                                      </button>
                                    </div>

                                    {/* Content Blocks Grid */}
                                    <div className="p-6">
                                      <div className="grid grid-cols-4 gap-4">
                                        {/* Education */}
                                        <button
                                          onClick={() => {
                                            if (!addedSections.includes('education')) {
                                              setAddedSections(prev => [...prev, 'education']);
                                              setSelectedBlockType('education');
                                              setEditingSection('education');
                                              setExpandedSections(prev => ({ ...prev, education: true }));
                                              setShowAddBlockModal(false);
                                            }
                                          }}
                                          disabled={addedSections.includes('education')}
                                          className={`p-4 rounded-lg border transition-all text-left ${
                                            addedSections.includes('education')
                                              ? 'bg-zinc-100 border-zinc-300 opacity-50 cursor-not-allowed'
                                              : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                                          }`}
                                        >
                                          <div className="flex items-start justify-between mb-3">
                                            <AcademicCapIcon className="h-8 w-8 text-zinc-600" />
                                            {addedSections.includes('education') && (
                                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                            )}
                                          </div>
                                          <h3 className="font-semibold text-zinc-950 mb-1">Education</h3>
                                          <p className="text-xs text-zinc-600">Show off your primary education, college degrees & exchange semesters.</p>
                                        </button>

                                        {/* Professional Experience */}
                                        <button
                                          onClick={() => {
                                            if (!addedSections.includes('experience')) {
                                              setAddedSections(prev => [...prev, 'experience']);
                                              setSelectedBlockType('experience');
                                              setEditingSection('experience');
                                              setExpandedSections(prev => ({ ...prev, experience: true }));
                                              setShowAddBlockModal(false);
                                            }
                                          }}
                                          disabled={addedSections.includes('experience')}
                                          className={`p-4 rounded-lg border transition-all text-left ${
                                            addedSections.includes('experience')
                                              ? 'bg-zinc-100 border-zinc-300 opacity-50 cursor-not-allowed'
                                              : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                                          }`}
                                        >
                                          <div className="flex items-start justify-between mb-3">
                                            <BriefcaseIcon className="h-8 w-8 text-zinc-600" />
                                            {addedSections.includes('experience') && (
                                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                            )}
                                          </div>
                                          <h3 className="font-semibold text-zinc-950 mb-1">Professional Experience</h3>
                                          <p className="text-xs text-zinc-600">A place to highlight your professional experience - including internships.</p>
                                        </button>

                                        {/* Skills */}
                                        <button
                                          onClick={() => {
                                            if (!addedSections.includes('skills')) {
                                              setAddedSections(prev => [...prev, 'skills']);
                                              setSelectedBlockType('skills');
                                              setEditingSection('skills');
                                              setExpandedSections(prev => ({ ...prev, skills: true }));
                                              setShowAddBlockModal(false);
                                            }
                                          }}
                                          disabled={addedSections.includes('skills')}
                                          className={`p-4 rounded-lg border transition-all text-left ${
                                            addedSections.includes('skills')
                                              ? 'bg-zinc-100 border-zinc-300 opacity-50 cursor-not-allowed'
                                              : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                                          }`}
                                        >
                                          <div className="flex items-start justify-between mb-3">
                                            <LightBulbIcon className="h-8 w-8 text-zinc-600" />
                                            {addedSections.includes('skills') && (
                                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                            )}
                                          </div>
                                          <h3 className="font-semibold text-zinc-950 mb-1">Skills</h3>
                                          <p className="text-xs text-zinc-600">List your technical, managerial or soft skills in this section.</p>
                                        </button>

                                        {/* Profile Summary */}
                                        <button
                                          onClick={() => {
                                            if (!addedSections.includes('profileSummary')) {
                                              setAddedSections(prev => [...prev, 'profileSummary']);
                                              setSelectedBlockType('profileSummary');
                                              setEditingSection('profileSummary');
                                              setExpandedSections(prev => ({ ...prev, profileSummary: true }));
                                              setShowAddBlockModal(false);
                                            }
                                          }}
                                          disabled={addedSections.includes('profileSummary')}
                                          className={`p-4 rounded-lg border transition-all text-left ${
                                            addedSections.includes('profileSummary')
                                              ? 'bg-zinc-100 border-zinc-300 opacity-50 cursor-not-allowed'
                                              : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                                          }`}
                                        >
                                          <div className="flex items-start justify-between mb-3">
                                            <UserIcon className="h-8 w-8 text-zinc-600" />
                                            {addedSections.includes('profileSummary') && (
                                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                            )}
                                          </div>
                                          <h3 className="font-semibold text-zinc-950 mb-1">Profile Summary</h3>
                                          <p className="text-xs text-zinc-600">A brief overview of your professional background and key achievements.</p>
                                        </button>

                                        {/* Languages */}
                                        <button
                                          onClick={() => {
                                            if (!addedSections.includes('languages')) {
                                              setAddedSections(prev => [...prev, 'languages']);
                                              setSelectedBlockType('languages');
                                              setEditingSection('languages');
                                              setExpandedSections(prev => ({ ...prev, languages: true }));
                                              setShowAddBlockModal(false);
                                            }
                                          }}
                                          disabled={addedSections.includes('languages')}
                                          className={`p-4 rounded-lg border transition-all text-left ${
                                            addedSections.includes('languages')
                                              ? 'bg-zinc-100 border-zinc-300 opacity-50 cursor-not-allowed'
                                              : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                                          }`}
                                        >
                                          <div className="flex items-start justify-between mb-3">
                                            <GlobeAltIcon className="h-8 w-8 text-zinc-600" />
                                            {addedSections.includes('languages') && (
                                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                            )}
                                          </div>
                                          <h3 className="font-semibold text-zinc-950 mb-1">Languages</h3>
                                          <p className="text-xs text-zinc-600">You speak more than one language? Make sure to list them here.</p>
                                        </button>

                                        {/* Certificates */}
                                        <button
                                          onClick={() => {
                                            if (!addedSections.includes('certifications')) {
                                              setAddedSections(prev => [...prev, 'certifications']);
                                              setSelectedBlockType('certifications');
                                              setEditingSection('certifications');
                                              setExpandedSections(prev => ({ ...prev, certifications: true }));
                                              setShowAddBlockModal(false);
                                            }
                                          }}
                                          disabled={addedSections.includes('certifications')}
                                          className={`p-4 rounded-lg border transition-all text-left ${
                                            addedSections.includes('certifications')
                                              ? 'bg-zinc-100 border-zinc-300 opacity-50 cursor-not-allowed'
                                              : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                                          }`}
                                        >
                                          <div className="flex items-start justify-between mb-3">
                                            <DocumentTextIcon className="h-8 w-8 text-zinc-600" />
                                            {addedSections.includes('certifications') && (
                                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                            )}
                                          </div>
                                          <h3 className="font-semibold text-zinc-950 mb-1">Certificates</h3>
                                          <p className="text-xs text-zinc-600">Drivers licenses and other industry-specific certificates you have belong here.</p>
                                        </button>

                                        {/* Interests */}
                                        <button
                                          onClick={() => {
                                            if (!addedSections.includes('interests')) {
                                              setAddedSections(prev => [...prev, 'interests']);
                                              setSelectedBlockType('interests');
                                              setEditingSection('interests');
                                              setExpandedSections(prev => ({ ...prev, interests: true }));
                                              setShowAddBlockModal(false);
                                            }
                                          }}
                                          disabled={addedSections.includes('interests')}
                                          className={`p-4 rounded-lg border transition-all text-left ${
                                            addedSections.includes('interests')
                                              ? 'bg-zinc-100 border-zinc-300 opacity-50 cursor-not-allowed'
                                              : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                                          }`}
                                        >
                                          <div className="flex items-start justify-between mb-3">
                                            <HeartIcon className="h-8 w-8 text-zinc-600" />
                                            {addedSections.includes('interests') && (
                                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                            )}
                                          </div>
                                          <h3 className="font-semibold text-zinc-950 mb-1">Interests</h3>
                                          <p className="text-xs text-zinc-600">Do you have interests that align with your career aspiration?</p>
                                        </button>

                                        {/* Projects */}
                                        <button
                                          onClick={() => {
                                            if (!addedSections.includes('projects')) {
                                              setAddedSections(prev => [...prev, 'projects']);
                                              setSelectedBlockType('projects');
                                              setEditingSection('projects');
                                              setExpandedSections(prev => ({ ...prev, projects: true }));
                                              setShowAddBlockModal(false);
                                            }
                                          }}
                                          disabled={addedSections.includes('projects')}
                                          className={`p-4 rounded-lg border transition-all text-left ${
                                            addedSections.includes('projects')
                                              ? 'bg-zinc-100 border-zinc-300 opacity-50 cursor-not-allowed'
                                              : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                                          }`}
                                        >
                                          <div className="flex items-start justify-between mb-3">
                                            <FolderIcon className="h-8 w-8 text-zinc-600" />
                                            {addedSections.includes('projects') && (
                                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                            )}
                                          </div>
                                          <h3 className="font-semibold text-zinc-950 mb-1">Projects</h3>
                                          <p className="text-xs text-zinc-600">Worked on a particular challenging project in the past? Mention it here.</p>
                                        </button>

                                        {/* Courses */}
                                        <button
                                          onClick={() => {
                                            if (!addedSections.includes('courses')) {
                                              setAddedSections(prev => [...prev, 'courses']);
                                              setSelectedBlockType('courses');
                                              setEditingSection('courses');
                                              setExpandedSections(prev => ({ ...prev, courses: true }));
                                              setShowAddBlockModal(false);
                                            }
                                          }}
                                          disabled={addedSections.includes('courses')}
                                          className={`p-4 rounded-lg border transition-all text-left ${
                                            addedSections.includes('courses')
                                              ? 'bg-zinc-100 border-zinc-300 opacity-50 cursor-not-allowed'
                                              : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                                          }`}
                                        >
                                          <div className="flex items-start justify-between mb-3">
                                            <BookOpenIcon className="h-8 w-8 text-zinc-600" />
                                            {addedSections.includes('courses') && (
                                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                            )}
                                          </div>
                                          <h3 className="font-semibold text-zinc-950 mb-1">Courses</h3>
                                          <p className="text-xs text-zinc-600">Did you complete MOOCs or an evening course? Show them off in this section.</p>
                                        </button>

                                        {/* Awards */}
                                        <button
                                          onClick={() => {
                                            if (!addedSections.includes('awards')) {
                                              setAddedSections(prev => [...prev, 'awards']);
                                              setSelectedBlockType('awards');
                                              setEditingSection('awards');
                                              setExpandedSections(prev => ({ ...prev, awards: true }));
                                              setShowAddBlockModal(false);
                                            }
                                          }}
                                          disabled={addedSections.includes('awards')}
                                          className={`p-4 rounded-lg border transition-all text-left ${
                                            addedSections.includes('awards')
                                              ? 'bg-zinc-100 border-zinc-300 opacity-50 cursor-not-allowed'
                                              : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                                          }`}
                                        >
                                          <div className="flex items-start justify-between mb-3">
                                            <TrophyIcon className="h-8 w-8 text-zinc-600" />
                                            {addedSections.includes('awards') && (
                                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                            )}
                                          </div>
                                          <h3 className="font-semibold text-zinc-950 mb-1">Awards</h3>
                                          <p className="text-xs text-zinc-600">Awards like student competitions or industry accolades belong here.</p>
                                        </button>

                                        {/* Organizations */}
                                        <button
                                          onClick={() => {
                                            if (!addedSections.includes('organizations')) {
                                              setAddedSections(prev => [...prev, 'organizations']);
                                              setSelectedBlockType('organizations');
                                              setEditingSection('organizations');
                                              setExpandedSections(prev => ({ ...prev, organizations: true }));
                                              setShowAddBlockModal(false);
                                            }
                                          }}
                                          disabled={addedSections.includes('organizations')}
                                          className={`p-4 rounded-lg border transition-all text-left ${
                                            addedSections.includes('organizations')
                                              ? 'bg-zinc-100 border-zinc-300 opacity-50 cursor-not-allowed'
                                              : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                                          }`}
                                        >
                                          <div className="flex items-start justify-between mb-3">
                                            <HeartIcon className="h-8 w-8 text-zinc-600" />
                                            {addedSections.includes('organizations') && (
                                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                            )}
                                          </div>
                                          <h3 className="font-semibold text-zinc-950 mb-1">Organizations</h3>
                                          <p className="text-xs text-zinc-600">If you volunteer or participate in a good cause, why not state it?</p>
                                        </button>

                                        {/* Publications */}
                                        <button
                                          onClick={() => {
                                            if (!addedSections.includes('publications')) {
                                              setAddedSections(prev => [...prev, 'publications']);
                                              setSelectedBlockType('publications');
                                              setEditingSection('publications');
                                              setExpandedSections(prev => ({ ...prev, publications: true }));
                                              setShowAddBlockModal(false);
                                            }
                                          }}
                                          disabled={addedSections.includes('publications')}
                                          className={`p-4 rounded-lg border transition-all text-left ${
                                            addedSections.includes('publications')
                                              ? 'bg-zinc-100 border-zinc-300 opacity-50 cursor-not-allowed'
                                              : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                                          }`}
                                        >
                                          <div className="flex items-start justify-between mb-3">
                                            <BookOpenIcon className="h-8 w-8 text-zinc-600" />
                                            {addedSections.includes('publications') && (
                                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                            )}
                                          </div>
                                          <h3 className="font-semibold text-zinc-950 mb-1">Publications</h3>
                                          <p className="text-xs text-zinc-600">Academic publications or book releases have a dedicated place here.</p>
                                        </button>

                                        {/* References */}
                                        <button
                                          onClick={() => {
                                            if (!addedSections.includes('references')) {
                                              setAddedSections(prev => [...prev, 'references']);
                                              setSelectedBlockType('references');
                                              setEditingSection('references');
                                              setExpandedSections(prev => ({ ...prev, references: true }));
                                              setShowAddBlockModal(false);
                                            }
                                          }}
                                          disabled={addedSections.includes('references')}
                                          className={`p-4 rounded-lg border transition-all text-left ${
                                            addedSections.includes('references')
                                              ? 'bg-zinc-100 border-zinc-300 opacity-50 cursor-not-allowed'
                                              : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                                          }`}
                                        >
                                          <div className="flex items-start justify-between mb-3">
                                            <UserGroupIcon className="h-8 w-8 text-zinc-600" />
                                            {addedSections.includes('references') && (
                                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                            )}
                                          </div>
                                          <h3 className="font-semibold text-zinc-950 mb-1">References</h3>
                                          <p className="text-xs text-zinc-600">If you have former colleagues or bosses that vouch for you, list them.</p>
                                        </button>

                                        {/* Declaration */}
                                        <button
                                          onClick={() => {
                                            if (!addedSections.includes('declaration')) {
                                              setAddedSections(prev => [...prev, 'declaration']);
                                              setSelectedBlockType('declaration');
                                              setEditingSection('declaration');
                                              setExpandedSections(prev => ({ ...prev, declaration: true }));
                                              setShowAddBlockModal(false);
                                            }
                                          }}
                                          disabled={addedSections.includes('declaration')}
                                          className={`p-4 rounded-lg border transition-all text-left ${
                                            addedSections.includes('declaration')
                                              ? 'bg-zinc-100 border-zinc-300 opacity-50 cursor-not-allowed'
                                              : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                                          }`}
                                        >
                                          <div className="flex items-start justify-between mb-3">
                                            <PencilIcon className="h-8 w-8 text-zinc-600" />
                                            {addedSections.includes('declaration') && (
                                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                            )}
                                          </div>
                                          <h3 className="font-semibold text-zinc-950 mb-1">Declaration</h3>
                                          <p className="text-xs text-zinc-600">You need a declaration with signature?</p>
                                        </button>

                                        {/* Custom - Dashed Border */}
                                        <button
                                          onClick={() => {
                                            if (!addedSections.includes('custom')) {
                                              setAddedSections(prev => [...prev, 'custom']);
                                              setSelectedBlockType('custom');
                                              setEditingSection('custom');
                                              setExpandedSections(prev => ({ ...prev, custom: true }));
                                              setShowAddBlockModal(false);
                                            }
                                          }}
                                          disabled={addedSections.includes('custom')}
                                          className={`p-4 rounded-lg border-2 border-dashed transition-all text-left ${
                                            addedSections.includes('custom')
                                              ? 'bg-zinc-100 border-zinc-300 opacity-50 cursor-not-allowed'
                                              : 'bg-zinc-50 border-zinc-300 hover:bg-zinc-100 hover:border-zinc-400'
                                          }`}
                                        >
                                          <div className="flex items-start justify-between mb-3">
                                            <PuzzlePieceIcon className="h-8 w-8 text-zinc-600" />
                                            {addedSections.includes('custom') && (
                                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                            )}
                                          </div>
                                          <h3 className="font-semibold text-zinc-950 mb-1">Custom</h3>
                                          <p className="text-xs text-zinc-600">You didn't find what you are looking for? Or you want to combine two sections to save space?</p>
                                        </button>
                                      </div>
                                    </div>
                                  </Dialog.Panel>
                                </Transition.Child>
                              </div>
                            </div>
                          </Dialog>
                        </Transition>
                      </>
                    )}

                    {/* Customize Tab */}
                    {activeTab === EDITOR_TABS.CUSTOMIZE && (
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg border border-zinc-200 p-4">
                          <h3 className="text-sm font-semibold text-zinc-950 mb-4">Template Settings</h3>
                          <FieldGroup>
                            <Field>
                              <Label>Color Scheme</Label>
                              <select
                                value={templateSettings.colorScheme}
                                onChange={(e) => setTemplateSettings(prev => ({ ...prev, colorScheme: e.target.value }))}
                                className="mt-1 block w-full rounded-lg border-zinc-300 py-2 pl-3 pr-10 text-sm"
                              >
                                <option value="blue">Blue</option>
                                <option value="green">Green</option>
                                <option value="purple">Purple</option>
                                <option value="orange">Orange</option>
                                <option value="red">Red</option>
                                <option value="indigo">Indigo</option>
                              </select>
                            </Field>
                            <Field>
                              <Label>Font Family</Label>
                              <select
                                value={templateSettings.fontFamily}
                                onChange={(e) => setTemplateSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                                className="mt-1 block w-full rounded-lg border-zinc-300 py-2 pl-3 pr-10 text-sm"
                              >
                                <option value="inter">Inter</option>
                                <option value="roboto">Roboto</option>
                                <option value="playfair">Playfair Display</option>
                                <option value="lato">Lato</option>
                                <option value="montserrat">Montserrat</option>
                              </select>
                            </Field>
                            <Field>
                              <Label>Font Size</Label>
                              <select
                                value={templateSettings.fontSize}
                                onChange={(e) => setTemplateSettings(prev => ({ ...prev, fontSize: e.target.value }))}
                                className="mt-1 block w-full rounded-lg border-zinc-300 py-2 pl-3 pr-10 text-sm"
                              >
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                              </select>
                            </Field>
                          </FieldGroup>
                        </div>
                      </div>
                    )}

                    {/* Overview and Links tabs */}
                    {activeTab === EDITOR_TABS.OVERVIEW && (
                      <div className="bg-white rounded-lg border border-zinc-200 p-4">
                        <h3 className="text-sm font-semibold text-zinc-950 mb-2">Resume Overview</h3>
                        <p className="text-sm text-zinc-600">Template: {selectedTemplate || 'modern'}</p>
                        <p className="text-sm text-zinc-600">Last updated: {new Date().toLocaleDateString()}</p>
                      </div>
                    )}

                    {activeTab === EDITOR_TABS.LINKS && (
                      <div className="bg-white rounded-lg border border-zinc-200 p-4">
                        <h3 className="text-sm font-semibold text-zinc-950 mb-4">Links</h3>
                        <FieldGroup>
                          <Field>
                            <Label>LinkedIn</Label>
                            <Input
                              value={resumeData.linkedin}
                              onChange={(e) => setResumeData(prev => ({ ...prev, linkedin: e.target.value }))}
                              placeholder="linkedin.com/in/yourname"
                            />
                          </Field>
                          <Field>
                            <Label>GitHub</Label>
                            <Input
                              value={resumeData.github}
                              onChange={(e) => setResumeData(prev => ({ ...prev, github: e.target.value }))}
                              placeholder="github.com/yourname"
                            />
                          </Field>
                          <Field>
                            <Label>Website</Label>
                            <Input
                              value={resumeData.website}
                              onChange={(e) => setResumeData(prev => ({ ...prev, website: e.target.value }))}
                              placeholder="yourwebsite.com"
                            />
                          </Field>
                        </FieldGroup>
                      </div>
                    )}
                  </div>
                  
                  {/* Right Preview Panel - 2 columns */}
                  <div className="col-span-2 overflow-y-auto bg-white border-l border-zinc-200">
                    <LivePreview templateSettings={templateSettings} />
                  </div>
                </div>
              </div>
            )}
            
            {/* Old Stepper-based Editor - Disabled, using new tabbed editor instead */}
            {false && ([WIZARD_STEPS.PERSONAL, WIZARD_STEPS.SUMMARY, WIZARD_STEPS.SKILLS, WIZARD_STEPS.EXPERIENCE, WIZARD_STEPS.EDUCATION, WIZARD_STEPS.CERTIFICATIONS, WIZARD_STEPS.REFERENCES].includes(currentStep)) && currentResume && (
              <div className="w-full">
                {/* Stepper Component */}
                <div className="bg-white border-b border-zinc-200 px-6 py-4">
                  <ResumeStepper
                    currentStep={currentEditorStep}
                    completedSteps={completedSteps}
                    onStepClick={handleStepClick}
                  />
                </div>
                
                {/* Editor Content - Split Screen */}
                <div className="grid grid-cols-3 h-[calc(100vh-200px)] w-full">
                  {/* Form Column - Left (1 column) */}
                  <div className="col-span-1 overflow-y-auto bg-zinc-50 border-r border-zinc-200">
                    <div className="p-6">
                      {/* Personal Details Step */}
                      {currentStep === WIZARD_STEPS.PERSONAL && (
                        <div className="space-y-6">
                          <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-zinc-950 mb-2">Personal Details</h2>
                            <p className="text-sm text-zinc-600">Enter your basic information</p>
                          </div>
                          
                          <FieldGroup>
                            <Field>
                              <Label htmlFor="fullName">Full Name *</Label>
                              <Input
                                id="fullName"
                                value={resumeData.fullName}
                                onChange={(e) => {
                                  setResumeData(prev => ({ ...prev, fullName: e.target.value }));
                                  if (e.target.value) markStepComplete('personal');
                                }}
                                placeholder="John Doe"
                              />
                            </Field>
                            <Field>
                              <Label htmlFor="email">Email *</Label>
                              <Input
                                id="email"
                                type="email"
                                value={resumeData.email}
                                onChange={(e) => setResumeData(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="john@example.com"
                              />
                            </Field>
                            <Field>
                              <Label htmlFor="phone">Phone</Label>
                              <Input
                                id="phone"
                                value={resumeData.phone}
                                onChange={(e) => setResumeData(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="+1 (555) 123-4567"
                              />
                            </Field>
                            <Field>
                              <Label htmlFor="location">Location</Label>
                              <Input
                                id="location"
                                value={resumeData.location}
                                onChange={(e) => setResumeData(prev => ({ ...prev, location: e.target.value }))}
                                placeholder="City, State"
                              />
                            </Field>
                            <Field>
                              <Label htmlFor="linkedin">LinkedIn</Label>
                              <Input
                                id="linkedin"
                                value={resumeData.linkedin}
                                onChange={(e) => setResumeData(prev => ({ ...prev, linkedin: e.target.value }))}
                                placeholder="linkedin.com/in/yourname"
                              />
                            </Field>
                            <Field>
                              <Label htmlFor="github">GitHub</Label>
                              <Input
                                id="github"
                                value={resumeData.github}
                                onChange={(e) => setResumeData(prev => ({ ...prev, github: e.target.value }))}
                                placeholder="github.com/yourname"
                              />
                            </Field>
                            <Field>
                              <Label htmlFor="photo">Photo URL</Label>
                              <Input
                                id="photo"
                                value={resumeData.photo}
                                onChange={(e) => setResumeData(prev => ({ ...prev, photo: e.target.value }))}
                                placeholder="https://example.com/photo.jpg"
                              />
                            </Field>
                          </FieldGroup>
                          
                          <div className="flex justify-between pt-4">
                            <Button onClick={handlePreviousStep} outline disabled={currentStep === WIZARD_STEPS.PERSONAL}>
                              <ChevronLeftIcon className="h-4 w-4" />
                              Back
                            </Button>
                            <Button onClick={handleNextStep} color="blue">
                              Continue
                              <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Summary Step */}
                      {currentStep === WIZARD_STEPS.SUMMARY && (
                        <div className="space-y-6">
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                              <h2 className="text-2xl font-semibold text-zinc-950">Professional Summary</h2>
                              <Button
                                onClick={() => handleRegenerateSection('summary')}
                                plain
                                className="text-xs"
                                disabled={isGenerating}
                              >
                                <ArrowPathIcon className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                              </Button>
                            </div>
                            <p className="text-sm text-zinc-600">Write a compelling summary of your professional background</p>
                          </div>
                          
                          <RichTextEditor
                            value={resumeData.summary}
                            onChange={(value) => {
                              setResumeData(prev => ({ ...prev, summary: value }));
                              if (value) markStepComplete('summary');
                            }}
                            placeholder="Write a compelling professional summary..."
                          />
                          
                          <div className="flex justify-between pt-4">
                            <Button onClick={handlePreviousStep} outline>
                              <ChevronLeftIcon className="h-4 w-4" />
                              Back
                            </Button>
                            <Button onClick={handleNextStep} color="blue">
                              Continue
                              <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Skills Step */}
                      {currentStep === WIZARD_STEPS.SKILLS && (
                        <div className="space-y-6">
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                              <h2 className="text-2xl font-semibold text-zinc-950">Skills</h2>
                              <Button
                                onClick={() => handleRegenerateSection('skills')}
                                plain
                                className="text-xs"
                                disabled={isGenerating}
                              >
                                <ArrowPathIcon className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                              </Button>
                            </div>
                            <p className="text-sm text-zinc-600">List your key skills and competencies</p>
                          </div>
                          
                          <RichTextEditor
                            value={Array.isArray(resumeData.skills) ? resumeData.skills.join('\n') : (resumeData.skills || '')}
                            onChange={(value) => {
                              // Convert HTML to plain text and split by lines
                              const tempDiv = document.createElement('div');
                              tempDiv.innerHTML = value;
                              const textContent = tempDiv.textContent || tempDiv.innerText || '';
                              const skillsArray = textContent.split('\n').filter(s => s.trim());
                              setResumeData(prev => ({ ...prev, skills: skillsArray }));
                              if (skillsArray.length > 0) markStepComplete('skills');
                            }}
                            placeholder="Enter your skills, one per line or as a list..."
                          />
                          
                          <div className="flex justify-between pt-4">
                            <Button onClick={handlePreviousStep} outline>
                              <ChevronLeftIcon className="h-4 w-4" />
                              Back
                            </Button>
                            <Button onClick={handleNextStep} color="blue">
                              Continue
                              <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Experience Step */}
                      {currentStep === WIZARD_STEPS.EXPERIENCE && (
                        <div className="space-y-6">
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                              <h2 className="text-2xl font-semibold text-zinc-950">Work Experience</h2>
                              <Button
                                onClick={() => handleRegenerateSection('experience')}
                                plain
                                className="text-xs"
                                disabled={isGenerating}
                              >
                                <ArrowPathIcon className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                              </Button>
                            </div>
                            <p className="text-sm text-zinc-600">Add your work history and achievements</p>
                          </div>
                          
                          <FieldGroup>
                            <div className="grid grid-cols-2 gap-4">
                              <Field>
                                <Label>Job Title *</Label>
                                <Input
                                  value={currentExperience.title}
                                  onChange={(e) => setCurrentExperience(prev => ({ ...prev, title: e.target.value }))}
                                  placeholder="Software Engineer"
                                />
                              </Field>
                              <Field>
                                <Label>Company *</Label>
                                <Input
                                  value={currentExperience.company}
                                  onChange={(e) => setCurrentExperience(prev => ({ ...prev, company: e.target.value }))}
                                  placeholder="Tech Corp"
                                />
                              </Field>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                              <Field>
                                <Label>Start Date</Label>
                                <Input
                                  type="month"
                                  value={currentExperience.startDate}
                                  onChange={(e) => setCurrentExperience(prev => ({ ...prev, startDate: e.target.value }))}
                                />
                              </Field>
                              <Field>
                                <Label>End Date</Label>
                                <Input
                                  type="month"
                                  value={currentExperience.endDate}
                                  onChange={(e) => setCurrentExperience(prev => ({ ...prev, endDate: e.target.value }))}
                                  disabled={currentExperience.current}
                                />
                              </Field>
                              <Field>
                                <CheckboxField>
                                  <Checkbox
                                    checked={currentExperience.current}
                                    onChange={(checked) => setCurrentExperience(prev => ({ ...prev, current: checked }))}
                                    color="blue"
                                  />
                                  <Label>Currently Working</Label>
                                </CheckboxField>
                              </Field>
                            </div>
                            
                            <Field>
                              <Label>Location</Label>
                              <Input
                                value={currentExperience.location}
                                onChange={(e) => setCurrentExperience(prev => ({ ...prev, location: e.target.value }))}
                                placeholder="City, State"
                              />
                            </Field>
                            
                            <Field>
                              <Label>Responsibilities & Achievements</Label>
                              <RichTextEditor
                                value={currentExperience.responsibilities || ''}
                                onChange={(value) => setCurrentExperience(prev => ({ ...prev, responsibilities: value }))}
                                placeholder="Describe your responsibilities, achievements, and impact..."
                              />
                            </Field>
                            
                            <Button 
                              onClick={() => {
                                addExperience();
                                markStepComplete('experience');
                              }} 
                              outline
                              disabled={!currentExperience.title || !currentExperience.company}
                            >
                              <PlusIcon className="h-4 w-4" />
                              Add Experience
                            </Button>
                          </FieldGroup>
                          
                          {/* List of added experiences */}
                          {resumeData.experience && resumeData.experience.length > 0 && (
                            <div className="mt-6 space-y-3">
                              {resumeData.experience.map((exp, idx) => (
                                <div key={idx} className="p-4 border border-zinc-200 rounded-lg bg-white">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <p className="font-semibold text-zinc-950">{exp.title} at {exp.company}</p>
                                      <p className="text-sm text-zinc-500">
                                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                        {exp.location && ` • ${exp.location}`}
                                      </p>
                                      {exp.responsibilities && (
                                        <div 
                                          className="text-sm text-zinc-600 mt-2 prose prose-sm max-w-none"
                                          dangerouslySetInnerHTML={{ __html: exp.responsibilities }}
                                        />
                                      )}
                                    </div>
                                    <Button
                                      onClick={() => {
                                        setResumeData(prev => ({
                                          ...prev,
                                          experience: prev.experience.filter((_, i) => i !== idx),
                                        }));
                                      }}
                                      plain
                                      className="text-red-600 ml-2"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex justify-between pt-4">
                            <Button onClick={handlePreviousStep} outline>
                              <ChevronLeftIcon className="h-4 w-4" />
                              Back
                            </Button>
                            <Button onClick={handleNextStep} color="blue">
                              Continue
                              <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Education Step */}
                      {currentStep === WIZARD_STEPS.EDUCATION && (
                        <div className="space-y-6">
                          <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-zinc-950 mb-2">Education</h2>
                            <p className="text-sm text-zinc-600">Add your educational background</p>
                          </div>
                          
                          <FieldGroup>
                            <div className="grid grid-cols-2 gap-4">
                              <Field>
                                <Label>Degree *</Label>
                                <Input
                                  value={currentEducation.degree}
                                  onChange={(e) => setCurrentEducation(prev => ({ ...prev, degree: e.target.value }))}
                                  placeholder="Bachelor of Science"
                                />
                              </Field>
                              <Field>
                                <Label>Institution *</Label>
                                <Input
                                  value={currentEducation.institution}
                                  onChange={(e) => setCurrentEducation(prev => ({ ...prev, institution: e.target.value }))}
                                  placeholder="University Name"
                                />
                              </Field>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                              <Field>
                                <Label>Start Date</Label>
                                <Input
                                  type="month"
                                  value={currentEducation.startDate}
                                  onChange={(e) => setCurrentEducation(prev => ({ ...prev, startDate: e.target.value }))}
                                />
                              </Field>
                              <Field>
                                <Label>End Date</Label>
                                <Input
                                  type="month"
                                  value={currentEducation.endDate}
                                  onChange={(e) => setCurrentEducation(prev => ({ ...prev, endDate: e.target.value }))}
                                />
                              </Field>
                              <Field>
                                <Label>GPA</Label>
                                <Input
                                  value={currentEducation.gpa}
                                  onChange={(e) => setCurrentEducation(prev => ({ ...prev, gpa: e.target.value }))}
                                  placeholder="3.8"
                                />
                              </Field>
                            </div>
                            
                            <Field>
                              <Label>Location</Label>
                              <Input
                                value={currentEducation.location}
                                onChange={(e) => setCurrentEducation(prev => ({ ...prev, location: e.target.value }))}
                                placeholder="City, State"
                              />
                            </Field>
                            
                            <Field>
                              <Label>Description</Label>
                              <RichTextEditor
                                value={currentEducation.description || ''}
                                onChange={(value) => setCurrentEducation(prev => ({ ...prev, description: value }))}
                                placeholder="Additional details about your education, honors, coursework..."
                              />
                            </Field>
                            
                            <Button 
                              onClick={() => {
                                addEducation();
                                markStepComplete('education');
                              }} 
                              outline
                              disabled={!currentEducation.degree || !currentEducation.institution}
                            >
                              <PlusIcon className="h-4 w-4" />
                              Add Education
                            </Button>
                          </FieldGroup>
                          
                          {/* List of added education */}
                          {resumeData.education && resumeData.education.length > 0 && (
                            <div className="mt-6 space-y-3">
                              {resumeData.education.map((edu, idx) => (
                                <div key={idx} className="p-4 border border-zinc-200 rounded-lg bg-white">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <p className="font-semibold text-zinc-950">{edu.degree}</p>
                                      <p className="text-sm text-zinc-500">{edu.institution}</p>
                                      <p className="text-sm text-zinc-500">
                                        {edu.startDate} - {edu.endDate}
                                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                                      </p>
                                      {edu.description && (
                                        <div 
                                          className="text-sm text-zinc-600 mt-2 prose prose-sm max-w-none"
                                          dangerouslySetInnerHTML={{ __html: edu.description }}
                                        />
                                      )}
                                    </div>
                                    <Button
                                      onClick={() => {
                                        setResumeData(prev => ({
                                          ...prev,
                                          education: prev.education.filter((_, i) => i !== idx),
                                        }));
                                      }}
                                      plain
                                      className="text-red-600 ml-2"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex justify-between pt-4">
                            <Button onClick={handlePreviousStep} outline>
                              <ChevronLeftIcon className="h-4 w-4" />
                              Back
                            </Button>
                            <Button onClick={handleNextStep} color="blue">
                              Continue
                              <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Certifications Step */}
                      {currentStep === WIZARD_STEPS.CERTIFICATIONS && (
                        <div className="space-y-6">
                          <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-zinc-950 mb-2">Certifications</h2>
                            <p className="text-sm text-zinc-600">Add your professional certifications</p>
                          </div>
                          
                          <FieldGroup>
                            <div className="grid grid-cols-2 gap-4">
                              <Field>
                                <Label>Certification Name *</Label>
                                <Input
                                  value={currentCertification.name}
                                  onChange={(e) => setCurrentCertification(prev => ({ ...prev, name: e.target.value }))}
                                  placeholder="AWS Certified Solutions Architect"
                                />
                              </Field>
                              <Field>
                                <Label>Issuing Organization *</Label>
                                <Input
                                  value={currentCertification.issuer}
                                  onChange={(e) => setCurrentCertification(prev => ({ ...prev, issuer: e.target.value }))}
                                  placeholder="Amazon Web Services"
                                />
                              </Field>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <Field>
                                <Label>Issue Date</Label>
                                <Input
                                  type="month"
                                  value={currentCertification.date}
                                  onChange={(e) => setCurrentCertification(prev => ({ ...prev, date: e.target.value }))}
                                />
                              </Field>
                              <Field>
                                <Label>Expiry Date</Label>
                                <Input
                                  type="month"
                                  value={currentCertification.expiryDate}
                                  onChange={(e) => setCurrentCertification(prev => ({ ...prev, expiryDate: e.target.value }))}
                                  placeholder="Leave empty if no expiry"
                                />
                              </Field>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <Field>
                                <Label>Credential ID</Label>
                                <Input
                                  value={currentCertification.credentialId}
                                  onChange={(e) => setCurrentCertification(prev => ({ ...prev, credentialId: e.target.value }))}
                                  placeholder="ABC123456"
                                />
                              </Field>
                              <Field>
                                <Label>Credential URL</Label>
                                <Input
                                  type="url"
                                  value={currentCertification.credentialUrl}
                                  onChange={(e) => setCurrentCertification(prev => ({ ...prev, credentialUrl: e.target.value }))}
                                  placeholder="https://..."
                                />
                              </Field>
                            </div>
                            
                            <Button 
                              onClick={() => {
                                addCertification();
                                markStepComplete('certifications');
                              }} 
                              outline
                              disabled={!currentCertification.name || !currentCertification.issuer}
                            >
                              <PlusIcon className="h-4 w-4" />
                              Add Certification
                            </Button>
                          </FieldGroup>
                          
                          {/* List of added certifications */}
                          {resumeData.certifications && resumeData.certifications.length > 0 && (
                            <div className="mt-6 space-y-3">
                              {resumeData.certifications.map((cert, idx) => (
                                <div key={idx} className="p-4 border border-zinc-200 rounded-lg bg-white">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <p className="font-semibold text-zinc-950">{cert.name}</p>
                                      <p className="text-sm text-zinc-500">{cert.issuer}</p>
                                      <p className="text-sm text-zinc-500">
                                        {cert.date && `Issued: ${cert.date}`}
                                        {cert.expiryDate && ` • Expires: ${cert.expiryDate}`}
                                        {cert.credentialId && ` • ID: ${cert.credentialId}`}
                                      </p>
                                      {cert.credentialUrl && (
                                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                                          View Credential
                                        </a>
                                      )}
                                    </div>
                                    <Button
                                      onClick={() => {
                                        setResumeData(prev => ({
                                          ...prev,
                                          certifications: prev.certifications.filter((_, i) => i !== idx),
                                        }));
                                      }}
                                      plain
                                      className="text-red-600 ml-2"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex justify-between pt-4">
                            <Button onClick={handlePreviousStep} outline>
                              <ChevronLeftIcon className="h-4 w-4" />
                              Back
                            </Button>
                            <Button onClick={handleNextStep} color="blue">
                              Continue
                              <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* References Step */}
                      {currentStep === WIZARD_STEPS.REFERENCES && (
                        <div className="space-y-6">
                          <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-zinc-950 mb-2">Professional References</h2>
                            <p className="text-sm text-zinc-600">Add people who can vouch for your work</p>
                          </div>
                          
                          <FieldGroup>
                            <div className="grid grid-cols-2 gap-4">
                              <Field>
                                <Label>Name *</Label>
                                <Input
                                  value={currentReference.name}
                                  onChange={(e) => setCurrentReference(prev => ({ ...prev, name: e.target.value }))}
                                  placeholder="John Doe"
                                />
                              </Field>
                              <Field>
                                <Label>Title</Label>
                                <Input
                                  value={currentReference.title}
                                  onChange={(e) => setCurrentReference(prev => ({ ...prev, title: e.target.value }))}
                                  placeholder="Senior Manager"
                                />
                              </Field>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <Field>
                                <Label>Company</Label>
                                <Input
                                  value={currentReference.company}
                                  onChange={(e) => setCurrentReference(prev => ({ ...prev, company: e.target.value }))}
                                  placeholder="Company Name"
                                />
                              </Field>
                              <Field>
                                <Label>Relationship</Label>
                                <Input
                                  value={currentReference.relationship}
                                  onChange={(e) => setCurrentReference(prev => ({ ...prev, relationship: e.target.value }))}
                                  placeholder="Former Manager, Colleague, etc."
                                />
                              </Field>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <Field>
                                <Label>Email *</Label>
                                <Input
                                  type="email"
                                  value={currentReference.email}
                                  onChange={(e) => setCurrentReference(prev => ({ ...prev, email: e.target.value }))}
                                  placeholder="john@example.com"
                                />
                              </Field>
                              <Field>
                                <Label>Phone</Label>
                                <Input
                                  type="tel"
                                  value={currentReference.phone}
                                  onChange={(e) => setCurrentReference(prev => ({ ...prev, phone: e.target.value }))}
                                  placeholder="+1 (555) 123-4567"
                                />
                              </Field>
                            </div>
                            
                            <Button 
                              onClick={() => {
                                addReference();
                                markStepComplete('references');
                              }} 
                              outline
                              disabled={!currentReference.name || !currentReference.email}
                            >
                              <PlusIcon className="h-4 w-4" />
                              Add Reference
                            </Button>
                          </FieldGroup>
                          
                          {/* List of added references */}
                          {resumeData.references && resumeData.references.length > 0 && (
                            <div className="mt-6 space-y-3">
                              {resumeData.references.map((ref, idx) => (
                                <div key={idx} className="p-4 border border-zinc-200 rounded-lg bg-white">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <p className="font-semibold text-zinc-950">{ref.name}</p>
                                      <p className="text-sm text-zinc-500">
                                        {ref.title && `${ref.title}`}
                                        {ref.company && ` at ${ref.company}`}
                                        {ref.relationship && ` • ${ref.relationship}`}
                                      </p>
                                      <p className="text-sm text-zinc-500">{ref.email}</p>
                                      {ref.phone && <p className="text-sm text-zinc-500">{ref.phone}</p>}
                                    </div>
                                    <Button
                                      onClick={() => {
                                        setResumeData(prev => ({
                                          ...prev,
                                          references: prev.references.filter((_, i) => i !== idx),
                                        }));
                                      }}
                                      plain
                                      className="text-red-600 ml-2"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex justify-between pt-4">
                            <Button onClick={handlePreviousStep} outline>
                              <ChevronLeftIcon className="h-4 w-4" />
                              Back
                            </Button>
                            <Button 
                              onClick={handleSave} 
                              color="blue"
                              disabled={isGenerating}
                            >
                              {isGenerating ? (
                                <>
                                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  Save Resume
                                  <CheckCircleIcon className="h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Live Preview Panel - Right (2 columns) */}
                  <div className="col-span-2 overflow-y-auto bg-white">
                    <LivePreview templateSettings={templateSettings} />
                  </div>
                </div>
              </div>
            )}
            
            {/* Legacy Single-Screen Editor - Disabled, using new tabbed editor instead */}
            {false && currentStep === WIZARD_STEPS.EDITOR && currentResume && (
              <div className="grid grid-cols-4 h-[calc(100vh-120px)] w-full">
                {/* Form Column - Left (1 column) */}
                <div className="col-span-1 overflow-y-auto bg-zinc-50 border-r border-zinc-200">
                  <div className="p-6 space-y-8">
                    {/* Template Customization */}
                    <div className="bg-white rounded-lg border border-zinc-200 p-4">
                      <h3 className="text-sm font-semibold text-zinc-950 mb-4">Template Settings</h3>
                      <FieldGroup>
                        <Field>
                          <Label>Color Scheme</Label>
                          <select
                            value={templateSettings.colorScheme}
                            onChange={(e) => setTemplateSettings(prev => ({ ...prev, colorScheme: e.target.value }))}
                            className="mt-1 block w-full rounded-lg border-zinc-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          >
                            <option value="blue">Blue</option>
                            <option value="green">Green</option>
                            <option value="purple">Purple</option>
                            <option value="orange">Orange</option>
                            <option value="red">Red</option>
                            <option value="indigo">Indigo</option>
                          </select>
                        </Field>
                        <Field>
                          <Label>Font Family</Label>
                          <select
                            value={templateSettings.fontFamily}
                            onChange={(e) => setTemplateSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                            className="mt-1 block w-full rounded-lg border-zinc-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          >
                            <option value="inter">Inter</option>
                            <option value="roboto">Roboto</option>
                            <option value="playfair">Playfair Display</option>
                            <option value="lato">Lato</option>
                            <option value="montserrat">Montserrat</option>
                          </select>
                        </Field>
                      </FieldGroup>
                    </div>

                    {/* Personal Details Section */}
                    <div className="bg-white rounded-lg border border-zinc-200 p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <UserIcon className="h-5 w-5 text-zinc-600" />
                        <h3 className="text-sm font-semibold text-zinc-950">Personal Details</h3>
                      </div>
                      <FieldGroup>
                        <Field>
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            value={resumeData.fullName}
                            onChange={(e) => setResumeData(prev => ({ ...prev, fullName: e.target.value }))}
                            placeholder="John Doe"
                          />
                        </Field>
                        <Field>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={resumeData.email}
                            onChange={(e) => setResumeData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="john@example.com"
                          />
                        </Field>
                        <Field>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={resumeData.phone}
                            onChange={(e) => setResumeData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+1 (555) 123-4567"
                          />
                        </Field>
                        <Field>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={resumeData.location}
                            onChange={(e) => setResumeData(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="City, State"
                          />
                        </Field>
                        <Field>
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            value={resumeData.linkedin}
                            onChange={(e) => setResumeData(prev => ({ ...prev, linkedin: e.target.value }))}
                            placeholder="linkedin.com/in/yourname"
                          />
                        </Field>
                        <Field>
                          <Label htmlFor="github">GitHub</Label>
                          <Input
                            id="github"
                            value={resumeData.github}
                            onChange={(e) => setResumeData(prev => ({ ...prev, github: e.target.value }))}
                            placeholder="github.com/yourname"
                          />
                        </Field>
                        <Field>
                          <Label htmlFor="photo">Photo URL</Label>
                          <Input
                            id="photo"
                            value={resumeData.photo}
                            onChange={(e) => setResumeData(prev => ({ ...prev, photo: e.target.value }))}
                            placeholder="https://example.com/photo.jpg"
                          />
                        </Field>
                      </FieldGroup>
                    </div>

                    {/* Professional Summary Section */}
                    <div className="bg-white rounded-lg border border-zinc-200 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <DocumentTextIcon className="h-5 w-5 text-zinc-600" />
                          <h3 className="text-sm font-semibold text-zinc-950">Professional Summary</h3>
                        </div>
                        <Button
                          onClick={() => handleRegenerateSection('summary')}
                          plain
                          className="text-xs"
                          disabled={isGenerating}
                        >
                          <ArrowPathIcon className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
                      <RichTextEditor
                        value={resumeData.summary}
                        onChange={(value) => setResumeData(prev => ({ ...prev, summary: value }))}
                        placeholder="Write a compelling professional summary..."
                      />
                    </div>

                    {/* Skills Section */}
                    <div className="bg-white rounded-lg border border-zinc-200 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-zinc-950">Skills</h3>
                        <Button
                          onClick={() => handleRegenerateSection('skills')}
                          plain
                          className="text-xs"
                          disabled={isGenerating}
                        >
                          <ArrowPathIcon className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
                      <div className="flex gap-2 mb-3">
                        <Input
                          value={currentSkill}
                          onChange={(e) => setCurrentSkill(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addSkill();
                            }
                          }}
                          placeholder="Add skill"
                          className="text-sm"
                        />
                        <Button onClick={addSkill} size="sm">
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      {resumeData.skills && resumeData.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {resumeData.skills.map((skill, idx) => (
                            <Badge key={idx} color="blue" className="text-xs">
                              {skill}
                              <button
                                onClick={() => {
                                  setResumeData(prev => ({
                                    ...prev,
                                    skills: prev.skills.filter((_, i) => i !== idx),
                                  }));
                                }}
                                className="ml-1 hover:text-red-600"
                              >
                                <XMarkIcon className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Technical Skills Section */}
                    <div className="bg-white rounded-lg border border-zinc-200 p-4">
                      <h3 className="text-sm font-semibold text-zinc-950 mb-4">Technical Skills</h3>
                      <div className="flex gap-2 mb-3">
                        <Input
                          value={currentTechnicalSkill}
                          onChange={(e) => setCurrentTechnicalSkill(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTechnicalSkill();
                            }
                          }}
                          placeholder="Add technical skill"
                          className="text-sm"
                        />
                        <Button onClick={addTechnicalSkill} size="sm">
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      {resumeData.technicalSkills && resumeData.technicalSkills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {resumeData.technicalSkills.map((skill, idx) => (
                            <Badge key={idx} color="green" className="text-xs">
                              {skill}
                              <button
                                onClick={() => {
                                  setResumeData(prev => ({
                                    ...prev,
                                    technicalSkills: prev.technicalSkills.filter((_, i) => i !== idx),
                                  }));
                                }}
                                className="ml-1 hover:text-red-600"
                              >
                                <XMarkIcon className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Work History Section */}
                    <div className="bg-white rounded-lg border border-zinc-200 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <BriefcaseIcon className="h-5 w-5 text-zinc-600" />
                          <h3 className="text-sm font-semibold text-zinc-950">Work History</h3>
                        </div>
                        <Button
                          onClick={() => handleRegenerateSection('experience')}
                          plain
                          className="text-xs"
                          disabled={isGenerating}
                        >
                          <ArrowPathIcon className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
                      <FieldGroup>
                        <Field>
                          <Label>Job Title *</Label>
                          <Input
                            value={currentExperience.title}
                            onChange={(e) => setCurrentExperience(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Software Engineer"
                            className="text-sm"
                          />
                        </Field>
                        <Field>
                          <Label>Company Name *</Label>
                          <Input
                            value={currentExperience.company}
                            onChange={(e) => setCurrentExperience(prev => ({ ...prev, company: e.target.value }))}
                            placeholder="Tech Corp"
                            className="text-sm"
                          />
                        </Field>
                        <div className="grid grid-cols-2 gap-2">
                          <Field>
                            <Label>Start Date</Label>
                            <Input
                              type="month"
                              value={currentExperience.startDate}
                              onChange={(e) => setCurrentExperience(prev => ({ ...prev, startDate: e.target.value }))}
                              className="text-sm"
                            />
                          </Field>
                          <Field>
                            <Label>End Date</Label>
                            <Input
                              type="month"
                              value={currentExperience.endDate}
                              onChange={(e) => setCurrentExperience(prev => ({ ...prev, endDate: e.target.value }))}
                              disabled={currentExperience.current}
                              className="text-sm"
                            />
                          </Field>
                        </div>
                        <Field>
                          <Label>Location</Label>
                          <Input
                            value={currentExperience.location}
                            onChange={(e) => setCurrentExperience(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="City, State"
                            className="text-sm"
                          />
                        </Field>
                        <CheckboxField>
                          <Checkbox
                            checked={currentExperience.current}
                            onChange={(checked) => setCurrentExperience(prev => ({ ...prev, current: checked }))}
                          />
                          <Label>Currently Working</Label>
                        </CheckboxField>
                        <Field>
                          <Label>Responsibilities</Label>
                          <RichTextEditor
                            value={currentExperience.responsibilities}
                            onChange={(value) => setCurrentExperience(prev => ({ ...prev, responsibilities: value }))}
                            placeholder="Describe your responsibilities and achievements..."
                          />
                        </Field>
                        <Button onClick={addExperience} outline className="w-full text-sm">
                          <PlusIcon className="h-4 w-4" />
                          Add Experience
                        </Button>
                      </FieldGroup>
                      {resumeData.experience && resumeData.experience.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {resumeData.experience.map((exp, idx) => (
                            <div key={idx} className="p-2 bg-zinc-50 rounded border border-zinc-200">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-xs font-semibold">{exp.title} at {exp.company}</p>
                                  <p className="text-xs text-zinc-500">
                                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                  </p>
                                </div>
                                <Button
                                  onClick={() => {
                                    setResumeData(prev => ({
                                      ...prev,
                                      experience: prev.experience.filter((_, i) => i !== idx),
                                    }));
                                  }}
                                  plain
                                  className="text-red-600 p-1"
                                >
                                  <TrashIcon className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Education Section */}
                    <div className="bg-white rounded-lg border border-zinc-200 p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <AcademicCapIcon className="h-5 w-5 text-zinc-600" />
                        <h3 className="text-sm font-semibold text-zinc-950">Education</h3>
                      </div>
                      <FieldGroup>
                        <Field>
                          <Label>Degree *</Label>
                          <Input
                            value={currentEducation.degree}
                            onChange={(e) => setCurrentEducation(prev => ({ ...prev, degree: e.target.value }))}
                            placeholder="Bachelor of Science"
                            className="text-sm"
                          />
                        </Field>
                        <Field>
                          <Label>Institution *</Label>
                          <Input
                            value={currentEducation.institution}
                            onChange={(e) => setCurrentEducation(prev => ({ ...prev, institution: e.target.value }))}
                            placeholder="University Name"
                            className="text-sm"
                          />
                        </Field>
                        <div className="grid grid-cols-2 gap-2">
                          <Field>
                            <Label>Start Date</Label>
                            <Input
                              type="month"
                              value={currentEducation.startDate}
                              onChange={(e) => setCurrentEducation(prev => ({ ...prev, startDate: e.target.value }))}
                              className="text-sm"
                            />
                          </Field>
                          <Field>
                            <Label>End Date</Label>
                            <Input
                              type="month"
                              value={currentEducation.endDate}
                              onChange={(e) => setCurrentEducation(prev => ({ ...prev, endDate: e.target.value }))}
                              className="text-sm"
                            />
                          </Field>
                        </div>
                        <Button onClick={addEducation} outline className="w-full text-sm">
                          <PlusIcon className="h-4 w-4" />
                          Add Education
                        </Button>
                      </FieldGroup>
                      {resumeData.education && resumeData.education.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {resumeData.education.map((edu, idx) => (
                            <div key={idx} className="p-2 bg-zinc-50 rounded border border-zinc-200">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-xs font-semibold">{edu.degree}</p>
                                  <p className="text-xs text-zinc-500">{edu.institution}</p>
                                </div>
                                <Button
                                  onClick={() => {
                                    setResumeData(prev => ({
                                      ...prev,
                                      education: prev.education.filter((_, i) => i !== idx),
                                    }));
                                  }}
                                  plain
                                  className="text-red-600 p-1"
                                >
                                  <TrashIcon className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Certifications Section */}
                    <div className="bg-white rounded-lg border border-zinc-200 p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <TrophyIcon className="h-5 w-5 text-zinc-600" />
                        <h3 className="text-sm font-semibold text-zinc-950">Certifications</h3>
                      </div>
                      <FieldGroup>
                        <Field>
                          <Label>Certification Name *</Label>
                          <Input
                            value={currentCertification.name}
                            onChange={(e) => setCurrentCertification(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="AWS Certified Solutions Architect"
                            className="text-sm"
                          />
                        </Field>
                        <Field>
                          <Label>Issuer *</Label>
                          <Input
                            value={currentCertification.issuer}
                            onChange={(e) => setCurrentCertification(prev => ({ ...prev, issuer: e.target.value }))}
                            placeholder="Amazon Web Services"
                            className="text-sm"
                          />
                        </Field>
                        <div className="grid grid-cols-2 gap-2">
                          <Field>
                            <Label>Issue Date</Label>
                            <Input
                              type="month"
                              value={currentCertification.date}
                              onChange={(e) => setCurrentCertification(prev => ({ ...prev, date: e.target.value }))}
                              className="text-sm"
                            />
                          </Field>
                          <Field>
                            <Label>Expiry Date</Label>
                            <Input
                              type="month"
                              value={currentCertification.expiryDate}
                              onChange={(e) => setCurrentCertification(prev => ({ ...prev, expiryDate: e.target.value }))}
                              className="text-sm"
                            />
                          </Field>
                        </div>
                        <Field>
                          <Label>Credential ID</Label>
                          <Input
                            value={currentCertification.credentialId}
                            onChange={(e) => setCurrentCertification(prev => ({ ...prev, credentialId: e.target.value }))}
                            placeholder="Credential ID"
                            className="text-sm"
                          />
                        </Field>
                        <Button onClick={addCertification} outline className="w-full text-sm">
                          <PlusIcon className="h-4 w-4" />
                          Add Certification
                        </Button>
                      </FieldGroup>
                      {resumeData.certifications && resumeData.certifications.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {resumeData.certifications.map((cert, idx) => (
                            <div key={idx} className="p-2 bg-zinc-50 rounded border border-zinc-200">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-xs font-semibold">{cert.name}</p>
                                  <p className="text-xs text-zinc-500">{cert.issuer}</p>
                                </div>
                                <Button
                                  onClick={() => {
                                    setResumeData(prev => ({
                                      ...prev,
                                      certifications: prev.certifications.filter((_, i) => i !== idx),
                                    }));
                                  }}
                                  plain
                                  className="text-red-600 p-1"
                                >
                                  <TrashIcon className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Professional References Section */}
                    <div className="bg-white rounded-lg border border-zinc-200 p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <UserGroupIcon className="h-5 w-5 text-zinc-600" />
                        <h3 className="text-sm font-semibold text-zinc-950">Professional References</h3>
                      </div>
                      <FieldGroup>
                        <Field>
                          <Label>Name *</Label>
                          <Input
                            value={currentReference.name}
                            onChange={(e) => setCurrentReference(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="John Smith"
                            className="text-sm"
                          />
                        </Field>
                        <Field>
                          <Label>Title</Label>
                          <Input
                            value={currentReference.title}
                            onChange={(e) => setCurrentReference(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Senior Manager"
                            className="text-sm"
                          />
                        </Field>
                        <Field>
                          <Label>Company</Label>
                          <Input
                            value={currentReference.company}
                            onChange={(e) => setCurrentReference(prev => ({ ...prev, company: e.target.value }))}
                            placeholder="Company Name"
                            className="text-sm"
                          />
                        </Field>
                        <Field>
                          <Label>Email *</Label>
                          <Input
                            type="email"
                            value={currentReference.email}
                            onChange={(e) => setCurrentReference(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="john@example.com"
                            className="text-sm"
                          />
                        </Field>
                        <Field>
                          <Label>Phone</Label>
                          <Input
                            value={currentReference.phone}
                            onChange={(e) => setCurrentReference(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+1 (555) 123-4567"
                            className="text-sm"
                          />
                        </Field>
                        <Field>
                          <Label>Relationship</Label>
                          <Input
                            value={currentReference.relationship}
                            onChange={(e) => setCurrentReference(prev => ({ ...prev, relationship: e.target.value }))}
                            placeholder="Former Manager"
                            className="text-sm"
                          />
                        </Field>
                        <Button onClick={addReference} outline className="w-full text-sm">
                          <PlusIcon className="h-4 w-4" />
                          Add Reference
                        </Button>
                      </FieldGroup>
                      {resumeData.references && resumeData.references.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {resumeData.references.map((ref, idx) => (
                            <div key={idx} className="p-2 bg-zinc-50 rounded border border-zinc-200">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-xs font-semibold">{ref.name}</p>
                                  <p className="text-xs text-zinc-500">{ref.title} at {ref.company}</p>
                                </div>
                                <Button
                                  onClick={() => {
                                    setResumeData(prev => ({
                                      ...prev,
                                      references: prev.references.filter((_, i) => i !== idx),
                                    }));
                                  }}
                                  plain
                                  className="text-red-600 p-1"
                                >
                                  <TrashIcon className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Save Button */}
                    <div className="sticky bottom-0 bg-zinc-50 pt-4 pb-2 border-t border-zinc-200">
                      <Button
                        onClick={handleSave}
                        color="blue"
                        className="w-full"
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <ArrowPathIcon className="h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon className="h-4 w-4" />
                            Save Resume
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Preview Columns - Right (3 columns) */}
                <div className="col-span-3 overflow-y-auto bg-white">
                  <LivePreview templateSettings={templateSettings} />
                </div>
              </div>
            )}

            {/* Old sections removed - now using stepper-based approach above */}
            
            {/* Experience Step - Full Width Split Screen - OLD VERSION (to be removed) */}
            {false && currentStep === WIZARD_STEPS.EXPERIENCE && (
              <div className="flex h-[calc(100vh-120px)] w-full">
                {/* Editor Panel - Left */}
                <div className="flex-1 overflow-y-auto bg-white border-r border-zinc-200">
                  <div className="max-w-full p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold text-zinc-950">Work Experience</h2>
                    <Button
                      onClick={() => handleRegenerateSection('experience')}
                      outline
                      disabled={isGenerating}
                    >
                      <ArrowPathIcon data-slot="icon" className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                      Enhance with AI
                    </Button>
                  </div>

                  <FieldGroup>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <Label htmlFor="exp-title">Job Title *</Label>
                        <Input
                          id="exp-title"
                          value={currentExperience.title}
                          onChange={(e) => setCurrentExperience(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Software Engineer"
                        />
                      </Field>

                      <Field>
                        <Label htmlFor="exp-company">Company *</Label>
                        <Input
                          id="exp-company"
                          value={currentExperience.company}
                          onChange={(e) => setCurrentExperience(prev => ({ ...prev, company: e.target.value }))}
                          placeholder="Tech Corp"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <Field>
                        <Label htmlFor="exp-start">Start Date</Label>
                        <Input
                          id="exp-start"
                          type="month"
                          value={currentExperience.startDate}
                          onChange={(e) => setCurrentExperience(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                      </Field>

                      <Field>
                        <Label htmlFor="exp-end">End Date</Label>
                        <Input
                          id="exp-end"
                          type="month"
                          value={currentExperience.endDate}
                          onChange={(e) => setCurrentExperience(prev => ({ ...prev, endDate: e.target.value }))}
                          disabled={currentExperience.current}
                        />
                      </Field>

                      <CheckboxField>
                        <Checkbox
                          checked={currentExperience.current}
                          onChange={(checked) => {
                            setCurrentExperience(prev => ({ ...prev, current: checked }));
                          }}
                          color="blue"
                        />
                        <Label>Currently Working</Label>
                      </CheckboxField>
                    </div>

                    <Field>
                      <Label htmlFor="exp-description">Description</Label>
                      <Textarea
                        id="exp-description"
                        value={currentExperience.description}
                        onChange={(e) => setCurrentExperience(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        placeholder="Describe your responsibilities and achievements..."
                      />
                    </Field>

                    <Button onClick={addExperience} outline>
                      <PlusIcon data-slot="icon" className="h-4 w-4" />
                      Add Experience
                    </Button>
                  </FieldGroup>

                  {/* List of added experiences */}
                  {resumeData.experience && resumeData.experience.length > 0 && (
                    <div className="mt-6 space-y-3">
                      {resumeData.experience.map((exp, idx) => (
                        <div key={idx} className="p-4 border border-zinc-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold">{exp.title} at {exp.company}</p>
                              <p className="text-sm text-zinc-500">
                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                              </p>
                            </div>
                            <Button
                              onClick={() => {
                                setResumeData(prev => ({
                                  ...prev,
                                  experience: prev.experience.filter((_, i) => i !== idx),
                                }));
                              }}
                              plain
                              className="text-red-600"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex justify-between">
                    <Button
                      onClick={() => setCurrentStep(WIZARD_STEPS.SUMMARY)}
                      outline
                    >
                      <ChevronLeftIcon data-slot="icon" className="h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(WIZARD_STEPS.EDUCATION)}
                      color="blue"
                    >
                      Continue
                      <ChevronRightIcon data-slot="icon" className="h-4 w-4" />
                    </Button>
                    </div>
                  </div>
                </div>
                
                {/* Live Preview Panel - Right - Full Width */}
                <div className="flex-1 hidden lg:block min-w-0">
                  <LivePreview />
                </div>
              </div>
            )}

            {/* Education Step - Full Width Split Screen - OLD VERSION (to be removed) */}
            {false && currentStep === WIZARD_STEPS.EDUCATION && (
              <div className="flex h-[calc(100vh-120px)] w-full">
                {/* Editor Panel - Left */}
                <div className="flex-1 overflow-y-auto bg-white border-r border-zinc-200">
                  <div className="max-w-full p-8">
                    <h2 className="text-2xl font-semibold text-zinc-950 mb-6">Education</h2>

                  <FieldGroup>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <Label htmlFor="edu-degree">Degree *</Label>
                        <Input
                          id="edu-degree"
                          value={currentEducation.degree}
                          onChange={(e) => setCurrentEducation(prev => ({ ...prev, degree: e.target.value }))}
                          placeholder="Bachelor of Science"
                        />
                      </Field>

                      <Field>
                        <Label htmlFor="edu-institution">Institution *</Label>
                        <Input
                          id="edu-institution"
                          value={currentEducation.institution}
                          onChange={(e) => setCurrentEducation(prev => ({ ...prev, institution: e.target.value }))}
                          placeholder="University Name"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <Field>
                        <Label htmlFor="edu-start">Start Date</Label>
                        <Input
                          id="edu-start"
                          type="month"
                          value={currentEducation.startDate}
                          onChange={(e) => setCurrentEducation(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                      </Field>

                      <Field>
                        <Label htmlFor="edu-end">End Date</Label>
                        <Input
                          id="edu-end"
                          type="month"
                          value={currentEducation.endDate}
                          onChange={(e) => setCurrentEducation(prev => ({ ...prev, endDate: e.target.value }))}
                        />
                      </Field>

                      <Field>
                        <Label htmlFor="edu-gpa">GPA</Label>
                        <Input
                          id="edu-gpa"
                          value={currentEducation.gpa}
                          onChange={(e) => setCurrentEducation(prev => ({ ...prev, gpa: e.target.value }))}
                          placeholder="3.8"
                        />
                      </Field>
                    </div>

                    <Button onClick={addEducation} outline>
                      <PlusIcon data-slot="icon" className="h-4 w-4" />
                      Add Education
                    </Button>
                  </FieldGroup>

                  {/* List of added education */}
                  {resumeData.education && resumeData.education.length > 0 && (
                    <div className="mt-6 space-y-3">
                      {resumeData.education.map((edu, idx) => (
                        <div key={idx} className="p-4 border border-zinc-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold">{edu.degree}</p>
                              <p className="text-sm text-zinc-500">{edu.institution}</p>
                            </div>
                            <Button
                              onClick={() => {
                                setResumeData(prev => ({
                                  ...prev,
                                  education: prev.education.filter((_, i) => i !== idx),
                                }));
                              }}
                              plain
                              className="text-red-600"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                    <div className="mt-6 flex justify-between">
                      <Button
                        onClick={() => setCurrentStep(WIZARD_STEPS.EXPERIENCE)}
                        outline
                      >
                        <ChevronLeftIcon data-slot="icon" className="h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        onClick={() => setCurrentStep(WIZARD_STEPS.SKILLS)}
                        color="blue"
                      >
                        Continue
                        <ChevronRightIcon data-slot="icon" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Live Preview Panel - Right - Full Width */}
                <div className="flex-1 hidden lg:block min-w-0">
                  <LivePreview />
                </div>
              </div>
            )}

            {/* Skills Step - Full Width Split Screen - OLD VERSION (to be removed) */}
            {false && currentStep === WIZARD_STEPS.SKILLS && (
              <div className="flex h-[calc(100vh-120px)] w-full">
                {/* Editor Panel - Left */}
                <div className="flex-1 overflow-y-auto bg-white border-r border-zinc-200">
                  <div className="max-w-full p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold text-zinc-950">Skills</h2>
                      <Button
                        onClick={() => handleRegenerateSection('skills')}
                        outline
                        disabled={isGenerating}
                      >
                        <ArrowPathIcon data-slot="icon" className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                        {isGenerating ? 'Regenerating...' : 'Suggest Skills with AI'}
                      </Button>
                    </div>

                    <div className="flex gap-2 mb-4">
                    <Input
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="Type a skill and press Enter"
                    />
                    <Button onClick={addSkill}>
                      <PlusIcon data-slot="icon" className="h-4 w-4" />
                      Add
                    </Button>
                  </div>

                  {/* Skills list */}
                  {resumeData.skills && resumeData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {resumeData.skills.map((skill, idx) => (
                        <Badge
                          key={idx}
                          color="blue"
                          className="flex items-center gap-1"
                        >
                          {skill}
                          <Button
                            onClick={() => {
                              setResumeData(prev => ({
                                ...prev,
                                skills: prev.skills.filter((_, i) => i !== idx),
                              }));
                            }}
                            plain
                            className="ml-1 p-0 h-auto hover:text-red-600"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}

                    <div className="mt-6 flex justify-between">
                      <Button
                        onClick={() => setCurrentStep(WIZARD_STEPS.EDUCATION)}
                        outline
                      >
                        <ChevronLeftIcon data-slot="icon" className="h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        onClick={() => setCurrentStep(WIZARD_STEPS.PREVIEW)}
                        color="blue"
                      >
                        Continue
                        <ChevronRightIcon data-slot="icon" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Live Preview Panel - Right - Full Width */}
                <div className="flex-1 hidden lg:block min-w-0">
                  <LivePreview />
                </div>
              </div>
            )}

            {/* Preview Step */}
            {currentStep === WIZARD_STEPS.PREVIEW && (
              <div className="max-w-full px-6 py-8">
                <div className="bg-white rounded-lg border border-zinc-200 p-8">
                  <h2 className="text-2xl font-semibold text-zinc-950 mb-6">Preview Your Resume</h2>
                  
                  <div className="border border-zinc-200 rounded-lg p-8 bg-white mb-6">
                    {/* Resume Preview */}
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="border-b border-zinc-200 pb-4">
                        <h2 className="text-2xl font-bold text-zinc-950">{resumeData.fullName || 'Your Name'}</h2>
                        <div className="flex flex-wrap gap-2 text-sm text-zinc-600 mt-2">
                          {resumeData.email && <span>{resumeData.email}</span>}
                          {resumeData.phone && <span>• {resumeData.phone}</span>}
                          {resumeData.location && <span>• {resumeData.location}</span>}
                          {resumeData.website && <span>• {resumeData.website}</span>}
                          {resumeData.linkedin && <span>• LinkedIn</span>}
                          {resumeData.github && <span>• GitHub</span>}
                        </div>
                      </div>

                      {/* Summary */}
                      {resumeData.summary && (
                        <div>
                          <h3 className="font-semibold text-zinc-950 mb-2">Professional Summary</h3>
                          <p className="text-sm text-zinc-600">{resumeData.summary}</p>
                        </div>
                      )}

                      {/* Skills */}
                      {resumeData.skills && resumeData.skills.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-zinc-950 mb-2">Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {resumeData.skills.map((skill, idx) => (
                              <Badge key={idx} color="zinc">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Experience */}
                      {resumeData.experience && resumeData.experience.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-zinc-950 mb-2">Experience</h3>
                          <div className="space-y-4">
                            {resumeData.experience.map((exp, idx) => (
                              <div key={idx}>
                                <p className="font-semibold">{exp.title} - {exp.company}</p>
                                <p className="text-sm text-zinc-500">
                                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                </p>
                                {exp.description && (
                                  <p className="text-sm text-zinc-600 mt-1">{exp.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Education */}
                      {resumeData.education && resumeData.education.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-zinc-950 mb-2">Education</h3>
                          <div className="space-y-2">
                            {resumeData.education.map((edu, idx) => (
                              <div key={idx}>
                                <p className="font-semibold">{edu.degree}</p>
                                <p className="text-sm text-zinc-500">{edu.institution}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      onClick={() => setCurrentStep(WIZARD_STEPS.SKILLS)}
                      outline
                    >
                      <ChevronLeftIcon data-slot="icon" className="h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      onClick={handleSave}
                      color="blue"
                      disabled={isGenerating}
                    >
                      {isGenerating ? 'Saving...' : 'Save & Complete'}
                      <CheckCircleIcon data-slot="icon" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Complete Step */}
            {currentStep === WIZARD_STEPS.COMPLETE && (
              <div className="max-w-full px-6 py-8">
                <div className="bg-white rounded-lg border border-zinc-200 p-12 text-center">
                  <CheckCircleIcon className="h-16 w-16 mx-auto mb-4 text-green-500" />
                  <h2 className="text-2xl font-semibold text-zinc-950 mb-2">Resume Created!</h2>
                  <p className="text-zinc-600 mb-8">Your resume has been saved successfully.</p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={handleGeneratePDF}
                      color="blue"
                      disabled={isGenerating}
                    >
                      <ArrowDownTrayIcon data-slot="icon" className="h-4 w-4" />
                      {isGenerating ? 'Generating...' : 'Generate PDF'}
                    </Button>
                    {currentResume?.pdfUrl && (
                      <>
                        <Button
                          onClick={handleViewPDF}
                          outline
                        >
                          <EyeIcon data-slot="icon" className="h-4 w-4" />
                          View PDF
                        </Button>
                        <Button
                          onClick={handleDownloadPDF}
                          outline
                        >
                          <ArrowDownTrayIcon data-slot="icon" className="h-4 w-4" />
                          Download PDF
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => {
                        setCurrentStep(WIZARD_STEPS.TEMPLATE);
                        setSelectedTemplate(null);
                        setCurrentResume(null);
                        setUploadMethod(null);
                        setResumeNameInput('');
                        setShowResumeNameModal(false);
                      }}
                      outline
                    >
                      Create Another
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
      
      {/* Template Settings Modal */}
      <TemplateSettings
        isOpen={showTemplateSettings}
        onClose={() => setShowTemplateSettings(false)}
        settings={templateSettings}
        onSettingsChange={setTemplateSettings}
      />

      {/* Resume Name Modal */}
      <Transition appear show={showResumeNameModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowResumeNameModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Dialog.Title className="text-xl font-bold text-zinc-950">
                        Name Your Resume
                      </Dialog.Title>
                      <button
                        onClick={() => {
                          setShowResumeNameModal(false);
                          setResumeNameInput('');
                        }}
                        className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                      >
                        <XMarkIcon className="h-5 w-5 text-zinc-600" />
                      </button>
                    </div>
                    
                    <p className="text-sm text-zinc-600 mb-4">
                      Give your resume a unique name to easily identify it later.
                    </p>

                    <FieldGroup>
                      <Field>
                        <Label>Resume Name</Label>
                        <Input
                          value={resumeNameInput}
                          onChange={(e) => setResumeNameInput(e.target.value)}
                          placeholder="e.g., Software Engineer Resume 2024"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && resumeNameInput.trim()) {
                              handleCreateNew();
                            }
                          }}
                          autoFocus
                        />
                      </Field>
                    </FieldGroup>

                    <div className="flex gap-3 mt-6">
                      <Button
                        onClick={() => {
                          setShowResumeNameModal(false);
                          setResumeNameInput('');
                        }}
                        outline
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          if (resumeNameInput.trim()) {
                            if (uploadMethod === 'upload') {
                              handleFileUpload();
                            } else {
                              handleCreateNew();
                            }
                          } else {
                            toast.error('Please enter a resume name');
                          }
                        }}
                        color="blue"
                        disabled={!resumeNameInput.trim() || (uploadMethod === 'upload' ? uploading : isGenerating)}
                        className="flex-1"
                      >
                        {(uploadMethod === 'upload' ? uploading : isGenerating) ? (
                          <>
                            <ArrowPathIcon className="h-4 w-4 animate-spin" />
                            {uploadMethod === 'upload' ? 'Uploading...' : 'Creating...'}
                          </>
                        ) : (
                          uploadMethod === 'upload' ? 'Upload Resume' : 'Create Resume'
                        )}
                      </Button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
