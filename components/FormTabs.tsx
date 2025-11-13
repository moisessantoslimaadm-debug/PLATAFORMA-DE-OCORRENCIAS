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
    <div className="border-b border-gray-200/80">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
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
              className={`group inline-flex shrink-0 items-center gap-x-2.5 rounded-t-lg border-b-2 px-1 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                isCurrent
                  ? 'border-emerald-500 text-emerald-600'
                  : isClickable
                  ? 'border-transparent text-gray-500 hover:border-gray-400 hover:text-gray-700'
                  : 'border-transparent text-gray-400 cursor-not-allowed'
              }`}
              aria-current={isCurrent ? 'page' : undefined}
            >
              {isCompleted ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckIcon className="h-5 w-5" />
                </span>
              ) : (
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    isCurrent ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNumber}
                </span>
              )}
              <span className="hidden sm:inline-block">{step.description}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
