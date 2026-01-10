import { useState } from 'react';

export const useAuthForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate on blur
    if (validate) {
      const error = validate(field, values[field]);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = (callback) => (e) => {
    e.preventDefault();
    
    if (validate) {
      const newErrors = {};
      Object.keys(values).forEach(key => {
        const error = validate(key, values[key]);
        if (error) newErrors[key] = error;
      });
      
      setErrors(newErrors);
      setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      
      if (Object.keys(newErrors).length === 0) {
        callback(values);
      }
    } else {
      callback(values);
    }
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit
  };
};