import React from 'react';

interface ResultContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ResultContainer: React.FC<ResultContainerProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`transition-all duration-500 animate-scale-in ${className}`}
    >
      <div className="flex flex-col items-center space-y-4">
        {children}
      </div>
    </div>
  );
};

export default ResultContainer;
