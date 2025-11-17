import React from 'react';

interface Step {
  id: number;
  title: string;
}

interface FormProgressProps {
  steps: Step[];
  currentStep: number;
}

const FormProgress: React.FC<FormProgressProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full px-4 py-6">
      {/* Progress Bar */}
      <div className="relative">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
          <div
            style={{ width: `${((currentStep) / steps.length) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600 transition-all duration-500"
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex justify-between">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-semibold transition-all duration-300
                ${
                  step.id < currentStep
                    ? 'bg-green-600 border-green-600 text-white'
                    : step.id === currentStep
                    ? 'bg-red-600 border-red-600 text-white ring-4 ring-red-200'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
            >
              {step.id < currentStep ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.id
              )}
            </div>
            <div className={`mt-2 text-xs font-medium text-center hidden md:block
              ${step.id === currentStep ? 'text-red-600' : 'text-gray-500'}`}>
              {step.title}
            </div>
          </div>
        ))}
      </div>

      {/* Current Step Title (Mobile) */}
      <div className="md:hidden text-center mt-4">
        <p className="text-sm font-semibold text-red-600">{steps[currentStep - 1].title}</p>
        <p className="text-xs text-gray-500">Step {currentStep} of {steps.length}</p>
      </div>
    </div>
  );
};

export default FormProgress;
