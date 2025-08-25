import React from 'react';
import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';

interface TopBarProps {
  title: string;
  isDark: boolean;
  onThemeToggle: () => void;
  showBackButton?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ title, isDark, onThemeToggle, showBackButton = false }) => {
  return (
    <header className="absolute top-0 left-0 right-0 flex justify-between items-center p-6">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Link
            href="/"
            className={`p-2 rounded-full transition-colors header-link ${
              isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
            aria-label="Back to home"
          >
            <span>&larr;</span>
          </Link>
        )}
        <h1
          className="text-2xl font-serif italic font-light animate-slide-in-left hover:animate-pulse text-muted-foreground"
        >
          {title}
        </h1>
      </div>
      <button
        onClick={onThemeToggle}
        className={`p-2 rounded-full transition-colors ${
          isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
        }`}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </header>
  );
};

export default TopBar;
