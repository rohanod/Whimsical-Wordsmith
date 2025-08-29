'use client';

import React, { useState, useEffect } from 'react';

import {
  TopBar,
  Description,
  MainInputContainer,
  EloquentExpressionsInput,
  ResultContainer,
  LoadingContainer,
  LongResponse
 } from '@/app/components';
import { useApiKey } from '@/app/hooks/useApiKey';

// Custom hook for theme management
const useTheme = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setIsDark(false);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return { isDark, setIsDark };
};



const App = () => {
  const [phrase, setPhrase] = useState('');
  const [result, setResult] = useState<{
    original: string;
    words: Array<{
      word: string;
      reasoning: string;
    }>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [previousResults, setPreviousResults] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { isDark, setIsDark } = useTheme();
  const { apiKey, validateApiKey } = useApiKey();

  const getSuggestion = async (refresh = false) => {
    if (!phrase.trim() || isLoading) return;

    // Validate API key before making request
    const isValidKey = await validateApiKey();
    if (!isValidKey) {
      return; // API key validation will handle showing the popup
    }

    setIsLoading(true);
    setError(false);
    // no-op: copy state handled inside LongResponse

    // Clear previous result when submitting a new request (not refresh)
    if (!refresh) {
      setResult(null);
    }

    try {
      const previousContext = refresh && previousResults.length > 0
        ? `Previously crafted versions: ${previousResults.join('; ')}.`
        : '';

       const prompt = `The user wants to transform this ordinary phrase into something magnificently fancy and eloquent:

"${phrase}"

${previousContext}

You are a distinguished wordsmith and master of eloquent expression, skilled in the art of transforming mundane phrases into sophisticated, grandiose statements. Your mission: rewrite the given phrase using delightfully pretentious and ornate language.

IMPORTANT LENGTH GUIDELINES:
- For phrases 1-3 words: Keep transformation under 8 words
- For phrases 4-6 words: Keep transformation under 12 words
- For phrases 7+ words: Can expand more freely but stay reasonable
- Focus on replacing words with fancier alternatives rather than adding many new words

Your rewritten phrase should:
- Sound incredibly sophisticated and pompous in the most amusing way
- Use elaborate vocabulary and flowery language
- Be distinctly different from previous attempts
- Maintain the original meaning while making it sound ridiculously fancy
- Be entertaining and delightfully over-the-top
- Respect the length guidelines above

CRITICAL: Return ONLY an array of word segments. Each segment should be a separate object with "word" and "reasoning" fields. Do NOT combine multiple words into a single reasoning explanation - each word segment gets its own reasoning.

You can leave the reasoning field blank ("") if a word segment doesn't need explanation or if the transformation is obvious.

Example: If the transformation is "I find myself in profound gastronomic yearning", return:
[
  {"word": "I find myself in", "reasoning": "Sets formal introspective tone"},
  {"word": "profound", "reasoning": "Elevates simple to philosophical"},
  {"word": "gastronomic yearning", "reasoning": "Transforms hunger to sophisticated desire"}
]

NOT this (which combines explanations):
[
  {"word": "I find myself in profound gastronomic yearning", "reasoning": "Sets tone, elevates hunger, transforms desire"}
]

Each reasoning should be specific to that exact word/segment only. If a segment doesn't need special explanation or is obvious, use an empty string ("") for the reasoning field.`;

       // Define schema and example for this app
       const schemaDescription = `Array of word segments with word text and reasoning for eloquent phrase transformation`;

       const exampleFormat = `[
  {
    "word": "I find myself in a state of",
    "reasoning": "Sets a formal, introspective tone"
  },
  {
    "word": "profound gastronomic yearning",
    "reasoning": "Elevates simple hunger to philosophical depth"
  },
  {
    "word": "that demands immediate attention",
    "reasoning": "Adds dramatic urgency to the request"
  }
]`;

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
        throw new Error('Failed to generate transformation');
      }

      const data = await response.json();
      
       // The response is an array of word/reasoning objects
       const wordsArray = Array.isArray(data) ? data : [];
       // Reconstruct the transformed text from the words array
       const transformedText = wordsArray.map((w: {word: string, reasoning: string}) => w.word).join(' ');
       setResult({
         original: phrase,
         words: wordsArray
       });
       setPreviousResults(prev => [...prev, transformedText]);
    } catch (error) {
      console.error('Error fetching suggestion:', error);
      setError(true);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPhrase(e.target.value);
    setResult(null);
    setPreviousResults([]);
    setError(false);
    setIsTyping(false);
    // no-op: copy state handled inside LongResponse
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      getSuggestion();
    }
  };

  const handleRefresh = () => {
    if (result && !isLoading) {
      setResult(null);
      setError(false);
    // copy state handled inside LongResponse
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
        title="Eloquent Expressions"
        isDark={isDark}
        onThemeToggle={() => setIsDark(!isDark)}
        showBackButton={true}
      />

      {/* Main content */}
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl px-6 space-y-8">
          <Description text="Rewrite any plain sentence into gloriously ornate prose—same meaning, maximum flourish." />

          <MainInputContainer className={isTyping ? '-translate-y-8' : 'translate-y-0'}>
            <EloquentExpressionsInput
              value={phrase}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="I'm really hungry and want some food"
              onSubmit={() => phrase && getSuggestion()}
              isDisabled={isLoading}
            />
          </MainInputContainer>

           {result && (
             <ResultContainer>
                <LongResponse
                  isDark={isDark}
                  data={{ text: result.words.map((w: {word: string, reasoning: string}) => w.word).join(' '), original: result.original, words: result.words }}
                  isLoading={isLoading}
                  onRefresh={handleRefresh}
                  onStartTyping={() => setIsTyping(true)}
                />
             </ResultContainer>
           )}

          {error && (
            <div className="flex justify-center animate-shake">
              <div
                className="text-2xl font-serif text-center"
                style={{ color: '#EF4444' }}
              >
                Allow me to attempt that once more
              </div>
            </div>
          )}

          {isLoading && (
            <LoadingContainer text="Crafting eloquent prose..." />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;