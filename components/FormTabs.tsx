import React from 'react';
import { CheckIcon } from './icons/CheckIcon';

interface FormTabsProps {
  steps: { name: string; description: string }[];
  currentStep: number;
  visitedSteps: Set<number>;
  setCurrentStep: (step: number) => void;
}

export const FormTabs: React.FC<FormTabsProps> = ({ steps, currentStep, visitedSteps, setCurrentStep }) => {
  return (
    <nav className="flex flex-col space-y-1" aria-label="Tabs">
      {steps.map((step, stepIdx) => {
        const stepNumber = stepIdx + 1;
        const isCompleted = visitedSteps.has(stepNumber) && stepNumber !== currentStep;
        const isCurrent = stepNumber === currentStep;
        const isClickable = visitedSteps.has(stepNumber);

        const handleTabClick = () => {
          if (isClickable) {
            setCurrentStep(stepNumber);
          }
        };

        return (
          <button
            key={step.name}
            onClick={handleTabClick}
            disabled={!isClickable}
            className={`group w-full flex items-center gap-x-3 rounded-md border-l-4 p-3 text-sm font-medium text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
              isCurrent
                ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                : isClickable
                ? 'border-transparent text-gray-500 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50'
                : 'border-transparent text-gray-400 cursor-not-allowed'
            }`}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {isCompleted ? (
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <CheckIcon className="h-5 w-5" />
              </span>
            ) : (
              <span
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  isCurrent ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stepNumber}
              </span>
            )}
            <span className="flex flex-col">
              <span className="font-semibold">{step.name}</span>
              <span className={`text-xs ${isCurrent ? 'text-emerald-600' : isClickable ? 'text-gray-500' : 'text-gray-400'}`}>{step.description}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
};
