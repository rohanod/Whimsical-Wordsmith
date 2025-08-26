'use client';

import React from 'react';
import { useApiKey } from '@/app/hooks/useApiKey';
import APIKeyInputPopup from './APIKeyInputPopup';
import { UserGivesKey } from '../config';

interface APIKeyProviderProps {
  children: React.ReactNode;
}

const APIKeyProvider: React.FC<APIKeyProviderProps> = ({ children }) => {
  const { isPopupVisible, handleSaveApiKey, handleClosePopup, isValidating } = useApiKey();

  // Only show API key functionality if UserGivesKey is true
  if (!UserGivesKey) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {isPopupVisible && (
        <APIKeyInputPopup
          onSave={handleSaveApiKey}
          onClose={handleClosePopup}
          isValidating={isValidating}
        />
      )}
    </>
  );
};

export default APIKeyProvider;
