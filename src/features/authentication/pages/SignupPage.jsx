// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { authAPI } from '../api';
// import AuthCard from '../../auth/components/AuthCard';
// import Heading from '../../auth/components/Heading';
// import Subheading from '../../auth/components/Subheading';
// import InputField from '../../auth/components/InputField';
// import PasswordField from '../../auth/components/PasswordField';
// import Button from '../../auth/components/Button';
// import ErrorMessage from '../../auth/components/ErrorMessage';
// import Divider from '../../auth/components/Divider';
// import SocialLoginButton from '../../auth/components/SocialLoginButton';
// import Logo from '../../../components/Logo';

// const SignupPage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ 
//     name: '', 
//     email: '', 
//     password: '',
//     confirmPassword: '' 
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     if (error) setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     setLoading(true);

//     try {
//       const { name, email, password } = formData;
//       const result = await authAPI.signup({ name, email, password });
      
//       // Success check
//       if (result.status === 201 || result.token) {
//         localStorage.setItem('token', result.token);
//         localStorage.setItem('user', JSON.stringify(result.data));
//         localStorage.setItem('isNewUser', 'true');
//         window.location.href = '/onboarding'; // Hard redirect to prevent stale state
//       }
//     } catch (err) {
//       const status = err.response?.status;
//       const serverMessage = err.response?.data?.message || '';

//       // 1. Logic for "User already exists"
//       if (status === 409 || serverMessage.toLowerCase().includes('already exist')) {
//         setError('User already exists. Redirecting to Login...');
//         setTimeout(() => {
//           navigate('/login');
//         }, 2000); // Give user 2 seconds to read the message
//       } 
//       // 2. Logic for General Server Errors with Error Code
//       else {
//         setError(`Server side error: ${status || 'Unknown Code'} - ${serverMessage || 'Please try again later'}`);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
//       <AuthCard>
//         <div className="text-center mb-8">
//           <Logo className="mx-auto h-12 w-auto" />
//           <Heading>Create your account</Heading>
//           <Subheading>Start your free trial today</Subheading>
//         </div>

//         {error && (
//           <ErrorMessage type={error.includes('Redirecting') ? 'warning' : 'error'}>
//             {error}
//           </ErrorMessage>
//         )}

//         <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//           <InputField
//             label="Full Name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             placeholder="Enter your full name"
//           />
//           <InputField
//             label="Email Address"
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             placeholder="Enter your email"
//           />
//           <PasswordField
//             label="Password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             placeholder="Create a password"
//           />
//           <PasswordField
//             label="Confirm Password"
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             required
//             placeholder="Re-enter your password"
//           />
//           <Button type="submit" disabled={loading} fullWidth>
//             {loading ? 'Creating account...' : 'Sign up'}
//           </Button>
//         </form>

//         <Divider>Or continue with</Divider>
//         <div className="mt-6 grid grid-cols-2 gap-3">
//           <SocialLoginButton provider="google" onClick={() => {}} />
//           <SocialLoginButton provider="github" onClick={() => {}} />
//         </div>
//         <div className="mt-6 text-center">
//           <p className="text-sm text-gray-600">
//             Already have an account?{' '}
//             <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
//               Log in
//             </Link>
//           </p>
//         </div>
//       </AuthCard>
//     </div>
//   );
// };

// export default SignupPage;


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';
import AuthCard from '../../auth/components/AuthCard';
import Heading from '../../auth/components/Heading';
import Subheading from '../../auth/components/Subheading';
import InputField from '../../auth/components/InputField';
import PasswordField from '../../auth/components/PasswordField';
import Button from '../../auth/components/Button';
import ErrorMessage from '../../auth/components/ErrorMessage';
import Divider from '../../auth/components/Divider';
import SocialLoginButton from '../../auth/components/SocialLoginButton';
import Logo from '../../../components/Logo';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { name, email, password } = formData;
      const result = await authAPI.signup({ name, email, password });
      
      if (result.status === 201 || result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.data));
        localStorage.setItem('isNewUser', 'true');
        window.location.href = '/onboarding';
      }
    } catch (err) {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message || '';

      if (status === 409 || serverMessage.toLowerCase().includes('already exist')) {
        setError('User already exists. Redirecting to Login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } 
      else {
        setError(`Server side error: ${status || 'Unknown Code'} - ${serverMessage || 'Please try again later'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50 py-12 px-4">
      <AuthCard className="max-w-md w-full">
        <div className="text-center mb-10">
          <Logo className="mx-auto h-14 w-auto mb-6" />
          <Heading className="text-3xl">Create your account</Heading>
          <Subheading className="mt-3 text-gray-600">Start your free trial today</Subheading>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage type={error.includes('Redirecting') ? 'warning' : 'error'}>
              {error}
            </ErrorMessage>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
          />
          <PasswordField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Create a secure password"
          />
          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Re-enter your password"
          />
          
          <div className="flex items-start space-x-2">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the <Link to="/terms" className="text-blue-600 hover:text-blue-500 font-medium">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 hover:text-blue-500 font-medium">Privacy Policy</Link>
            </label>
          </div>
          
          <Button 
            type="submit" 
            disabled={loading} 
            fullWidth 
            className="py-3.5 text-base font-semibold"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <Divider className="my-8">Or continue with</Divider>
        
        <div className="grid grid-cols-2 gap-4">
          <SocialLoginButton provider="google" onClick={() => {}} />
          <SocialLoginButton provider="github" onClick={() => {}} />
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </AuthCard>
    </div>
  );
};

export default SignupPage;