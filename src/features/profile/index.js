// Main exports for the profile feature
export { default as ProfilePage } from './pages/ProfilePage';
export { ProfileProvider } from './context/ProfileContext';
export { useProfile } from './hooks/useProfile';
export { useProfileProgress } from './hooks/useProfileProgress';
export { useProfileForm } from './hooks/useProfileForm';

// Component exports
export { default as ProfileCard } from './components/ProfileCard';
export { CompanySection, PersonalSection, PasswordSection } from './components/ProfileForm';
export { ProgressBar, CompletionBadge } from './components/ProfileProgress';
export { AvatarUpload } from './components/AvatarUpload';
export { MessageAlert } from './components/Common';