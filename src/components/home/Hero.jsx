import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const defaultSlides = [
    {
        id: 1,
        title: 'WINTERWEAR',
        subtitle: 'STAY WARM, LOOK COOL',
        description: 'Explore our premium winter collection designed for performance and style',
        image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200&q=75',
        cta: { text: 'SHOP NOW', link: '/collections/winterwear' },
        theme: 'dark',
        badge: 'NEW COLLECTION',
    },
    {
        id: 2,
        title: "MEN'S ESSENTIALS",
        subtitle: 'COMFORT & STYLE',
        description: 'Discover premium hoodies, t-shirts, and everyday training essentials',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200&q=75',
        cta: { text: 'SHOP APPAREL', link: '/collections/mens-clothing' },
        theme: 'light',
        badge: 'NEW ARRIVALS',
    },
    {
        id: 4,
        title: 'SCUDERIA FERRARI',
        subtitle: 'OFFICIAL TEAM COLLECTION',
        description: 'Wear the passion. Official Ferrari motorsport apparel and footwear',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=75',
        cta: { text: 'EXPLORE COLLECTION', link: '/collections/ferrari' },
        theme: 'dark',
        badge: 'MOTORSPORT',
    },
];

const Hero = ({ slides = [] }) => {
    const activeSlides = slides.length > 0 ? slides : defaultSlides;
    const [currentSlide, setCurrentSlide] = useState(0);

    // Reset slide index if activeSlides changes length (e.g. navigation switch)
    useEffect(() => {
        setCurrentSlide(0);
    }, [activeSlides]);

    const changeSlide = useCallback((newIndex) => {
        setCurrentSlide(newIndex);
    }, []);

    const nextSlide = () => changeSlide((currentSlide + 1) % activeSlides.length);
    const prevSlide = () => changeSlide((currentSlide - 1 + activeSlides.length) % activeSlides.length);

    if (!activeSlides || activeSlides.length === 0) return null;
    const slide = activeSlides[currentSlide];

    return (
        <div className="relative h-[220px] sm:h-[260px] md:h-[320px] lg:h-[360px] overflow-hidden bg-black">
            {/* Background Image */}
            <div key={slide.id} className="absolute inset-0">
                <div className="absolute inset-0">
                    <img
                        src={slide.image}
                        alt={slide.title}
                        width={1200}
                        height={750}
                        className="w-full h-full object-cover"
                        // First slide is LCP — load eagerly with high priority
                        {...(currentSlide === 0
                            ? { fetchpriority: 'high', loading: 'eager' }
                            : { loading: 'lazy', decoding: 'async' }
                        )}
                    />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 bg-black/35 pointer-events-none" />
                <div className="relative h-full container-custom flex items-center">
                    <div className={`max-w-2xl ${slide.theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                        {/* Badge */}
                        <div className="inline-block mb-1.5 md:mb-2.5">
                            <span className={`px-2 py-0.5 text-[9px] md:text-xs font-bold tracking-widest uppercase rounded-full ${slide.theme === 'dark'
                                ? 'bg-white text-black'
                                : 'bg-black text-white'
                            }`}>
                                {slide.badge}
                            </span>
                        </div>

                        {/* Subtitle */}
                        <p className="text-[9px] md:text-xs font-bold tracking-widest uppercase mb-1 opacity-90">
                            {slide.subtitle}
                        </p>

                        {/* Title */}
                        <h1
                            className="text-xl md:text-3xl lg:text-4xl font-black mb-1.5 md:mb-2.5 leading-none tracking-tighter"
                            style={{ fontFamily: 'Arial Black, sans-serif' }}
                        >
                            {slide.title}
                        </h1>

                        {/* Description */}
                        <p className="text-xs md:text-sm mb-3 md:mb-4 max-w-lg leading-relaxed opacity-95">
                            {slide.description}
                        </p>

                        {/* CTA Button */}
                        <div>
                            <Link
                                to={slide.cta.link}
                                className={`inline-block px-4 py-2 text-[10px] md:text-xs font-bold tracking-wider uppercase rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${slide.theme === 'dark'
                                    ? 'bg-white text-black hover:bg-neutral-100'
                                    : 'bg-black text-white hover:bg-neutral-900'
                                }`}
                            >
                                {slide.cta.text}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all z-10 group"
                aria-label="Previous slide"
            >
                <ChevronLeft size={18} className="text-white group-hover:scale-110 transition-transform" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all z-10 group"
                aria-label="Next slide"
            >
                <ChevronRight size={18} className="text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {activeSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => changeSlide(index)}
                        className={`transition-all duration-300 rounded-full ${index === currentSlide
                            ? 'bg-white w-6 h-1'
                            : 'bg-white/40 hover:bg-white/60 w-1 h-1'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Slide Counter */}
            <div className="absolute bottom-4 md:bottom-6 right-4 md:right-8 text-white font-bold text-[10px] md:text-xs z-10">
                <span className="text-sm md:text-base">{String(currentSlide + 1).padStart(2, '0')}</span>
                <span className="text-white/60"> / {String(activeSlides.length).padStart(2, '0')}</span>
            </div>
        </div>
    );
};

export default Hero;
