import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Sparkles } from "lucide-react";
import GradientText from "@/components/ui/gradient-text";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { AnimatedBackground } from "@/components/ui/animated-blur-blob-background";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Animated Blur Background Effect */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
        {/* 404 Number with Sparkles */}
        <div className="relative mb-8">
          <div className="absolute -top-4 -left-4 text-accent/30">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <div className="absolute -bottom-4 -right-4 text-accent/30">
            <Sparkles className="w-6 h-6 animate-pulse delay-300" />
          </div>
          <h1 className="text-9xl md:text-[12rem] font-bold mb-4">
            <GradientText
              colors={[
                "#ff6b6b",
                "#4ecdc4",
                "#45b7d1",
                "#96ceb4",
                "#feca57",
                "#ff6b6b",
              ]}
              animationSpeed={6}
              className="text-9xl md:text-[12rem]"
            >
              404
            </GradientText>
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's
            get you back to where the magic happens.
          </p>
          <p className="text-sm text-muted-foreground/70 font-mono bg-muted/30 px-3 py-1 rounded-md inline-block">
            Route: {location.pathname}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/">
            <RainbowButton className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </RainbowButton>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm text-primary hover:bg-accent/10 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* SharpFlow Branding */}
        <div className="mt-12 pt-8 border-t border-border/30">
          <p className="text-sm text-muted-foreground">
            Powered by{" "}
            <GradientText
              colors={["#ff6b6b", "#4ecdc4", "#45b7d1"]}
              className="font-semibold"
            >
              SharpFlow
            </GradientText>
          </p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent/20 rounded-full animate-bounce delay-100" />
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-accent/30 rounded-full animate-bounce delay-300" />
      <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-accent/40 rounded-full animate-bounce delay-500" />
    </div>
  );
};

export default NotFound;
