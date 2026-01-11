import { useState } from 'react';
import { useProfile } from './useProfile';

export const useProfileForm = (section, initialValues) => {
  const { updateProfile } = useProfile();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Form submission for', section, ':', formData);
    
    // Basic validation
    const newErrors = {};
    
    if (section === 'company') {
      const requiredFields = ['companyName', 'gstNumber', 'address', 'city', 'state', 'pincode', 'phone', 'email', 'bankName', 'accountNumber', 'ifscCode', 'branchName'];
      requiredFields.forEach(key => {
        if (!formData[key] || formData[key].trim() === '') {
          newErrors[key] = 'This field is required';
        }
      });
    } else if (section === 'personal') {
      const requiredFields = ['firstName', 'lastName', 'email'];
      requiredFields.forEach(key => {
        if (!formData[key] || formData[key].trim() === '') {
          newErrors[key] = 'This field is required';
        }
      });
    } else if (section === 'password') {
      const requiredFields = ['current_password', 'new_password', 'confirm_password'];
      requiredFields.forEach(key => {
        if (!formData[key] || formData[key].trim() === '') {
          newErrors[key] = 'This field is required';
        }
      });
      
      if (formData.new_password !== formData.confirm_password) {
        newErrors.confirm_password = 'Passwords do not match';
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      console.log('Form validation errors:', newErrors);
      return { success: false, error: 'Please fill all required fields correctly' };
    }
    
    try {
      const result = await updateProfile(section, formData);
      console.log('Form submission result:', result);
      setIsLoading(false);
      return result;
    } catch (error) {
      console.error('Form submission error:', error);
      setIsLoading(false);
      return { success: false, error: 'Submission failed' };
    }
  };

  const resetForm = () => {
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