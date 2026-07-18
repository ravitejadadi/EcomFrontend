import { useState, useEffect, useRef } from 'react';
import ProductCard from '../product/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const NewArrivalsCarousel = ({ products = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [isMoving, setIsMoving] = useState(false);
    const trackRef = useRef(null);

    // Ensure we have at least 8 items so the carousel track has enough elements to loop seamlessly
    let baseProducts = [...products];
    if (baseProducts.length > 0) {
        while (baseProducts.length < 8) {
            baseProducts = [...baseProducts, ...products];
        }
    }

    // To implement smooth infinite scrolling, we clone items at both ends.
    // We clone 4 items since desktop shows 4 columns max.
    const cloneCount = 4;
    const clonedProducts = baseProducts.length > 0 ? [
        ...baseProducts.slice(-cloneCount),
        ...baseProducts,
        ...baseProducts.slice(0, cloneCount)
    ] : [];

    // Set initial index to point to first real product (which sits after the prepended clones)
    useEffect(() => {
        if (baseProducts.length > 0) {
            setCurrentIndex(cloneCount);
        }
        setIsMoving(false);
    }, [baseProducts.length]);

    const handlePrev = () => {
        if (isMoving) return;
        setIsMoving(true);
        setCurrentIndex((prev) => prev - 1);
    };

    const handleNext = () => {
        if (isMoving) return;
        setIsMoving(true);
        setCurrentIndex((prev) => prev + 1);
    };

    const handleTransitionEnd = () => {
        setIsMoving(false);
        // If we scrolled past the first real product into the prepended clones
        if (currentIndex <= cloneCount - 1) {
            setIsTransitioning(false);
            // Instantly jump to the corresponding real item at the end
            setCurrentIndex(baseProducts.length + currentIndex);
        }
        // If we scrolled past the last real product into the appended clones
        else if (currentIndex >= baseProducts.length + cloneCount) {
            setIsTransitioning(false);
            // Instantly jump to the corresponding real item at the beginning
            setCurrentIndex(currentIndex - baseProducts.length);
        }
    };

    // Re-enable transitioning on the next render cycle if it was disabled for jump-back
    useEffect(() => {
        if (!isTransitioning) {
            // Force a reflow/repaint to ensure transition is disabled instantly
            if (trackRef.current) {
                // eslint-disable-next-line no-unused-expressions
                trackRef.current.offsetHeight;
            }
            setIsTransitioning(true);
        }
    }, [isTransitioning]);

    // Responsive items per view:
    // desktop: lg = 4 items
    // tablet: md = 3 items
    // mobile: default = 2 items
    // Let's use Tailwind's classes to control widths, but we calculate translation percentages:
    // Translate percentage = -(currentIndex * (100 / itemsPerView))
    // To make it fully responsive, we can set the translate CSS variables dynamically, 
    // or use custom inline styles based on window width listeners.
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    let itemsPerView = 4;
    if (windowWidth < 640) {
        itemsPerView = 2;
    } else if (windowWidth < 1024) {
        itemsPerView = 3;
    }

    const translatePercent = -(currentIndex * (100 / itemsPerView));

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-12 text-neutral-500 font-medium bg-neutral-50 rounded-xl">
                No products found in this category.
            </div>
        );
    }

    return (
        <div className="relative group px-4 md:px-8">
            {/* Slider Viewport */}
            <div className="overflow-hidden">
                <div
                    ref={trackRef}
                    className="flex transition-transform"
                    style={{
                        transform: `translateX(${translatePercent}%)`,
                        transitionDuration: isTransitioning ? '500ms' : '0ms',
                        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {clonedProducts.map((product, idx) => (
                        <div
                            key={`${product.id}-clone-${idx}`}
                            className="w-1/2 sm:w-1/3 lg:w-1/4 flex-shrink-0 px-2 md:px-3"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Left Button */}
            <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 md:ml-2 w-10 h-10 md:w-12 md:h-12 bg-white text-black shadow-xl border border-neutral-200 rounded-full flex items-center justify-center hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                aria-label="Previous products"
            >
                <ChevronLeft size={24} />
            </button>

            {/* Right Button */}
            <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 md:mr-2 w-10 h-10 md:w-12 md:h-12 bg-white text-black shadow-xl border border-neutral-200 rounded-full flex items-center justify-center hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                aria-label="Next products"
            >
                <ChevronRight size={24} />
            </button>
        </div>
    );
};

export default NewArrivalsCarousel;
