import React, { useState, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface StepProps {
  children: ReactNode;
}

export const Step: React.FC<StepProps> = ({ children }) => {
  return <div className="step-content">{children}</div>;
};

interface StepperProps {
  children: React.ReactElement<StepProps>[];
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  backButtonText?: string;
  nextButtonText?: string;
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({
  children,
  initialStep = 1,
  onStepChange,
  onFinalStepCompleted,
  backButtonText = "Previous",
  nextButtonText = "Next",
  className = ""
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const totalSteps = children.length;

  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinalStepCompleted?.();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  return (
    <div className={`stepper-container ${className}`}>
      {/* Step Indicators */}
      <div className="flex items-center justify-center mb-8">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <React.Fragment key={stepNumber}>
              <motion.div
                className={`relative flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-all duration-300 ${
                  isCompleted
                    ? 'bg-accent text-accent-foreground'
                    : isActive
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                onClick={() => goToStep(stepNumber)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check size={16} />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="number"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-semibold"
                    >
                      {stepNumber}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Connection Line */}
              {index < totalSteps - 1 && (
                <div className="flex-1 h-px mx-4 relative">
                  <div className="absolute inset-0 bg-border"></div>
                  <motion.div
                    className="absolute inset-0 bg-accent origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ 
                      scaleX: stepNumber < currentStep ? 1 : 0 
                    }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="min-h-[200px] mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {children[currentStep - 1]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <motion.button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            currentStep === 1
              ? 'text-muted-foreground cursor-not-allowed'
              : 'text-primary hover:bg-primary/10'
          }`}
          whileHover={currentStep > 1 ? { scale: 1.02 } : {}}
          whileTap={currentStep > 1 ? { scale: 0.98 } : {}}
        >
          <ChevronLeft size={16} />
          {backButtonText}
        </motion.button>

        <div className="flex gap-2">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index + 1 === currentStep
                  ? 'bg-primary'
                  : index + 1 < currentStep
                  ? 'bg-accent'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <motion.button
          onClick={nextStep}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {currentStep === totalSteps ? 'Complete' : nextButtonText}
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </div>
  );
};

export default Stepper;