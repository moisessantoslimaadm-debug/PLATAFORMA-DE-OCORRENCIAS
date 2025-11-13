import React from 'react';

interface CheckboxInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const CheckboxInput: React.FC<CheckboxInputProps> = ({ label, id, ...props }) => {
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        {...props}
        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
      />
      <label htmlFor={id} className="ml-2 block text-sm text-gray-900">
        {label}
      </label>
    </div>
  );
};