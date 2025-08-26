import React from 'react';
import SubmitButton from './SubmitButton';

interface DramaticDeclarationsInputProps {
  requestValue: string;
  responseType: 'accept' | 'decline' | '';
  onRequestChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onResponseTypeChange: (type: 'accept' | 'decline') => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  onSubmit?: () => void;
  isDisabled?: boolean;
}

const DramaticDeclarationsInput: React.FC<DramaticDeclarationsInputProps> = ({
  requestValue,
  responseType,
  onRequestChange,
  onResponseTypeChange,
  onKeyDown,
  placeholder = "Can you help me move this weekend?",
  onSubmit,
  isDisabled = false
}) => {
  return (
    <div className="relative w-full max-w-2xl space-y-6">
      {/* Text Input for Request */}
      <div className="relative">
        <textarea
          value={requestValue}
          onChange={onRequestChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="w-full h-24 p-4 border-2 rounded-lg resize-none transition-colors duration-300 bg-transparent outline-none text-lg font-serif"
          style={{
            borderColor: '#A8A29D',
          }}
        />
      </div>

      {/* Response Type Selection */}
      <div className="space-y-3">
        <p className="text-sm font-serif text-center muted">
          How shall I respond?
        </p>
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={() => onResponseTypeChange('accept')}
            className={`px-6 py-3 rounded-lg border-2 transition-all duration-300 font-serif text-lg ${
              responseType === 'accept'
                ? 'border-green-500 bg-green-500 bg-opacity-20 text-green-800 dark:text-green-200'
                : 'border-muted hover:border-green-400 hover:bg-green-400 hover:bg-opacity-10'
            }`}
            disabled={isDisabled}
          >
            ✓ Accept
          </button>
          <button
            type="button"
            onClick={() => onResponseTypeChange('decline')}
            className={`px-6 py-3 rounded-lg border-2 transition-all duration-300 font-serif text-lg ${
              responseType === 'decline'
                ? 'border-red-500 bg-red-500 bg-opacity-20 text-red-800 dark:text-red-200'
                : 'border-muted hover:border-red-400 hover:bg-red-400 hover:bg-opacity-10'
            }`}
            disabled={isDisabled}
          >
            ✗ Decline
          </button>
        </div>
      </div>

      {/* Submit Button */}
      {onSubmit && (
        <div className="flex justify-center">
          <SubmitButton
            onClick={onSubmit}
            isDisabled={isDisabled || !requestValue || !responseType}
            ariaLabel="Create dramatic declaration"
          />
        </div>
      )}
    </div>
  );
};

export default DramaticDeclarationsInput;