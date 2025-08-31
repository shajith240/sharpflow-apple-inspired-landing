import { BookingDialog } from "@/components/ui/booking-dialog";
import { CAL_CONFIG } from "@/config/cal";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import PixelBlast from "../../blocks/Backgrounds/PixelBlast/PixelBlast";

const CTASection = () => {
  return (
    <section
      id="contact"
      className="section-padding bg-primary relative overflow-hidden"
    >
      {/* PixelBlast Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="#22d3ee"
          patternScale={2}
          patternDensity={1.2}
          enableRipples={true}
          rippleIntensityScale={1.5}
          rippleSpeed={0.5}
          speed={0.4}
          edgeFade={0.2}
          transparent={true}
        />
      </div>

      <div className="container-padding relative z-20">
        <ScrollReveal className="max-w-3xl mx-auto text-center">
          <h2 className="text-heading text-primary-foreground mb-6">
            Ready to transform your customer experience?
          </h2>
          <p className="text-body text-primary-foreground/80 mb-12">
            Let's discuss how voice AI can revolutionize your business!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <BookingDialog calLink={CAL_CONFIG.fullLink}>
              <RainbowButton className="!bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] !text-black dark:!bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] dark:!text-white">
                Book Your Call
              </RainbowButton>
            </BookingDialog>
            <a
              href="mailto:contact@sharpflow.com"
              className="inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 text-primary-foreground border border-primary-foreground/30 bg-primary-foreground/10 hover:bg-primary-foreground/20"
              aria-label="Send us an email"
            >
              Send Email
            </a>
          </div>

          <p className="text-caption text-primary-foreground/60 mt-8">
            Free consultation • Custom solutions • Expert guidance
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTASection;
