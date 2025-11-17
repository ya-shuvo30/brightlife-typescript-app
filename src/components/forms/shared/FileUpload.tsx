import React, { useRef } from 'react';
import type { ChangeEvent } from 'react';

interface FileUploadProps {
  label: string;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  required?: boolean;
  value?: File | File[] | null;
  onChange: (files: File | File[] | null) => void;
  error?: string;
  helpText?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = 'image/*',
  multiple = false,
  maxSizeMB = 2,
  required = false,
  value,
  onChange,
  error,
  helpText,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      onChange(null);
      return;
    }

    const maxSize = maxSizeMB * 1024 * 1024;
    const fileArray = Array.from(files);

    // Validate file sizes
    for (const file of fileArray) {
      if (file.size > maxSize) {
        alert(`File "${file.name}" exceeds maximum size of ${maxSizeMB}MB`);
        e.target.value = '';
        return;
      }
    }

    onChange(multiple ? fileArray : fileArray[0]);
  };

  const handleRemoveFile = (index?: number) => {
    if (multiple && Array.isArray(value) && index !== undefined) {
      const newFiles = value.filter((_, i) => i !== index);
      onChange(newFiles.length > 0 ? newFiles : null);
    } else {
      onChange(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getFileName = () => {
    if (!value) return null;
    if (Array.isArray(value)) {
      return value.map((file, index) => (
        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border border-gray-200 mt-2">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
            <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
          <button
            type="button"
            onClick={() => handleRemoveFile(index)}
            className="text-red-600 hover:text-red-800 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ));
    }
    return (
      <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border border-gray-200 mt-2">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-gray-700 truncate max-w-xs">{value.name}</span>
          <span className="text-xs text-gray-500">({(value.size / 1024).toFixed(1)} KB)</span>
        </div>
        <button
          type="button"
          onClick={() => handleRemoveFile()}
          className="text-red-600 hover:text-red-800 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`px-4 py-2 border rounded-lg font-medium transition-all duration-200
                   ${error ? 'border-red-500 text-red-700 hover:bg-red-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>Choose {multiple ? 'Files' : 'File'}</span>
          </div>
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {helpText && !error && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {value && (
        <div className="mt-2">
          {getFileName()}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
