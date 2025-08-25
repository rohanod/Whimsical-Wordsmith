import React from 'react';

interface MainInputContainerProps {
  children: React.ReactNode;
  className?: string;
}

const MainInputContainer: React.FC<MainInputContainerProps> = ({ children, className = "" }) => {
  return (
    <div className={`flex justify-center transition-transform duration-500 ease-out animate-fade-in-up ${className}`}
         style={{ animationDelay: '0.3s' }}>
      {children}
    </div>
  );
};

export default MainInputContainer;
