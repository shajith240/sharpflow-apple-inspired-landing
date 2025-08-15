import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import GradientText from "@/components/ui/gradient-text";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const TechStackSection = () => {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth <= 768 || "ontouchstart" in window;
  });

  // Enhanced mobile detection with performance considerations
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice =
        window.innerWidth <= 768 ||
        "ontouchstart" in window ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      setIsMobile(isMobileDevice);
    };

    // Check on mount
    checkMobile();

    // Check on resize with debouncing
    let resizeTimer: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 250);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", debouncedResize);
    };
  }, []);

  return (
    <section className="section-padding">
      <div className="container-padding">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <ScrollReveal delay={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-heading text-primary mb-12">
                What We're Using Inside
              </h2>
            </div>
          </ScrollReveal>

          {/* Technology Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Pinecone */}
            <ScrollReveal delay={0.2}>
              <div className="text-center py-6">
                <h3 className="text-xl lg:text-2xl text-primary mb-0 flex items-center justify-center gap-4">
                  RAG using{" "}
                  <GradientText
                    colors={[
                      "#22c55e",
                      "#16a34a",
                      "#15803d",
                      "#166534",
                      "#14532d",
                      "#22c55e",
                    ]}
                    animationSpeed={8}
                    className="inline"
                  >
                    <strong>Pinecone</strong>
                  </GradientText>
                  <img
                    src={
                      theme === "dark"
                        ? "/pinecone_white.svg"
                        : "/pinecone_black.svg"
                    }
                    alt="Pinecone"
                    className="w-10 h-10 lg:w-12 lg:h-12 object-contain transition-all duration-300 hover:scale-105 hover:opacity-90"
                  />
                </h3>
              </div>
            </ScrollReveal>

            {/* N8N */}
            <ScrollReveal delay={0.3}>
              <div className="text-center py-6">
                <h3 className="text-xl lg:text-2xl text-primary mb-0 flex items-center justify-center gap-4">
                  Constructed using{" "}
                  <GradientText
                    colors={[
                      "#ff6d6b",
                      "#ff8f6b",
                      "#ffb16b",
                      "#ffd36b",
                      "#fff56b",
                      "#ff6d6b",
                    ]}
                    animationSpeed={8}
                    className="inline"
                  >
                    <strong>n8n</strong>
                  </GradientText>
                  <img
                    src={theme === "dark" ? "/n8n-color.svg" : "/n8n_black.svg"}
                    alt="n8n"
                    className="w-10 h-10 lg:w-12 lg:h-12 object-contain transition-all duration-300 hover:scale-105 hover:opacity-90"
                  />
                </h3>
              </div>
            </ScrollReveal>

            {/* Gemini */}
            <ScrollReveal delay={0.4}>
              <div className="text-center py-6">
                <h3 className="text-xl lg:text-2xl text-primary mb-0 flex items-center justify-center gap-4">
                  Chat model by{" "}
                  <GradientText
                    colors={[
                      "#4285f4",
                      "#34a853",
                      "#ea4335",
                      "#fbbc05",
                      "#4285f4",
                    ]}
                    animationSpeed={6}
                    className="inline"
                  >
                    <strong>Gemini</strong>
                  </GradientText>
                  <img
                    src="/gemini-color.svg"
                    alt="Gemini"
                    className="w-10 h-10 lg:w-12 lg:h-12 object-contain transition-all duration-300 hover:scale-105 hover:opacity-90"
                  />
                </h3>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
