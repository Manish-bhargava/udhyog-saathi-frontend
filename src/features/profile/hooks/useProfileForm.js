import { useState } from 'react';
import { useProfile } from './useProfile';

export const useProfileForm = (section, initialValues) => {
  const { updateProfile, setMessage } = useProfile();
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Basic validation
    if (!formData[name] && section !== 'password') {
      setErrors(prev => ({
        ...prev,
        [name]: 'This field is required'
      }));
    }
  };

  const handleSubmit = async (e, customData = null) => {
    // Only prevent default if it's a form submission event
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    console.log('handleSubmit called for section:', section, 'with data:', customData || formData);
    setIsLoading(true);
    
    // Basic validation
    const newErrors = {};
    const dataToValidate = customData || formData;
    
    if (section === 'company') {
      const requiredFields = ['companyName', 'GST', 'companyAddress', 'companyPhone', 'companyEmail', 'bankName', 'accountNumber', 'IFSC', 'branchName'];
      requiredFields.forEach(key => {
        if (!dataToValidate[key] || dataToValidate[key].trim() === '') {
          newErrors[key] = 'This field is required';
        }
      });
    } else if (section === 'personal') {
      const requiredFields = ['firstName', 'lastName', 'email'];
      requiredFields.forEach(key => {
        if (!dataToValidate[key] || dataToValidate[key].trim() === '') {
          newErrors[key] = 'This field is required';
        }
      });
    } else if (section === 'password') {
      const requiredFields = ['current_password', 'new_password', 'confirm_password'];
      requiredFields.forEach(key => {
        if (!dataToValidate[key] || dataToValidate[key].trim() === '') {
          newErrors[key] = 'This field is required';
        }
      });
      
      if (dataToValidate.new_password !== dataToValidate.confirm_password) {
        newErrors.confirm_password = 'Passwords do not match';
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      
      // NEW: Show red error alert for validation failure
      setMessage({ 
        type: 'error', 
        text: 'Validation Failed: Please check the required fields.' 
      });
      
      return { success: false, error: 'Please fill all required fields correctly' };
    }
    
    try {
      const result = await updateProfile(section, dataToValidate);
      // Success is already handled inside updateProfile in ProfileContext.jsx
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      // Error is already handled inside updateProfile in ProfileContext.jsx
      return { success: false, error: 'Submission failed' };
    }
  };

  const resetForm = () => {
    console.log('Resetting form to initial values');
    setFormData(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    formData,
    errors,
    touched,
    isLoading,
    handleChange,
    handleBlur,
    handleSubmit,
    setFormData,
    resetForm
  };
};