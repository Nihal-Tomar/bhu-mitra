'use client';

import React, { useRef, useState } from 'react';
import { UploadCloudIcon, FileTextIcon, CloseIcon } from '../icons';

export interface FileUploadProps {
  label?: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  maxSizeMb?: number;
  onFilesSelected?: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label = 'Upload Official Documents',
  description = 'PDF, GeoJSON, TIFF, or Gazette Scans up to 25MB',
  accept = '.pdf,.geojson,.kml,.png,.jpg,.jpeg',
  multiple = false,
  maxSizeMb = 25,
  onFilesSelected,
  className = '',
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.size <= maxSizeMb * 1024 * 1024) {
        validFiles.push(f);
      }
    }
    const updated = multiple ? [...selectedFiles, ...validFiles] : validFiles;
    setSelectedFiles(updated);
    onFilesSelected?.(updated);
  };

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    onFilesSelected?.(updated);
  };

  return (
    <div className={`w-full space-y-2.5 ${className}`}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!disabled) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => {
          if (!disabled) fileInputRef.current?.click();
        }}
        className={`relative border-2 border-dashed rounded-lg p-5 text-center transition-colors cursor-pointer ${
          isDragging
            ? 'border-[#0A2540] bg-slate-100/80'
            : 'border-slate-300 bg-slate-50/50 hover:bg-slate-100/50 hover:border-slate-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
          className="sr-only"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-2 rounded-full bg-[#0A2540]/5 text-[#0A2540]">
            <UploadCloudIcon size={24} />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-semibold text-[#0A2540]">
              {label}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
          </div>
          <span className="text-[10px] font-medium text-slate-400">
            Click to browse or drag & drop files
          </span>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <ul className="space-y-1.5" aria-label="Selected files">
          {selectedFiles.map((file, idx) => (
            <li
              key={`${file.name}-${idx}`}
              className="flex items-center justify-between p-2 rounded border border-slate-200 bg-white text-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <FileTextIcon size={14} className="text-slate-500 shrink-0" />
                <span className="font-medium text-slate-800 truncate">{file.name}</span>
                <span className="text-[10px] text-slate-400 shrink-0">
                  ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                aria-label={`Remove ${file.name}`}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <CloseIcon size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
