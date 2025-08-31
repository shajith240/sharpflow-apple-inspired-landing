import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import LogoLoop from "../../blocks/Animations/LogoLoop/LogoLoop";
import GradientText from "@/components/ui/gradient-text";

const TechStackLoop = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const logos = [
    {
      node: (
        <div className="flex items-center gap-3">
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
            className="text-2xl font-bold"
          >
            Pinecone
          </GradientText>
          <img
            src={
              theme === "dark" ? "/pinecone_white.svg" : "/pinecone_black.svg"
            }
            alt="Pinecone"
            className="w-8 h-8 object-contain"
          />
        </div>
      ),
    },
    {
      node: (
        <div className="flex items-center gap-3">
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
            className="text-2xl font-bold"
          >
            n8n
          </GradientText>
          <img
            src={theme === "dark" ? "/n8n-color.svg" : "/n8n_black.svg"}
            alt="n8n"
            className="w-8 h-8 object-contain"
          />
        </div>
      ),
    },
    {
      node: (
        <div className="flex items-center gap-3">
          <GradientText
            colors={["#4285f4", "#34a853", "#ea4335", "#fbbc05", "#4285f4"]}
            animationSpeed={6}
            className="text-2xl font-bold"
          >
            Gemini
          </GradientText>
          <img
            src="/gemini-color.svg"
            alt="Gemini"
            className="w-8 h-8 object-contain"
          />
        </div>
      ),
    },
  ];

  return (
    <section id="tech-stack" className="section-padding">
      <div className="container-padding">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-heading text-primary mb-8">
              What We're Using Inside
            </h2>
          </div>

          <LogoLoop
            logos={logos}
            speed={60}
            direction="left"
            logoHeight={40}
            gap={80}
            pauseOnHover={true}
            fadeOut={true}
            scaleOnHover={true}
            className="py-8"
          />
        </div>
      </div>
    </section>
  );
};

export default TechStackLoop;
