import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SubmitButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  isDisabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
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
      className={`p-2 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12 ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      style={{ color: '#A8A29D' }}
      aria-label={ariaLabel}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};

export default SubmitButton;
