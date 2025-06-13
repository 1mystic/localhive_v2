
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2 my-4">
      <div
        className={`animate-spin rounded-full border-4 border-primary border-t-transparent ${sizeClasses[size]}`}
      ></div>
      {text && <p className="text-neutral-DEFAULT text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
