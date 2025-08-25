import React from 'react';
import { Search } from 'lucide-react';

interface DelightfullyDifferentWordsInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  onSearch?: () => void;
  isDisabled?: boolean;
}

const DelightfullyDifferentWordsInput: React.FC<DelightfullyDifferentWordsInputProps> = ({
  value,
  onChange,
  onKeyDown,
  onBlur,
  placeholder = "happy",
  onSearch,
  isDisabled = false
}) => {
  return (
    <div className="flex items-baseline gap-4 text-4xl font-serif text-foreground">
      <span>Very</span>
      <div className="relative flex items-baseline gap-2">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          placeholder={placeholder}
          className="border-b transition-colors duration-300 bg-transparent outline-none text-center text-4xl font-serif pb-3"
          style={{
            borderColor: '#A8A29D',
            width: '16rem',
            borderBottomWidth: '1px'
          }}
        />
        {onSearch && (
          <button
            onClick={onSearch}
            className={`p-2 transition-all duration-300 relative top-1 hover:scale-110 hover:rotate-12 ${!value ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ color: '#A8A29D' }}
            disabled={isDisabled || !value}
            aria-label="Search for alternative"
          >
            <Search className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DelightfullyDifferentWordsInput;
