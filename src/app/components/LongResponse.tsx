import React, { useMemo, useState } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';
import RetryButton from './RetryButton';
import HoverableText from './HoverableText';

export interface Word {
  word: string;
  reasoning: string;
}

export interface LongResponseData {
  text: string;
  original?: string;
  words?: Word[];
}

interface LongResponseProps {
  isDark: boolean;
  data: LongResponseData;
  isLoading?: boolean;
  onRefresh?: () => void;
  onStartTyping?: () => void;
}

const LongResponse: React.FC<LongResponseProps> = ({ isDark, data, isLoading = false, onRefresh, onStartTyping }) => {
  const [copied, setCopied] = useState(false);

  const words = useMemo(() => data.words || [], [data.words]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(data.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <div className="w-full max-w-3xl">
        <div className="text-3xl font-serif leading-relaxed text-center p-8 rounded-lg border-2 border-muted bg-muted-10 relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={copyToClipboard}
              className={`p-2 rounded-full transition-all duration-300 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              style={{ color: '#A8A29D' }}
              aria-label="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            {onRefresh && (
              <RetryButton
                icon={RefreshCw}
                onClick={onRefresh}
                isDisabled={isLoading}
                ariaLabel="Get another version"
              />
            )}
          </div>
          <HoverableText text={data.text} annotations={words} onStart={onStartTyping} />
        </div>

        {copied && (
          <div className="text-sm font-serif animate-pulse muted text-center mt-2">Copied!</div>
        )}
      </div>

      {/* Component-scoped animations */}
      <style jsx global>{`
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
    </>
  );
};

export default LongResponse;
