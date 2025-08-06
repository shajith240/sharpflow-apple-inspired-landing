const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Setup & Configuration",
      description: "Define your business requirements and customize your AI agent's personality, knowledge base, and workflows."
    },
    {
      number: "02", 
      title: "Integration",
      description: "Connect SharpFlow to your existing phone system, CRM, and business tools with our simple API integrations."
    },
    {
      number: "03",
      title: "Training & Testing",
      description: "Our AI learns your business processes and we test the system to ensure optimal performance before going live."
    },
    {
      number: "04",
      title: "Launch & Monitor",
      description: "Deploy your AI voice agents and monitor performance with real-time analytics and continuous optimization."
    }
  ];

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
          <div className="grid lg:grid-cols-2 gap-12">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`fade-in fade-in-delay-${index + 1} relative`}
              >
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-accent text-accent-foreground rounded-xl flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-subheading text-primary mb-3">
                      {step.title}
                    </h3>
                    <p className="text-body">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {/* Connection line for desktop */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-6 -right-6 w-12 h-px bg-border"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;