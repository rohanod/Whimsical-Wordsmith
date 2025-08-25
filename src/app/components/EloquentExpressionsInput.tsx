import React from 'react';
import { Sparkles } from 'lucide-react';

interface EloquentExpressionsInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  onSubmit?: () => void;
  isDisabled?: boolean;
}

const EloquentExpressionsInput: React.FC<EloquentExpressionsInputProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder = "I'm really hungry and want some food",
  onSubmit,
  isDisabled = false
}) => {
  return (
    <div className="relative w-full max-w-2xl">
      <textarea
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full h-32 p-4 border-2 rounded-lg resize-none transition-colors duration-300 bg-transparent outline-none text-lg font-serif"
        style={{
          borderColor: '#A8A29D',
        }}
      />
      {onSubmit && (
        <button
          onClick={onSubmit}
          className={`absolute bottom-4 right-4 p-2 rounded-full transition-colors ${
            !value
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          style={{ color: '#A8A29D' }}
          disabled={isDisabled || !value}
          aria-label="Transform phrase"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default EloquentExpressionsInput;
