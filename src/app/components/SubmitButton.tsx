import React from 'react';
import { Sparkles } from 'lucide-react';

interface SubmitButtonProps {
  onClick?: () => void;
  isDisabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  onClick,
  isDisabled = false,
  ariaLabel = "Submit",
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
      <Sparkles className="w-5 h-5" />
    </button>
  );
};

export default SubmitButton;
