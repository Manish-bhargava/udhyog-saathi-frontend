import { useProfile } from './useProfile';

export const useProfileProgress = () => {
  const { profile } = useProfile();
  
  const calculateProgress = () => {
    if (!profile) return 0;
    
    let completed = 0;
    let total = 0;
    
    // Check personal info
    if (profile.personal) {
      total += 3;
      if (profile.personal.firstName) completed++;
      if (profile.personal.lastName) completed++;
      if (profile.personal.email) completed++;
    }
    
    // Check company info
    if (profile.company) {
      total += 5;
      if (profile.company.companyName) completed++;
      if (profile.company.GST) completed++;
      if (profile.company.companyAddress) completed++;
      if (profile.company.companyPhone) completed++;
      if (profile.company.companyEmail) completed++;
    }
    
    // Check bank info
    if (profile.bank) {
      total += 4;
      if (profile.bank.bankName) completed++;
      if (profile.bank.accountNumber) completed++;
      if (profile.bank.IFSC) completed++;
      if (profile.bank.branchName) completed++;
    }
    
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };
  
  const isComplete = calculateProgress() === 100;
  
  return {
    progress: calculateProgress(),
    isComplete
  };
};