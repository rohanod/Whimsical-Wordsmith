'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';
import {
  TopBar,
  Description,
  MainInputContainer,
  EloquentExpressionsInput,
  ResultContainer,
  RetryButton,
  LoadingContainer,
  HoverableText
} from '@/app/components';



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
  const [suggestion, setSuggestion] = useState<{
    transformed: string;
    original: string;
    annotations: Array<{
      word: string;
      reasoning: string;
    }>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [previousSuggestions, setPreviousSuggestions] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isDark, setIsDark } = useTheme();

  const getSuggestion = async (refresh = false) => {
    if (!phrase.trim() || isLoading) return;

    setIsLoading(true);
    setError(false);
    setCopied(false);

    try {
      const previousContext = refresh && previousSuggestions.length > 0
        ? `Previously crafted versions: ${previousSuggestions.join('; ')}.`
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

Additionally, provide annotations for 3-5 key word choices. Focus on individual words or maximum 2-word phrases that showcase the most striking transformations. Each explanation should be maximum 15 words explaining simply why you chose that specific word/phrase over simpler alternatives.

Prefer shorter explanations for single words over longer explanations for phrases.

Return the transformed phrase, original phrase, and annotations explaining your word choices.`;

      // Define schema and example for this app
      const schemaDescription = `Eloquent phrase transformation with original phrase and 3-5 annotations for key word choices (single words or max 2-word phrases with max 15-word explanations)`;
      
      const exampleFormat = `{
  "transformed": "I find myself in a state of profound gastronomic yearning",
  "original": "I'm hungry",
  "annotations": [
    {
      "word": "profound",
      "reasoning": "Elevates simple hunger to philosophical depth"
    },
    {
      "word": "gastronomic yearning",
      "reasoning": "Transforms 'hungry' into sophisticated culinary desire"
    }
  ]
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
        throw new Error('Failed to generate transformation');
      }

      const data = await response.json();
      
      setSuggestion(data);
      setPreviousSuggestions(prev => [...prev, data.transformed]);
    } catch (error) {
      console.error('Error fetching suggestion:', error);
      setError(true);
      setSuggestion(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPhrase(e.target.value);
    setSuggestion(null);
    setPreviousSuggestions([]);
    setError(false);
    setIsTyping(false);
    setCopied(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      getSuggestion();
    }
  };

  const handleRefresh = () => {
    if (suggestion && !isLoading) {
      setIsTyping(false);
      getSuggestion(true);
    }
  };

  const copyToClipboard = async () => {
    if (suggestion) {
      try {
        await navigator.clipboard.writeText(suggestion.transformed);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
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
            <div className="text-3xl font-serif mb-6 text-center font-medium animate-fade-in-up text-foreground" style={{
              animationDelay: '0.2s'
            }}>
              Transform:
            </div>
            <EloquentExpressionsInput
              value={phrase}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="I'm really hungry and want some food"
              onSubmit={() => phrase && getSuggestion()}
              isDisabled={isLoading}
            />
          </MainInputContainer>

          {suggestion && (
            <ResultContainer>
              <div className="w-full max-w-3xl">
                <div
                  className="text-3xl font-serif leading-relaxed text-center p-8 rounded-lg border-2 border-muted bg-muted-10 relative"
                >
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        isDark
                          ? 'hover:bg-gray-800'
                          : 'hover:bg-gray-100'
                      }`}
                      style={{ color: '#A8A29D' }}
                      aria-label="Copy to clipboard"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <RetryButton
                      icon={RefreshCw}
                      onClick={handleRefresh}
                      isDisabled={isLoading}
                      ariaLabel="Get another version"
                    />
                  </div>
                  <HoverableText
                    text={suggestion.transformed}
                    annotations={suggestion.annotations || []}
                    onStart={() => setIsTyping(true)}
                  />
                </div>
              </div>

              {copied && (
                <div
                  className="text-sm font-serif animate-pulse muted"
                >
                  Copied!
                </div>
              )}
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

        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out both; }
      `}</style>
    </div>
  );
};

export default App;