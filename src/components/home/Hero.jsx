import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            title: 'WINTERWEAR',
            subtitle: 'STAY WARM, LOOK COOL',
            description: 'Explore our premium winter collection designed for performance and style',
            image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80',
            cta: { text: 'SHOP NOW', link: '/collections/winterwear' },
            theme: 'dark',
            badge: 'NEW COLLECTION',
        },
        {
            id: 2,
            title: 'VELOCITY NITRO 4',
            subtitle: 'ENGINEERED FOR SPEED',
            description: 'Experience explosive performance with advanced NITRO foam technology',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&q=80',
            cta: { text: 'DISCOVER MORE', link: '/collections/running' },
            theme: 'light',
            badge: 'PERFORMANCE',
        },
        {
            id: 3,
            title: 'SPEEDCAT',
            subtitle: 'MOTORSPORT HERITAGE',
            description: 'The iconic silhouette returns. Racing-inspired style for the streets',
            image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1920&q=80',
            cta: { text: 'SHOP SPEEDCAT', link: '/collections/speedcat' },
            theme: 'dark',
            badge: 'TRENDING',
        },
        {
            id: 4,
            title: 'SCUDERIA FERRARI',
            subtitle: 'OFFICIAL TEAM COLLECTION',
            description: 'Wear the passion. Official Ferrari motorsport apparel and footwear',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
            cta: { text: 'EXPLORE COLLECTION', link: '/collections/ferrari' },
            theme: 'dark',
            badge: 'MOTORSPORT',
        },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);

        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="relative h-[550px] md:h-[650px] lg:h-[750px] overflow-hidden bg-black">
            <AnimatePresence mode="wait">
                {slides.map((slide, index) => {
                    if (index !== currentSlide) return null;

                    return (
                        <motion.div
                            key={slide.id}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                            className="absolute inset-0"
                        >
                            {/* Background Image with Parallax Effect */}
                            <motion.div
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 8, ease: 'linear' }}
                                className="absolute inset-0"
                            >
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className={`absolute inset-0 ${slide.theme === 'dark'
                                        ? 'bg-gradient-to-r from-black via-black/70 to-transparent'
                                        : 'bg-gradient-to-r from-white/90 via-white/60 to-transparent'
                                    }`} />
                            </motion.div>

                            {/* Content */}
                            <div className="relative h-full container-custom flex items-center">
                                <motion.div
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.7 }}
                                    className={`max-w-2xl ${slide.theme === 'dark' ? 'text-white' : 'text-neutral-900'
                                        }`}
                                >
                                    {/* Badge */}
                                    <motion.div
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.5 }}
                                        className="inline-block mb-4"
                                    >
                                        <span className={`px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full ${slide.theme === 'dark'
                                                ? 'bg-white text-black'
                                                : 'bg-black text-white'
                                            }`}>
                                            {slide.badge}
                                        </span>
                                    </motion.div>

                                    {/* Subtitle */}
                                    <motion.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.6 }}
                                        className="text-sm md:text-base font-bold tracking-widest uppercase mb-3 opacity-90"
                                    >
                                        {slide.subtitle}
                                    </motion.p>

                                    {/* Title */}
                                    <motion.h1
                                        initial={{ y: 30, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.7 }}
                                        className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-none tracking-tighter"
                                        style={{ fontFamily: 'Arial Black, sans-serif' }}
                                    >
                                        {slide.title}
                                    </motion.h1>

                                    {/* Description */}
                                    <motion.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.7, duration: 0.6 }}
                                        className="text-base md:text-lg lg:text-xl mb-8 max-w-xl leading-relaxed"
                                    >
                                        {slide.description}
                                    </motion.p>

                                    {/* CTA Button */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.8, duration: 0.6 }}
                                    >
                                        <Link
                                            to={slide.cta.link}
                                            className={`inline-block px-8 py-4 text-sm md:text-base font-bold tracking-wider uppercase rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${slide.theme === 'dark'
                                                    ? 'bg-white text-black hover:bg-neutral-100'
                                                    : 'bg-black text-white hover:bg-neutral-900'
                                                }`}
                                        >
                                            {slide.cta.text}
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

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
                        onClick={() => setCurrentSlide(index)}
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
        </div>
    );
};

export default Hero;
