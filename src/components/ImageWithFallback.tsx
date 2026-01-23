"use client";
import { useState } from 'react';
import { Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  showIcon?: boolean;
  iconSize?: number;
}

export const ImageWithFallback = ({
  src,
  alt,
  className = '',
  fallbackText = 'Image not available',
  showIcon = true,
  iconSize = 48
}: ImageWithFallbackProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-secondary/20 border border-border rounded-lg ${className}`}>
        {showIcon && (
          <AlertCircle size={iconSize} className="text-muted-foreground mb-2 opacity-50" />
        )}
        <p className="text-xs text-muted-foreground text-center px-2">
          {fallbackText}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/20 rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
};