import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';


export default function Footer() {

  const footerSections = [
    {
      title: 'CUSTOMER SERVICE',
      links: ['Contact Us', 'Size Guide', 'Returns & Exchanges', 'Shipping Info', 'FAQ']
    },
    {
      title: 'COMPANY',
      links: ['About Nirvi', 'Careers', 'Press', 'Sustainability', 'Privacy Policy']
    },
    {
      title: 'CATEGORIES',
      links: ['Women', 'Men', 'Kids', 'Accessories', 'Sale']
    }
  ];

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Youtube, label: 'Youtube', href: '#' }
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-light tracking-wide text-foreground mb-4" data-testid={`text-footer-${section.title.toLowerCase().replace(' ', '-')}`}>
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <button 
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm font-light"
                      data-testid={`link-footer-${link.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border">
          {/* Brand */}
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-light tracking-widest text-foreground" data-testid="text-footer-brand">
              NIRVI
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Modern fashion for contemporary living
            </p>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <Button
                key={social.label}
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                data-testid={`link-social-${social.label.toLowerCase()}`}
              >
                <social.icon className="h-5 w-5" />
              </Button>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-border mt-8">
          <p className="text-sm text-muted-foreground" data-testid="text-copyright">
            © 2024 Nirvi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}