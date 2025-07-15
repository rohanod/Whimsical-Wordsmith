import React, { useState, useEffect } from 'react';
import { Moon, Sun, RefreshCw, Sparkles, Copy, Check } from 'lucide-react';

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
    "claudePrompt": "The user wants to transform this ordinary phrase into something magnificently fancy and eloquent:\n\n\"{phrase}\"\n\n{previousContext}\n\nYou are a distinguished wordsmith and master of eloquent expression, skilled in the art of transforming mundane phrases into sophisticated, grandiose statements. Your mission: rewrite the given phrase using delightfully pretentious and ornate language.\n\nYour rewritten phrase should:\n- Sound incredibly sophisticated and pompous in the most charming way\n- Use elevated vocabulary and formal grammar\n- Be MORE CONCISE than overly verbose - aim for elegant brevity\n- Include fancy words like: magnificent, exquisite, endeavor, procure, sumptuous, delectable, perchance, forthwith, indeed, rather, quite, tremendously, exceedingly\n- Sound like it came from a Victorian novel or aristocratic dinner party\n- Still convey the same basic meaning as the original\n- Be grammatically correct and make sense\n- Keep it SHORT and PUNCHY while still being fancy\n{refreshContext}\n\nThink concise but elaborate phrases like:\n- \"I'm hungry\" → \"I find myself rather famished\"\n- \"It's hot\" → \"The temperature is quite oppressive\"\n- \"I need sleep\" → \"I require immediate repose\"\n- \"That's cool\" → \"How tremendously delightful\"\n- \"I'm tired\" → \"I am utterly exhausted\"\n\nMake it sound ridiculously fancy but keep it SHORT and snappy!\n\nPlease respond in {locale} language.\n\nRespond with just the rewritten phrase in a JSON object with the format:\n{\n  \"suggestion\": \"your fancy rewritten phrase\"\n}",
    "previouslySuggested": "Previously crafted versions: {suggestions}.",
    "differentFromPrevious": "- Create a distinctly different version from previous attempts",
    "transformLabel": "Transform:"
  },
  "es-ES": {
    "appTitle": "Expresiones Elegantes",
    "toggleTheme": "Cambiar tema",
    "inputPlaceholder": "Tengo mucha hambre y quiero comida",
    "transformPhrase": "Transformar frase",
    "getAnotherVersion": "Obtener otra versión",
    "errorMessage": "Permíteme intentarlo una vez más",
    "copyToClipboard": "Copiar al portapapeles",
    "copied": "¡Copiado!",
    "claudePrompt": "El usuario quiere transformar esta frase ordinaria en algo magníficamente elegante y elocuente:\n\n\"{phrase}\"\n\n{previousContext}\n\nEres un distinguido maestro de las palabras y experto en expresión elocuente, hábil en el arte de transformar frases mundanas en declaraciones sofisticadas y grandiosas. Tu misión: reescribir la frase dada usando lenguaje deliciosamente pretencioso y ornamentado.\n\nTu frase reescrita debe:\n- Sonar increíblemente sofisticada y pomposa de la manera más encantadora\n- Usar vocabulario elevado y gramática formal\n- Ser MÁS CONCISA que excesivamente verbosa - apunta a la brevedad elegante\n- Incluir palabras elegantes como: magnífico, exquisito, procurar, suntuoso, delectable, acaso, inmediatamente, ciertamente, bastante, tremendamente, excesivamente\n- Sonar como si viniera de una novela victoriana o una cena aristocrática\n- Aún transmitir el mismo significado básico que la original\n- Ser gramaticalmente correcta y tener sentido\n- Mantenerla CORTA y CONTUNDENTE mientras sigue siendo elegante\n{refreshContext}\n\nPiensa en frases concisas pero elaboradas como:\n- \"Tengo hambre\" → \"Me encuentro bastante famélico\"\n- \"Hace calor\" → \"La temperatura es sumamente opresiva\"\n- \"Necesito dormir\" → \"Requiero reposo inmediato\"\n- \"Está genial\" → \"Qué tremendamente delicioso\"\n- \"Estoy cansado\" → \"Me hallo completamente exhausto\"\n\n¡Hazlo sonar ridículamente elegante pero mantenlo CORTO y directo!\n\nPor favor responde en idioma {locale}.\n\nResponde solo con la frase reescrita en un objeto JSON con el formato:\n{\n  \"suggestion\": \"tu frase elegante reescrita\"\n}",
    "previouslySuggested": "Versiones previamente elaboradas: {suggestions}.",
    "differentFromPrevious": "- Crea una versión distintamente diferente de los intentos anteriores",
    "transformLabel": "Transformar:"
  }
};

const appLocale = '{{APP_LOCALE}}';
const browserLocale = navigator.languages?.[0] || navigator.language || 'en-US';
const findMatchingLocale = (locale) => {
  if (TRANSLATIONS[locale]) return locale;
  const lang = locale.split('-')[0];
  const match = Object.keys(TRANSLATIONS).find(key => key.startsWith(lang + '-'));
  return match || 'en-US';
};
const locale = (appLocale !== '{{APP_LOCALE}}') ? findMatchingLocale(appLocale) : findMatchingLocale(browserLocale);
const t = (key) => TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en-US'][key] || key;

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
      }, 25); // Faster typing for longer phrases

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
  const [phrase, setPhrase] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fade, setFade] = useState(false);
  const [previousSuggestions, setPreviousSuggestions] = useState([]);
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
        ? t('previouslySuggested').replace('{suggestions}', previousSuggestions.join('; '))
        : '';

      const refreshContext = refresh ? t('differentFromPrevious') : '';

      const prompt = t('claudePrompt')
        .replace('{phrase}', phrase)
        .replace('{previousContext}', previousContext)
        .replace('{refreshContext}', refreshContext)
        .replace('{locale}', locale);

      const response = await window.claude.complete(prompt);
      const result = JSON.parse(response);
      
      setSuggestion(result.suggestion);
      setPreviousSuggestions(prev => [...prev, result.suggestion]);
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
    setPhrase(e.target.value);
    setSuggestion('');
    setPreviousSuggestions([]);
    setError(false);
    setIsTyping(false);
    setCopied(false);
  };

  const handleKeyPress = (e) => {
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
        await navigator.clipboard.writeText(suggestion);
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
        <h1 
          className="text-2xl font-serif italic font-light flex items-center gap-2"
          style={{ color: '#A8A29D' }}
        >
          <Sparkles className="w-6 h-6" />
          {t('appTitle')}
        </h1>
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
          {/* Input section */}
          <div 
            className={`flex flex-col items-center transition-transform duration-500 ease-out ${
              isTyping ? '-translate-y-8' : 'translate-y-0'
            }`}
          >
            <div className="text-2xl font-serif mb-4 text-center" style={{ color: '#A8A29D' }}>
              {t('transformLabel')}
            </div>
            <div className="relative w-full max-w-2xl">
              <textarea
                value={phrase}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={t('inputPlaceholder')}
                className="w-full h-32 p-4 border-2 rounded-lg resize-none transition-colors duration-300 bg-transparent outline-none text-lg font-serif"
                style={{
                  borderColor: '#A8A29D',
                  color: isDark ? '#ffffff' : '#1B1917',
                }}
              />
              <button
                onClick={() => phrase && getSuggestion()}
                className={`absolute bottom-4 right-4 p-2 rounded-full transition-colors ${
                  !phrase 
                    ? 'opacity-50 cursor-not-allowed' 
                    : isDark 
                      ? 'hover:bg-gray-800' 
                      : 'hover:bg-gray-100'
                }`}
                style={{ color: '#A8A29D' }}
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
              className={`transition-opacity duration-300 ${
                fade ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="w-full max-w-3xl">
                  <div 
                    className="text-3xl font-serif leading-relaxed text-center p-8 rounded-lg border-2 relative"
                    style={{ 
                      borderColor: '#A8A29D',
                      backgroundColor: isDark ? 'rgba(168, 162, 157, 0.1)' : 'rgba(168, 162, 157, 0.05)'
                    }}
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
                    <TypewriterText 
                      text={suggestion} 
                      onStart={() => setIsTyping(true)}
                    />
                  </div>
                </div>
                {copied && (
                  <div 
                    className="mt-4 text-sm font-serif animate-pulse"
                    style={{ color: '#A8A29D' }}
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
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&display=swap');
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
        
        .font-serif {
          font-family: 'EB Garamond', serif;
        }
        
        .dark {
          color-scheme: dark;
        }
        
        textarea::placeholder {
          color: #A8A29D;
          opacity: 0.7;
        }
        
        textarea:focus {
          border-color: #A8A29D;
          outline: none;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default App;
