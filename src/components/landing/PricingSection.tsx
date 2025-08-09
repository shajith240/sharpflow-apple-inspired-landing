import { Pricing } from "@/components/ui/pricing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "@/components/ui/booking-dialog";
import { CAL_CONFIG } from "@/config/cal";

const PricingSection = () => {
  const plans = [
    {
      name: "Basic Package",
      price: "Starting from ₹1,999",
      yearlyPrice: "Custom Quote",
      period: "",
      description: "Perfect for small businesses starting with voice automation",
      features: [
        "Free consultation call",
        "Query Bot functionality",
        "1 Website integration",
        "Custom script development",
        "Email support",
        "Basic analytics setup"
      ],
      buttonText: "Schedule Consultation",
      href: "#contact",
      isPopular: false
    },
    {
      name: "Growth Package",
      price: "Starting from ₹3,999",
      yearlyPrice: "Custom Quote",
      period: "",
      description: "Ideal for growing businesses with appointment booking needs",
      features: [
        "Free consultation call",
        "Query + Appointment booking",
        "1 Website integration",
        "Custom booking logic",
        "Priority support",
        "Advanced analytics",
        "Custom voice training",
        "API integration"
      ],
      buttonText: "Schedule Consultation",
      href: "#contact",
      isPopular: true
    },
    {
      name: "Enterprise Package",
      price: "Starting from ₹6,999",
      yearlyPrice: "Custom Quote",
      period: "",
      description: "Complete automation solution for established businesses",
      features: [
        "Free consultation call",
        "Fully custom AI agent",
        "Multiple site integrations",
        "Full logic customization",
        "Dedicated support + Dashboard",
        "WhatsApp integration",
        "CRM integration",
        "Custom analytics",
        "24/7 phone support"
      ],
      buttonText: "Schedule Consultation",
      href: "#contact",
      isPopular: false
    }
  ];

  return (
    <section id="pricing" className="pt-8 pb-20 lg:pt-16 lg:pb-32 bg-gradient-to-b from-background to-surface-subtle">
      <div className="container-padding">
        <Pricing
          plans={plans}
          title="Service Packages"
          description="Custom solutions tailored to your business needs. Every package includes a free consultation to understand your requirements and provide accurate pricing.
Final pricing determined after consultation based on your specific needs."
          renderButton={(plan, buttonClassName) => (
            <BookingDialog calLink={CAL_CONFIG.fullLink}>
              <button className={buttonClassName}>
                {plan.buttonText}
              </button>
            </BookingDialog>
          )}
        />

      </div>
    </section>
  );
};

export default PricingSection;