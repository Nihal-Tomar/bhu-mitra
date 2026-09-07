import React from 'react';
import { CheckIcon, AlertCircleIcon, ClockIcon } from '../icons';

export interface StepItem {
  id: string;
  title: string;
  subtitle?: string;
  status: 'completed' | 'current' | 'upcoming' | 'error' | 'blocked';
  optional?: boolean;
}

export interface StepperProps {
  steps: StepItem[];
  activeStepId?: string;
  orientation?: 'horizontal' | 'vertical';
  onStepClick?: (step: StepItem) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  orientation = 'horizontal',
  onStepClick,
  className = '',
}) => {
  if (orientation === 'vertical') {
    return (
      <div className={`space-y-6 ${className}`}>
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;

          return (
            <div key={step.id} className="relative flex items-start gap-4">
              {/* Connector line */}
              {!isLast && (
                <div
                  className={`absolute left-4 top-8 -bottom-6 w-0.5 ${
                    step.status === 'completed' ? 'bg-[#046A38]' : 'bg-slate-200'
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Step indicator node */}
              <button
                type="button"
                disabled={!onStepClick}
                onClick={() => onStepClick?.(step)}
                className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-transform ${
                  onStepClick ? 'hover:scale-105' : 'cursor-default'
                } ${
                  step.status === 'completed'
                    ? 'bg-[#046A38] text-white shadow-xs'
                    : step.status === 'current'
                    ? 'bg-[#0A2540] text-white ring-4 ring-[#0A2540]/20'
                    : step.status === 'error'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-500 border border-slate-300'
                }`}
                aria-label={`Step ${idx + 1}: ${step.title} (${step.status})`}
              >
                {step.status === 'completed' ? (
                  <CheckIcon size={14} />
                ) : step.status === 'error' ? (
                  <AlertCircleIcon size={14} />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </button>

              <div className="flex-1 pt-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs sm:text-sm font-semibold ${
                      step.status === 'current' ? 'text-[#0A2540]' : 'text-slate-800'
                    }`}
                  >
                    {step.title}
                  </span>
                  {step.optional && (
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                      Optional
                    </span>
                  )}
                </div>
                {step.subtitle && (
                  <p className="text-[11px] text-slate-500 mt-0.5">{step.subtitle}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal Stepper
  return (
    <div className={`w-full overflow-x-auto pb-3 ${className}`}>
      <ol className="flex items-center min-w-max gap-2 sm:gap-4 text-xs" aria-label="Acquisition statutory progress">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;

          return (
            <li key={step.id} className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                disabled={!onStepClick}
                onClick={() => onStepClick?.(step)}
                className={`flex items-center gap-2 text-left group ${
                  onStepClick ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <span
                  className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    step.status === 'completed'
                      ? 'bg-[#046A38] text-white'
                      : step.status === 'current'
                      ? 'bg-[#0A2540] text-white ring-2 ring-amber-400'
                      : step.status === 'error'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                  aria-hidden="true"
                >
                  {step.status === 'completed' ? (
                    <CheckIcon size={13} />
                  ) : step.status === 'error' ? (
                    <AlertCircleIcon size={13} />
                  ) : step.status === 'current' ? (
                    <ClockIcon size={13} />
                  ) : (
                    idx + 1
                  )}
                </span>
                <div className="flex flex-col">
                  <span
                    className={`font-semibold line-clamp-1 ${
                      step.status === 'current'
                        ? 'text-[#0A2540]'
                        : step.status === 'completed'
                        ? 'text-slate-800'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.title}
                  </span>
                  {step.subtitle && (
                    <span className="text-[10px] text-slate-400 line-clamp-1">
                      {step.subtitle}
                    </span>
                  )}
                </div>
              </button>

              {!isLast && (
                <div
                  className={`w-6 sm:w-10 h-0.5 ${
                    step.status === 'completed' ? 'bg-[#046A38]' : 'bg-slate-200'
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};
