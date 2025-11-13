import React, { useState, useRef, useEffect } from 'react';
import { OccurrenceType } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface MultiSelectTagInputProps {
  label: string;
  id: string;
  options: OccurrenceType[];
  selectedOptions: OccurrenceType[];
  onChange: (selected: OccurrenceType[]) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export const MultiSelectTagInput: React.FC<MultiSelectTagInputProps> = ({
  label,
  id,
  options,
  selectedOptions,
  onChange,
  error,
  placeholder = "Selecione um ou mais tipos...",
  required,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const removeOption = (option: OccurrenceType) => {
    onChange(selectedOptions.filter(o => o !== option));
  };

  const onOptionClicked = (option: OccurrenceType) => {
     if (selectedOptions.includes(option)) {
      onChange(selectedOptions.filter(o => o !== option));
    } else {
      onChange([...selectedOptions, option]);
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const errorClass = "border-red-500 ring-1 ring-red-500";
  const defaultClass = "border-gray-600 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-700 focus-within:ring-green-500 focus-within:border-green-500";


  return (
    <div ref={containerRef}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`flex flex-wrap items-center w-full gap-2 p-2 text-left bg-gray-700 border rounded-md shadow-sm min-h-[42px] cursor-pointer ${error ? errorClass : defaultClass}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {selectedOptions.length === 0 && <span className="text-gray-400 text-sm px-1">{placeholder}</span>}
          {selectedOptions.map(option => (
            <span key={option} className="flex items-center gap-1 bg-green-200 text-green-900 text-sm font-medium px-2 py-1 rounded-full">
              {option}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(option);
                }}
                className="rounded-full hover:bg-green-300"
                aria-label={`Remover ${option}`}
              >
                <CloseIcon className="h-4 w-4 text-green-800" />
              </button>
            </span>
          ))}
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
          </span>
        </div>
        
        {isOpen && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto" role="listbox">
            {options.map(option => (
              <li
                key={option}
                onClick={() => onOptionClicked(option)}
                className="px-4 py-2 text-sm text-gray-900 cursor-pointer hover:bg-green-50 flex items-center justify-between"
                role="option"
                aria-selected={selectedOptions.includes(option)}
              >
                {option}
                {selectedOptions.includes(option) && 
                    <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                }
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};