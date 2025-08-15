import { lazy, Suspense, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import StarBorder from "@/components/ui/star-border";
import { Play, Sparkles, PhoneCall, Clock } from "lucide-react";
import { BookingDialog } from "@/components/ui/booking-dialog";
import { CAL_CONFIG } from "@/config/cal";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { AuroraEffect } from "@/components/ui/aurora-effect";

// Dynamically import DarkVeil only for desktop
const DarkVeil = lazy(() => import("@/components/backgrounds/DarkVeil"));

const HeroSection = () => {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(true); // Default to mobile for SSR
  const [shouldLoadDarkVeil, setShouldLoadDarkVeil] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const isMobileDevice =
        window.innerWidth <= 768 ||
        "ontouchstart" in window ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      setIsMobile(isMobileDevice);

      // Load DarkVeil for most devices, with performance considerations
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // Always load for desktop
        if (!isMobileDevice && window.innerWidth >= 1024) {
          setShouldLoadDarkVeil(true);
        }
        // Load for mobile only if device has reasonable performance
        else if (isMobileDevice) {
          const hasReasonablePerformance =
            navigator.hardwareConcurrency >= 2 && // At least 2 CPU cores
            window.devicePixelRatio <= 3; // Not ultra-high DPI

          setShouldLoadDarkVeil(hasReasonablePerformance);
        }
      }
    };

    const timer = setTimeout(checkDevice, 100);

    let resizeTimer: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkDevice, 250);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", debouncedResize);
    };
  }, []);

  const renderBackground = () => {
    if (theme === "dark") {
      if (shouldLoadDarkVeil) {
        return (
          <Suspense
            fallback={
              <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
            }
          >
            <DarkVeil speed={isMobile ? 0.8 : 1.5} />
          </Suspense>
        );
      } else {
        // Fallback gradient for devices that can't handle DarkVeil
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
        );
      }
    } else {
      // Light theme background with enhanced visibility
      return (
        <div className="absolute inset-0 -z-10">
          {/* Base gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80" />
          {/* Aurora effect overlay */}
          <AuroraEffect className="opacity-60" />
          {/* Additional subtle pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100/30 to-transparent" />
        </div>
      );
    }
  };

  return (
    <section
      id="hero"
      className="section-padding min-h-screen flex items-center relative"
    >
      {renderBackground()}

      <div className="container-padding w-full relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-display text-primary mb-4 fade-in relative z-20">
            Turn visitors into conversations
          </h1>

          <p className="text-body max-w-2xl mx-auto mb-6 fade-in fade-in-delay-1">
            SharpFlow integrates natural‑sounding voice agents into your website
            to answer questions, book appointments, and qualify leads—instantly
            and 24/7.
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

const HeroPill = ({
  Icon,
  text,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  text: string;
}) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/50 px-3 py-1.5 text-sm text-foreground/80">
    <Icon className="w-4 h-4" />
    <span>{text}</span>
  </div>
);

export default HeroSection;
