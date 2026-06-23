import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
    {
        id: 1,
        title: 'WINTERWEAR',
        subtitle: 'STAY WARM, LOOK COOL',
        description: 'Explore our premium winter collection designed for performance and style',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=75',
        cta: { text: 'SHOP NOW', link: '/collections/winterwear' },
        theme: 'dark',
        badge: 'NEW COLLECTION',
    },
    {
        id: 2,
        title: 'VELOCITY NITRO 4',
        subtitle: 'ENGINEERED FOR SPEED',
        description: 'Experience explosive performance with advanced NITRO foam technology',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=75',
        cta: { text: 'DISCOVER MORE', link: '/collections/running' },
        theme: 'light',
        badge: 'PERFORMANCE',
    },
    {
        id: 3,
        title: 'SPEEDCAT',
        subtitle: 'MOTORSPORT HERITAGE',
        description: 'The iconic silhouette returns. Racing-inspired style for the streets',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=75',
        cta: { text: 'SHOP SPEEDCAT', link: '/collections/speedcat' },
        theme: 'dark',
        badge: 'TRENDING',
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

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);

        return () => clearInterval(timer);
    }, []);

    const changeSlide = useCallback((newIndex) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide(newIndex);
        setTimeout(() => setIsTransitioning(false), 800);
    }, [isTransitioning]);

    const nextSlide = () => changeSlide((currentSlide + 1) % slides.length);
    const prevSlide = () => changeSlide((currentSlide - 1 + slides.length) % slides.length);

    const slide = slides[currentSlide];

    return (
        <div className="relative h-[550px] md:h-[650px] lg:h-[750px] overflow-hidden bg-black">
            {/* Background Image — CSS transition instead of framer-motion */}
            <div
                className="absolute inset-0 transition-opacity duration-800 ease-in-out"
                key={slide.id}
                style={{ animation: 'heroFadeIn 0.8s ease-in-out' }}
            >
                <div className="absolute inset-0" style={{ animation: 'heroZoom 8s linear forwards' }}>
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

                {/* Content */}
                <div className="relative h-full container-custom flex items-center">
                    <div
                        className={`max-w-2xl ${slide.theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}
                        style={{ animation: 'heroContentIn 0.7s ease-out 0.3s both' }}
                    >
                        {/* Badge */}
                        <div className="inline-block mb-4" style={{ animation: 'heroContentIn 0.5s ease-out 0.4s both' }}>
                            <span className={`px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full ${slide.theme === 'dark'
                                ? 'bg-white text-black'
                                : 'bg-black text-white'
                            }`}>
                                {slide.badge}
                            </span>
                        </div>

                        {/* Subtitle */}
                        <p
                            className="text-sm md:text-base font-bold tracking-widest uppercase mb-3 opacity-90"
                            style={{ animation: 'heroContentIn 0.6s ease-out 0.5s both' }}
                        >
                            {slide.subtitle}
                        </p>

                        {/* Title */}
                        <h1
                            className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-none tracking-tighter"
                            style={{ fontFamily: 'Arial Black, sans-serif', animation: 'heroContentIn 0.7s ease-out 0.6s both' }}
                        >
                            {slide.title}
                        </h1>

                        {/* Description */}
                        <p
                            className="text-base md:text-lg lg:text-xl mb-8 max-w-xl leading-relaxed"
                            style={{ animation: 'heroContentIn 0.6s ease-out 0.7s both' }}
                        >
                            {slide.description}
                        </p>

                        {/* CTA Button */}
                        <div style={{ animation: 'heroContentIn 0.6s ease-out 0.8s both' }}>
                            <Link
                                to={slide.cta.link}
                                className={`inline-block px-8 py-4 text-sm md:text-base font-bold tracking-wider uppercase rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${slide.theme === 'dark'
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
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all z-10 group"
                aria-label="Previous slide"
            >
                <ChevronLeft size={24} className="text-white group-hover:scale-110 transition-transform" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all z-10 group"
                aria-label="Next slide"
            >
                <ChevronRight size={24} className="text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => changeSlide(index)}
                        className={`transition-all duration-300 rounded-full ${index === currentSlide
                            ? 'bg-white w-12 h-2'
                            : 'bg-white/40 hover:bg-white/60 w-2 h-2'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Slide Counter */}
            <div className="absolute bottom-8 md:bottom-12 right-4 md:right-8 text-white font-bold text-sm z-10">
                <span className="text-2xl">{String(currentSlide + 1).padStart(2, '0')}</span>
                <span className="text-white/60"> / {String(slides.length).padStart(2, '0')}</span>
            </div>

            {/* CSS keyframes for hero animations (replaces framer-motion) */}
            <style>{`
                @keyframes heroFadeIn {
                    from { opacity: 0; transform: scale(1.05); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes heroZoom {
                    from { transform: scale(1.1); }
                    to { transform: scale(1); }
                }
                @keyframes heroContentIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Hero;
