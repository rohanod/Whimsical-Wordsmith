import React from 'react';
import Link from 'next/link';

interface AppCardProps {
  title: string;
  description: string;
  href: string;
  animationDelay?: number;
  titleHoverColour?: string;
}

const AppCard: React.FC<AppCardProps> = ({
  title,
  description,
  href,
  animationDelay = 0,
  titleHoverColour
}) => {
  return (
    <Link href={href} className="group block">
      <div
        className="app-card p-8 border-2 rounded-lg transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:rotate-2 opacity-100 h-80 flex items-center"
        style={{
          animationDelay: `${animationDelay}s`,
          backgroundColor: 'var(--app-card-bg, rgba(168, 162, 157, 0.1))',
          borderColor: 'var(--app-card-border, #A8A29D)',
          transformOrigin: 'center center',
          ...(titleHoverColour && { '--title-hover-color': titleHoverColour }),
        } as React.CSSProperties & { '--title-hover-color'?: string }}
      >
        <div className="text-center space-y-4 w-full">
          <h2
            className={`text-2xl font-serif font-medium leading-relaxed transition-all duration-300 group-hover:scale-105 ${titleHoverColour ? 'title-hover-color' : ''}`}
            style={{
              color: 'var(--app-card-text, #1B1917)',
            }}
          >
            {title}
          </h2>
          <p
            className="text-lg font-serif leading-relaxed transition-all duration-300 group-hover:scale-105"
            style={{
              color: 'var(--app-card-muted-text, #4B5563)',
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default AppCard;
