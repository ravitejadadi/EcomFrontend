import Hero from '../components/home/Hero';
import ProductCard from '../components/product/ProductCard';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, TrendingUp, Award, Dumbbell, Trophy, Shirt } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../utils/api';
import NewArrivalsCarousel from '../components/home/NewArrivalsCarousel';
import NewDropsCarousel from '../components/home/NewDropsCarousel';

const newDropsItems = [
    { id: 'drop-m1', name: 'Olive Button Down Oxford Shirts', image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&q=80' },
    { id: 'drop-m2', name: 'Sand Brown Linen Striped Shirt', image: 'https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=600&q=80' },
    { id: 'drop-m3', name: 'Dark Wine Double Cuff Satin Shirt', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80' },
    { id: 'drop-m4', name: 'Black Jacquard Speckled T-Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80' },
];

const apparelCategories = [
    { name: 'SHIRTS', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80', href: '/collections/mens-clothing?subcategory=shirts' },
    { name: 'TROUSERS', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80', href: '/collections/mens-clothing?subcategory=trousers' },
    { name: "EVERYTHING UNDER\n₹799", image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80', href: '/collections/mens-clothing?maxPrice=799', promo: true },
    { name: 'POLOS', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80', href: '/collections/mens-clothing?subcategory=polos' },
    { name: 'CARGOS', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80', href: '/collections/mens-clothing?subcategory=cargos' },
    { name: 'JEANS', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80', href: '/collections/mens-clothing?subcategory=jeans' },
    { name: 'OVERSIZED\nT-SHIRTS', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', href: '/collections/mens-clothing?subcategory=t-shirts' },
    { name: 'JOGGERS', image: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=500&q=80', href: '/collections/mens-clothing?subcategory=shorts' },
    { name: 'PRINTED\nT-SHIRTS', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80', href: '/collections/mens-clothing?subcategory=t-shirts' },
    { name: "EVERYTHING UNDER\n₹999", image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&q=80', href: '/collections/mens-clothing?maxPrice=999', promo: true },
    { name: 'PYJAMAS', image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=500&q=80', href: '/collections/mens-clothing?subcategory=pyjamas' },
    { name: 'BOXERS', image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&q=80', href: '/collections/mens-clothing?subcategory=boxers' },
];

// Scroll-reveal wrapper — transitions only opacity + transform (composited, no layout cost)
const AnimatedSection = ({ children, className = '' }) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.unobserve(el); } },
            { threshold: 0.05, rootMargin: '100px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
            }}
            className={className}
        >
            {children}
        </div>
    );
};

// Defined OUTSIDE HomePage so React never sees it as a new component type on re-renders
// (defining inside causes unmount/remount of all cards every time products state updates)
const CategorySection = ({ title, subtitle, icon: Icon, products, link, bgColor = 'bg-neutral-50' }) => (
    <section className={`${bgColor} py-12 md:py-20`}>
        <div className="container-custom">
            <div className="flex items-center justify-between mb-8 md:mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Icon size={24} className="text-blue-600" />
                        <span className="text-xs md:text-sm font-bold tracking-widest uppercase text-neutral-600">
                            {subtitle}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight">
                        {title}
                    </h2>
                </div>
                <Link
                    to={link}
                    className="hidden md:flex items-center gap-2 text-sm font-bold hover:gap-3 transition-all uppercase"
                >
                    VIEW ALL <ArrowRight size={18} />
                </Link>
            </div>
            <AnimatedSection>
                <div className="product-grid">
                    {products.map((product) => (
                        <div key={product.id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </AnimatedSection>
        </div>
    </section>
);

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [activeFilter, setActiveFilter] = useState('View All');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await apiFetch('/products');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) { setProducts(data); return; }
                }
            } catch (err) {
                console.log('API failed, loading fallback:', err.message);
            }
            const { products: fallback } = await import('../data/products');
            setProducts(fallback);
        };
        fetchProducts();
    }, []);

    const isMensProduct = (p) => (p.gender === 'men' || p.gender === 'unisex') && p.category !== 'Sneakers' && p.category !== 'Running';

    const newArrivals = products.filter(p => isMensProduct(p) && (p.badges?.includes('NEW') || p.id.startsWith('men')));

    const filteredNewArrivals = newArrivals.filter(p => {
        if (activeFilter === 'View All') return true;
        const sub = p.subcategory?.toLowerCase() || '';
        const name = p.name?.toLowerCase() || '';
        if (activeFilter === 'Shirts') {
            return sub === 'shirts' || name.includes('shirt') || sub === 'polos';
        }
        if (activeFilter === 'Polo T-shirts') {
            return sub === 'polos' || name.includes('polo');
        }
        if (activeFilter === 'T-shirts') {
            return sub === 't-shirts' || name.includes('tee') || name.includes('t-shirt');
        }
        if (activeFilter === 'Trousers') {
            return sub === 'trousers' || sub === 'shorts' || name.includes('shorts') || name.includes('pant') || name.includes('jogger');
        }
        return true;
    });

    return (
        <div>
            <Hero />

            {/* Trending Banner */}
            {/* <section className="bg-black text-white py-3 md:py-4">
                <div className="container-custom">
                    <div className="flex items-center justify-center gap-3 text-sm md:text-base font-bold tracking-wider">
                        <TrendingUp size={20} className="text-yellow-400" />
                        <span className="uppercase">TRENDING: VELOCITY NITRO 4 | SCUDERIA FERRARI | TRAINING HOODIE</span>
                        <TrendingUp size={20} className="text-yellow-400" />
                    </div>
                </div>
            </section> */}

            {/* Featured Categories Grid */}
            <section className="container-custom py-12 md:py-20">
                <AnimatedSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {[
                            { title: "MEN'S APPAREL", subtitle: 'Clothing & Gear', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=75', link: '/collections/mens-clothing', badge: 'ESSENTIALS' },
                            { title: "MEN'S SHIRTS", subtitle: 'Trend Collection', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=75', link: '/collections/mens-clothing', badge: 'SHIRTS' },
                            { title: "MEN'S WINTERWEAR", subtitle: 'Stay Warm', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=75', link: '/collections/mens-clothing', badge: 'PUFFER' },
                            { title: "MEN'S MOTORSPORT", subtitle: 'Racing Heritage', image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=75', link: '/collections/mens-clothing', badge: 'FERRARI' },
                        ].map((cat, i) => (
                            <div key={i}>
                                <Link to={cat.link} className="relative h-80 md:h-96 rounded-xl overflow-hidden group block">
                                    <img
                                        src={cat.image}
                                        alt={cat.title}
                                        width={600}
                                        height={800}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white text-black text-xs font-bold tracking-wider uppercase rounded-full">{cat.badge}</span>
                                    </div>
                                    <div className="absolute bottom-6 left-6 right-6 text-white">
                                        <p className="text-xs md:text-sm font-semibold tracking-widest uppercase mb-2 opacity-90">{cat.subtitle}</p>
                                        <h3 className="text-2xl md:text-3xl font-black mb-3 tracking-tight">{cat.title}</h3>
                                        <div className="flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all">
                                            SHOP NOW <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </section>
            {/* New Drops Section (Similar to screenshot layout) */}
            <section className="bg-white py-12 md:py-20 border-t border-neutral-100">
                <div className="container-custom">
                    {/* Header */}
                    <div className="text-center mb-10 md:mb-14">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase mb-2">
                            NEW DROPS
                        </h2>
                        <p className="text-neutral-600 text-sm md:text-base font-medium">
                            Exclusive Styles For You
                        </p>
                    </div>

                    <AnimatedSection>
                        <NewDropsCarousel items={newDropsItems} />
                    </AnimatedSection>
                </div>
            </section>

            {/* Shop By Category Grid (Nitro Collection Replacement) */}
            <section className="bg-white py-12 md:py-20 border-t border-neutral-100">
                <div className="container-custom">
                    <div className="flex items-center justify-between mb-8 md:mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Shirt size={24} className="text-blue-600" />
                                <span className="text-xs md:text-sm font-bold tracking-widest uppercase text-neutral-600">
                                    Browse Collections
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase">
                                Shop by Category
                            </h2>
                        </div>
                    </div>

                    <AnimatedSection>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                            {apparelCategories.map((cat, i) => (
                                <Link
                                    key={i}
                                    to={cat.href}
                                    className="relative h-64 sm:h-72 rounded-xl overflow-hidden group block shadow-md hover:shadow-xl transition-all"
                                >
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        width={300}
                                        height={400}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Text Overlay */}
                                    <div className="absolute bottom-4 left-4 right-4 text-center z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                        {cat.promo ? (
                                            <p className="text-[10px] font-bold text-yellow-400 tracking-wider uppercase mb-1">
                                                SPECIAL OFFER
                                            </p>
                                        ) : null}
                                        <h3 className="text-xs sm:text-sm md:text-base font-black tracking-tight text-white uppercase whitespace-pre-line leading-tight">
                                            {cat.name}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* Quick Autoscrolling Marquee Banner */}
            <div className="bg-[#FFCC00] py-3.5 overflow-hidden whitespace-nowrap select-none border-y-2 border-black flex items-center">
                <div className="animate-marquee flex items-center text-black text-lg md:text-2xl font-black uppercase tracking-wider">
                    {Array(8).fill(null).map((_, i) => (
                        <span key={i} className="mx-12 flex items-center gap-1.5 flex-shrink-0">
                            <span>Making</span>
                            <span style={{ WebkitTextStroke: '1.2px black', color: 'transparent' }} className="font-extrabold">Global Fashion</span>
                            <span>Accessible</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* New Arrivals Section (Similar to Second Image) */}
            <section className="bg-white py-16 md:py-24">
                <div className="container-custom">
                    {/* Header */}
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase mb-2">
                            NEW ARRIVALS
                        </h2>
                        <p className="text-neutral-600 text-sm md:text-base font-medium">
                            Get them before everyone else does
                        </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap justify-center items-center gap-3 mb-10 md:mb-14">
                        {['View All', 'Shirts', 'Polo T-shirts', 'T-shirts', 'Trousers'].map((filterName) => {
                            const isActive = activeFilter === filterName;
                            return (
                                <button
                                    key={filterName}
                                    onClick={() => setActiveFilter(filterName)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide border transition-all uppercase ${
                                        isActive
                                            ? 'bg-black text-white border-black shadow-md'
                                            : 'bg-white text-black border-neutral-200 hover:border-black hover:bg-neutral-50'
                                    }`}
                                >
                                    {filterName}
                                </button>
                            );
                        })}
                    </div>

                    {/* Products Carousel */}
                    <AnimatedSection>
                        <NewArrivalsCarousel products={filteredNewArrivals} />
                    </AnimatedSection>
                </div>
            </section>

            {/* Floating Notification Bell Button */}
            <button
                className="fixed bottom-6 right-6 w-14 h-14 bg-[#FFCC00] text-black shadow-2xl rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 border border-black/10 hover:shadow-[#FFCC00]/25 hover:shadow-lg"
                aria-label="Notifications"
            >
                <span className="relative">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                </span>
            </button>
        </div>
    );
};

export default HomePage;
