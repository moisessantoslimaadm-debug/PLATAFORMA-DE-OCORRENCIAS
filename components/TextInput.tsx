
import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ label, id, error, className, ...props }) => {
  const errorClass = "border-red-500 focus:border-red-500 focus:ring-red-500";
  const defaultClass = "border-gray-300 focus:border-lime-500 focus:ring-lime-500";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        id={id}
        {...props}
        className={`block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${error ? errorClass : defaultClass} ${className || ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};