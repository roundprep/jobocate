import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function CandidateProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Senior Software Engineer',
    bio: 'Experienced software engineer with 5+ years of experience in full-stack development. Passionate about creating efficient and scalable applications.',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp Inc.',
        duration: '2020 - Present',
        description: 'Leading a team of developers to build scalable web applications.'
      },
      {
        title: 'Software Engineer',
        company: 'Web Solutions LLC',
        duration: '2018 - 2020',
        description: 'Developed and maintained multiple client websites and applications.'
      }
    ],
    education: [
      {
        degree: 'M.S. in Computer Science',
        institution: 'Stanford University',
        year: '2018'
      },
      {
        degree: 'B.Tech in Computer Science',
        institution: 'University of California',
        year: '2016'
      }
    ]
  });

  const [editData, setEditData] = useState({...profile});

  const handleEdit = () => {
    setEditData({...profile});
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile({...editData});
    setIsEditing(false);
    // Here you would typically make an API call to save the data
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setEditData(prev => ({
      ...prev,
      skills
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-black">My Profile</h1>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 border border-black text-sm font-medium rounded-md text-black hover:bg-gray-100 focus:outline-none"
            >
              <PencilIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Edit Profile
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <XMarkIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none"
              >
                <CheckIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-black">Personal Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-600">Your personal details and information.</p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200 dark:divide-gray-700">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-700">Full name</dt>
                <dd className="mt-1 text-sm text-black sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={editData.fullName}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black border p-2"
                    />
                  ) : (
                    profile.fullName
                  )}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black border p-2"
                    />
                  ) : (
                    profile.email
                  )}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black border p-2"
                    />
                  ) : (
                    profile.phone
                  )}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Location</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={editData.location}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black border p-2"
                    />
                  ) : (
                    profile.location
                  )}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Job Title</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="title"
                      value={editData.title}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black border p-2"
                    />
                  ) : (
                    profile.title
                  )}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Bio</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <textarea
                      name="bio"
                      rows={3}
                      value={editData.bio}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black border p-2"
                    />
                  ) : (
                    <p className="whitespace-pre-line">{profile.bio}</p>
                  )}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Skills</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <div>
                      <textarea
                        name="skills"
                        rows={3}
                        value={editData.skills.join(', ')}
                        onChange={handleSkillsChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black border p-2"
                        placeholder="Enter skills separated by commas"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Separate skills with commas (e.g., JavaScript, React, Node.js)</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Experience Section */}
        <div className="mt-8 bg-white border border-gray-200 overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-black">Work Experience</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-600">Your professional work history.</p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200 dark:divide-gray-700">
              {profile.experience.map((exp, index) => (
                <div key={index} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-700">{exp.duration}</dt>
                  <dd className="mt-1 text-sm text-black sm:mt-0 sm:col-span-2">
                    <h4 className="font-medium">{exp.title}</h4>
                    <p className="text-gray-800 font-medium">{exp.company}</p>
                    <p className="mt-1">{exp.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Education Section */}
        <div className="mt-8 bg-white border border-gray-200 overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-black">Education</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-600">Your educational background.</p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200 dark:divide-gray-700">
              {profile.education.map((edu, index) => (
                <div key={index} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-700">{edu.year}</dt>
                  <dd className="mt-1 text-sm text-black sm:mt-0 sm:col-span-2">
                    <h4 className="font-medium">{edu.degree}</h4>
                    <p className="text-gray-800 font-medium">{edu.institution}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
