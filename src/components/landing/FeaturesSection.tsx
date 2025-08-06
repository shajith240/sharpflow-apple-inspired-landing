import { Brain, Clock, Shield, BarChart3 } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "Advanced AI Intelligence",
      description: "Natural language processing that understands context, intent, and emotions for human-like conversations."
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Never miss a call or opportunity. Your AI agents work around the clock without breaks or downtime."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and compliance standards to protect your business and customer data."
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Comprehensive insights and performance metrics to optimize your voice automation strategy."
    }
  ];

  return (
    <section className="section-padding">
      <div className="container-padding">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-heading text-primary mb-6 fade-in">
            Key Features
          </h2>
          <p className="text-body fade-in fade-in-delay-1">
            Built with cutting-edge technology to deliver exceptional performance 
            and reliability for your business needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`fade-in fade-in-delay-${index + 1} flex gap-6`}
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-subheading text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-body">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;