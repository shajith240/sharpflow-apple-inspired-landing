import { lazy, Suspense, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import StarBorder from "@/components/ui/star-border";
import { Play } from "lucide-react";
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
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      setIsMobile(isMobileDevice);

      // Load DarkVeil for most devices, with performance considerations
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
          <Suspense fallback={
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
          }>
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
      return <AuroraEffect />;
    }
  };

  return (
    <section
      id="hero"
      className="section-padding min-h-screen flex items-center relative"
    >
      {renderBackground()}

      <div className="container-padding w-full">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-display text-primary mb-6 fade-in">
            Let your website speak
          </h1>

          <p className="text-body max-w-2xl mx-auto mb-12 fade-in fade-in-delay-1">
            SharpFlow intigrate intelligent voice agents that handle customer
            calls, book appointments, and manage conversations with human-like
            precision.
          </p>

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

export default HeroSection;
