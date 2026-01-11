import React from 'react';
import UserInfo from './UserInfo';
import QuickActions from './QuickActions';

const ProfileCard = ({ activeSection, onSectionChange }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <UserInfo />
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <QuickActions 
          activeSection={activeSection} 
          onSectionChange={onSectionChange} 
        />
      </div>
    </div>
  );
};

export default ProfileCard;