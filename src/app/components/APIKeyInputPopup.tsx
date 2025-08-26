import React, { useState } from 'react';

interface APIKeyInputPopupProps {
  onSave: (apiKey: string) => void;
  onClose: () => void;
}

const APIKeyInputPopup: React.FC<APIKeyInputPopupProps> = ({ onSave, onClose }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-serif font-medium text-foreground">
            Enter API Key
          </h2>
          <p className="text-muted-foreground text-sm">
            Please enter your Google Generative AI API key to continue using this application.
          </p>
          <div className="space-y-4">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your API key"
              className="w-full p-3 border-2 rounded-lg bg-transparent outline-none text-lg font-serif transition-colors duration-300"
              style={{
                borderColor: '#A8A29D',
              }}
              autoFocus
            />
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleSave}
                disabled={!apiKey.trim()}
                className="px-6 py-2 bg-stone-600 hover:bg-stone-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-300 font-serif"
              >
                Save
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 border-2 border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-400 rounded-lg transition-colors duration-300 font-serif"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIKeyInputPopup;
