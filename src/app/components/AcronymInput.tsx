import React from 'react';
import SubmitButton from './SubmitButton';

interface AcronymInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  onSearch?: () => void;
  isDisabled?: boolean;
}

const AcronymInput: React.FC<AcronymInputProps> = ({
  value,
  onChange,
  onKeyDown,
  onBlur,
  placeholder = "hope",
  onSearch,
  isDisabled = false
}) => {
  return (
    <div className="flex items-baseline justify-center gap-4 text-4xl font-serif text-foreground">
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
            width: '20rem',
            borderBottomWidth: '1px'
          }}
        />
        {onSearch && (
          <div className="relative top-1">
            <SubmitButton
              onClick={onSearch}
              isDisabled={isDisabled || !value}
              ariaLabel="Generate acronym"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AcronymInput;
