'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sun, RefreshCw, Sparkles, Copy, Check } from 'lucide-react';
import Link from 'next/link';

const TRANSLATIONS = {
  "en-US": {
    "appTitle": "Eloquent Expressions",
    "toggleTheme": "Toggle theme",
    "inputPlaceholder": "I'm really hungry and want some food",
    "transformPhrase": "Transform phrase",
    "getAnotherVersion": "Get another version",
    "errorMessage": "Allow me to attempt that once more",
    "copyToClipboard": "Copy to clipboard",
    "copied": "Copied!",
    "claudePrompt": "The user wants to transform this ordinary phrase into something magnificently fancy and eloquent:\n\n\"{phrase}\"\n\n{previousContext}\n\nYou are a distinguished wordsmith and master of eloquent expression, skilled in the art of transforming mundane phrases into sophisticated, grandiose statements. Your mission: rewrite the given phrase using delightfully pretentious and ornate language.\n\nYour rewritten phrase should:\n- Sound incredibly sophisticated and pompous in the most amusing way\n- Use elaborate vocabulary and flowery language\n- Be distinctly different from previous attempts\n- Maintain the original meaning while making it sound ridiculously fancy\n- Be entertaining and delightfully over-the-top\n\nRespond with ONLY the transformed phrase, nothing else.",
    "previouslySuggested": "Previously crafted versions: {suggestions}.",
    "differentFromPrevious": "- Create a distinctly different version from previous attempts",
    "transformLabel": "Transform:"
  }
};

const appLocale = 'en-US';
type TranslationKeys = keyof typeof TRANSLATIONS[typeof appLocale];
const t = (key: TranslationKeys): string => (TRANSLATIONS as any)[appLocale]?.[key] || (TRANSLATIONS as any)['en-US'][key] || (key as string);

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

// Hoverable text component with tooltips
type HoverableTextProps = { 
  text: string; 
  annotations: Array<{ word: string; reasoning: string }>;
  onStart?: () => void; 
};

const HoverableText = ({ text, annotations, onStart }: HoverableTextProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  useEffect(() => {
    if (currentIndex === 0 && text && onStart) {
      onStart();
    }
    
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 25);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, onStart]);

  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);

  // Function to render text with hoverable words
  const renderTextWithHovers = (text: string) => {
    if (!annotations || annotations.length === 0) {
      return text;
    }

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    // Sort annotations by position in text to process them in order
    const sortedAnnotations = [...annotations].sort((a, b) => {
      const aIndex = text.toLowerCase().indexOf(a.word.toLowerCase());
      const bIndex = text.toLowerCase().indexOf(b.word.toLowerCase());
      return aIndex - bIndex;
    });

    sortedAnnotations.forEach((annotation, annotationIndex) => {
      const wordLower = annotation.word.toLowerCase();
      const textLower = text.toLowerCase();
      const wordIndex = textLower.indexOf(wordLower, lastIndex);
      
      if (wordIndex !== -1) {
        // Add text before the word
        if (wordIndex > lastIndex) {
          elements.push(text.slice(lastIndex, wordIndex));
        }
        
        // Add the hoverable word
        const actualWord = text.slice(wordIndex, wordIndex + annotation.word.length);
        elements.push(
          <span
            key={`word-${annotationIndex}`}
            className={`relative cursor-pointer underline decoration-dotted decoration-2 underline-offset-4 transition-all duration-200 rounded-md px-1 py-0.5 ${
              hoveredWord === annotation.word 
                ? 'bg-stone-300/40' 
                : 'hover:bg-stone-300/20'
            }`}
            onMouseEnter={() => setHoveredWord(annotation.word)}
            onMouseLeave={() => setHoveredWord(null)}
          >
            {actualWord}
            {hoveredWord === annotation.word && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-50 pointer-events-none">
                <div className="bg-gray-900 text-white rounded-xl px-4 py-3 shadow-2xl border border-gray-700 w-64 max-w-xs">
                  <div className="text-base font-medium leading-relaxed text-center">
                    {annotation.reasoning}
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
            )}
          </span>
        );
        
        lastIndex = wordIndex + annotation.word.length;
      }
    });

    // Add remaining text
    if (lastIndex < text.length) {
      elements.push(text.slice(lastIndex));
    }

    return elements;
  };

  return <span>{renderTextWithHovers(displayText)}</span>;
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
  const [fade, setFade] = useState(false);
  const [previousSuggestions, setPreviousSuggestions] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isDark, setIsDark } = useTheme();

  const getSuggestion = async (refresh = false) => {
    if (!phrase.trim() || isLoading) return;

    setIsLoading(true);
    setFade(true);
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
      setFade(false);
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
            className="text-2xl font-serif italic font-light flex items-center gap-2 animate-slide-in-left hover:animate-pulse"
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

      {/* Main content */}
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl px-6 space-y-8">
          {/* Description */}
          <p className="text-center text-lg font-serif leading-relaxed" style={{ color: '#A8A29D' }}>
            Rewrite any plain sentence into gloriously ornate prose—same meaning, maximum flourish.
          </p>

          {/* Input section */}
          <div 
            className={`flex flex-col items-center transition-transform duration-500 ease-out animate-fade-in-up ${
              isTyping ? '-translate-y-8' : 'translate-y-0'
            }`}
            style={{ animationDelay: '0.3s' }}
          >
            <div className="text-2xl font-serif mb-4 text-center" style={{ color: '#A8A29D' }}>
              {t('transformLabel')}
            </div>
            <div className="relative w-full max-w-2xl">
              <textarea
                value={phrase}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={t('inputPlaceholder')}
                 className="w-full h-32 p-4 border-2 border-muted rounded-lg resize-none transition-colors duration-300 bg-transparent outline-none text-lg font-serif"
                style={{
                  color: isDark ? '#ffffff' : '#1B1917',
                }}
              />
              <button
                onClick={() => phrase && getSuggestion()}
                 className={`absolute bottom-4 right-4 p-2 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12 ${
                  !phrase 
                    ? 'opacity-50 cursor-not-allowed' 
                    : isDark 
                      ? 'hover:bg-gray-800' 
                      : 'hover:bg-gray-100'
                } muted`}

                disabled={!phrase}
                aria-label={t('transformPhrase')}
              >
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Result section */}
          {suggestion && (
            <div 
              className={`transition-all duration-500 animate-scale-in ${
                fade ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              <div className="flex flex-col items-center space-y-6">
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
                         aria-label={t('copyToClipboard')}
                       >
                         {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                       </button>
                       <button
                         onClick={handleRefresh}
                         disabled={isLoading}
                         className={`p-2 rounded-full transition-all duration-300 ${
                           isDark 
                             ? 'hover:bg-gray-800 disabled:opacity-50' 
                             : 'hover:bg-gray-100 disabled:opacity-50'
                         } ${isLoading ? 'animate-spin' : ''}`}
                         style={{ color: '#A8A29D' }}
                         aria-label={t('getAnotherVersion')}
                       >
                         <RefreshCw className="w-4 h-4" />
                       </button>
                     </div>
                     <HoverableText 
                       text={suggestion.transformed} 
                       annotations={suggestion.annotations || []}
                       onStart={() => setIsTyping(true)}
                     />
                   </div>
                 </div>

                 {/* Annotations Section - Hidden since we show on hover now */}
                 {/* 
                 {suggestion.annotations && suggestion.annotations.length > 0 && (
                   <div className="w-full max-w-2xl">
                     <div className="text-lg font-serif mb-4 text-center muted">
                       Word Choice Explanations
                     </div>
                     <div className="space-y-3">
                       {suggestion.annotations.map((annotation, index) => (
                         <div 
                           key={index}
                           className="p-4 rounded-lg border border-muted bg-muted-5"
                         >
                           <div className="flex items-start gap-3">
                             <div className="text-lg font-serif font-medium">
                               "{annotation.word}"
                             </div>
                             <div className="text-sm muted">—</div>
                             <div className="text-sm font-serif muted leading-relaxed">
                               {annotation.reasoning}
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
                 */}

                {copied && (
                  <div 
                    className="text-sm font-serif animate-pulse muted"
                  >
                    {t('copied')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex justify-center animate-shake">
              <div 
                className="text-2xl font-serif text-center"
                style={{ color: '#EF4444' }}
              >
                {t('errorMessage')}
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2 text-lg font-serif" style={{ color: '#A8A29D' }}>
                <div className="animate-spin">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span>Crafting eloquent prose...</span>
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