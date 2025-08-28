'use client';

import React, { useState, useEffect } from 'react';
import {
  TopBar,
  Description,
  MainInputContainer,
  DelightfullyDifferentWordsInput,
  ResultContainer,
  LoadingContainer,
  ShortResponse
} from '@/app/components';
import { useApiKey } from '@/app/hooks/useApiKey';

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

const App = () => {
  const [adjective, setAdjective] = useState('');
  const [suggestion, setSuggestion] = useState<{
    word: string;
    definition: string;
    original: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [previousSuggestions, setPreviousSuggestions] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { isDark, setIsDark } = useTheme();
  const { apiKey, validateApiKey } = useApiKey();

  const getSuggestion = async (refresh = false) => {
    if (!adjective.trim() || isLoading) return;

    // Validate API key before making request
    const isValidKey = await validateApiKey();
    if (!isValidKey) {
      return; // API key validation will handle showing the popup
    }

    setIsLoading(true);
    setError(false);

    // Clear previous result when submitting a new request (not refresh)
    if (!refresh) {
      setSuggestion(null);
    }

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
          exampleFormat,
          apiKey
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
      setSuggestion(null);
      setError(false);
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
      <TopBar
        title="Delightfully Different Words"
        isDark={isDark}
        onThemeToggle={() => setIsDark(!isDark)}
        showBackButton={true}
      />

      {/* Main content - centered on page */}
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl px-6 space-y-8">
          <Description text="Trade the tired 'very + adjective' for a single, delightful word that says it better." />

          <MainInputContainer className={isTyping ? '-translate-y-4' : 'translate-y-0'}>
            <DelightfullyDifferentWordsInput
              value={adjective}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={() => adjective && !suggestion && getSuggestion()}
              placeholder="happy"
              onSearch={() => adjective && getSuggestion()}
              isDisabled={isLoading}
            />
          </MainInputContainer>

          {isLoading && (
            <LoadingContainer text="Crafting the perfect synonym..." />
          )}

          {suggestion && (
            <ResultContainer>
              <ShortResponse
                data={suggestion}
                isLoading={isLoading}
                onRefresh={handleRefresh}
                onStartTyping={() => setIsTyping(true)}
              />
            </ResultContainer>
          )}

          {error && (
            <div className="flex justify-center animate-shake">
              <div
                className="text-2xl font-serif"
                style={{ color: '#EF4444' }}
              >
                Let&apos;s try again
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;