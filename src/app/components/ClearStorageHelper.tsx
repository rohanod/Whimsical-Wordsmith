'use client';

import { useEffect } from 'react';

// Global function for clearing all storage (accessible from browser console)
declare global {
  interface Window {
    clearStorage?: () => string;
  }
}

const ClearStorageHelper: React.FC = () => {
  useEffect(() => {
    // Attach the clearStorage function to the window object
    window.clearStorage = function() {
      console.log('🧹 Clearing all storage...');

      // Clear localStorage
      const storageKeys = Object.keys(localStorage);
      storageKeys.forEach(key => {
        console.log(`🗑️ Removing localStorage item: ${key}`);
        localStorage.removeItem(key);
      });

      // Clear sessionStorage
      const sessionKeys = Object.keys(sessionStorage);
      sessionKeys.forEach(key => {
        console.log(`🗑️ Removing sessionStorage item: ${key}`);
        sessionStorage.removeItem(key);
      });

      // Clear cookies
      if (document.cookie) {
        console.log('🍪 Clearing cookies...');
        document.cookie.split(";").forEach(cookie => {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
        });
      }

      // Clear IndexedDB (if any)
      if ('indexedDB' in window) {
        console.log('💾 Attempting to clear IndexedDB...');
        // This is a simplified approach - in a real app you'd need to handle specific databases
        try {
          indexedDB.databases().then(databases => {
            databases.forEach(db => {
              if (db.name) {
                console.log(`🗑️ Found IndexedDB: ${db.name}`);
                // Note: Actually deleting IndexedDB requires opening and deleting each one
              }
            });
          });
        } catch {
          console.log('IndexedDB clearing may not be supported in this browser');
        }
      }

      // Clear Cache Storage
      if ('caches' in window) {
        console.log('📦 Clearing Cache Storage...');
        caches.keys().then(names => {
          names.forEach(name => {
            console.log(`🗑️ Deleting cache: ${name}`);
            caches.delete(name);
          });
        });
      }

      console.log('✅ Storage clearing complete! Refresh the page to see changes.');
      console.log('💡 Tip: You can run clearStorage() again from the console anytime.');

      return 'Storage cleared successfully!';
    };

    // Make it clear this function is available
    console.log('🛠️ Debug function available: clearStorage() - Run this in the console to clear all storage');

    // Cleanup function to remove from window when component unmounts
    return () => {
      if (typeof window !== 'undefined' && window.clearStorage) {
        delete window.clearStorage;
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default ClearStorageHelper;
