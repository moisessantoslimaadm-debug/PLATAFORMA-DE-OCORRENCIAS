import React from 'react';

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  error?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({ label, id, children, error, className, ...props }) => {
  const errorClass = "border-red-500 focus:border-red-500 focus:ring-red-500";
  const defaultClass = "border-gray-600 focus:border-green-500 focus:ring-green-500";
  
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        {...props}
        className={`block w-full px-3 py-2 bg-gray-700 text-gray-200 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-700 sm:text-sm ${error ? errorClass : defaultClass} ${className || ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        {children}
      </select>
       {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};