import React, { useState } from 'react';
import { Key, Eye, EyeOff, X, AlertCircle } from 'lucide-react';

interface APIKeyInputPopupProps {
  onSave: (apiKey: string) => void;
  onClose: () => void;
  isValidating?: boolean;
  error?: string;
  isOpen?: boolean;
  isDark?: boolean;
}

const APIKeyInputPopup: React.FC<APIKeyInputPopupProps> = ({
  onSave,
  onClose,
  isValidating = false,
  error,
  isOpen = true,
  isDark = true
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
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      } backdrop-blur-sm`}
      style={{
        background: isDark
          ? 'rgba(27, 25, 23, 0.8)'
          : 'rgba(250, 250, 249, 0.9)'
      }}
    >
      <div
        className={`rounded-2xl p-8 max-w-lg w-full shadow-2xl border-2 transform transition-all duration-300 ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
        style={{
          backgroundColor: isDark ? '#1B1917' : '#FAFAF9',
          borderColor: '#A8A29D'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted-5 rounded-lg">
              <Key className="w-6 h-6 muted" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-medium text-foreground">
                API Key Required
              </h2>
              <p className="text-sm muted">
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
        <div className="mb-6 p-4 bg-muted-5 rounded-lg border border-muted">
          <h3 className="font-medium text-foreground mb-2">
            How to get your API key:
          </h3>
          <ol className="text-sm muted space-y-1 list-decimal list-inside">
            <li>Go to the <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-foreground hover:opacity-80"
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
                  : 'border-muted focus:border-muted'
              }`}
              autoFocus
              disabled={isValidating}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted-5 rounded transition-colors"
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
              className="px-6 py-2 border-2 border-muted hover:bg-muted-5 muted rounded-lg transition-colors duration-300 font-serif disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!apiKey.trim() || isValidating}
              className="px-6 py-2 border-2 border-muted hover:bg-muted-5 text-foreground rounded-lg transition-all duration-300 font-serif flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
              {isValidating && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isValidating ? 'Saving...' : 'Save API Key'}
            </button>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-3 bg-muted-5 border border-muted rounded-lg">
          <p className="text-xs muted">
            🔒 Your API key is stored locally in your browser and is never sent to our servers.
            It&apos;s only used to communicate directly with Google&apos;s AI services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default APIKeyInputPopup;
