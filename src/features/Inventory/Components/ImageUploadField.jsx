import React, { useState, useRef } from 'react';

/**
 * ImageUploadField
 * Drag-and-drop / click-to-upload image picker with inline preview.
 *
 * Props:
 *   currentImageUrl  – URL of the existing image (for edit forms); shows as initial preview
 *   onFileSelect(file | null) – called whenever the selection changes
 */
const ImageUploadField = ({ currentImageUrl = null, onFileSelect }) => {
  const [preview, setPreview] = useState(currentImageUrl || null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  const handleRemove = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      {preview ? (
        /* ---- Preview state ---- */
        <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <img src={preview} alt="preview" className="w-full h-36 object-cover" />
          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-md transition-colors"
            title="Remove image"
          >
            ×
          </button>
          {/* Replace label */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white text-[10px] font-medium px-2 py-1 rounded-md transition-colors"
          >
            Replace
          </button>
        </div>
      ) : (
        /* ---- Upload zone ---- */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            processFile(e.dataTransfer.files[0]);
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer select-none transition-colors ${
            dragging
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/40'
          }`}
        >
          <svg
            className="w-7 h-7 text-gray-400 mb-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-xs font-medium text-gray-500">
            {dragging ? 'Drop image here' : 'Click or drag & drop to upload'}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG up to 5 MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => processFile(e.target.files?.[0] || null)}
      />
    </div>
  );
};

export default ImageUploadField;
