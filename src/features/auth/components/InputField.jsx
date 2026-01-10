import React from 'react';

const InputField = React.forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  disabled = false,
  required = false,
  icon,
  id, // Add id prop
  ...props
}, ref) => {
  // Generate a unique ID if not provided
  const inputId = id || `input-${label?.replace(/\s+/g, '-').toLowerCase() || 'field'}`;
  
  return (
    <div className="mb-6">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          className={`
            w-full px-4 py-3.5 rounded-xl border
            ${icon ? 'pl-10' : 'pl-4'}
            ${error && touched 
              ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500'
            }
            disabled:bg-gray-100 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-opacity-20
            transition-all duration-200
            text-gray-900 placeholder-gray-400
          `}
          placeholder={placeholder}
          {...props}
        />
      </div>
      
      {error && touched && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;