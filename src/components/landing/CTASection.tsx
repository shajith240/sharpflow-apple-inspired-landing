import Ballpit from '@/components/ui/ballpit';
import { BookingDialog } from "@/components/ui/booking-dialog";
import { CAL_CONFIG } from "@/config/cal";

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
            Ready to transform your customer experience?
          </h2>
          <p className="text-body text-primary-foreground/80 mb-12 fade-in fade-in-delay-1">
            Let's discuss how voice AI can revolutionize your business!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in fade-in-delay-2">
            <BookingDialog calLink={CAL_CONFIG.fullLink}>
              <button className="bg-background text-primary px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-background/90 hover:shadow-lg hover:scale-[1.02] relative z-30">
                Book Your Call
              </button>
            </BookingDialog>
            <a
              href="mailto:contact@sharpflow.com"
              className="text-primary-foreground px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/10 relative z-30"
            >
              Send Email
            </a>
          </div>

          <p className="text-caption text-primary-foreground/60 mt-8 fade-in fade-in-delay-3">
            Free consultation • Custom solutions • Expert guidance
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;