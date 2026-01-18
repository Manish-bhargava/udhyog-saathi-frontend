// import React, { useState, useEffect } from 'react';
// import { profileAPI } from '../api';
// import InputField from '../../auth/components/InputField';
// import Button from '../../auth/components/Button';
// import ErrorMessage from '../../auth/components/ErrorMessage';

// const ProfilePage = () => {
//   const [activeSection, setActiveSection] = useState('company');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   // 1. DATA STATES - Full API Field Mapping
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
//   const isEmailLocked = user.onboarding === true;
//   const [companyData, setCompanyData] = useState({
//     companyName: '',
//     companyEmail: '', // Locked
//     companyAddress: '',
//     companyPhone: '',
//     companyLogo: '',
//     companyDescription: '',
//     GST: '',
//     companyStamp: '',
//     companySignature: '',
//     accountNumber: '',
//     IFSC: '',
//     bankName: '',
//     branchName: ''
//   });
//   const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

//   // 2. INITIAL SYNC: Load data from API once
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await profileAPI.getProfile();
//         if (res.success) {
//           const d = res.data;
//           // Synchronize the single onboarding flag
//           const updatedUser = { ...user, name: d.name, email: d.email, onboarding: d.isOnboarded };
//           localStorage.setItem('user', JSON.stringify(updatedUser));
//           setUser(updatedUser);
          
//           // Map backend response to flat state
//           setCompanyData({
//             ...d.company,
//             ...d.bankDetails
//           });
//         }
//       } catch (err) {
//         setError('Failed to sync profile data.');
//       }
//     };
//     fetchProfile();
//   }, []);

//   const handleSave = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       let result;

//       if (activeSection === 'password') {
//         // Password section still requires current password for security
//         if (passwordData.newPassword !== passwordData.confirmPassword) throw new Error("Passwords do not match");
//         result = await profileAPI.changePassword({
//           oldPassword: passwordData.oldPassword,
//           newPassword: passwordData.newPassword
//         });
//         setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
//       } else if (activeSection === 'personal') {
//         // FIXED: Password is no longer required for personal name updates
//         result = await profileAPI.updatePersonalInfo({
//           name: user.name,
//           email: user.email // Immutable
//         });
//       } else {
//         // Business update using Onboarding API
//         result = await profileAPI.updateBusinessInfo(companyData);
//       }

//       if (result.success) {
//         // Re-fetch to synchronize DB, LocalStorage, and UI
//         const freshProfile = await profileAPI.getProfile(); 
//         if (freshProfile.success) {
//           const d = freshProfile.data;
//           const updatedUser = { _id: d.id, name: d.name, email: d.email, onboarding: d.isOnboarded };
//           localStorage.setItem('user', JSON.stringify(updatedUser));
//           setUser(updatedUser);
//           setCompanyData({ ...d.company, ...d.bankDetails });
//           setSuccess(result.message || 'Profile updated successfully!');
//         }
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Update failed.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="mb-8 flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Profile Management</h1>
//           <p className="text-gray-600 text-sm">Update your information across business and personal accounts.</p>
//         </div>
//         <div className={`px-4 py-2 rounded-full text-xs font-bold ${user.onboarding ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
//           {user.onboarding ? '✅ Profile Complete' : '⚠️ Profile Incomplete'}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//         {/* LEFT: QUICK ACTIONS */}
//         <div className="lg:col-span-1 space-y-4">
//           <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
//             <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-inner">
//               {user.name?.charAt(0).toUpperCase()}
//             </div>
//             <h3 className="font-bold text-gray-900">{user.name}</h3>
//             <p className="text-xs text-gray-500">{user.email}</p>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm border p-2 space-y-1">
//             {[
//               { id: 'company', label: 'Business Profile', icon: '🏢' },
//               { id: 'personal', label: 'Account Info', icon: '👤' },
//               { id: 'password', label: 'Security', icon: '🔒' }
//             ].map(item => (
//               <button
//                 key={item.id}
//                 onClick={() => { setActiveSection(item.id); setError(''); setSuccess(''); }}
//                 className={`w-full flex items-center p-3 rounded-lg text-sm font-medium transition-all ${
//                   activeSection === item.id ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//               >
//                 <span className="mr-3">{item.icon}</span> {item.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* RIGHT: FORM CONTENT AREA */}
//         <div className="lg:col-span-3">
//           <div className="bg-white rounded-xl shadow-sm border p-8">
//             {error && <ErrorMessage type="error">{error}</ErrorMessage>}
//             {success && <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-medium">✨ {success}</div>}

//             <form onSubmit={handleSave} className="space-y-8">
//               {activeSection === 'company' && (
//                 <>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <InputField label="Company Name" value={companyData.companyName} onChange={e => setCompanyData({...companyData, companyName: e.target.value})} />
                    
//                     {/* BLOCKED EMAIL FIELD */}
//                     <div className="relative">
//                       <InputField 
//                         label={isEmailLocked ? "Company Email (Locked)" : "Company Email"} 
//                         value={companyData.companyEmail} 
//                         onChange={e => setCompanyData({...companyData, companyEmail: e.target.value})}
//                         disabled={isEmailLocked} 
//                       />
//                       <span className="absolute right-3 top-10 text-gray-400 text-[10px] font-bold uppercase">🔒 Fixed</span>
//                     </div>

//                     <InputField label="Contact Number" value={companyData.companyPhone} onChange={e => setCompanyData({...companyData, companyPhone: e.target.value})} />
//                     <InputField label="GST Identification Number" value={companyData.GST} onChange={e => setCompanyData({...companyData, GST: e.target.value})} />
//                     <div className="md:col-span-2">
//                       <InputField label="Business Description" value={companyData.companyDescription} onChange={e => setCompanyData({...companyData, companyDescription: e.target.value})} />
//                     </div>
//                     <div className="md:col-span-2">
//                       <InputField label="Registered Business Address" value={companyData.companyAddress} onChange={e => setCompanyData({...companyData, companyAddress: e.target.value})} />
//                     </div>
//                   </div>

//                   <div className="border-t pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <InputField label="Logo URL" value={companyData.companyLogo} onChange={e => setCompanyData({...companyData, companyLogo: e.target.value})} />
//                     <InputField label="Seal/Stamp URL" value={companyData.companyStamp} onChange={e => setCompanyData({...companyData, companyStamp: e.target.value})} />
//                     <InputField label="Signature URL" value={companyData.companySignature} onChange={e => setCompanyData({...companyData, companySignature: e.target.value})} />
//                   </div>

//                   <div className="border-t pt-8">
//                     <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
//                       <span className="mr-2">🏦</span> Banking Details
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <InputField label="Account Number" value={companyData.accountNumber} onChange={e => setCompanyData({...companyData, accountNumber: e.target.value})} />
//                       <InputField label="Bank Name" value={companyData.bankName} onChange={e => setCompanyData({...companyData, bankName: e.target.value})} />
//                       <InputField label="IFSC Code" value={companyData.IFSC} onChange={e => setCompanyData({...companyData, IFSC: e.target.value})} />
//                       <InputField label="Branch Location" value={companyData.branchName} onChange={e => setCompanyData({...companyData, branchName: e.target.value})} />
//                     </div>
//                   </div>
//                 </>
//               )}

//               {activeSection === 'personal' && (
//                 <div className="space-y-6">
//                   {/* Password requirement removed here */}
//                   <InputField label="Owner Full Name" value={user.name} onChange={e => setUser({...user, name: e.target.value})} />
                  
//                   <div className="relative">
//                     <InputField 
//                       label={isEmailLocked ? "Account Email (Locked)" : "Account Email"} 
//                       value={user.email} 
//                       disabled={isEmailLocked} 
//                     />
//                     <span className="absolute right-3 top-10 text-gray-400 text-[10px] font-bold uppercase">🔒 Fixed</span>
//                   </div>
//                 </div>
//               )}

//               {activeSection === 'password' && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="md:col-span-2">
//                     <InputField label="Current Password" type="password" value={passwordData.oldPassword} onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} />
//                   </div>
//                   <InputField label="New Password" type="password" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} />
//                   <InputField label="Confirm New Password" type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
//                 </div>
//               )}

//               <div className="pt-8 flex justify-end">
//                 <div className="w-full md:w-56">
//                   <Button type="submit" loading={loading} fullWidth>
//                     Confirm & Save Updates
//                   </Button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useState, useEffect } from 'react';
import { profileAPI } from '../api';
import InputField from '../../auth/components/InputField';
import Button from '../../auth/components/Button';
import ErrorMessage from '../../auth/components/ErrorMessage';

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState('company');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const isEmailLocked = user.onboarding === true;
  const [companyData, setCompanyData] = useState({
    companyName: '',
    companyEmail: '',
    companyAddress: '',
    companyPhone: '',
    companyLogo: '',
    companyDescription: '',
    GST: '',
    companyStamp: '',
    companySignature: '',
    accountNumber: '',
    IFSC: '',
    bankName: '',
    branchName: ''
  });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileAPI.getProfile();
        if (res.success) {
          const d = res.data;
          const updatedUser = { ...user, name: d.name, email: d.email, onboarding: d.isOnboarded };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
          
          setCompanyData({
            ...d.company,
            ...d.bankDetails
          });
        }
      } catch (err) {
        setError('Failed to sync profile data.');
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let result;

      if (activeSection === 'password') {
        if (passwordData.newPassword !== passwordData.confirmPassword) throw new Error("Passwords do not match");
        result = await profileAPI.changePassword({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        });
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else if (activeSection === 'personal') {
        result = await profileAPI.updatePersonalInfo({
          name: user.name,
          email: user.email
        });
      } else {
        result = await profileAPI.updateBusinessInfo(companyData);
      }

      if (result.success) {
        const freshProfile = await profileAPI.getProfile(); 
        if (freshProfile.success) {
          const d = freshProfile.data;
          const updatedUser = { _id: d.id, name: d.name, email: d.email, onboarding: d.isOnboarded };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
          setCompanyData({ ...d.company, ...d.bankDetails });
          setSuccess(result.message || 'Profile updated successfully!');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Profile Management</h1>
          <p className="text-gray-600 mt-2">Update your information across business and personal accounts.</p>
        </div>
        <div className={`px-5 py-2.5 rounded-full text-sm font-semibold ${user.onboarding ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
          {user.onboarding ? '✅ Profile Complete' : '⚠️ Profile Incomplete'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
            <p className="text-sm text-gray-500 mt-1 truncate">{user.email}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3 space-y-1.5">
            {[
              { id: 'company', label: 'Business Profile', icon: '🏢' },
              { id: 'personal', label: 'Account Info', icon: '👤' },
              { id: 'password', label: 'Security', icon: '🔒' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setError(''); setSuccess(''); }}
                className={`w-full flex items-center p-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id 
                    ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span> 
                <span className="text-left">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            {error && (
              <div className="mb-6">
                <ErrorMessage type="error">{error}</ErrorMessage>
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-50 text-green-800 border border-green-200 rounded-xl text-sm font-medium flex items-center">
                <span className="mr-2">✨</span>
                {success}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-10">
              {activeSection === 'company' && (
                <>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <span className="mr-3">🏢</span> Company Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField 
                        label="Company Name" 
                        value={companyData.companyName} 
                        onChange={e => setCompanyData({...companyData, companyName: e.target.value})} 
                      />
                      
                      <div className="relative">
                        <InputField 
                          label={isEmailLocked ? "Company Email (Locked)" : "Company Email"} 
                          value={companyData.companyEmail} 
                          onChange={e => setCompanyData({...companyData, companyEmail: e.target.value})}
                          disabled={isEmailLocked} 
                        />
                        {isEmailLocked && (
                          <span className="absolute right-3 top-10 text-xs text-gray-500 font-medium uppercase tracking-wide">Fixed</span>
                        )}
                      </div>

                      <InputField 
                        label="Contact Number" 
                        value={companyData.companyPhone} 
                        onChange={e => setCompanyData({...companyData, companyPhone: e.target.value})} 
                      />
                      <InputField 
                        label="GST Identification Number" 
                        value={companyData.GST} 
                        onChange={e => setCompanyData({...companyData, GST: e.target.value})} 
                      />
                      <div className="md:col-span-2">
                        <InputField 
                          label="Business Description" 
                          value={companyData.companyDescription} 
                          onChange={e => setCompanyData({...companyData, companyDescription: e.target.value})} 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <InputField 
                          label="Registered Business Address" 
                          value={companyData.companyAddress} 
                          onChange={e => setCompanyData({...companyData, companyAddress: e.target.value})} 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <span className="mr-3">🖼️</span> Digital Assets
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <InputField 
                        label="Logo URL" 
                        value={companyData.companyLogo} 
                        onChange={e => setCompanyData({...companyData, companyLogo: e.target.value})} 
                      />
                      <InputField 
                        label="Seal/Stamp URL" 
                        value={companyData.companyStamp} 
                        onChange={e => setCompanyData({...companyData, companyStamp: e.target.value})} 
                      />
                      <InputField 
                        label="Signature URL" 
                        value={companyData.companySignature} 
                        onChange={e => setCompanyData({...companyData, companySignature: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="border-t pt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <span className="mr-3">🏦</span> Banking Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField 
                        label="Account Number" 
                        value={companyData.accountNumber} 
                        onChange={e => setCompanyData({...companyData, accountNumber: e.target.value})} 
                      />
                      <InputField 
                        label="Bank Name" 
                        value={companyData.bankName} 
                        onChange={e => setCompanyData({...companyData, bankName: e.target.value})} 
                      />
                      <InputField 
                        label="IFSC Code" 
                        value={companyData.IFSC} 
                        onChange={e => setCompanyData({...companyData, IFSC: e.target.value})} 
                      />
                      <InputField 
                        label="Branch Location" 
                        value={companyData.branchName} 
                        onChange={e => setCompanyData({...companyData, branchName: e.target.value})} 
                      />
                    </div>
                  </div>
                </>
              )}

              {activeSection === 'personal' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <span className="mr-3">👤</span> Personal Information
                  </h3>
                  <div className="space-y-6 max-w-2xl">
                    <InputField 
                      label="Owner Full Name" 
                      value={user.name} 
                      onChange={e => setUser({...user, name: e.target.value})} 
                    />
                    
                    <div className="relative">
                      <InputField 
                        label={isEmailLocked ? "Account Email (Locked)" : "Account Email"} 
                        value={user.email} 
                        disabled={isEmailLocked} 
                      />
                      {isEmailLocked && (
                        <span className="absolute right-3 top-10 text-xs text-gray-500 font-medium uppercase tracking-wide">Fixed</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'password' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <span className="mr-3">🔒</span> Change Password
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                    <div className="md:col-span-2">
                      <InputField 
                        label="Current Password" 
                        type="password" 
                        value={passwordData.oldPassword} 
                        onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} 
                      />
                    </div>
                    <InputField 
                      label="New Password" 
                      type="password" 
                      value={passwordData.newPassword} 
                      onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} 
                    />
                    <InputField 
                      label="Confirm New Password" 
                      type="password" 
                      value={passwordData.confirmPassword} 
                      onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                    />
                  </div>
                </div>
              )}

              <div className="pt-8 border-t flex justify-end">
                <div className="w-full md:w-48">
                  <Button type="submit" loading={loading} fullWidth className="py-3">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;