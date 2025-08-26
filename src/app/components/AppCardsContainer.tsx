import React, { useEffect, useRef, useState } from 'react';

interface AppCardsContainerProps {
  children: React.ReactNode;
  className?: string;
}

const AppCardsContainer: React.FC<AppCardsContainerProps> = ({ children, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [needsScroll, setNeedsScroll] = useState(false);

  useEffect(() => {
    const checkScrollNeed = () => {
      if (containerRef.current) {
        const { scrollWidth, clientWidth } = containerRef.current;
        setNeedsScroll(scrollWidth > clientWidth);
      }
    };

    checkScrollNeed();
    window.addEventListener('resize', checkScrollNeed);
    return () => window.removeEventListener('resize', checkScrollNeed);
  }, [children]);

  return (
    <div 
      ref={containerRef}
      className={`flex gap-8 overflow-x-auto w-full px-2 scrollbar-custom items-center min-h-96 ${
        needsScroll ? 'justify-start' : 'justify-center'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default AppCardsContainer;
