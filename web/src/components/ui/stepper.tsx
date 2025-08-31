"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface StepperContextType {
  currentStep: number;
  totalSteps: number;
  goToNext: () => void;
  goToPrevious: () => void;
  goToStep: (step: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isStepComplete: (step: number) => boolean;
  setStepComplete: (step: number, complete: boolean) => void;
}

const StepperContext = createContext<StepperContextType | undefined>(undefined);

export const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('useStepper must be used within a Stepper component');
  }
  return context;
};

interface StepperProps {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  backButtonText?: string;
  nextButtonText?: string;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  children,
  initialStep = 1,
  onStepChange,
  onFinalStepCompleted,
  backButtonText = "Previous",
  nextButtonText = "Next",
  className
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  const steps = React.Children.toArray(children).filter(
    child => React.isValidElement(child) && child.type === Step
  );
  
  const totalSteps = steps.length;

  const goToNext = () => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
      
      if (nextStep === totalSteps) {
        onFinalStepCompleted?.();
      }
    }
  };

  const goToPrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange?.(prevStep);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
      onStepChange?.(step);
    }
  };

  const isStepComplete = (step: number) => completedSteps.has(step);

  const setStepComplete = (step: number, complete: boolean) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (complete) {
        newSet.add(step);
      } else {
        newSet.delete(step);
      }
      return newSet;
    });
  };

  const contextValue: StepperContextType = {
    currentStep,
    totalSteps,
    goToNext,
    goToPrevious,
    goToStep,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    isStepComplete,
    setStepComplete,
  };

  return (
    <StepperContext.Provider value={contextValue}>
      <div className={cn("w-full", className)}>
        {/* Step Indicators */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((_, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = isStepComplete(stepNumber);
            
            return (
              <div key={stepNumber} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold border-2 transition-all duration-200",
                      isActive && "bg-primary text-primary-foreground border-primary shadow-lg",
                      isCompleted && "bg-green-500 text-white border-green-500 shadow-lg",
                      !isActive && !isCompleted && "bg-background text-muted-foreground border-border hover:border-primary/50"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  {stepNumber < totalSteps && (
                    <div
                      className={cn(
                        "w-20 h-1 mx-4 transition-all duration-200 rounded-full",
                        isCompleted ? "bg-green-500" : "bg-border"
                      )}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {steps[currentStep - 1]}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={goToPrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 h-12 px-6"
          >
            <ChevronLeft className="w-4 h-4" />
            {backButtonText}
          </Button>
          
          <Button
            onClick={goToNext}
            disabled={currentStep === totalSteps}
            className="flex items-center gap-2 h-12 px-6"
          >
            {nextButtonText}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </StepperContext.Provider>
  );
};

interface StepProps {
  children: ReactNode;
}

export const Step: React.FC<StepProps> = ({ children }) => {
  return <div className="w-full">{children}</div>;
};
