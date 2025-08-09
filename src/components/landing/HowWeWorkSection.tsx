"use client";

import { Phone, FileText, Code, Zap, Globe, CreditCard } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

const HowWeWorkSection = () => {
    const workflowSteps = [
        {
            icon: Phone,
            step: "01",
            title: "Discovery Call",
            description: "We start with a detailed consultation call to understand your business needs, gather requirements, and identify the perfect plan that suits your specific use case."
        },
        {
            icon: FileText,
            step: "02",
            title: "Requirements Analysis",
            description: "Our team analyzes your requirements and creates a comprehensive plan outlining how our voice agent will integrate with your existing systems and workflows."
        },
        {
            icon: Code,
            step: "03",
            title: "Backend Development",
            description: "We develop a custom backend script tailored to your specific requirements, ensuring seamless integration with your business processes and data systems."
        },
        {
            icon: Zap,
            step: "04",
            title: "Voice Agent Setup",
            description: "Using ElevenLabs voice technology, we create and configure your personalized voice agent, connecting it to our custom backend script for optimal performance."
        },
        {
            icon: Globe,
            step: "05",
            title: "Website Integration",
            description: "We integrate the voice agent directly into your website using your GitHub repository link, ensuring smooth deployment and functionality across all pages."
        },
        {
            icon: CreditCard,
            step: "06",
            title: "Launch & Billing",
            description: "After successful integration and testing, we launch your voice agent. You'll be charged a one-time installation fee plus ongoing monthly subscription fees."
        }
    ];

    return (
        <section className="section-padding">
            <div className="container-padding">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-heading text-primary mb-6 fade-in">
                        How We Work
                    </h2>
                    <p className="text-body fade-in fade-in-delay-1">
                        Our streamlined process ensures seamless integration of voice agents into your website,
                        from initial consultation to full deployment and ongoing support.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto">
                    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-2 lg:gap-6">
                        {workflowSteps.map((step, index) => (
                            <WorkflowItem
                                key={index}
                                icon={step.icon}
                                stepNumber={step.step}
                                title={step.title}
                                description={step.description}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

interface WorkflowItemProps {
    icon: React.ComponentType<{ className?: string }>;
    stepNumber: string;
    title: string;
    description: string;
}

const WorkflowItem = ({ icon: Icon, stepNumber, title, description }: WorkflowItemProps) => {
    return (
        <li className="min-h-[16rem] list-none">
            <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
                <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={3}
                />
                <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
                    <div className="relative flex flex-1 flex-col justify-between gap-4">
                        {/* Step Number - Top Right Corner */}
                        <div className="absolute top-0 right-0 w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
                            <span className="text-xs font-semibold text-foreground">{stepNumber}</span>
                        </div>

                        {/* Icon */}
                        <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-3">
                            <Icon className="h-6 w-6" />
                        </div>

                        {/* Content */}
                        <div className="space-y-3">
                            <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                                {title}
                            </h3>
                            <p className="font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default HowWeWorkSection;