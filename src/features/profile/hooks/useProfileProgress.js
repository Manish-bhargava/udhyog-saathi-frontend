import { useProfile } from './useProfile';
import { useEffect, useState, useCallback } from 'react';

export const useProfileProgress = () => {
  const { profile, loading } = useProfile();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const calculateProgress = useCallback(() => {
    if (!profile || loading) return 0;
    
    let completed = 0;
    let total = 0;
    
    // Personal info (3 fields)
    if (profile.personal) {
      total += 3;
      if (profile.personal.firstName && profile.personal.firstName.trim() !== '') completed++;
      if (profile.personal.lastName && profile.personal.lastName.trim() !== '') completed++;
      if (profile.personal.email && profile.personal.email.trim() !== '') completed++;
    }
    
    // Company info
    if (profile.company) {
      const companyFields = [
        'companyName',
        'GST',
        'companyAddress', 
        'companyPhone', 
        'companyEmail'
      ];
      
      total += companyFields.length;
      
      companyFields.forEach(field => {
        if (profile.company[field] && profile.company[field].trim() !== '') {
          completed++;
        }
      });
    }
    
    // Bank info
    if (profile.bank) {
      const bankFields = ['bankName', 'accountNumber', 'IFSC', 'branchName'];
      total += bankFields.length;
      
      bankFields.forEach(field => {
        if (profile.bank[field] && profile.bank[field].trim() !== '') {
          completed++;
        }
      });
    }
    
    // Calculate percentage (minimum 0, maximum 100)
    const calculated = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
    return calculated;
  }, [profile, loading]);

  useEffect(() => {
    if (!loading && profile) {
      const calculatedProgress = calculateProgress();
      setProgress(calculatedProgress);
      setIsComplete(calculatedProgress === 100);
    }
  }, [profile, loading, calculateProgress]);

  return {
    progress,
    isComplete
  };
};
