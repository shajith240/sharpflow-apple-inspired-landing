const Footer = () => {
  return (
    <footer className="bg-surface-elevated border-t border-border">
      <div className="container-padding py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg"></div>
              <span className="text-subheading font-semibold text-primary">SharpFlow</span>
            </div>
            <p className="text-body text-text-secondary max-w-sm">
              Intelligent AI voice agents that automate your business communications 
              with human-like precision.
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h4 className="text-subheading text-primary mb-4 font-medium">Product</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-body text-text-secondary hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="text-body text-text-secondary hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="text-body text-text-secondary hover:text-primary transition-colors">Integrations</a></li>
              <li><a href="#" className="text-body text-text-secondary hover:text-primary transition-colors">API</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="text-subheading text-primary mb-4 font-medium">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-body text-text-secondary hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="text-body text-text-secondary hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-body text-text-secondary hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="text-body text-text-secondary hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-subheading text-primary mb-4 font-medium">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-body text-text-secondary hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="text-body text-text-secondary hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-body text-text-secondary hover:text-primary transition-colors">Community</a></li>
              <li><a href="#" className="text-body text-text-secondary hover:text-primary transition-colors">Status</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-caption text-text-tertiary">
            © 2024 SharpFlow. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
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