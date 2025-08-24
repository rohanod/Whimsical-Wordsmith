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
type TranslationKeys = keyof typeof TRANSLATIONS[typeof appLocale];
const t = (key: TranslationKeys): string => (TRANSLATIONS as any)[appLocale]?.[key] || (TRANSLATIONS as any)['en-US'][key] || (key as string);

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
type TypewriterProps = { text: string; className?: string; onStart?: () => void };
const TypewriterText = ({ text, className = "", onStart }: TypewriterProps) => {
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
  const [suggestion, setSuggestion] = useState<{
    word: string;
    definition: string;
    original: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fade, setFade] = useState(false);
  const [previousSuggestions, setPreviousSuggestions] = useState<string[]>([]);
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
        ? `Previously suggested words: ${previousSuggestions.join(', ')}.`
        : '';

      const prompt = `The user wants to find a delightfully different word to replace "very ${adjective}":

"very ${adjective}"

${previousContext}

You are a wordsmith and vocabulary expert. Your mission: find a single, sophisticated word that captures the essence of "very ${adjective}" but with more elegance and charm.

The replacement word should:
- Be a real English word that precisely captures the intensified meaning of the adjective
- Be distinctly different from previous suggestions
- Sound more interesting and delightful than "very ${adjective}"
- Be appropriate for general use
- Have a whimsical or charming quality

Return the word, its definition, and the original phrase being replaced.`;

      // Define schema and example for this app
      const schemaDescription = `A single alternative word that replaces "very + adjective" with brief definition and original phrase`;
      
      const exampleFormat = `{
  "word": "effervescent",
  "definition": "Vivacious and enthusiastic; bubbling with excitement",
  "original": "very happy"
}`;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          schemaDescription,
          exampleFormat
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate alternative');
      }

      const data = await response.json();
      
      setSuggestion(data);
      setPreviousSuggestions(prev => [...prev, data.word]);
    } catch (error) {
      console.error('Error fetching suggestion:', error);
      setError(true);
      setSuggestion(null);
    } finally {
      setIsLoading(false);
      setFade(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdjective(e.target.value);
    setSuggestion(null);
    setPreviousSuggestions([]);
    setError(false);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
          {/* Description */}
          <p className="text-center text-lg font-serif leading-relaxed" style={{ color: '#A8A29D' }}>
            Trade the tired "very + adjective" for a single, delightful word that says it better.
          </p>

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
                  onKeyDown={handleKeyDown}
                  onBlur={() => adjective && !suggestion && getSuggestion()}
                  placeholder={t('inputPlaceholder')}
                   className="border-b border-muted transition-colors duration-300 bg-transparent outline-none text-center text-4xl font-serif pb-3"
                  style={{
                    color: isDark ? '#ffffff' : '#1B1917',
                    width: '16rem',
                    borderBottomWidth: '1px'
                  }}
                />
                <button
                  onClick={() => adjective && getSuggestion()}
                   className={`p-2 transition-all duration-300 relative top-1 hover:scale-110 hover:rotate-12 ${!adjective ? 'opacity-50 cursor-not-allowed' : ''} muted`}

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
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-6xl font-serif">
                    "<TypewriterText 
                      text={suggestion.word} 
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
                {/* Definition */}
                <div className="text-center max-w-lg">
                  <p className="text-lg font-serif muted italic">
                    {suggestion.definition}
                  </p>
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
        /* Page-scoped animations only */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out both; }
        .animate-slide-in-left { animation: slide-in-left 0.6s ease-out; }
        .animate-scale-in { animation: scale-in 0.5s ease-out; }
        .animate-wiggle { animation: wiggle 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default App;