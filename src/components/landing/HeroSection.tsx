const HeroSection = () => {
  return (
    <section className="section-padding min-h-screen flex items-center">
      <div className="container-padding w-full">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-display text-primary mb-6 fade-in">
            Automate Your Business with
            <span className="block">AI Voice Agents</span>
          </h1>
          
          <p className="text-body max-w-2xl mx-auto mb-12 fade-in fade-in-delay-1">
            SharpFlow creates intelligent voice agents that handle customer calls, 
            book appointments, and manage conversations with human-like precision.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in fade-in-delay-2">
            <button className="btn-primary">
              Get Started Free
            </button>
            <button className="btn-ghost">
              Watch Demo
            </button>
          </div>
          
          <div className="mt-16 fade-in fade-in-delay-3">
            <p className="text-caption mb-4">Trusted by leading businesses</p>
            <div className="flex justify-center items-center space-x-12 opacity-40">
              <div className="h-8 w-20 bg-muted rounded"></div>
              <div className="h-8 w-20 bg-muted rounded"></div>
              <div className="h-8 w-20 bg-muted rounded"></div>
              <div className="h-8 w-20 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;