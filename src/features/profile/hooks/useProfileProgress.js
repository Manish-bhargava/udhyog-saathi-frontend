import { useProfile } from './useProfile';
import { useEffect, useState } from 'react';

export const useProfileProgress = () => {
  const { profile, loading } = useProfile();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const calculateProgress = () => {
    if (!profile || loading) return 0;
    
    let completed = 0;
    let total = 0;
    
    // Check personal info - only count if user has filled these fields
    if (profile.personal) {
      total += 3;
      if (profile.personal.firstName && profile.personal.firstName.trim() !== '') completed++;
      if (profile.personal.lastName && profile.personal.lastName.trim() !== '') completed++;
      if (profile.personal.email && profile.personal.email.trim() !== '') completed++;
    }
    
    // Check company info - only count fields that are actually filled
    if (profile.company) {
      // Count mandatory fields
      const mandatoryFields = [
        'companyName',
        'GST',
        'companyAddress', 
        'companyPhone', 
        'companyEmail',
        'companyDescription',
        'companyStamp',
        'companySignature'
      ];
      
      total += mandatoryFields.length;
      
      mandatoryFields.forEach(field => {
        if (profile.company[field] && profile.company[field].trim() !== '') {
          completed++;
        }
      });
    }
    
    // Check bank info
    if (profile.bank) {
      const bankFields = ['bankName', 'accountNumber', 'IFSC', 'branchName'];
      total += bankFields.length;
      
      bankFields.forEach(field => {
        if (profile.bank[field] && profile.bank[field].trim() !== '') {
          completed++;
        }
      });
    }
    
    // Calculate percentage
    const calculated = total > 0 ? Math.round((completed / total) * 100) : 0;
    console.log('Progress calculation:', { completed, total, calculated, profile });
    return calculated;
  };

  useEffect(() => {
    if (!loading) {
      const calculatedProgress = calculateProgress();
      setProgress(calculatedProgress);
      setIsComplete(calculatedProgress === 100);
    }
  }, [profile, loading]);

  return {
    progress,
    isComplete
  };
};