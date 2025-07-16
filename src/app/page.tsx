'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';

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
                className="p-8 border-2 rounded-lg transition-all duration-500 group-hover:scale-105 group-hover:rotate-1 group-hover:shadow-2xl animate-slide-up h-80 flex items-center"
                style={{ 
                  borderColor: '#A8A29D',
                  backgroundColor: isDark ? 'rgba(168, 162, 157, 0.1)' : 'rgba(168, 162, 157, 0.05)',
                  animationDelay: '0.2s'
                }}
              >
                <div className="text-center space-y-4 w-full">
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
                className="p-8 border-2 rounded-lg transition-all duration-500 group-hover:scale-105 group-hover:-rotate-1 group-hover:shadow-2xl animate-slide-up h-80 flex items-center"
                style={{ 
                  borderColor: '#A8A29D',
                  backgroundColor: isDark ? 'rgba(168, 162, 157, 0.1)' : 'rgba(168, 162, 157, 0.05)',
                  animationDelay: '0.4s'
                }}
              >
                <div className="text-center space-y-4 w-full">
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


        </div>
      </main>

      {/* Global styles to match original tools */}
      <style jsx global>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
        
        .font-serif {
          font-family: 'Times New Roman', Times, serif;
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