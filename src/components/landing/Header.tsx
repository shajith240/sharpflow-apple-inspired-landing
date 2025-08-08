import { Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const Header = () => {
  const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-4 sm:px-6">
      <div className="floating-nav">
        <div className="flex items-center justify-between h-14 px-4 sm:px-6">
          <div className="flex items-center space-x-4">
            <img 
              src={theme === 'dark' ? '/sharpflow_white.svg' : '/sharpflow_black.svg'} 
              alt="SharpFlow" 
              className="h-8 transition-all duration-200" 
            />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <nav className="flex items-center space-x-1">
              <a href="#features" className="nav-link">Features</a>
              <a href="#pricing" className="nav-link">Pricing</a>
              <a href="#contact" className="nav-link">Contact</a>
            </nav>
            
            <div className="flex items-center ml-4">
              <Button size="sm" className="nav-cta">Get Started</Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="nav-theme-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 px-4 py-4">
            <nav className="flex flex-col space-y-2">
              <a 
                href="#features" 
                className="nav-link text-left"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#pricing" 
                className="nav-link text-left"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a 
                href="#contact" 
                className="nav-link text-left"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
              <div className="pt-2">
                <Button size="sm" className="nav-cta w-full">Get Started</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;