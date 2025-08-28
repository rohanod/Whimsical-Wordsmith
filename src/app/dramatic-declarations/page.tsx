'use client';

import React, { useState, useEffect } from 'react';

import {
  TopBar,
  Description,
  MainInputContainer,
  DramaticDeclarationsInput,
  ResultContainer,
  LoadingContainer,
  LongResponse
} from '@/app/components';
import { useApiKey } from '@/app/hooks/useApiKey';

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
  const [request, setRequest] = useState('');
  const [responseType, setResponseType] = useState<'accept' | 'decline' | ''>('');
  const [declaration, setDeclaration] = useState<{
    response: string;
    tone: 'acceptance' | 'rejection';
    original: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [previousDeclarations, setPreviousDeclarations] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { isDark, setIsDark } = useTheme();
  const { apiKey, validateApiKey } = useApiKey();

  const getDeclaration = async (refresh = false) => {
    if (!request.trim() || !responseType || isLoading) return;

    const isValidKey = await validateApiKey();
    if (!isValidKey) {
      return;
    }

    setIsLoading(true);
    setError(false);

    if (!refresh) {
      setDeclaration(null);
    }

    try {
      const previousContext = refresh && previousDeclarations.length > 0
        ? `Previously created declarations: ${previousDeclarations.join('; ')}.`
        : '';

      const tone = responseType === 'accept' ? 'acceptance' : 'rejection';
      const prompt = `The user received this request: "${request}"

They want to ${responseType === 'accept' ? 'accept and agree' : 'decline and reject'} this request.

${previousContext}

You are a master of grandiose proclamations and theatrical language, skilled in transforming simple responses into magnificent dramatic declarations. Your mission: craft an ${responseType === 'accept' ? 'elaborate acceptance' : 'ornate rejection'} that sounds incredibly sophisticated, pompous, and delightfully over-the-top.

${responseType === 'accept' ? 
`Your acceptance should:
- Express enthusiastic agreement with royal flourishes
- Use elaborate vocabulary that makes simple "yes" sound magnificent  
- Sound like a nobleman granting a favor with great ceremony
- Be entertaining and delightfully grandiose while clearly meaning "yes"` :
`Your rejection should:
- Express dignified refusal with theatrical flair
- Use elaborate vocabulary that makes simple "no" sound sophisticated
- Sound like a refined person declining with utmost politeness but dramatic emphasis
- Be entertaining and delightfully pompous while clearly meaning "no"`}

IMPORTANT LENGTH GUIDELINES:
- Keep the declaration under 25 words for maximum impact
- Focus on replacing simple words with fancier alternatives
- Make it sound ridiculously elaborate but still concise
- Be distinctly different from previous attempts

Examples of the humor style:
- Simple "yes" becomes "I shall graciously bestow my most enthusiastic acquiescence upon this endeavor"
- Simple "no" becomes "I must regretfully decline this proposition with utmost ceremonial dignity"

Return the dramatic declaration, whether it's an acceptance or rejection, and the original request.`;

      const schemaDescription = `Dramatic ${tone} with the response text, tone type, and original request`;
      
      const exampleFormat = `{
  "response": "I shall graciously bestow my most enthusiastic acquiescence upon this endeavor",
  "tone": "${tone}",
  "original": "${request}"
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
        throw new Error('Failed to generate declaration');
      }

      const data = await response.json();
      
      setDeclaration(data);
      setPreviousDeclarations(prev => [...prev, data.response]);
    } catch (error) {
      console.error('Error fetching declaration:', error);
      setError(true);
      setDeclaration(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRequest(e.target.value);
    setDeclaration(null);
    setPreviousDeclarations([]);
    setError(false);
    setIsTyping(false);
  };

  const handleResponseTypeChange = (type: 'accept' | 'decline') => {
    setResponseType(type);
    setDeclaration(null);
    setPreviousDeclarations([]);
    setError(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      getDeclaration();
    }
  };

  const handleRefresh = () => {
    if (declaration && !isLoading) {
      setDeclaration(null);
      setError(false);
      setIsTyping(false);
      getDeclaration(true);
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
        title="Dramatic Declarations"
        isDark={isDark}
        onThemeToggle={() => setIsDark(!isDark)}
        showBackButton={true}
      />

      <main className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl px-6 space-y-8">
          <Description text="Transform simple acceptances and rejections into magnificently theatrical proclamations." />

          <MainInputContainer className={isTyping ? '-translate-y-8' : 'translate-y-0'}>
            <DramaticDeclarationsInput
              requestValue={request}
              responseType={responseType}
              onRequestChange={handleRequestChange}
              onResponseTypeChange={handleResponseTypeChange}
              onKeyDown={handleKeyDown}
              placeholder="Can you help me move this weekend?"
              onSubmit={() => request && responseType && getDeclaration()}
              isDisabled={isLoading}
            />
          </MainInputContainer>

           {declaration && (
             <ResultContainer>
               <LongResponse
                 isDark={isDark}
                 data={{
                   text: declaration.response,
                   original: declaration.original,
                   words: [] // No annotations for dramatic declarations
                 }}
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
            <LoadingContainer text="Crafting dramatic proclamation..." />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;