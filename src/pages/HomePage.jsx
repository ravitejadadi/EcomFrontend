import Hero from '../components/home/Hero';
import ProductCard from '../components/product/ProductCard';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, TrendingUp, Award, Dumbbell, Trophy, Shirt } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../utils/api';

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

    const runningShoes = products.filter(p => p.category === 'Running').slice(0, 4);
    const sneakers = products.filter(p => p.category === 'Sneakers').slice(0, 4);
    const mensClothing = products.filter(p => p.category === 'Mens Clothing').slice(0, 4);
    const womensClothing = products.filter(p => p.category === 'Womens Clothing').slice(0, 4);
    const kidsProducts = products.filter(p => p.category === 'Kids').slice(0, 4);
    const accessories = products.filter(p => p.category === 'Accessories').slice(0, 4);
    const newArrivals = products.filter(p => p.badges?.includes('NEW')).slice(0, 4);
    const bestsellers = products.filter(p => p.badges?.includes('BESTSELLER')).slice(0, 4);
    const saleProducts = products.filter(p => p.badges?.includes('SALE')).slice(0, 4);

    return (
        <div>
            <Hero />

            {/* Trending Banner */}
            <section className="bg-black text-white py-3 md:py-4">
                <div className="container-custom">
                    <div className="flex items-center justify-center gap-3 text-sm md:text-base font-bold tracking-wider">
                        <TrendingUp size={20} className="text-yellow-400" />
                        <span className="uppercase">TRENDING: SPEEDCAT | PALERMO | VELOCITY NITRO 4</span>
                        <TrendingUp size={20} className="text-yellow-400" />
                    </div>
                </div>
            </section>

            {/* Featured Categories Grid */}
            <section className="container-custom py-12 md:py-20">
                <AnimatedSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {[
                            { title: 'RUNNING', subtitle: 'Performance', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=75', link: '/collections/running', badge: 'NITRO' },
                            { title: 'SNEAKERS', subtitle: 'Lifestyle', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=75', link: '/collections/sneakers', badge: 'ICONIC' },
                            { title: 'TRAINING', subtitle: 'Gym & Fitness', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=75', link: '/collections/training', badge: 'POWER' },
                            { title: 'MOTORSPORT', subtitle: 'Racing', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75', link: '/collections/motorsport', badge: 'FERRARI' },
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

            {/* New Arrivals — above the fold categories before the heavy 3D section */}
            <CategorySection
                title="NEW ARRIVALS"
                subtitle="Just Dropped"
                icon={Zap}
                products={newArrivals}
                link="/collections/new-arrivals"
                bgColor="bg-neutral-50"
            />

            {/* Running Collection */}
            <CategorySection
                title="NITRO COLLECTION"
                subtitle="Performance Running"
                icon={Award}
                products={runningShoes}
                link="/collections/running"
                bgColor="bg-white"
            />

            {/* Men's Clothing */}
            <CategorySection
                title="MEN'S ESSENTIALS"
                subtitle="Apparel & Gear"
                icon={Shirt}
                products={mensClothing}
                link="/collections/mens-clothing"
                bgColor="bg-neutral-50"
            />

            {/* Women's Clothing */}
            <CategorySection
                title="WOMEN'S ACTIVEWEAR"
                subtitle="Train in Style"
                icon={Dumbbell}
                products={womensClothing}
                link="/collections/womens-clothing"
                bgColor="bg-white"
            />

            {/* Dual Banners */}
            <section className="container-custom py-12 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link to="/collections/speedcat" className="relative h-96 md:h-[500px] rounded-xl overflow-hidden group">
                        <img
                            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=75"
                            alt="Speedcat"
                            width={800}
                            height={500}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                            <span className="px-4 py-1.5 bg-white text-black text-xs font-bold tracking-widest uppercase rounded-full mb-4">MOTORSPORT</span>
                            <h3 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">SPEEDCAT</h3>
                            <p className="text-lg mb-6 max-w-md">Racing heritage meets street style</p>
                            <span className="inline-flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all">SHOP NOW <ArrowRight size={16} /></span>
                        </div>
                    </Link>
                    <Link to="/collections/ferrari" className="relative h-96 md:h-[500px] rounded-xl overflow-hidden group">
                        <img
                            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=75"
                            alt="Ferrari"
                            width={800}
                            height={500}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-red-900 via-red-900/60 to-transparent" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                            <span className="px-4 py-1.5 bg-white text-red-600 text-xs font-bold tracking-widest uppercase rounded-full mb-4">OFFICIAL</span>
                            <h3 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">SCUDERIA FERRARI</h3>
                            <p className="text-lg mb-6 max-w-md">Wear the passion</p>
                            <span className="inline-flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all">DISCOVER <ArrowRight size={16} /></span>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Bestsellers */}
            <CategorySection
                title="BESTSELLERS"
                subtitle="Customer Favorites"
                icon={Award}
                products={bestsellers}
                link="/collections/bestsellers"
                bgColor="bg-neutral-50"
            />

            {/* Sneaker Store */}
            <CategorySection
                title="SNEAKER STORE"
                subtitle="Lifestyle Classics"
                icon={TrendingUp}
                products={sneakers}
                link="/collections/sneakers"
                bgColor="bg-white"
            />

            {/* Kids Zone */}
            <CategorySection
                title="KIDS ZONE"
                subtitle="For Young Athletes"
                icon={Trophy}
                products={kidsProducts}
                link="/collections/kids"
                bgColor="bg-neutral-50"
            />

            {/* Accessories */}
            <CategorySection
                title="ACCESSORIES"
                subtitle="Complete Your Look"
                icon={Shirt}
                products={accessories}
                link="/collections/accessories"
                bgColor="bg-white"
            />

            {/* Sale Section */}
            {saleProducts.length > 0 && (
                <section className="bg-red-600 text-white py-12 md:py-20">
                    <div className="container-custom">
                        <div className="text-center mb-8 md:mb-12">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">SALE</h2>
                            <p className="text-xl md:text-2xl">Up to 40% OFF on selected items</p>
                        </div>
                        <AnimatedSection>
                            <div className="product-grid">
                                {saleProducts.map((product) => (
                                    <div key={product.id}>
                                        <ProductCard product={product} inverted={true} />
                                    </div>
                                ))}
                            </div>
                        </AnimatedSection>
                        <div className="text-center mt-8">
                            <Link to="/collections/sale" className="btn btn-lg bg-white text-red-600 hover:bg-neutral-100 uppercase">
                                SHOP ALL SALE
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Features */}
            <section className="bg-black text-white py-12 md:py-16">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">🚚</div>
                            <h3 className="font-bold text-lg mb-2 uppercase tracking-wider">FREE SHIPPING</h3>
                            <p className="text-neutral-400 text-sm">On orders above ₹2,500</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">🔄</div>
                            <h3 className="font-bold text-lg mb-2 uppercase tracking-wider">EASY RETURNS</h3>
                            <p className="text-neutral-400 text-sm">30-day return policy</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
                            <h3 className="font-bold text-lg mb-2 uppercase tracking-wider">AUTHENTIC</h3>
                            <p className="text-neutral-400 text-sm">100% genuine products</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
