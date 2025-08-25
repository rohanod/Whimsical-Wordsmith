import React from 'react';
import { LucideIcon } from 'lucide-react';

interface RetryButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  isDisabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

const RetryButton: React.FC<RetryButtonProps> = ({
  icon: Icon,
  onClick,
  isDisabled = false,
  ariaLabel,
  className = ""
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`p-2 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-180 ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      style={{ color: '#A8A29D' }}
      aria-label={ariaLabel}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
};

export default RetryButton;
