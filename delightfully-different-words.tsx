import React, { useState, useEffect } from 'react';
import { Moon, Sun, RefreshCw, Search } from 'lucide-react';

const TRANSLATIONS = {
  "en-US": {
    "appTitle": "Delightfully Different Words",
    "toggleTheme": "Toggle theme",
    "inputPlaceholder": "happy",
    "searchAlternative": "Search for alternative",
    "getAnotherSuggestion": "Get another suggestion",
    "errorMessage": "Let's try again",
    "claudePrompt": "The user entered the adjective \"{adjective}\" to complete the phrase \"very {adjective}\".\n\n{previousContext}\n\nYou are a whimsical word wizard who delights in finding the most amusing yet legitimate alternatives to boring phrases. Your mission: find ONE single, REAL English word that can replace \"very {adjective}\" - but make it sound absolutely delightful and perhaps a bit silly!\n\nYour suggestion should:\n- Be a single, genuine English word found in dictionaries (no made-up words or hyphens)\n- Be more colorful, dramatic, or amusing than the original phrase\n- Sound quirky, old-fashioned, or charmingly unusual\n- Still convey the intended meaning accurately\n- Be the kind of word that makes people smile or go \"ooh, what a fun word!\"\n{refreshContext}\n\nThink of words like: flummoxed, discombobulated, wonky, zany, scrumptious, preposterous, bamboozled, gobsmacked, or hullabaloo. Choose words that have character and personality!\n\nPlease respond in {locale} language.\n\nRespond with just the word in a JSON object with the format:\n{\n  \"suggestion\": \"word\"\n}",
    "previouslySuggested": "Previously suggested: {suggestions}.",
    "differentFromPrevious": "- Be different from previous suggestions",
    "veryLabel": "Very"
  },
  /* LOCALE_PLACEHOLDER_START */
  "es-ES": {
    "appTitle": "Palabras Deliciosamente Diferentes",
    "toggleTheme": "Cambiar tema",
    "inputPlaceholder": "feliz",
    "searchAlternative": "Buscar alternativa",
    "getAnotherSuggestion": "Obtener otra sugerencia",
    "errorMessage": "Intentémoslo de nuevo",
    "claudePrompt": "El usuario ingresó el adjetivo \"{adjective}\" para completar la frase \"muy {adjective}\".\n\n{previousContext}\n\n¡Eres un mago de las palabras caprichoso que se deleita encontrando las alternativas más divertidas pero legítimas a frases aburridas! Tu misión: encontrar UNA sola palabra REAL del español que pueda reemplazar \"muy {adjective}\" - ¡pero hazla sonar absolutamente deliciosa y quizás un poco tonta!\n\nTu sugerencia debe:\n- Ser una sola palabra genuina del español encontrada en diccionarios (no palabras inventadas o con guiones)\n- Ser más colorida, dramática o divertida que la frase original\n- Sonar peculiar, anticuada, o encantadoramente inusual\n- Aún transmitir el significado deseado con precisión\n- Ser el tipo de palabra que hace sonreír a la gente o decir \"¡oh, qué palabra tan divertida!\"\n{refreshContext}\n\nPiensa en palabras como: estupendo, fenomenal, descabellado, chiflado, espectacular, tremendo, o fantástico. ¡Elige palabras que tengan carácter y personalidad!\n\nPor favor responde en idioma {locale}.\n\nResponde solo con la palabra en un objeto JSON con el formato:\n{\n  \"suggestion\": \"palabra\"\n}",
    "previouslySuggested": "Sugerido anteriormente: {suggestions}.",
    "differentFromPrevious": "- Ser diferente de las sugerencias anteriores",
    "veryLabel": "Muy"
  }
  /* LOCALE_PLACEHOLDER_END */
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
        <h1 
          className="text-2xl font-serif italic font-light"
          style={{ color: '#A8A29D' }}
        >
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

      {/* Main content - centered on page */}
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl px-6 space-y-8">
          {/* Input section */}
          <div 
            className={`flex justify-center transition-transform duration-500 ease-out ${
              isTyping ? '-translate-y-4' : 'translate-y-0'
            }`}
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
                  className={`p-2 transition-colors relative top-1 ${!adjective ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              className={`transition-opacity duration-300 ${
                fade ? 'opacity-0' : 'opacity-100'
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
                    className={`p-2 rounded-full transition-all duration-300 ${
                      isDark 
                        ? 'hover:bg-gray-800 disabled:opacity-50' 
                        : 'hover:bg-gray-100 disabled:opacity-50'
                    } ${isLoading ? 'animate-spin' : ''}`}
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
      `}</style>
    </div>
  );
};

export default App;
