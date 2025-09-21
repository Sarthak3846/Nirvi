import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  imageSrc: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export default function Hero({ 
  imageSrc, 
  title, 
  subtitle, 
  ctaText = "EXPLORE COLLECTION", 
  onCtaClick 
}: HeroProps) {
  const handleCtaClick = () => {
    console.log('CTA clicked:', ctaText);
    onCtaClick?.();
  };

  const scrollToContent = () => {
    window.scrollTo({ 
      top: window.innerHeight, 
      behavior: 'smooth' 
    });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageSrc})` }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          {/* Brand/Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-widest text-white mb-4" data-testid="text-hero-title">
            {title}
          </h1>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-lg md:text-xl font-light text-white/90 mb-8 max-w-2xl mx-auto tracking-wide" data-testid="text-hero-subtitle">
              {subtitle}
            </p>
          )}

          {/* CTA Button */}
          <Button
            onClick={handleCtaClick}
            variant="outline"
            className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 px-8 py-3 text-sm tracking-widest font-light"
            data-testid="button-hero-cta"
          >
            {ctaText}
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={scrollToContent}
            className="text-white/70 hover:text-white transition-colors animate-bounce"
            data-testid="button-scroll-indicator"
          >
            <ChevronDown className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
}