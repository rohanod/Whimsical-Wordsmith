import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import RetryButton from './RetryButton';

export interface ShortResponseData {
  word: string;
  definition: string;
  original: string;
}

interface ShortResponseProps {
  data: ShortResponseData;
  isLoading?: boolean;
  onRefresh?: () => void;
  onStartTyping?: () => void;
}

// Typewriter animation component
type TypewriterProps = { text: string; className?: string; onStart?: () => void };
const TypewriterText = ({ text, className = "", onStart }: TypewriterProps) => {
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

const ShortResponse: React.FC<ShortResponseProps> = ({ data, isLoading = false, onRefresh, onStartTyping }) => {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="text-6xl font-serif">
          &ldquo;<TypewriterText
            text={data.word}
            onStart={onStartTyping}
          />&rdquo;
        </div>
        {onRefresh && (
          <RetryButton
            icon={RefreshCw}
            onClick={onRefresh}
            isDisabled={isLoading}
            ariaLabel="Get another suggestion"
          />
        )}
      </div>
      <div className="text-center max-w-lg">
        <p className="text-lg font-serif italic text-foreground">
          {data.definition}
        </p>
      </div>

      {/* Component-scoped animations */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </>
  );
};

export default ShortResponse;