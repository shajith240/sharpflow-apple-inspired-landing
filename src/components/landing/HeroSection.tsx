import DarkVeil from "@/components/backgrounds/DarkVeil";
import { useTheme } from "next-themes";
import StarBorder from "@/components/ui/star-border";
import { Play, Sparkles, PhoneCall, Clock } from "lucide-react";
import { BookingDialog } from "@/components/ui/booking-dialog";
import { CAL_CONFIG } from "@/config/cal";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { AuroraEffect } from "@/components/ui/aurora-effect";

const HeroSection = () => {
  const { theme } = useTheme();

  return (
    <section
      id="hero"
      className="section-padding min-h-screen flex items-center relative"
    >
      {theme === "dark" ? <DarkVeil speed={1.5} /> : <AuroraEffect />}

      <div className="container-padding w-full">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-display text-primary mb-4 fade-in">
            Turn visitors into conversations
          </h1>

          <p className="text-body max-w-2xl mx-auto mb-6 fade-in fade-in-delay-1">
            SharpFlow integrates natural‑sounding voice agents into your website to
            answer questions, book appointments, and qualify leads—instantly and
            24/7.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-10 fade-in fade-in-delay-1">
            <HeroPill Icon={Sparkles} text="Human‑like voice" />
            <HeroPill Icon={PhoneCall} text="Answers in seconds" />
            <HeroPill Icon={Clock} text="24/7 availability" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in fade-in-delay-2">
            <BookingDialog calLink={CAL_CONFIG.fullLink}>
              <RainbowButton>Free Consultation</RainbowButton>
            </BookingDialog>
            <StarBorder
              as="button"
              className="h-11 px-8 py-2 font-medium hover:scale-105 transition-transform duration-200 inline-flex items-center justify-center rounded-xl bg-transparent text-primary hover:bg-accent/5"
              color="hsl(var(--accent))"
              speed="3s"
              thickness={2}
            >
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                See Our Work
              </div>
            </StarBorder>
          </div>
        </div>
      </div>
    </section>
  );
};

const HeroPill = ({ Icon, text }: { Icon: React.ComponentType<{ className?: string }>; text: string }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/50 px-3 py-1.5 text-sm text-foreground/80">
    <Icon className="w-4 h-4" />
    <span>{text}</span>
  </div>
);

export default HeroSection;
