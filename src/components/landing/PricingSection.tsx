import { Pricing } from "@/components/ui/pricing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      price: "1999",
      yearlyPrice: "1599", // 20% discount
      period: "month",
      description: "Perfect for small businesses starting with voice automation",
      features: [
        "~300 voice minutes/month",
        "Query Bot functionality",
        "1 Website integration",
        "Fixed script templates",
        "Email support",
        "Basic analytics"
      ],
      buttonText: "Get Started",
      href: "#contact",
      isPopular: false
    },
    {
      name: "Growth",
      price: "3999",
      yearlyPrice: "3199", // 20% discount
      period: "month",
      description: "Ideal for growing businesses with appointment booking needs",
      features: [
        "~750 voice minutes/month",
        "Query + Appointment booking",
        "1 Website integration",
        "Custom booking rules",
        "Priority support",
        "Advanced analytics",
        "Custom voice training",
        "API access"
      ],
      buttonText: "Start Growing",
      href: "#contact",
      isPopular: true
    },
    {
      name: "Pro",
      price: "6999",
      yearlyPrice: "5599", // 20% discount
      period: "month",
      description: "Complete automation solution for established businesses",
      features: [
        "1500+ voice minutes/month",
        "Fully custom AI agent",
        "Up to 3 site integrations",
        "Full logic customization",
        "Dedicated support + Dashboard",
        "WhatsApp integration",
        "CRM integration",
        "Custom analytics",
        "24/7 phone support"
      ],
      buttonText: "Go Pro",
      href: "#contact",
      isPopular: false
    }
  ];

  return (
    <section id="pricing" className="pt-8 pb-20 lg:pt-16 lg:pb-32 bg-gradient-to-b from-background to-surface-subtle">
      <div className="container-padding">
        <Pricing
          plans={plans}
          title="Simple, Transparent Pricing"
          description="Choose the perfect plan for your business. Scale as you grow with our flexible pricing options.
All plans include access to our platform, lead generation tools, and dedicated support."
        />

      </div>
    </section>
  );
};

export default PricingSection;