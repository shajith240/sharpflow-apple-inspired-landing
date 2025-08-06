const CTASection = () => {
  return (
    <section className="section-padding bg-primary">
      <div className="container-padding">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-heading text-primary-foreground mb-6 fade-in">
            Ready to Transform Your Business?
          </h2>
          <p className="text-body text-primary-foreground/80 mb-12 fade-in fade-in-delay-1">
            Join leading businesses that trust SharpFlow to automate their customer interactions. 
            Start your free trial today and experience the future of voice automation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in fade-in-delay-2">
            <button className="bg-background text-primary px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-background/90 hover:shadow-lg hover:scale-[1.02]">
              Start Free Trial
            </button>
            <button className="text-primary-foreground px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/10">
              Contact Sales
            </button>
          </div>
          
          <p className="text-caption text-primary-foreground/60 mt-8 fade-in fade-in-delay-3">
            No credit card required • 14-day free trial • Setup in minutes
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;