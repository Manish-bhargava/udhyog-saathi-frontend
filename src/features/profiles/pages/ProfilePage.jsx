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

//   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
//   const isEmailLocked = user.onboarding === true;
  
//   const [companyData, setCompanyData] = useState({
//     companyName: '',
//     companyEmail: '',
//     companyAddress: '',
//     companyPhone: '',
//     GST: '',
//     companyDescription: '',
//     accountNumber: '',
//     IFSC: '',
//     bankName: '',
//     branchName: ''
//   });

//   const [files, setFiles] = useState({
//     companyLogo: null,
//     companyStamp: null,
//     companySignature: null
//   });

//   const [previews, setPreviews] = useState({
//     companyLogo: '',
//     companyStamp: '',
//     companySignature: ''
//   });

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await profileAPI.getProfile();
//         if (res.success) {
//           const d = res.data;
//           const updatedUser = { ...user, name: d.name, email: d.email, onboarding: d.isOnboarded };
//           localStorage.setItem('user', JSON.stringify(updatedUser));
//           setUser(updatedUser);
          
//           setCompanyData({
//             companyName: d.company?.companyName || '',
//             companyEmail: d.company?.companyEmail || '',
//             companyAddress: d.company?.companyAddress || '',
//             companyPhone: d.company?.companyPhone || '',
//             GST: d.company?.GST || '',
//             companyDescription: d.company?.companyDescription || '',
//             ...d.bankDetails
//           });

//           setPreviews({
//             companyLogo: d.company?.companyLogo || '',
//             companyStamp: d.company?.companyStamp || '',
//             companySignature: d.company?.companySignature || ''
//           });
//         }
//       } catch (err) {
//         setError('Failed to sync profile data.');
//       }
//     };
//     fetchProfile();
//   }, []);

//   const handleFileChange = (e, field) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFiles(prev => ({ ...prev, [field]: file }));
//       setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
//     }
//   };

//   // New function to remove local file selection and preview
//   const handleDeleteFile = (field) => {
//     setFiles(prev => ({ ...prev, [field]: null }));
//     setPreviews(prev => ({ ...prev, [field]: '' }));
    
//     // Reset the input field value so the user can re-select the same file if needed
//     const input = document.getElementById(`file-input-${field}`);
//     if (input) input.value = '';
//   };

//   const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

//   const handleSave = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       let result;

//       if (activeSection === 'company') {
//         const formData = new FormData();
        
//         // 1. Prepare text data including existing image URLs if no new file is chosen
//         const finalCompanyData = { ...companyData };
        
//         // If no new file is selected, but a preview URL exists, it's an old image
//         if (!(files.companyLogo instanceof File) && previews.companyLogo) {
//           finalCompanyData.companyLogo = previews.companyLogo;
//         }
//         if (!(files.companySignature instanceof File) && previews.companySignature) {
//           finalCompanyData.companySignature = previews.companySignature;
//         }
//         if (!(files.companyStamp instanceof File) && previews.companyStamp) {
//           finalCompanyData.companyStamp = previews.companyStamp;
//         }

//         // 2. Append all text/URL data to FormData
//         Object.keys(finalCompanyData).forEach(key => {
//           if (finalCompanyData[key]) {
//             formData.append(key, finalCompanyData[key]);
//           }
//         });

//         // 3. Append only NEW binary files (these will be in req.files)
//         if (files.companyLogo instanceof File) {
//           formData.append('companyLogo', files.companyLogo);
//         }
//         if (files.companySignature instanceof File) {
//           formData.append('companySignature', files.companySignature);
//         }
//         // Note: ensure your backend router accepts companyStamp to avoid "Unexpected Field"
//         if (files.companyStamp instanceof File) {
//           formData.append('companyStamp', files.companyStamp);
//         }

//         result = await profileAPI.updateBusinessInfo(formData);
//       } else {
//         // ... (personal/password logic)
//       }

//       if (result.success) {
//         setSuccess('Profile updated successfully!');
//         // Re-fetching ensures state is perfectly synced with the DB
//         const res = await profileAPI.getProfile();
//         if (res.success) {
//           const d = res.data;
//           setPreviews({
//             companyLogo: d.company?.companyLogo || '',
//             companyStamp: d.company?.companyStamp || '',
//             companySignature: d.company?.companySignature || ''
//           });
//           // Reset file selections since they are now saved
//           setFiles({ companyLogo: null, companyStamp: null, companySignature: null });
//         }
//       }
//     } catch (err) {
//       console.error("Save Error:", err);
//       setError(err.response?.data?.message || 'Update failed.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
//         <div>
//           <p className="text-gray-600 test-xl mt-2">Update your information across business and personal accounts.</p>
//         </div>
//         <div className={`px-5 py-2.5 rounded-full text-sm font-semibold ${user.onboarding ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
//           {user.onboarding ? '✅ Profile Complete' : '⚠️ Profile Incomplete'}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//         <div className="lg:col-span-1 space-y-6">
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7 text-center">
//             <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
//               {user.name?.charAt(0).toUpperCase()}
//             </div>
//             <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
//             <p className="text-sm text-gray-500 mt-1 truncate">{user.email}</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3 space-y-1.5">
//             {[
//               { id: 'company', label: 'Business Profile', icon: '🏢' },
//               { id: 'personal', label: 'Account Info', icon: '👤' },
//               { id: 'password', label: 'Security', icon: '🔒' }
//             ].map(item => (
//               <button
//                 key={item.id}
//                 onClick={() => { setActiveSection(item.id); setError(''); setSuccess(''); }}
//                 className={`w-full flex items-center p-4 rounded-xl text-sm font-medium transition-all duration-200 ${
//                   activeSection === item.id 
//                     ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm' 
//                     : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
//                 }`}
//               >
//                 <span className="mr-3 text-lg">{item.icon}</span> 
//                 <span className="text-left">{item.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="lg:col-span-3">
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
//             {error && <ErrorMessage type="error">{error}</ErrorMessage>}
//             {success && (
//               <div className="mb-6 p-4 bg-green-50 text-green-800 border border-green-200 rounded-xl text-sm font-medium flex items-center">
//                 <span className="mr-2">✨</span> {success}
//               </div>
//             )}

//             <form onSubmit={handleSave} className="space-y-10">
//               {activeSection === 'company' && (
//                 <>
//                   <div>
//                     <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
//                       <span className="mr-3">🏢</span> Company Details
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <InputField 
//                         label="Company Name" 
//                         value={companyData.companyName} 
//                         onChange={e => setCompanyData({...companyData, companyName: e.target.value})} 
//                       />
//                       <div className="relative">
//                         <InputField 
//                           label={isEmailLocked ? "Company Email (Locked)" : "Company Email"} 
//                           value={companyData.companyEmail} 
//                           onChange={e => setCompanyData({...companyData, companyEmail: e.target.value})}
//                           disabled={isEmailLocked} 
//                         />
//                         {isEmailLocked && <span className="absolute right-3 top-10 text-xs text-gray-500 font-medium uppercase tracking-wide">Fixed</span>}
//                       </div>
//                       <InputField label="Contact Number" value={companyData.companyPhone} onChange={e => setCompanyData({...companyData, companyPhone: e.target.value})} />
//                       <InputField label="GST Identification Number" value={companyData.GST} onChange={e => setCompanyData({...companyData, GST: e.target.value})} />
//                       <div className="md:col-span-2">
//                         <InputField label="Business Description" value={companyData.companyDescription} onChange={e => setCompanyData({...companyData, companyDescription: e.target.value})} />
//                       </div>
//                       <div className="md:col-span-2">
//                         <InputField label="Registered Business Address" value={companyData.companyAddress} onChange={e => setCompanyData({...companyData, companyAddress: e.target.value})} />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="border-t pt-8">
//                     <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
//                       <span className="mr-3">🖼️</span> Digital Assets
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                       {[
//                         { label: 'Company Logo', key: 'companyLogo' },
//                         { label: 'Seal/Stamp', key: 'companyStamp' },
//                         { label: 'Signature', key: 'companySignature' }
//                       ].map(asset => (
//                         <div key={asset.key} className="space-y-2">
//                           <label className="block text-sm font-medium text-gray-700">{asset.label}</label>
//                           <div className="relative mt-1 flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors group">
//                             {previews[asset.key] ? (
//                               <div className="relative mb-3">
//                                 <img src={previews[asset.key]} alt={asset.label} className="h-20 w-auto object-contain rounded-lg" />
//                                 <button
//                                   type="button"
//                                   onClick={() => handleDeleteFile(asset.key)}
//                                   className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 shadow-sm hover:bg-red-200 transition-colors opacity-0 group-hover:opacity-100"
//                                   title="Remove image"
//                                 >
//                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="6 18L18 6M6 6l12 12" />
//                                   </svg>
//                                 </button>
//                               </div>
//                             ) : (
//                               <div className="h-20 flex items-center justify-center text-gray-400">No Image</div>
//                             )}
//                             <input 
//                               id={`file-input-${asset.key}`}
//                               type="file" 
//                               accept="image/*" 
//                               onChange={(e) => handleFileChange(e, asset.key)}
//                               className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                             />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="border-t pt-8">
//                     <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
//                       <span className="mr-3">🏦</span> Banking Details
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
//                 <div>
//                   <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
//                     <span className="mr-3">👤</span> Personal Information
//                   </h3>
//                   <div className="space-y-6 max-w-2xl">
//                     <InputField label="Owner Full Name" value={user.name} onChange={e => setUser({...user, name: e.target.value})} />
//                     <div className="relative">
//                       <InputField label={isEmailLocked ? "Account Email (Locked)" : "Account Email"} value={user.email} disabled={isEmailLocked} />
//                       {isEmailLocked && <span className="absolute right-3 top-10 text-xs text-gray-500 font-medium uppercase tracking-wide">Fixed</span>}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeSection === 'password' && (
//                 <div>
//                   <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
//                     <span className="mr-3">🔒</span> Change Password
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
//                     <div className="md:col-span-2">
//                       <InputField label="Current Password" type="password" value={passwordData.oldPassword} onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} />
//                     </div>
//                     <InputField label="New Password" type="password" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} />
//                     <InputField label="Confirm New Password" type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
//                   </div>
//                 </div>
//               )}

//               <div className="pt-8 border-t flex justify-end">
//                 <div className="w-full md:w-48">
//                   <Button type="submit" loading={loading} fullWidth className="py-3">
//                     {loading ? 'Saving...' : 'Save Changes'}
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
    GST: '',
    companyDescription: '',
    accountNumber: '',
    IFSC: '',
    bankName: '',
    branchName: ''
  });

  // State for binary file objects (newly selected files)
  const [files, setFiles] = useState({
    companyLogo: null,
    companyStamp: null,
    companySignature: null
  });

  // NEW: State to store existing Cloudinary URLs from the backend
  const [existingImages, setExistingImages] = useState({
    companyLogo: '',
    companyStamp: '',
    companySignature: ''
  });

  // Previews for the UI (can be Blob URLs or Cloudinary URLs)
  const [previews, setPreviews] = useState({
    companyLogo: '',
    companyStamp: '',
    companySignature: ''
  });

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
            companyName: d.company?.companyName || '',
            companyEmail: d.company?.companyEmail || '',
            companyAddress: d.company?.companyAddress || '',
            companyPhone: d.company?.companyPhone || '',
            GST: d.company?.GST || '',
            companyDescription: d.company?.companyDescription || '',
            ...d.bankDetails
          });

          // Store existing Cloudinary URLs in state
          const cloudinaryUrls = {
            companyLogo: d.company?.companyLogo || '',
            companyStamp: d.company?.companyStamp || '',
            companySignature: d.company?.companySignature || ''
          };

          setExistingImages(cloudinaryUrls);
          setPreviews(cloudinaryUrls);
        }
      } catch (err) {
        setError('Failed to sync profile data.');
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [field]: file }));
      setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
    }
  };

  const handleDeleteFile = (field) => {
    setFiles(prev => ({ ...prev, [field]: null }));
    setPreviews(prev => ({ ...prev, [field]: '' }));
    // Clear the existing image state as well
    setExistingImages(prev => ({ ...prev, [field]: '' }));
    
    const input = document.getElementById(`file-input-${field}`);
    if (input) input.value = '';
  };

  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let result;

      if (activeSection === 'company') {
        const formData = new FormData();
        
        // 1. Append Text Data from companyData
        Object.keys(companyData).forEach(key => {
          if (companyData[key]) {
            formData.append(key, companyData[key]);
          }
        });

        console.log("Files to upload:", files);

        // 2. Append Images using the existingImages state for persistence
        // Process Company Logo
        if (files.companyLogo instanceof File) {
          formData.append('companyLogo', files.companyLogo);
        } else if (existingImages.companyLogo) {
          formData.append('companyLogo', existingImages.companyLogo);
        }

        // Process Company Signature
        if (files.companySignature instanceof File) {
          formData.append('companySignature', files.companySignature);
        } else if (existingImages.companySignature) {
          formData.append('companySignature', existingImages.companySignature);
        }

        // Process Company Stamp (Ensure backend router accepts this)
        if (files.companyStamp instanceof File) {
          formData.append('companyStamp', files.companyStamp);
        } else if (existingImages.companyStamp) {
          formData.append('companyStamp', existingImages.companyStamp);
        }

        result = await profileAPI.updateBusinessInfo(formData);
      } else {
        // ... (personal/password logic)
      }

      if (result.success) {
        setSuccess('Profile updated successfully!');
        const res = await profileAPI.getProfile();
        if (res.success) {
          const d = res.data;
          const freshUrls = {
            companyLogo: d.company?.companyLogo || '',
            companyStamp: d.company?.companyStamp || '',
            companySignature: d.company?.companySignature || ''
          };
          setExistingImages(freshUrls);
          setPreviews(freshUrls);
          setFiles({ companyLogo: null, companyStamp: null, companySignature: null });
        }
      }
    } catch (err) {
      console.error("Save Error:", err);
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <p className="text-gray-600 test-xl mt-2">Update your information across business and personal accounts.</p>
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
            {error && <ErrorMessage type="error">{error}</ErrorMessage>}
            {success && (
              <div className="mb-6 p-4 bg-green-50 text-green-800 border border-green-200 rounded-xl text-sm font-medium flex items-center">
                <span className="mr-2">✨</span> {success}
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
                        {isEmailLocked && <span className="absolute right-3 top-10 text-xs text-gray-500 font-medium uppercase tracking-wide">Fixed</span>}
                      </div>
                      <InputField label="Contact Number" value={companyData.companyPhone} onChange={e => setCompanyData({...companyData, companyPhone: e.target.value})} />
                      <InputField label="GST Identification Number" value={companyData.GST} onChange={e => setCompanyData({...companyData, GST: e.target.value})} />
                      <div className="md:col-span-2">
                        <InputField label="Business Description" value={companyData.companyDescription} onChange={e => setCompanyData({...companyData, companyDescription: e.target.value})} />
                      </div>
                      <div className="md:col-span-2">
                        <InputField label="Registered Business Address" value={companyData.companyAddress} onChange={e => setCompanyData({...companyData, companyAddress: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <span className="mr-3">🖼️</span> Digital Assets
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { label: 'Company Logo', key: 'companyLogo' },
                        { label: 'Seal/Stamp', key: 'companyStamp' },
                        { label: 'Signature', key: 'companySignature' }
                      ].map(asset => (
                        <div key={asset.key} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">{asset.label}</label>
                          <div className="relative mt-1 flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors group">
                            {previews[asset.key] ? (
                              <div className="relative mb-3">
                                <img src={previews[asset.key]} alt={asset.label} className="h-20 w-auto object-contain rounded-lg" />
                                <button
                                  type="button"
                                  onClick={() => handleDeleteFile(asset.key)}
                                  className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 shadow-sm hover:bg-red-200 transition-colors opacity-0 group-hover:opacity-100"
                                  title="Remove image"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              <div className="h-20 flex items-center justify-center text-gray-400">No Image</div>
                            )}
                            <input 
                              id={`file-input-${asset.key}`}
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleFileChange(e, asset.key)}
                              className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <span className="mr-3">🏦</span> Banking Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField label="Account Number" value={companyData.accountNumber} onChange={e => setCompanyData({...companyData, accountNumber: e.target.value})} />
                      <InputField label="Bank Name" value={companyData.bankName} onChange={e => setCompanyData({...companyData, bankName: e.target.value})} />
                      <InputField label="IFSC Code" value={companyData.IFSC} onChange={e => setCompanyData({...companyData, IFSC: e.target.value})} />
                      <InputField label="Branch Location" value={companyData.branchName} onChange={e => setCompanyData({...companyData, branchName: e.target.value})} />
                    </div>
                  </div>
                </>
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