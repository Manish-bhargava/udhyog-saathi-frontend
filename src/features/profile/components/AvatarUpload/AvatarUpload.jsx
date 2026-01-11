// src/features/profile/components/AvatarUpload/AvatarUpload.jsx
import React, { useState, useRef } from 'react';
import { useProfile } from '../../hooks/useProfile';

const AvatarUpload = ({ type = 'avatar', currentImage, onUploadComplete }) => {
  const { uploadImage } = useProfile();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const fileInputRef = useRef(null);
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Upload file
    handleUpload(file);
  };
  
  const handleUpload = async (file) => {
    setIsUploading(true);
    try {
      const result = await uploadImage(file, type);
      if (result.success) {
        setPreview(result.url);
        if (onUploadComplete) {
          onUploadComplete(result.url);
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const getTypeLabel = () => {
    switch (type) {
      case 'avatar': return 'Profile Picture';
      case 'logo': return 'Company Logo';
      case 'stamp': return 'Company Stamp';
      case 'signature': return 'Signature';
      default: return 'Image';
    }
  };
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
          {preview ? (
            <img
              src={preview}
              alt={getTypeLabel()}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {type === 'avatar' ? 'US' : type.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isUploading}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? 'Uploading...' : `Upload ${getTypeLabel()}`}
      </button>
      
      <p className="text-xs text-gray-500 text-center">
        Supports: JPG, PNG, GIF, WebP (max 5MB)
      </p>
    </div>
  );
};

export default AvatarUpload;