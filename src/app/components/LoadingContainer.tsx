import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingContainerProps {
  text: string;
  className?: string;
}

const LoadingContainer: React.FC<LoadingContainerProps> = ({ text, className = "" }) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="flex items-center gap-2 text-lg font-serif" style={{ color: '#A8A29D' }}>
        <div className="animate-spin">
          <Sparkles className="w-5 h-5" />
        </div>
        <span>{text}</span>
      </div>
    </div>
  );
};

export default LoadingContainer;
