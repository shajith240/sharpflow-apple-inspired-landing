import { Building2, Stethoscope, Car, ShoppingBag, Home, Briefcase } from "lucide-react";

const UseCasesSection = () => {
  const useCases = [
    {
      icon: Stethoscope,
      title: "Healthcare",
      description: "Appointment scheduling, patient inquiries, and follow-up calls"
    },
    {
      icon: Car,
      title: "Automotive",
      description: "Service bookings, parts inquiries, and customer support"
    },
    {
      icon: ShoppingBag,
      title: "E-commerce",
      description: "Order tracking, product information, and customer service"
    },
    {
      icon: Home,
      title: "Real Estate",
      description: "Property inquiries, showing scheduling, and lead qualification"
    },
    {
      icon: Building2,
      title: "Professional Services",
      description: "Consultation booking, client intake, and information gathering"
    },
    {
      icon: Briefcase,
      title: "Financial Services",
      description: "Account inquiries, appointment scheduling, and basic support"
    }
  ];

  return (
    <section className="section-padding">
      <div className="container-padding">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-heading text-primary mb-6 fade-in">
            Use Cases
          </h2>
          <p className="text-body fade-in fade-in-delay-1">
            SharpFlow adapts to various industries and business needs, 
            providing tailored solutions for different sectors.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {useCases.map((useCase, index) => (
            <div 
              key={index}
              className={`fade-in fade-in-delay-${Math.floor(index / 2) + 1} bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300`}
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <useCase.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-subheading text-primary mb-3">
                {useCase.title}
              </h3>
              <p className="text-body">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;