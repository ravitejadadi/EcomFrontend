import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const NewDropsCarousel = ({ items = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [isMoving, setIsMoving] = useState(false);
    const trackRef = useRef(null);

    if (!items || items.length === 0) return null;

    // Auto-fill array elements to ensure at least 8 items for seamless looping
    let baseItems = [...items];
    while (baseItems.length < 8) {
        baseItems = [...baseItems, ...items];
    }

    const cloneCount = 4;
    const clonedItems = [
        ...baseItems.slice(-cloneCount),
        ...baseItems,
        ...baseItems.slice(0, cloneCount)
    ];

    useEffect(() => {
        setCurrentIndex(cloneCount);
        setIsMoving(false);
    }, [baseItems.length]);

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
        if (currentIndex <= cloneCount - 1) {
            setIsTransitioning(false);
            setCurrentIndex(baseItems.length + currentIndex);
        } else if (currentIndex >= baseItems.length + cloneCount) {
            setIsTransitioning(false);
            setCurrentIndex(currentIndex - baseItems.length);
        }
    };

    useEffect(() => {
        if (!isTransitioning) {
            if (trackRef.current) {
                // eslint-disable-next-line no-unused-expressions
                trackRef.current.offsetHeight;
            }
            setIsTransitioning(true);
        }
    }, [isTransitioning]);

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

    return (
        <div className="relative group px-4 md:px-8">
            {/* Viewport */}
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
                    {clonedItems.map((item, idx) => (
                        <div
                            key={`${item.id}-clone-${idx}`}
                            className="w-1/2 sm:w-1/3 lg:w-1/4 flex-shrink-0 px-2 md:px-3"
                        >
                            <div className="flex flex-col">
                                {/* Image Card Container */}
                                <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-sm bg-neutral-100 group/card relative">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                                {/* Left-aligned description text printed directly below card */}
                                <h3 className="text-sm sm:text-base font-semibold text-neutral-800 mt-3 truncate hover:text-black transition-colors">
                                    {item.name}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Left Scroll Button */}
            <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 md:ml-2 w-10 h-10 md:w-12 md:h-12 bg-white text-black shadow-lg border border-neutral-200 rounded-full flex items-center justify-center hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all opacity-100 md:opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                aria-label="Previous drops"
            >
                <ChevronLeft size={24} />
            </button>

            {/* Right Scroll Button */}
            <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 md:mr-2 w-10 h-10 md:w-12 md:h-12 bg-white text-black shadow-lg border border-neutral-200 rounded-full flex items-center justify-center hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all opacity-100 md:opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                aria-label="Next drops"
            >
                <ChevronRight size={24} />
            </button>
        </div>
    );
};

export default NewDropsCarousel;
