import React from 'react';

interface DescriptionProps {
  text: string;
}

const Description: React.FC<DescriptionProps> = ({ text }) => {
  return (
    <p className="text-center text-lg font-serif leading-relaxed animate-fade-in-up text-muted-foreground">
      {text}
    </p>
  );
};

export default Description;
