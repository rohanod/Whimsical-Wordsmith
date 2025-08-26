'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import {
  TopBar,
  Description,
  MainInputContainer,
  AcronymInput,
  ExtraInstructionsInput,
  ResultContainer,
  RetryButton,
  LoadingContainer
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

interface AcronymResult {
  acronym: string;
  meaning: string;
  original: string;
}

const App = () => {
  const [input, setInput] = useState('');
  const [extraInstructions, setExtraInstructions] = useState('');
  const [result, setResult] = useState<AcronymResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previousResults, setPreviousResults] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const { isDark, setIsDark } = useTheme();
  const { apiKey, validateApiKey } = useApiKey();

  const generateAcronym = async (refresh = false) => {
    if (!input.trim() || isLoading) return;

    // Validate API key before making request
    const isValidKey = await validateApiKey();
    if (!isValidKey) {
      return; // API key validation will handle showing the popup
    }

    setIsLoading(true);
    setError(false);

    // Clear previous result when submitting a new request (not refresh)
    if (!refresh) {
      setResult(null);
    }

    try {
      const previousContext = refresh && previousResults.length > 0
        ? `Previously generated acronyms: ${previousResults.join(', ')}.`
        : '';

      const extraInstructionsText = extraInstructions.trim() 
        ? `\nAdditional instructions: ${extraInstructions}\n`
        : '';

      const prompt = `The user wants to create a creative acronym for the word/phrase:

"${input}"

${previousContext}${extraInstructionsText}

You are an Acronym Alchemist - a master of creating meaningful, creative acronyms where each letter of the original word/phrase becomes the first letter of words in the acronym expansion.

Your mission: Create a single, creative acronym that:
- Uses the exact letters of the original word/phrase in the same order
- Creates a meaningful, clever, and memorable expansion
- Is distinctly different from previous suggestions
- Has a whimsical or insightful quality
- Can be serious, humorous, motivational, or philosophical depending on the original word
- Uses each letter exactly once in sequence

Examples of great acronyms:
- HOPE: Holding Optimistic Possibilities Endlessly
- MUSIC: Making Up Sounds Intuitively and Creatively
- CHANGE: Cultivating Higher Ambitions and New Goals for Evolution
- RISK: Reward Is Seldom Known

Return the acronym (the original word in uppercase), its creative meaning, and the original phrase.`;

      const schemaDescription = `A creative acronym with its expansion meaning and the original word/phrase`;

      const exampleFormat = `{
  "acronym": "HOPE",
  "meaning": "Holding Optimistic Possibilities Endlessly",
  "original": "hope"
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
          extraInstructions,
          apiKey
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate acronym');
      }

      const data = await response.json();

      setResult(data);
      setPreviousResults(prev => [...prev, data.acronym]);
    } catch (error) {
      console.error('Error generating acronym:', error);
      setError(true);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setResult(null);
    setPreviousResults([]);
    setError(false);
  };

  const handleExtraInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setExtraInstructions(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      generateAcronym();
    }
  };

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      generateAcronym();
    }
  };

  const handleRefresh = () => {
    if (result && !isLoading) {
      setResult(null);
      setError(false);
      generateAcronym(true);
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
        title="Acronym Alchemist"
        isDark={isDark}
        onThemeToggle={() => setIsDark(!isDark)}
        showBackButton={true}
      />

      {/* Main content - centered on page */}
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl px-6 space-y-8">
          <Description text="Transform words and phrases into creative acronyms where each letter becomes the start of something meaningful." />

          <MainInputContainer>
            <AcronymInput
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="hope"
              onSearch={handleSubmit}
              isDisabled={isLoading}
            />
          </MainInputContainer>

          <ExtraInstructionsInput
            value={extraInstructions}
            onChange={handleExtraInstructionsChange}
            isDisabled={isLoading}
          />

          {isLoading && (
            <LoadingContainer text="Brewing your acronym..." />
          )}

          {result && (
            <ResultContainer>
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl font-serif font-bold tracking-wider">
                  {result.acronym}
                </div>
                <RetryButton
                  icon={RefreshCw}
                  onClick={handleRefresh}
                  isDisabled={isLoading}
                  ariaLabel="Generate another acronym"
                />
              </div>
              <div className="text-center max-w-lg">
                <p className="text-lg font-serif italic text-foreground">
                  {result.meaning}
                </p>
              </div>
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

      {/* Global styles */}
      <style jsx global>{`
        /* Page-scoped animations only */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default App;
