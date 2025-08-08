import Ballpit from '@/components/ui/ballpit';

const CTASection = () => {
  return (
    <section className="section-padding bg-primary relative overflow-hidden">
      {/* Ballpit Background */}
      <div style={{ position: 'absolute', inset: '0', overflow: 'hidden', minHeight: '500px', maxHeight: '500px', width: '100%', opacity: '0.6', zIndex: 1 }}>
        <Ballpit
          count={120}
          gravity={0.7}
          friction={0.8}
          wallBounce={0.95}
          followCursor={true}
          colors={[0x000000, 0x0066ff]}
        />
      </div>

      <div className="container-padding relative z-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-heading text-primary-foreground mb-6 fade-in">
            Ready to make you website talk?
          </h2>
          <p className="text-body text-primary-foreground/80 mb-12 fade-in fade-in-delay-1">
            Grab a plan to start now!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in fade-in-delay-2">
            <button className="bg-background text-primary px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-background/90 hover:shadow-lg hover:scale-[1.02] relative z-30">
              Buy now
            </button>
            <button className="text-primary-foreground px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/10 relative z-30">
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