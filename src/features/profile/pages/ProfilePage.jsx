import React, { useEffect, useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useProfileProgress } from '../hooks/useProfileProgress';
import ProfileCard from '../components/ProfileCard';
import { CompanySection, PersonalSection, PasswordSection } from '../components/ProfileForm';
import { ProgressBar, CompletionBadge } from '../components/ProfileProgress';
import { MessageAlert } from '../components/Common';
import { ProfileProvider } from '../context/ProfileContext';

const ProfilePageContent = () => {
  const { fetchProfile, message, clearMessage } = useProfile();
  const { isComplete } = useProfileProgress();
  const [activeSection, setActiveSection] = useState('company');
  
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  
  // Note: Removed the local setTimeout here because we added 
  // an auto-close timer inside the MessageAlert.jsx file.

  const renderSection = () => {
    switch (activeSection) {
      case 'company': return <CompanySection />;
      case 'personal': return <PersonalSection />;
      case 'password': return <PasswordSection />;
      default: return <CompanySection />;
    }
  };
  
  return (
    <div className="relative min-h-screen">
      {/* 1. Global Message Alert - Placed here for "Toast" behavior */}
      <MessageAlert 
        message={message} 
        onClose={clearMessage} 
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Profile Management</h1>
            <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-600">
              Manage your company details and personal information
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <CompletionBadge isComplete={isComplete} />
          </div>
        </div>
      </div>
      
      {/* 2. Removed the old message block from here to prevent duplicate alerts */}
      
      {/* Progress Section */}
      <div className="mb-8">
        <ProgressBar />
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <ProfileCard 
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
        </div>
        
        {/* Right Column */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="max-w-3xl mx-auto">
              {renderSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap with Provider
const ProfilePage = () => {
  return (
    <ProfileProvider>
      <ProfilePageContent />
    </ProfileProvider>
  );
};

export default ProfilePage;