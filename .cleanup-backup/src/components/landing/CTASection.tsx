import Ballpit from '@/components/ui/ballpit';
import { BookingDialog } from "@/components/ui/booking-dialog";
import { CAL_CONFIG } from "@/config/cal";
import { useTheme } from "next-themes";
import { RainbowButton } from "@/components/ui/rainbow-button";

const CTASection = () => {
  const { theme } = useTheme();

  // Theme-aware colors for ballpit
  const ballColors = theme === 'dark'
    ? [0x333333, 0x0088ff, 0x00ccff, 0x66aaff, 0x4d79ff] // Brighter colors for dark theme
    : [0x1a1a1a, 0x0066ff, 0x00aaff, 0x4d79ff]; // Original colors for light theme

  return (
    <section className="section-padding bg-primary relative overflow-hidden cursor-none">
      {/* Ballpit Background - Full Coverage */}
      <div style={{
        position: 'absolute',
        inset: '0',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        opacity: '0.8',
        zIndex: 1,
        cursor: 'none'
      }}>
        <Ballpit
          count={150}
          gravity={0.7}
          friction={0.8}
          wallBounce={0.95}
          followCursor={true}
          colors={ballColors}
          className="cursor-none"
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
              <RainbowButton className="relative z-30 cursor-pointer">
                Book Your Call
              </RainbowButton>
            </BookingDialog>
            <a
              href="mailto:contact@sharpflow.com"
              className="text-primary-foreground px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/10 relative z-30 cursor-pointer"
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