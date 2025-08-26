'use client';

import React, { useEffect, useState } from 'react';
import { useApiKey } from '@/app/hooks/useApiKey';
import APIKeyInputPopup from './APIKeyInputPopup';
import { UserGivesKey } from '../config';

interface APIKeyProviderProps {
  children: React.ReactNode;
  isDark?: boolean;
}

const APIKeyProvider: React.FC<APIKeyProviderProps> = ({ children, isDark = true }) => {
  const { isPopupVisible, handleSaveApiKey, handleClosePopup, isValidating } = useApiKey();

  // Keep popup mounted briefly to allow exit animation
  const [renderPopup, setRenderPopup] = useState(isPopupVisible);

  useEffect(() => {
    if (isPopupVisible) {
      setRenderPopup(true);
    } else {
      const t = setTimeout(() => setRenderPopup(false), 300);
      return () => clearTimeout(t);
    }
  }, [isPopupVisible]);

  // Only show API key functionality if UserGivesKey is true
  if (!UserGivesKey) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {renderPopup && (
        <APIKeyInputPopup
          onSave={handleSaveApiKey}
          onClose={handleClosePopup}
          isValidating={isValidating}
          isOpen={isPopupVisible}
          isDark={isDark}
        />
      )}
    </>
  );
};

export default APIKeyProvider;
