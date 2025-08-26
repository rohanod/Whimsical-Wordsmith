import React, { useState } from 'react';
import { Key, Eye, EyeOff, X, AlertCircle } from 'lucide-react';

interface APIKeyInputPopupProps {
  onSave: (apiKey: string) => void;
  onClose: () => void;
  isValidating?: boolean;
  error?: string;
}

const APIKeyInputPopup: React.FC<APIKeyInputPopupProps> = ({
  onSave,
  onClose,
  isValidating = false,
  error
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const validateApiKey = (key: string) => {
    if (!key.trim()) {
      return 'API key is required';
    }
    if (key.length < 20) {
      return 'API key appears to be too short';
    }
    if (!key.startsWith('AIza')) {
      return 'API key should start with "AIza"';
    }
    return '';
  };

  const handleSave = () => {
    const trimmedKey = apiKey.trim();
    const validation = validateApiKey(trimmedKey);

    if (validation) {
      setValidationError(validation);
      return;
    }

    setValidationError('');
    onSave(trimmedKey);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    if (validationError) {
      setValidationError('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-stone-100 dark:bg-stone-700 rounded-lg">
              <Key className="w-6 h-6 text-stone-600 dark:text-stone-400" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-medium text-foreground">
                API Key Required
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter your Google Generative AI API key
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="mb-6 p-4 bg-stone-50 dark:bg-stone-900/50 rounded-lg">
          <h3 className="font-medium text-stone-900 dark:text-stone-100 mb-2">
            How to get your API key:
          </h3>
          <ol className="text-sm text-stone-600 dark:text-stone-400 space-y-1 list-decimal list-inside">
            <li>Go to the <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-700 dark:text-stone-300 underline hover:text-stone-800"
              >
                Google AI Studio
              </a></li>
            <li>Create or select a project</li>
            <li>Generate a new API key</li>
            <li>Copy and paste it below</li>
          </ol>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={apiKey}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="AIza..."
              className={`w-full p-4 pr-12 border-2 rounded-lg bg-transparent outline-none text-lg font-serif transition-colors duration-300 ${
                validationError || error
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-stone-300 dark:border-stone-600 focus:border-stone-500'
              }`}
              autoFocus
              disabled={isValidating}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              aria-label={showPassword ? 'Hide API key' : 'Show API key'}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-500" />
              ) : (
                <Eye className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>

          {/* Error Messages */}
          {(validationError || error) && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">
                {validationError || error}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={onClose}
              disabled={isValidating}
              className="px-6 py-2 border-2 border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-lg transition-colors duration-300 font-serif disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!apiKey.trim() || isValidating}
              className="px-6 py-2 bg-stone-600 hover:bg-stone-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-300 font-serif flex items-center gap-2"
            >
              {isValidating && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isValidating ? 'Saving...' : 'Save API Key'}
            </button>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            🔒 Your API key is stored locally in your browser and is never sent to our servers.
            It&apos;s only used to communicate directly with Google&apos;s AI services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default APIKeyInputPopup;
