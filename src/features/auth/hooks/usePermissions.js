import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { user, isOnboarded } = useAuth();


  // Check if user has permission to perform actions
  const canPerformAction = () => {
    return user.isOnboarded;
  };

  // Get the appropriate button props based on permission
  const getButtonProps = (onClick, options = {}) => {
    const { disabled: customDisabled, ...restOptions } = options;
    
    if (!user.isOnboarded) {
      return {
        disabled: true,
        onClick: (e) => {
          e.preventDefault();
          // Show tooltip or message about onboarding
          if (options.onDisabledClick) {
            options.onDisabledClick();
          }
        },
        title: "Complete your onboarding to enable this feature",
        className: `${options.className || ''} opacity-50 cursor-not-allowed`,
        ...restOptions
      };
    }

    return {
      onClick,
      disabled: customDisabled || false,
      ...options
    };
  };

  // Get input/field props based on permission
  const getFieldProps = (options = {}) => {
    if (!user.isOnboarded) {
      return {
        disabled: true,
        readOnly: true,
        className: `${options.className || ''} bg-gray-50 cursor-not-allowed`,
        title: "Complete your onboarding to edit this field",
        ...options
      };
    }

    return options;
  };

  return {
    canPerformAction,
    getButtonProps,
    getFieldProps,
    isOnboarded
  };
};