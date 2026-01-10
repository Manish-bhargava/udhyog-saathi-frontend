import React, { useState } from 'react';

const PasswordField = React.forwardRef(({
  label = 'Password',
  placeholder = 'Enter your password',
  value,
  onChange,
  onBlur,
  error,
  touched,
  disabled = false,
  required = true,
  showStrength = false,
  id = 'password', // Add id prop with default value
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  
  // Generate a unique ID if not provided
  const fieldId = id || `password-${Math.random().toString(36).substr(2, 9)}`;
  
  const calculateStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getStrengthColor = (strength) => {
    if (strength < 50) return 'bg-red-500';
    if (strength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const strength = calculateStrength(value);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label 
          htmlFor={fieldId} // Use the unique fieldId here
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {showStrength && value && (
          <div className="text-xs font-medium text-gray-500">
            Strength: {strength}%
          </div>
        )}
      </div>
      
      <div className="relative">
        <input
          ref={ref}
          id={fieldId} // Use the unique fieldId here
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          className={`
            w-full px-4 py-3.5 rounded-xl border
            ${error && touched 
              ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500'
            }
            disabled:bg-gray-100 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-opacity-20
            transition-all duration-200
            text-gray-900 placeholder-gray-400 pr-12
          `}
          placeholder={placeholder}
          {...props}
        />
        
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      
      {showStrength && value && (
        <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getStrengthColor(strength)} transition-all duration-300`}
            style={{ width: `${strength}%` }}
          />
        </div>
      )}
      
      {error && touched && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {!error && label === 'Password' && (
        <p className="mt-2 text-xs text-gray-500">
          Password must be at least 6 characters long
        </p>
      )}
    </div>
  );
});

PasswordField.displayName = 'PasswordField';

export default PasswordField;