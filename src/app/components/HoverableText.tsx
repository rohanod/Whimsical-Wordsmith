import React, { useState, useEffect } from 'react';

interface Annotation {
  word: string;
  reasoning: string;
}

interface HoverableTextProps {
  text: string;
  annotations: Annotation[];
  onStart?: () => void;
}

const HoverableText: React.FC<HoverableTextProps> = ({ text, annotations, onStart }) => {
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

export default HoverableText;
