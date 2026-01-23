import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageWithFallback } from '@/components/ImageWithFallback';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const ImageUpload = ({
  value,
  onChange,
  label = "Image",
  placeholder = "Enter image URL or drag & drop",
  className = ""
}: ImageUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'portfolio26';

    if (!cloudName) {
      throw new Error('Cloudinary cloud name not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME environment variable.');
    }

    console.log('Cloudinary upload attempt:', {
      cloudName,
      uploadPreset,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    let errorMessage = 'Upload failed';
    let responseData = null;

    try {
      responseData = await response.json();
    } catch (e) {
      // If we can't parse JSON, use the response status text
      errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
    }

    if (!response.ok) {
      if (responseData && responseData.error) {
        errorMessage = `Cloudinary Error: ${responseData.error.message || responseData.error}`;
      } else if (response.status === 400) {
        errorMessage = 'Bad Request: Please check your Cloudinary configuration (cloud name, upload preset)';
      } else if (response.status === 401) {
        errorMessage = 'Unauthorized: Invalid upload preset or cloud name';
      } else if (response.status === 403) {
        errorMessage = 'Forbidden: Upload preset does not allow unsigned uploads';
      } else {
        errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
      }

      console.error('Cloudinary API Error:', {
        status: response.status,
        statusText: response.statusText,
        responseData,
        cloudName,
        uploadPreset
      });

      throw new Error(errorMessage);
    }

    if (!responseData || !responseData.secure_url) {
      throw new Error('Upload succeeded but no image URL returned from Cloudinary');
    }

    return responseData.secure_url;
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image. Please try again.';
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          await handleFileUpload(file);
        }
        break;
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Add paste event listener
  React.useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {value ? (
          <div className="space-y-3">
            <div className="relative inline-block">
              <ImageWithFallback
                src={value}
                alt="Preview"
                className="max-w-full h-32 object-cover rounded border"
                fallbackText="Image not available"
                iconSize={32}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 p-0"
                onClick={() => onChange('')}
              >
                <X size={12} />
              </Button>
            </div>
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Or enter URL manually"
              className="text-sm"
            />
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              {isUploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              ) : (
                <ImageIcon size={32} className="text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {isUploading ? 'Uploading...' : placeholder}
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload size={14} className="mr-2" />
                  Choose File
                </Button>
                <span className="text-xs text-muted-foreground self-center">or paste image</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};