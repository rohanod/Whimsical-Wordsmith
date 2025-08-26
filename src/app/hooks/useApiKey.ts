import { useState, useEffect } from 'react';

const API_KEY_STORAGE_KEY = 'google_generative_ai_api_key';

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      // Show popup if no API key is stored
      setPopupVisible(true);
    }
  }, []);

  const handleSaveApiKey = async (key: string) => {
    setIsValidating(true);
    try {
      // Basic validation - you could add more sophisticated validation here
      if (!key || key.length < 10) {
        throw new Error('Invalid API key format');
      }

      // Store the API key
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
      setApiKey(key);
      setPopupVisible(false);
    } catch (error) {
      console.error('Error saving API key:', error);
      // You could show an error message here
    } finally {
      setIsValidating(false);
    }
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    // Keep popup hidden for now - could show again on next API call attempt
  };

  const validateApiKey = async (): Promise<boolean> => {
    if (!apiKey) {
      setPopupVisible(true);
      return false;
    }

    // Could add actual API validation here if needed
    // For now, just check if it exists and has reasonable length
    return apiKey.length > 10;
  };

  return {
    apiKey,
    isPopupVisible,
    isValidating,
    handleSaveApiKey,
    handleClosePopup,
    validateApiKey,
  };
};
