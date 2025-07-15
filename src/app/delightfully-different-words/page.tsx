'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sun, RefreshCw, Search } from 'lucide-react';
import Link from 'next/link';

const TRANSLATIONS = {
  "en-US": {
    "appTitle": "Delightfully Different Words",
    "toggleTheme": "Toggle theme",
    "inputPlaceholder": "happy",
    "searchAlternative": "Search for alternative",
    "getAnotherSuggestion": "Get another suggestion",
    "errorMessage": "Let's try again",
    "claudePrompt": "The user entered the adjective \"{adjective}\" to complete the phrase \"very {adjective}\".\n\n{previousContext}\n\nYou are a whimsical word wizard who delights in finding the most amusing yet legitimate alternatives to boring phrases. Your mission: find ONE single, REAL English word that can replace \"very {adjective}\" - but make it sound absolutely delightful and perhaps a bit silly!\n\nYour suggestion should:\n- Be a single, genuine English word found in dictionaries (no made-up words!)\n- Be different from previous suggestions\n- Sound more interesting and delightful than \"very {adjective}\"\n- Be appropriate for general use\n- Have a whimsical or charming quality\n\nRespond with ONLY the single word, nothing else.",
    "previouslySuggested": "Previously suggested: {suggestions}.",
    "differentFromPrevious": "- Be different from previous suggestions",
    "veryLabel": "Very"
  }
};

const appLocale = 'en-US';
const t = (key) => TRANSLATIONS[appLocale]?.[key] || TRANSLATIONS['en-US'][key] || key;

// Custom hook for theme management
const useTheme = () => {
  const [isDark, setIsDark] = useState(true); // Default to dark mode

  useEffect(() => {
    // Only override if user explicitly prefers light mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setIsDark(false);
    }
  }, []);

  useEffect(() => {
    // Update HTML class when theme changes
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return { isDark, setIsDark };
};

// Typewriter animation component
const TypewriterText = ({ text, className = "", onStart }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex === 0 && text && onStart) {
      onStart();
    }
    
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, onStart]);

  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);

  return <span className={className}>{displayText}</span>;
};

const App = () => {
  const [adjective, setAdjective] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fade, setFade] = useState(false);
  const [previousSuggestions, setPreviousSuggestions] = useState([]);
  const [error, setError] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { isDark, setIsDark } = useTheme();

  const getSuggestion = async (refresh = false) => {
    if (!adjective.trim() || isLoading) return;

    setIsLoading(true);
    setFade(true);
    setError(false);

    try {
      const previousContext = refresh && previousSuggestions.length > 0
        ? t('previouslySuggested').replace('{suggestions}', previousSuggestions.join(', '))
        : '';

      const refreshContext = refresh ? t('differentFromPrevious') : '';

      const prompt = t('claudePrompt')
        .replace('{adjective}', adjective)
        .replace('{adjective}', adjective)
        .replace('{adjective}', adjective)
        .replace('{previousContext}', previousContext)
        .replace('{refreshContext}', refreshContext);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          type: 'delightfully-different-words'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate alternative');
      }

      const data = await response.json();
      const newSuggestion = data.text.trim();
      
      setSuggestion(newSuggestion);
      setPreviousSuggestions(prev => [...prev, newSuggestion]);
    } catch (error) {
      console.error('Error fetching suggestion:', error);
      setError(true);
      setSuggestion('');
    } finally {
      setIsLoading(false);
      setFade(false);
    }
  };

  const handleInputChange = (e) => {
    setAdjective(e.target.value);
    setSuggestion('');
    setPreviousSuggestions([]);
    setError(false);
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getSuggestion();
    }
  };

  const handleRefresh = () => {
    if (suggestion && !isLoading) {
      setIsTyping(false);
      getSuggestion(true);
    }
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{ 
        backgroundColor: isDark ? '#1B1917' : '#FAFAF9',
        color: isDark ? '#ffffff' : '#1B1917'
      }}
    >
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 flex justify-between items-center p-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
            aria-label="Back to home"
          >
            <span>&larr;</span>
          </Link>
          <h1 
            className="text-2xl font-serif italic font-light animate-slide-in-left hover:animate-pulse"
            style={{ color: '#A8A29D' }}
          >
            {t('appTitle')}
          </h1>
        </div>
        <button
          onClick={() => setIsDark(!isDark)}
          className={`p-2 rounded-full transition-colors ${
            isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}
          aria-label={t('toggleTheme')}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      {/* Main content - centered on page */}
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl px-6 space-y-8">
          {/* Input section */}
          <div 
            className={`flex justify-center transition-transform duration-500 ease-out animate-fade-in-up ${
              isTyping ? '-translate-y-4' : 'translate-y-0'
            }`}
            style={{ animationDelay: '0.3s' }}
          >
            <div className="flex items-baseline gap-4 text-4xl font-serif">
              <span>{t('veryLabel')}</span>
              <div className="relative flex items-baseline gap-2">
                <input
                  type="text"
                  value={adjective}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  onBlur={() => adjective && !suggestion && getSuggestion()}
                  placeholder={t('inputPlaceholder')}
                  className="border-b transition-colors duration-300 bg-transparent outline-none text-center text-4xl font-serif pb-3"
                  style={{
                    borderColor: '#A8A29D',
                    color: isDark ? '#ffffff' : '#1B1917',
                    width: '16rem',
                    borderBottomWidth: '1px'
                  }}
                />
                <button
                  onClick={() => adjective && getSuggestion()}
                  className={`p-2 transition-all duration-300 relative top-1 hover:scale-110 hover:rotate-12 ${!adjective ? 'opacity-50 cursor-not-allowed' : 'hover:animate-bounce'}`}
                  style={{
                    color: '#A8A29D'
                  }}
                  disabled={!adjective}
                  aria-label={t('searchAlternative')}
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Result section */}
          {suggestion && (
            <div 
              className={`transition-all duration-500 animate-scale-in ${
                fade ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-3">
                  <div className="text-6xl font-serif">
                    "<TypewriterText 
                      text={suggestion} 
                      onStart={() => setIsTyping(true)}
                    />"
                  </div>
                  <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className={`p-2 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-180 ${
                      isDark 
                        ? 'hover:bg-gray-800 disabled:opacity-50' 
                        : 'hover:bg-gray-100 disabled:opacity-50'
                    } ${isLoading ? 'animate-spin' : 'hover:animate-pulse'}`}
                    aria-label={t('getAnotherSuggestion')}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div 
              className="flex justify-center animate-shake"
            >
              <div 
                className="text-2xl font-serif"
                style={{ color: '#EF4444' }}
              >
                {t('errorMessage')}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Global styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&display=swap');
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
        
        .font-serif {
          font-family: 'EB Garamond', serif;
        }
        
        /* Dark mode styles */
        .dark {
          color-scheme: dark;
        }
        
        /* Fix for input placeholder color */
        input::placeholder {
          color: #A8A29D;
          opacity: 1;
        }
        
        /* Fix for input focus border */
        input:focus {
          border-color: #A8A29D;
          outline: none;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default App;