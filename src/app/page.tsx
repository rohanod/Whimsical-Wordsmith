'use client';

import { useState, useEffect } from 'react';
import { TopBar, Description, AppCardsContainer, AppCard } from '@/app/components';

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



  return (
    <div
      className="min-h-screen transition-colors duration-300 animate-fade-in"
      style={{
        backgroundColor: isDark ? '#1B1917' : '#FAFAF9',
        color: isDark ? '#ffffff' : '#1B1917'
      }}
    >
      <TopBar
        title="Whimsical Wordsmith"
        isDark={isDark}
        onThemeToggle={() => setIsDark(!isDark)}
        showBackButton={false}
      />

      {/* Update AppCard theme support */}
      <style jsx global>{`
        :root {
          --app-card-bg: rgba(168, 162, 157, 0.1);
          --app-card-border: #A8A29D;
          --app-card-text: #1B1917;
          --app-card-muted-text: #4B5563;
        }

        .dark {
          --app-card-bg: rgba(168, 162, 157, 0.1);
          --app-card-border: #A8A29D;
          --app-card-text: #ffffff;
          --app-card-muted-text: #D1D5DB;
        }

        .app-card {
          background-color: var(--app-card-bg) !important;
          border-color: var(--app-card-border) !important;
          color: var(--app-card-text) !important;
        }
      `}</style>

      {/* Main content - centered on page */}
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl px-6 space-y-12">
          <Description text="A delightful collection of word tools to enhance your writing" />

          <AppCardsContainer>
            <AppCard
              title="Delightfully Different Words"
              description="Transform boring 'very + adjective' phrases into delightfully whimsical alternatives"
              href="/delightfully-different-words"
              animationDelay={400}
              titleHoverColour="#8B5CF6"
            />

            <AppCard
              title="Eloquent Expressions"
              description="Transform ordinary phrases into magnificently sophisticated statements"
              href="/eloquent-expressions"
              animationDelay={400}
              titleHoverColour="#10B981"
            />
          </AppCardsContainer>
        </div>
      </main>

      {/* Page-scoped animations only */}
      <style jsx global>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out both; }

        /* Ensure app cards are visible */
        .group {
          display: block;
          text-decoration: none;
          color: inherit;
        }

        .group:hover {
          color: inherit;
        }
      `}</style>
    </div>
  );
}