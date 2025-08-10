import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import ChromaGrid, { ChromaItem } from "../../react bits/ChromaGrid/ChromaGrid";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import DarkVeil from "@/components/backgrounds/DarkVeil";
import { AuroraEffect } from "@/components/ui/aurora-effect";
import Ballpit from "@/components/ui/ballpit";
import { BookingDialog } from "@/components/ui/booking-dialog";
import { CAL_CONFIG } from "@/config/cal";
import { RainbowButton } from "@/components/ui/rainbow-button";
import {
    getDevicePerformanceProfile,
    PerformanceProfile,
} from "@/lib/performance-utils";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Target, Eye } from "lucide-react";

// Mobile-optimized founder cards component
const MobileFounderCards = ({ founders }: { founders: ChromaItem[] }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {founders.map((founder, index) => (
                <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:scale-105"
                    style={{
                        borderColor: founder.borderColor || '#3B82F6',
                        background: founder.gradient
                    }}
                >
                    <div className="p-4">
                        <img
                            src={founder.image}
                            alt={founder.title}
                            className="w-full h-64 object-cover rounded-xl mb-4"
                        />
                        <div className="text-white space-y-2">
                            <h3 className="text-xl font-semibold">{founder.title}</h3>
                            <p className="text-sm opacity-90">{founder.subtitle}</p>
                            {founder.handle && (
                                <p className="text-sm opacity-80">{founder.handle}</p>
                            )}
                            {founder.location && (
                                <p className="text-sm opacity-80">{founder.location}</p>
                            )}
                        </div>
                    </div>
                    {founder.url && (
                        <a
                            href={founder.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0"
                            aria-label={`View ${founder.title}'s profile`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

// Responsive ChromaGrid wrapper component
const ResponsiveChromaGrid = ({ founders }: { founders: ChromaItem[] }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [radius, setRadius] = useState(250);

    useEffect(() => {
        const updateDimensions = () => {
            const width = window.innerWidth;
            const mobile = width < 768;
            setIsMobile(mobile);

            if (width < 640) {
                setRadius(120);
            } else if (width < 768) {
                setRadius(150);
            } else if (width < 1024) {
                setRadius(200);
            } else {
                setRadius(250);
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Use simple cards on mobile, ChromaGrid on desktop
    if (isMobile) {
        return (
            <div className="w-full mb-16 px-4">
                <MobileFounderCards founders={founders} />
            </div>
        );
    }

    return (
        <div
            className="w-full max-w-6xl mx-auto mb-16 sm:mb-20 lg:mb-24 px-4"
            style={{
                height: '600px',
                minHeight: '600px',
                position: 'relative',
                zIndex: 1
            }}
        >
            <ChromaGrid
                items={founders}
                radius={radius}
                damping={0.4}
                fadeOut={0.7}
                ease="power3.out"
            />
        </div>
    );
};

const About = () => {
    const { theme } = useTheme();
    const [performanceProfile, setPerformanceProfile] =
        useState<PerformanceProfile | null>(null);

    // Initialize performance profile for CTA section
    useEffect(() => {
        const initializePerformance = async () => {
            try {
                const profile = await getDevicePerformanceProfile();
                setPerformanceProfile(profile);
            } catch (error) {
                console.warn(
                    "Failed to get performance profile, using low-end defaults:",
                    error
                );
                setPerformanceProfile({
                    tier: "low",
                    maxParticles: 300,
                    maxSpheres: 40,
                    targetFPS: 24,
                    enableShadows: false,
                    enableGlow: false,
                    renderScale: 0.6,
                    physicsSteps: 3,
                });
            }
        };

        initializePerformance();
    }, []);

    // SEO optimization
    useEffect(() => {
        document.title = "About Us - SharpFlow | AI Voice Automation Experts";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Learn about SharpFlow\'s mission to revolutionize customer interactions with AI-powered voice agents. Meet our founders and discover our journey in voice automation technology.');
        }

        // Add structured data for SEO
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About SharpFlow",
            "description": "SharpFlow specializes in AI-powered voice automation solutions for businesses",
            "url": "https://sharpflow.xyz/about",
            "mainEntity": {
                "@type": "Organization",
                "name": "SharpFlow",
                "description": "AI Voice Automation Company",
                "url": "https://sharpflow.xyz",
                "foundingDate": "2024",
                "founders": [
                    {
                        "@type": "Person",
                        "name": "Shajith Bathina",
                        "jobTitle": "Founder & CEO"
                    },
                    {
                        "@type": "Person",
                        "name": "Dinesh Yeturi",
                        "jobTitle": "Co-Founder & CTO"
                    }
                ],
                "sameAs": [
                    "https://linkedin.com/company/sharpflow",
                    "https://twitter.com/sharpflow_ai"
                ]
            }
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(structuredData);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    // Founders data for ChromaGrid (only 2 members)
    const founders: ChromaItem[] = [
        {
            image: "https://i.pravatar.cc/300?img=1", // Placeholder - replace with actual image
            title: "Shajith Bathina",
            subtitle: "Founder & CEO",
            handle: "@founder1",
            location: "India",
            borderColor: "#3B82F6",
            gradient: "linear-gradient(145deg, #3B82F6, #1E40AF, #000)",
            url: "https://linkedin.com/in/founder1"
        },
        {
            image: "https://i.pravatar.cc/300?img=2", // Placeholder - replace with actual image
            title: "Dinesh Yeturi",
            subtitle: "CO-founder & CTO",
            handle: "@founder2",
            location: "India",
            borderColor: "#10B981",
            gradient: "linear-gradient(145deg, #10B981, #059669, #000)",
            url: "https://linkedin.com/in/founder2"
        }
    ];

    return (
        <div className="min-h-screen">
            <Header />

            {/* Hero Section */}
            <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden">
                {theme === "dark" ? <DarkVeil speed={1.2} /> : <AuroraEffect />}

                <div className="container-padding relative z-10 w-full">
                    <ScrollReveal className="max-w-4xl mx-auto text-center px-4 sm:px-6">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 sm:mb-6 leading-tight">
                            About SharpFlow
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                            We're revolutionizing customer interactions with AI-powered voice agents
                            that understand, engage, and convert with human-like precision.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Our Story Section - Simplified with TextGenerateEffect */}
            <section className="section-padding bg-gradient-to-b from-background to-surface-subtle">
                <div className="w-full max-w-none mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal className="text-center mb-16">
                        <h2 className="text-heading text-primary mb-6 font-bold">
                            <span className="relative inline-block">
                                Our
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                            </span>
                            {" "}Story
                        </h2>
                    </ScrollReveal>

                    <div className="max-w-full mx-auto space-y-12">
                        {/* Company Foundation */}
                        <div className="text-center">
                            <TextGenerateEffect
                                words="Founded in 2024, SharpFlow transforms how businesses handle customer interactions with AI-powered voice agents that understand context and deliver results."
                                className="text-2xl sm:text-3xl lg:text-4xl font-medium text-primary max-w-6xl mx-auto"
                                duration={1}
                                filter={false}
                            />
                        </div>

                        {/* Problem Statement */}
                        <div className="text-center">
                            <TextGenerateEffect
                                words="Traditional customer service methods are slow and inconsistent. We created intelligent voice technology that provides instant, personalized support around the clock."
                                className="text-xl sm:text-2xl lg:text-3xl font-normal text-text-secondary max-w-7xl mx-auto"
                                duration={1.2}
                                filter={false}
                            />
                        </div>

                        {/* Solution & Value */}
                        <div className="text-center">
                            <TextGenerateEffect
                                words="Our ElevenLabs-powered agents handle everything from appointment booking to complex inquiries with human-like precision and natural conversation flow."
                                className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary max-w-6xl mx-auto"
                                duration={1.4}
                                filter={false}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section with Rainbow Cards */}
            <section className="section-padding">
                <div className="container-padding">
                    <div className="max-w-6xl mx-auto">
                        <ScrollReveal className="text-center mb-16">
                            <h2 className="text-heading text-primary mb-6">Mission & Vision</h2>
                            <p className="text-body">
                                Our core beliefs that drive everything we do at SharpFlow.
                            </p>
                        </ScrollReveal>

                        <div className="grid md:grid-cols-2 gap-8">
                            <ScrollReveal delay={0.2}>
                                <MissionVisionCard
                                    stepNumber="01"
                                    title="Our Mission"
                                    description="To empower businesses with AI voice technology that transforms customer interactions, increases conversions, and creates meaningful connections at scale. We believe every business deserves access to enterprise-level voice automation, regardless of size or budget."
                                />
                            </ScrollReveal>

                            <ScrollReveal delay={0.4}>
                                <MissionVisionCard
                                    stepNumber="02"
                                    title="Our Vision"
                                    description="A world where every customer interaction is intelligent, efficient, and delightful. We envision AI voice agents as the new standard for customer communication—not replacing human connection, but enhancing it with unprecedented availability and consistency."
                                />
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* Meet the Founders Section */}
            <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-surface-subtle to-background pb-24 sm:pb-32 lg:pb-40">
                <div className="container-padding">
                    <ScrollReveal className="text-center mb-12 sm:mb-16">
                        <h2 className="text-heading text-primary mb-6">Meet the Founders</h2>
                        <p className="text-body max-w-2xl mx-auto">
                            The visionaries behind SharpFlow, combining decades of experience in
                            AI, software development, and business strategy.
                        </p>
                    </ScrollReveal>

                    {/* Responsive ChromaGrid */}
                    <ScrollReveal delay={0.3}>
                        <ResponsiveChromaGrid founders={founders} />
                    </ScrollReveal>
                </div>
            </section>

            {/* Enhanced Spacer for section separation */}
            <div className="h-16 sm:h-20 lg:h-24 bg-background"></div>

            {/* CTA Section - Exact copy from landing page */}
            {!performanceProfile ? (
                <section
                    id="contact"
                    className="section-padding bg-primary relative overflow-hidden"
                >
                    <div className="container-padding relative z-20">
                        <ScrollReveal className="max-w-3xl mx-auto text-center">
                            <h2 className="text-heading text-primary-foreground mb-6">
                                Ready to transform your customer experience?
                            </h2>
                            <p className="text-body text-primary-foreground/80 mb-12">
                                Let's discuss how voice AI can revolutionize your business!
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <BookingDialog calLink={CAL_CONFIG.fullLink}>
                                    <RainbowButton className="relative z-30 cursor-pointer">
                                        Book Your Call
                                    </RainbowButton>
                                </BookingDialog>
                                <a
                                    href="mailto:contact@sharpflow.com"
                                    className="text-primary-foreground px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/10 relative z-30 cursor-pointer"
                                >
                                    Send Email
                                </a>
                            </div>

                            <p className="text-caption text-primary-foreground/60 mt-8">
                                Free consultation • Custom solutions • Expert guidance
                            </p>
                        </ScrollReveal>
                    </div>
                </section>
            ) : (
                <section
                    id="contact"
                    className="section-padding bg-primary relative overflow-hidden cursor-none"
                >
                    {/* Ballpit Background - Full Coverage */}
                    <div
                        style={{
                            position: "absolute",
                            inset: "0",
                            overflow: "hidden",
                            width: "100%",
                            height: "100%",
                            opacity: "0.8",
                            zIndex: 1,
                            cursor: "none",
                        }}
                    >
                        <Ballpit
                            count={performanceProfile.maxSpheres}
                            gravity={performanceProfile.tier === "low" ? 0.5 : 0.7}
                            friction={performanceProfile.tier === "low" ? 0.9 : 0.8}
                            wallBounce={0.95}
                            followCursor={performanceProfile.tier !== "low"}
                            colors={theme === "dark"
                                ? [0x333333, 0x0088ff, 0x00ccff, 0x66aaff, 0x4d79ff]
                                : [0x1a1a1a, 0x0066ff, 0x00aaff, 0x4d79ff]
                            }
                            className="cursor-none"
                            physicsSteps={performanceProfile.physicsSteps}
                            enableShadows={performanceProfile.enableShadows}
                            renderQuality={performanceProfile.tier}
                        />
                    </div>

                    <div className="container-padding relative z-20">
                        <ScrollReveal className="max-w-3xl mx-auto text-center">
                            <h2 className="text-heading text-primary-foreground mb-6">
                                Ready to transform your customer experience?
                            </h2>
                            <p className="text-body text-primary-foreground/80 mb-12">
                                Let's discuss how voice AI can revolutionize your business!
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <BookingDialog calLink={CAL_CONFIG.fullLink}>
                                    <RainbowButton className="relative z-30 cursor-pointer">
                                        Book Your Call
                                    </RainbowButton>
                                </BookingDialog>
                                <a
                                    href="mailto:contact@sharpflow.com"
                                    className="text-primary-foreground px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/10 relative z-30 cursor-pointer"
                                >
                                    Send Email
                                </a>
                            </div>

                            <p className="text-caption text-primary-foreground/60 mt-8">
                                Free consultation • Custom solutions • Expert guidance
                            </p>
                        </ScrollReveal>
                    </div>
                </section>
            )}

            <Footer />
        </div>
    );
};


// Mission & Vision Card Component (same style as HowWeWork cards)
interface MissionVisionCardProps {
    stepNumber: string;
    title: string;
    description: string;
}

const MissionVisionCard = ({ stepNumber, title, description }: MissionVisionCardProps) => {
    const Icon = stepNumber === "01" ? Target : Eye;

    return (
        <div className="min-h-[16rem] list-none">
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
        </div>
    );
};

export default About;