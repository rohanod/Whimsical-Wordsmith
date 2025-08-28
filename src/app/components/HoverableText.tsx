import React, { useState, useEffect } from 'react';

interface Word {
  word: string;
  reasoning: string;
}

interface HoverableTextProps {
  text: string;
  annotations: Word[];
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

  // Function to render text with hoverable words, robust to repeated words
  const renderTextWithHovers = (text: string) => {
    if (!annotations || annotations.length === 0) {
      return text;
    }

    const elements: React.ReactNode[] = [];
    let cursor = 0;

    // Build a lowercase working copy for matching without affecting output casing
    const lower = text.toLowerCase();

    // For repeated words, assign occurrences in a left-to-right pass using per-word counters
    const counters = new Map<string, number>();

    const anns = [...annotations];

    for (let i = 0; i < anns.length; i++) {
      const ann = anns[i];
      const token = ann.word.toLowerCase();
      if (!token) continue;

      // Determine which occurrence of this token to target based on how many times
      // we've already placed this token
      const count = counters.get(token) ?? 0;

      // Find the Nth occurrence index starting from current cursor
      let startIdx = -1;
      let searchFrom = cursor;
      for (let k = 0; k <= count; k++) {
        startIdx = lower.indexOf(token, searchFrom);
        if (startIdx === -1) break;
        searchFrom = startIdx + token.length;
      }

      if (startIdx === -1) {
        // Could not find next occurrence; skip gracefully
        counters.set(token, count + 1);
        continue;
      }

      // Push any intermediate text between cursor and startIdx
      if (startIdx > cursor) {
        elements.push(text.slice(cursor, startIdx));
      }

      const actual = text.slice(startIdx, startIdx + ann.word.length);
      const key = `${token}-${count}-${startIdx}`;
      elements.push(
        <span
          key={key}
          className={`relative cursor-pointer underline decoration-dotted decoration-2 underline-offset-4 transition-all duration-200 rounded-md px-1 py-0.5 ${
            hoveredWord === ann.word ? 'bg-stone-300/40' : 'hover:bg-stone-300/20'
          }`}
          onMouseEnter={() => setHoveredWord(ann.word)}
          onMouseLeave={() => setHoveredWord(null)}
        >
          {actual}
          {hoveredWord === ann.word && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-50 pointer-events-none">
              <div className="bg-gray-900 text-white rounded-xl px-4 py-3 shadow-2xl border border-gray-700 w-64 max-w-xs">
                <div className="text-base font-medium leading-relaxed text-center">{ann.reasoning}</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                </div>
              </div>
            </div>
          )}
        </span>
      );

      // Move cursor and bump counter for this token
      cursor = startIdx + ann.word.length;
      counters.set(token, count + 1);
    }

    // Append remainder
    if (cursor < text.length) {
      elements.push(text.slice(cursor));
    }

    return elements;
  };

  return <span>{renderTextWithHovers(displayText)}</span>;
};

export default HoverableText;
