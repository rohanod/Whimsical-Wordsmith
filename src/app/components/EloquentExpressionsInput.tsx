import React from 'react';
import SubmitButton from './SubmitButton';

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
        <div className="absolute bottom-4 right-4">
          <SubmitButton
            onClick={onSubmit}
            isDisabled={isDisabled || !value}
            ariaLabel="Transform phrase"
          />
        </div>
      )}
    </div>
  );
};

export default EloquentExpressionsInput;
