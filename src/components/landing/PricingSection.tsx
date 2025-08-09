import { Pricing } from "@/components/ui/pricing";

const PricingSection = () => {
  const plans = [
    {
      name: "Starter Plan",
      price: "89",
      yearlyPrice: "71",
      period: "month",
      description: "Perfect for small businesses starting with voice automation",
      features: [
        "50 minutes of voice interactions/month",
        "Basic voice agent setup",
        "Website integration",
        "Custom workflow creation",
        "Email support",
        "Monthly usage analytics",
        "$249 one-time setup fee"
      ],
      buttonText: "Get Started",
      href: "#contact",
      isPopular: false
    },
    {
      name: "Professional Plan",
      price: "159",
      yearlyPrice: "127",
      period: "month",
      description: "Ideal for growing businesses with higher interaction needs",
      features: [
        "250 minutes of voice interactions/month",
        "Advanced voice agent with personality",
        "Website integration",
        "Complex workflow automation",
        "Priority support",
        "Detailed analytics & reporting",
        "Custom voice training",
        "Multiple integration options",
        "$249 one-time setup fee"
      ],
      buttonText: "Get Started",
      href: "#contact",
      isPopular: true
    },
    {
      name: "Enterprise Plan",
      price: "449",
      yearlyPrice: "359",
      period: "month",
      description: "Complete solution for businesses with high-volume needs",
      features: [
        "3,600 minutes of voice interactions/month",
        "Premium voice agent with full customization",
        "Multiple website integrations",
        "Advanced workflow automation",
        "Dedicated support manager",
        "Real-time analytics dashboard",
        "Custom integrations",
        "24/7 priority support",
        "$249 one-time setup fee"
      ],
      buttonText: "Contact Sales",
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
          description="Choose the plan that fits your business needs. All plans include setup, integration, and ongoing support. Start with our consultation to determine the best fit for your requirements."
          renderButton={() => null}
        />

      </div>
    </section>
  );
};

export default PricingSection;