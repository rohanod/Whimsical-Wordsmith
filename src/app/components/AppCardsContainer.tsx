import React from 'react';

interface AppCardsContainerProps {
  children: React.ReactNode;
  className?: string;
}

const AppCardsContainer: React.FC<AppCardsContainerProps> = ({ children, className = "" }) => {
  return (
    <div className={`grid md:grid-cols-2 gap-8 max-w-3xl mx-auto ${className}`}>
      {children}
    </div>
  );
};

export default AppCardsContainer;
