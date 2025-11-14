import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { checkProfileCompletion } from '@/utils/profileCompletion';
import ProfileCompletionGauge from './ProfileCompletionGauge';
import ProfileCompletionWizard from './ProfileCompletionWizard';

export default function ProfileCompletionBanner() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [completion, setCompletion] = useState(null);

  useEffect(() => {
    if (user) {
      const result = checkProfileCompletion(user);
      setCompletion(result);
      
      // Only show banner if profile is incomplete and not on profile page
      if (!result.isComplete && router.pathname !== '/candidate/profile' && router.pathname !== '/employer/profile') {
        // Check if dismissed in localStorage
        const dismissed = localStorage.getItem(`profileBannerDismissed_${user.id}`);
        if (!dismissed) {
          setIsVisible(true);
        }
      } else {
        setIsVisible(false);
      }
    }
  }, [user, router.pathname]);

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      if (refreshUser) {
        refreshUser();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('profileUpdated', handleProfileUpdate);
      return () => {
        window.removeEventListener('profileUpdated', handleProfileUpdate);
      };
    }
  }, [refreshUser]);

  const handleClose = () => {
    setIsVisible(false);
    if (user && typeof window !== 'undefined') {
      localStorage.setItem(`profileBannerDismissed_${user.id}`, 'true');
    }
  };

  const handleCompleteProfile = () => {
    setShowWizard(true);
  };

  const handleWizardComplete = () => {
    setShowWizard(false);
    setIsVisible(false);
  };

  if (!isVisible || !completion || completion.isComplete) {
    return null;
  }

  return (
    <>
      <ProfileCompletionWizard 
        isOpen={showWizard} 
        onClose={() => setShowWizard(false)}
        onComplete={handleWizardComplete}
      />
    <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-400 dark:border-primary-500 p-4 mb-6 rounded-lg">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <ProfileCompletionGauge percentage={completion.completionPercentage} size="sm" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-primary-800 dark:text-primary-200">
                Complete your profile to get better matches
              </h3>
              <div className="mt-2 text-sm text-primary-700 dark:text-primary-300">
                <p>
                  Your profile is {completion.completionPercentage}% complete. 
                  {completion.missingFields.length > 0 && (
                    <span> Missing: {completion.missingFields.slice(0, 3).join(', ')}
                      {completion.missingFields.length > 3 && ` +${completion.missingFields.length - 3} more`}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="ml-4 flex items-center space-x-2">
              <button
                onClick={handleCompleteProfile}
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                Complete Now
              </button>
              <button
                onClick={handleClose}
                className="text-primary-400 dark:text-primary-500 hover:text-primary-500 dark:hover:text-primary-400"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

