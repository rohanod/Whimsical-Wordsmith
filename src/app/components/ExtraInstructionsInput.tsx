import React from 'react';

interface ExtraInstructionsInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  isDisabled?: boolean;
}

const ExtraInstructionsInput: React.FC<ExtraInstructionsInputProps> = ({
  value,
  onChange,
  placeholder = "e.g., Make it humorous, Focus on technology themes, Keep it professional...",
  isDisabled = false
}) => {
  return (
    <div className="w-full max-w-lg mx-auto">
      <label className="block text-base font-serif text-foreground mb-2">
        Extra Instructions (Optional)
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={isDisabled}
        rows={3}
        className="w-full px-4 py-3 border-muted bg-transparent border rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-300 resize-none text-sm"
      />
    </div>
  );
};

export default ExtraInstructionsInput;