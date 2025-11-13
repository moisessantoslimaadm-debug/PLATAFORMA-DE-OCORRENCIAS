
import React from 'react';

interface TagProps {
  text: string;
  color: string;
}

export const Tag: React.FC<TagProps> = ({ text, color }) => {
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
      {text}
    </span>
  );
};
