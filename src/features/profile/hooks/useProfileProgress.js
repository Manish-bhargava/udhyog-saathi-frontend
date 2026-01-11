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
      if (profile.personal.firstName?.trim()) completed++;
      if (profile.personal.lastName?.trim()) completed++;
      if (profile.personal.email?.trim()) completed++;
    }
    
    // Check company info (removed companyLogo from count)
    if (profile.company) {
      total += 8; // Removed companyLogo from total count
      if (profile.company.companyName?.trim()) completed++;
      if (profile.company.GST?.trim()) completed++;
      if (profile.company.companyAddress?.trim()) completed++;
      if (profile.company.companyPhone?.trim()) completed++;
      if (profile.company.companyEmail?.trim()) completed++;
      if (profile.company.companyDescription?.trim()) completed++;
      if (profile.company.companyStamp?.trim()) completed++;
      if (profile.company.companySignature?.trim()) completed++;
    }
    
    // Check bank info
    if (profile.bank) {
      total += 4;
      if (profile.bank.bankName?.trim()) completed++;
      if (profile.bank.accountNumber?.trim()) completed++;
      if (profile.bank.IFSC?.trim()) completed++;
      if (profile.bank.branchName?.trim()) completed++;
    }
    
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };
  
  const isComplete = calculateProgress() === 100;
  
  return {
    progress: calculateProgress(),
    isComplete
  };
};