import React from 'react';

interface StepperProps {
  steps: { name: string; description: string }[];
  currentStep: number; // 1-based index
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, stepIdx) => {
          const stepNumber = stepIdx + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <li key={step.name} className="md:flex-1">
              {isCompleted ? (
                <div className="group flex w-full flex-col border-l-4 border-emerald-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-emerald-600 transition-colors">{step.name}</span>
                  <span className="text-sm font-medium text-gray-500">{step.description}</span>
                </div>
              ) : isCurrent ? (
                <div
                  className="flex w-full flex-col border-l-4 border-emerald-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-emerald-600">{step.name}</span>
                  <span className="text-sm font-medium text-gray-500">{step.description}</span>
                </div>
              ) : (
                <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors hover:border-gray-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-gray-500 transition-colors">{step.name}</span>
                  <span className="text-sm font-medium text-gray-500">{step.description}</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};