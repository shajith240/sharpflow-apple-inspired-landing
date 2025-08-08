import { useState } from 'react';
import Stepper, { Step } from '@/components/ui/Stepper';
import { Settings, Brain, Zap, Rocket } from 'lucide-react';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const HowItWorksSection = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const stepIcons = [Settings, Brain, Zap, Rocket];

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleFinalStepCompleted = () => {
    console.log("All steps completed! Ready to get started!");
  };

  return (
    <section className="section-padding bg-surface-subtle">
      <div className="container-padding">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-heading text-primary mb-6 fade-in">
            How It Works
          </h2>
          <p className="text-body fade-in fade-in-delay-1">
            Get your AI voice agents up and running in four simple steps,
            with full support throughout the process.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={3}
            />
            <div className="relative overflow-hidden rounded-xl border-[0.75px] bg-background shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)]">
              <Stepper
                initialStep={1}
                onStepChange={handleStepChange}
                onFinalStepCompleted={handleFinalStepCompleted}
                backButtonText="Previous Step"
                nextButtonText="Next Step"
                className="bg-transparent p-8"
              >
                <Step>
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                      <Settings className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-subheading text-primary mb-4">
                        Setup & Configuration
                      </h3>

                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                      <strong>What we'll do:</strong> Analyze your needs, configure agent parameters,
                      and set up your custom knowledge base.
                    </div>
                  </div>
                </Step>

                <Step>
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                      <Brain className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-subheading text-primary mb-4">
                        AI Training
                      </h3>

                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                      <strong>What we'll do:</strong> Train the AI model, optimize response accuracy,
                      and fine-tune conversation flows.
                    </div>
                  </div>
                </Step>

                <Step>
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                      <Zap className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-subheading text-primary mb-4">
                        Integration
                      </h3>

                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                      <strong>What we'll do:</strong> Implement the agent on your platform,
                      configure API endpoints, and ensure smooth operation.
                    </div>
                  </div>
                </Step>

                <Step>
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                      <Rocket className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-subheading text-primary mb-4">
                        Launch & Monitor
                      </h3>

                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                      <strong>What we'll do:</strong> Deploy to production, conduct live testing,
                      and provide continuous monitoring and support.
                    </div>
                  </div>
                </Step>
              </Stepper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;