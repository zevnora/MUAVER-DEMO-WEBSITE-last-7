import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BannerSlide, Product, SiteSettings } from '../types/store';
import { ChevronLeft, ChevronRight, Crown, Sparkles, MessageCircle } from 'lucide-react';
import { buildWhatsAppOrderUrl, buildGeneralWhatsAppUrl } from '../services/storeService';
import { getOptimizedImageUrl } from './OptimizedImage';

interface HeroSliderProps {
  banners: BannerSlide[];
  onNavigate: (page: string, productId?: string) => void;
  featuredProduct?: Product;
  settings: SiteSettings;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  banners,
  onNavigate,
  featuredProduct,
  settings,
}) => {
  // Filter active banners and sort
  const activeBanners = banners
    .filter((b) => b.isActive !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const total = activeBanners.length;

  // Auto-adjust index if active banner was deleted
  useEffect(() => {
    if (currentIndex >= total && total > 0) {
      setCurrentIndex(0);
    }
  }, [total, currentIndex]);

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Auto-play interval: every 5 seconds (paused when user hovers or touches)
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [total, isPaused, nextSlide]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const diffX = touchStartXRef.current - touchEndXRef.current;
      const minSwipeDistance = 45;
      if (diffX > minSwipeDistance) {
        // Swiped left -> next slide
        nextSlide();
      } else if (diffX < -minSwipeDistance) {
        // Swiped right -> prev slide
        prevSlide();
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Button action handler
  const handleButtonClick = (slide: BannerSlide) => {
    const link = slide.buttonLink?.toLowerCase().trim() || 'shop';
    if (link === 'whatsapp') {
      if (featuredProduct) {
        window.open(
          buildWhatsAppOrderUrl(
            featuredProduct.name,
            featuredProduct.variants[0]?.size || '50ml',
            1,
            featuredProduct.variants[0]?.salePrice || featuredProduct.variants[0]?.price || featuredProduct.price,
            window.location.href,
            settings.whatsappRawNumber
          ),
          '_blank',
          'noopener,noreferrer'
        );
      } else {
        window.open(buildGeneralWhatsAppUrl(settings.whatsappRawNumber), '_blank', 'noopener,noreferrer');
      }
    } else if (link === 'product' && featuredProduct) {
      onNavigate('product', featuredProduct.id);
    } else if (link === 'shop') {
      onNavigate('shop');
    } else if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      onNavigate(link);
    }
  };

  if (!activeBanners || activeBanners.length === 0) {
    return null;
  }

  return (
    <section
      className="relative w-full overflow-hidden select-none bg-[#0A1A4F] border-b border-slate-200"
      aria-label="Hero Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slider Viewport */}
      <div className="relative w-full h-[400px] sm:h-[480px] md:h-[540px] lg:h-[580px]">
        {activeBanners.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Media */}
              <picture className="w-full h-full block">
                {slide.mobileImage && (
                  <source
                    media="(max-width: 640px)"
                    srcSet={getOptimizedImageUrl(slide.mobileImage, { quality: 80, width: 720 })}
                    type="image/webp"
                  />
                )}
                <source
                  srcSet={`${getOptimizedImageUrl(slide.desktopImage, { quality: 80, width: 900 })} 900w, ${getOptimizedImageUrl(slide.desktopImage, { quality: 80, width: 1400 })} 1400w, ${getOptimizedImageUrl(slide.desktopImage, { quality: 85, width: 1920 })} 1920w`}
                  sizes="100vw"
                  type="image/webp"
                />
                <img
                  src={getOptimizedImageUrl(slide.desktopImage, { quality: 80, width: 1400 })}
                  alt={slide.heading}
                  width={1400}
                  height={580}
                  className={`w-full h-full object-cover object-center transform transition-transform duration-[6000ms] ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                />
              </picture>

              {/* Clean, subtle dark overlay */}
              <div className="absolute inset-0 bg-slate-950/45" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 w-full">
                  <div className="max-w-xl sm:max-w-2xl space-y-3 sm:space-y-4 text-white">
                    {/* Minimal Kicker Tag */}
                    {slide.badgeText && (
                      <div
                        className={`inline-block text-[11px] sm:text-xs font-semibold tracking-widest text-[#F0D27A] uppercase transition-all duration-500 delay-100 ${
                          isActive ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                        }`}
                      >
                        {slide.badgeText}
                      </div>
                    )}

                    {/* Main Heading */}
                    <h1
                      className={`font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight transition-all duration-500 delay-150 ${
                        isActive ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                      }`}
                    >
                      {slide.heading}
                    </h1>

                    {/* Subtitle / Description */}
                    <p
                      className={`text-xs sm:text-sm md:text-base text-slate-200 max-w-lg font-light leading-relaxed transition-all duration-500 delay-200 ${
                        isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                      }`}
                    >
                      {slide.subheading}
                    </p>

                    {/* Action Buttons */}
                    <div
                      className={`pt-2 sm:pt-3 flex flex-wrap items-center gap-3 transition-all duration-500 delay-250 ${
                        isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                      }`}
                    >
                      <button
                        onClick={() => handleButtonClick(slide)}
                        className="btn-gold px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold tracking-wider uppercase inline-flex items-center gap-2 cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-transform"
                      >
                        {slide.buttonLink === 'whatsapp' ? (
                          <MessageCircle className="w-4 h-4 text-[#0A1A4F]" />
                        ) : null}
                        <span>{slide.buttonText || 'Shop Collection'}</span>
                      </button>

                      {slide.buttonLink !== 'whatsapp' && (
                        <button
                          onClick={() => {
                            if (featuredProduct) {
                              window.open(
                                buildWhatsAppOrderUrl(
                                  featuredProduct.name,
                                  featuredProduct.variants[0]?.size || '50ml',
                                  1,
                                  featuredProduct.variants[0]?.salePrice || featuredProduct.variants[0]?.price || featuredProduct.price,
                                  window.location.href,
                                  settings.whatsappRawNumber
                                ),
                                '_blank',
                                'noopener,noreferrer'
                              );
                            } else {
                              window.open(buildGeneralWhatsAppUrl(settings.whatsappRawNumber), '_blank', 'noopener,noreferrer');
                            }
                          }}
                          className="bg-black/40 hover:bg-black/60 text-white border border-white/30 px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-xs sm:text-sm font-medium tracking-wider uppercase inline-flex items-center gap-2 cursor-pointer transition-colors backdrop-blur-sm"
                        >
                          <MessageCircle className="w-4 h-4 text-[#25D366]" />
                          <span>WhatsApp</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows (Prev / Next) */}
      {total > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/70 hover:bg-white text-slate-800 flex items-center justify-center transition-all shadow-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/70 hover:bg-white text-slate-800 flex items-center justify-center transition-all shadow-sm cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </>
      )}

      {/* Dots / Indicators */}
      {total > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-2">
          {activeBanners.map((_, dotIdx) => {
            const isCurrent = dotIdx === currentIndex;
            return (
              <button
                key={dotIdx}
                onClick={() => goToSlide(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full h-1.5 focus:outline-none cursor-pointer ${
                  isCurrent
                    ? 'w-6 bg-[#D4AF37]'
                    : 'w-1.5 bg-white/60 hover:bg-white'
                }`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};
