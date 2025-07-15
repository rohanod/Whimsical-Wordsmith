'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Moon, Sun, Sparkles } from 'lucide-react';

export default function Home() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Match the original tools' theme logic
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setIsDark(false);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-300 animate-fade-in"
      style={{ 
        backgroundColor: isDark ? '#1B1917' : '#FAFAF9',
        color: isDark ? '#ffffff' : '#1B1917'
      }}
    >
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 flex justify-between items-center p-6">
        <h1 
          className="text-3xl font-serif italic font-light"
          style={{ color: '#A8A29D' }}
        >
          Whimsical Wordsmith
        </h1>
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-colors ${
            isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      {/* Main content - centered on page */}
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl px-6 space-y-12">
          
          {/* Welcome section */}
          <div className="text-center space-y-6">
            <p className="text-2xl font-serif leading-relaxed" style={{ color: '#A8A29D' }}>
              A delightful collection of word tools to enhance your writing
            </p>
          </div>

          {/* Tools grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            
            {/* Delightfully Different Words */}
            <Link href="/delightfully-different-words" className="group">
              <div 
                className="p-8 border-2 rounded-lg transition-all duration-500 group-hover:scale-105 group-hover:rotate-1 group-hover:shadow-2xl animate-slide-up"
                style={{ 
                  borderColor: '#A8A29D',
                  backgroundColor: isDark ? 'rgba(168, 162, 157, 0.1)' : 'rgba(168, 162, 157, 0.05)',
                  animationDelay: '0.2s'
                }}
              >
                <div className="text-center space-y-4">
                  <div className="text-4xl animate-bounce-gentle group-hover:animate-spin-slow">✨</div>
                  <h2 className="text-2xl font-serif font-medium group-hover:text-blue-400 transition-colors duration-300">
                    Delightfully Different Words
                  </h2>
                  <p className="text-lg font-serif leading-relaxed transition-all duration-300 group-hover:scale-105" style={{ color: '#A8A29D' }}>
                    Transform boring "very + adjective" phrases into delightfully whimsical alternatives
                  </p>
                </div>
              </div>
            </Link>

            {/* Eloquent Expressions */}
            <Link href="/eloquent-expressions" className="group">
              <div 
                className="p-8 border-2 rounded-lg transition-all duration-500 group-hover:scale-105 group-hover:-rotate-1 group-hover:shadow-2xl animate-slide-up"
                style={{ 
                  borderColor: '#A8A29D',
                  backgroundColor: isDark ? 'rgba(168, 162, 157, 0.1)' : 'rgba(168, 162, 157, 0.05)',
                  animationDelay: '0.4s'
                }}
              >
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <Sparkles className="w-10 h-10 animate-pulse group-hover:animate-ping transition-all duration-300 group-hover:text-purple-400" style={{ color: '#A8A29D' }} />
                  </div>
                  <h2 className="text-2xl font-serif font-medium group-hover:text-purple-400 transition-colors duration-300">
                    Eloquent Expressions
                  </h2>
                  <p className="text-lg font-serif leading-relaxed transition-all duration-300 group-hover:scale-105" style={{ color: '#A8A29D' }}>
                    Transform ordinary phrases into magnificently sophisticated statements
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Coming soon section */}
          <div className="text-center space-y-8">
            <h3 className="text-2xl font-serif font-medium" style={{ color: '#A8A29D' }}>
              More delightful tools coming soon...
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center space-y-3 animate-slide-up hover:scale-110 transition-all duration-300 cursor-pointer" style={{ animationDelay: '0.6s' }}>
                <div className="text-2xl animate-bounce-gentle hover:animate-spin-slow">📝</div>
                <h4 className="font-serif font-medium hover:text-green-400 transition-colors duration-300">Poetic Paraphraser</h4>
                <p className="text-sm font-serif hover:scale-105 transition-transform duration-300" style={{ color: '#A8A29D' }}>
                  Transform prose into beautiful poetry
                </p>
              </div>
              
              <div className="text-center space-y-3 animate-slide-up hover:scale-110 transition-all duration-300 cursor-pointer" style={{ animationDelay: '0.8s' }}>
                <div className="text-2xl animate-bounce-gentle hover:animate-spin-slow">🎪</div>
                <h4 className="font-serif font-medium hover:text-red-400 transition-colors duration-300">Silly Synonym Circus</h4>
                <p className="text-sm font-serif hover:scale-105 transition-transform duration-300" style={{ color: '#A8A29D' }}>
                  Find the most amusing word alternatives
                </p>
              </div>
              
              <div className="text-center space-y-3 animate-slide-up hover:scale-110 transition-all duration-300 cursor-pointer" style={{ animationDelay: '1s' }}>
                <div className="text-2xl animate-bounce-gentle hover:animate-spin-slow">🌟</div>
                <h4 className="font-serif font-medium hover:text-yellow-400 transition-colors duration-300">Magical Metaphor Maker</h4>
                <p className="text-sm font-serif hover:scale-105 transition-transform duration-300" style={{ color: '#A8A29D' }}>
                  Create enchanting metaphors and similes
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global styles to match original tools */}
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

        /* Custom micro animations */
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-gentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(168, 162, 157, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(168, 162, 157, 0.6);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out both;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        /* Hover effects */
        .hover-lift:hover {
          transform: translateY(-5px);
          transition: transform 0.3s ease;
        }

        /* Staggered animations */
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
      `}</style>
    </div>
  );
}