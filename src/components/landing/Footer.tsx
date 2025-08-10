import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const Footer = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  };
  return (
    <footer className="relative overflow-hidden bg-surface-elevated border-t border-border">
      {/* subtle top glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-gradient-to-b from-accent/10 to-transparent" />
      <div className="container-padding py-12 sm:py-16">
        {/* Mobile: stack sections with accordion; Desktop: grid */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block group">
              <img
                src={theme === 'dark' ? '/sharpflow_white.svg' : '/sharpflow_black.svg'}
                alt="SharpFlow"
                className="h-12 transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </Link>
            <p className="mt-4 text-caption text-text-tertiary max-w-xs">
              Conversational voice agents that turn visitors into customers.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-subheading text-primary mb-4 font-medium">Product</h4>
            <ul className="space-y-3">
              <li><a href="/#hero" className="text-body text-text-secondary hover:text-primary transition-colors">Overview</a></li>
              <li><a href="/#pricing" className="text-body text-text-secondary hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="/#contact" className="text-body text-text-secondary hover:text-primary transition-colors">Book a demo</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-subheading text-primary mb-4 font-medium">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-body text-text-secondary hover:text-primary transition-colors">About</Link></li>
              <li><a href="/#contact" className="text-body text-text-secondary hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-subheading text-primary mb-4 font-medium">Support</h4>
            <ul className="space-y-3">
              <li><a href="mailto:contact@sharpflow.com" className="text-body text-text-secondary hover:text-primary transition-colors">Email support</a></li>
              <li><a href="/#contact" className="text-body text-text-secondary hover:text-primary transition-colors">Help center</a></li>
            </ul>
          </div>
        </div>

        {/* Mobile accordion */}
        <div className="lg:hidden space-y-6">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block group">
              <img
                src={theme === 'dark' ? '/sharpflow_white.svg' : '/sharpflow_black.svg'}
                alt="SharpFlow"
                className="h-10 transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </Link>
            <p className="mt-3 text-caption text-text-tertiary">
              Conversational voice agents that turn visitors into customers.
            </p>
          </div>

          <Accordion type="multiple" className="divide-y divide-border rounded-xl border border-border/60 overflow-hidden">
            <AccordionItem value="product" className="border-none">
              <AccordionTrigger className="px-4">Product</AccordionTrigger>
              <AccordionContent className="px-4">
                <ul className="space-y-3">
                  <li><a href="/#hero" className="text-body text-text-secondary hover:text-primary transition-colors">Overview</a></li>
                  <li><a href="/#pricing" className="text-body text-text-secondary hover:text-primary transition-colors">Pricing</a></li>
                  <li><a href="/#contact" className="text-body text-text-secondary hover:text-primary transition-colors">Book a demo</a></li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="company" className="border-none">
              <AccordionTrigger className="px-4">Company</AccordionTrigger>
              <AccordionContent className="px-4">
                <ul className="space-y-3">
                  <li><Link to="/about" className="text-body text-text-secondary hover:text-primary transition-colors">About</Link></li>
                  <li><a href="/#contact" className="text-body text-text-secondary hover:text-primary transition-colors">Contact</a></li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="support" className="border-none">
              <AccordionTrigger className="px-4">Support</AccordionTrigger>
              <AccordionContent className="px-4">
                <ul className="space-y-3">
                  <li><a href="mailto:contact@sharpflow.com" className="text-body text-text-secondary hover:text-primary transition-colors">Email support</a></li>
                  <li><a href="/#contact" className="text-body text-text-secondary hover:text-primary transition-colors">Help center</a></li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-caption text-text-tertiary">
            © 2024 SharpFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-3 md:gap-6 mt-2 md:mt-0">
            {/* Theme Toggle */}
            <div className="transition-transform duration-300 hover:scale-105">
              <AnimatedThemeToggler />
            </div>

            {/* Links */}
            <a href="#" className="text-caption text-text-tertiary hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-caption text-text-tertiary hover:text-primary transition-colors">Terms</a>
            <a href="#" className="text-caption text-text-tertiary hover:text-primary transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;