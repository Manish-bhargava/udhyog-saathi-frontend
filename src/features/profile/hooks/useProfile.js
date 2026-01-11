import { useProfile as useProfileContext } from '../context/ProfileContext';

export const useProfile = () => {
  const context = useProfileContext();
  
  return {
    profile: context.profile,
    loading: context.loading,
    message: context.message,
    fetchProfile: context.fetchProfile,
    updateProfile: context.updateProfile,
    clearMessage: context.clearMessage
  };
};