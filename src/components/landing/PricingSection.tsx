import { Check } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      badge: "🟢",
      price: "₹1,999",
      period: "/ month",
      description: "Perfect for small businesses starting with voice automation",
      features: [
        "~300 voice minutes/month",
        "Query Bot functionality",
        "1 Website integration",
        "Fixed script templates",
        "Email support"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Growth",
      badge: "🟡",
      price: "₹3,999",
      period: "/ month",
      description: "Ideal for growing businesses with appointment booking needs",
      features: [
        "~750 voice minutes/month",
        "Query + Appointment booking",
        "1 Website integration",
        "Custom booking rules",
        "Priority support"
      ],
      cta: "Start Growing",
      popular: true
    },
    {
      name: "Pro",
      badge: "🔵",
      price: "₹6,999+",
      period: "/ month",
      description: "Complete automation solution for established businesses",
      features: [
        "1500+ voice minutes/month",
        "Fully custom AI agent",
        "Up to 3 site integrations",
        "Full logic customization",
        "Dedicated support + Dashboard"
      ],
      cta: "Go Pro",
      popular: false
    }
  ];

  return (
    <section className="section-padding bg-surface-subtle">
      <div className="container-padding">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-heading text-primary mb-6 fade-in">
            Simple, Transparent Pricing
          </h2>
          <p className="text-body fade-in fade-in-delay-1">
            Plans built for small businesses to grow with automation.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`fade-in fade-in-delay-${index + 1} relative bg-card border border-border rounded-2xl p-8 ${
                plan.popular ? 'ring-2 ring-accent' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">{plan.badge}</span>
                  <h3 className="text-subheading text-primary">{plan.name}</h3>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-body">{plan.period}</span>
                </div>
                <p className="text-caption">{plan.description}</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-body text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                  plan.popular 
                    ? 'bg-accent text-accent-foreground hover:bg-accent/90' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                } hover:scale-[1.02]`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
        
        <div className="max-w-2xl mx-auto text-center mt-12">
          <p className="text-caption fade-in fade-in-delay-3">
            For Custom voice, WhatsApp, CRM, or analytics available as add-ons.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;