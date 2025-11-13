
import React from 'react';

// FIX: The label prop is made optional to allow usage without a visible label, especially inside a fieldset with a legend.
interface TextAreaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  id: string;
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      {/* FIX: The label is only rendered if the prop is provided, preventing empty label tags. */}
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>}
      <textarea
        id={id}
        {...props}
        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
      ></textarea>
    </div>
  );
};
