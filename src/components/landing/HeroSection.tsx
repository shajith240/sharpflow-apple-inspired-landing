import DarkVeil from "@/components/backgrounds/DarkVeil";
import { useTheme } from "next-themes";
import StarBorder from "@/components/ui/star-border";
import { Play } from "lucide-react";

const HeroSection = () => {
  const { theme } = useTheme();

  return (
    <section className="section-padding min-h-screen flex items-center relative">
      {theme === 'dark' && <DarkVeil speed={1.5} />}

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
            <button className="btn-primary">Get Started Free</button>
            <StarBorder
              as="button"
              className="hover:scale-105 transition-transform duration-200"
              color="hsl(var(--accent))"
              speed="3s"
              thickness={2}
            >
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Watch Demo
              </div>
            </StarBorder>
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
