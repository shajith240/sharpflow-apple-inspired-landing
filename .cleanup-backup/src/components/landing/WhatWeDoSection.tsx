import { Phone, MessageSquare, Calendar, Zap } from "lucide-react";

const WhatWeDoSection = () => {
  return (
    <section className="section-padding bg-surface-subtle">
      <div className="container-padding">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-heading text-primary mb-6 fade-in">
            What SharpFlow Does
          </h2>
          <p className="text-body fade-in fade-in-delay-1">
            We integrate AI voice agents seamlessly into your business operations, 
            handling customer interactions with natural conversation and intelligent automation.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="text-center fade-in fade-in-delay-1">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-subheading text-primary mb-2">Answer Calls</h3>
            <p className="text-caption">
              Handle inbound calls 24/7 with natural conversation
            </p>
          </div>
          
          <div className="text-center fade-in fade-in-delay-2">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-subheading text-primary mb-2">Engage Customers</h3>
            <p className="text-caption">
              Provide instant support and information with AI with maximum presission.
            </p>
          </div>
          
          <div className="text-center fade-in fade-in-delay-3">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-subheading text-primary mb-2">Book Appointments</h3>
            <p className="text-caption">
              Schedule meetings and appointments automatically
            </p>
          </div>
          
          <div className="text-center fade-in fade-in-delay-3">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-subheading text-primary mb-2">Automate Tasks</h3>
            <p className="text-caption">
              Streamline workflows and reduce manual operations
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;