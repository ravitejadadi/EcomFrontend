import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Award, Users, Globe } from 'lucide-react';

const AboutPage = () => {
    const values = [
        { icon: Zap, title: 'Performance First', desc: 'Every product is engineered for peak performance — from the track to the streets.' },
        { icon: Award, title: 'Uncompromising Quality', desc: 'We source the finest materials and use premium craftsmanship at every step.' },
        { icon: Users, title: 'Community Driven', desc: 'Built by athletes, for athletes. Our community shapes everything we create.' },
        { icon: Globe, title: 'Sustainable Future', desc: 'Committed to reducing our environmental footprint through responsible sourcing.' },
    ];

    const milestones = [
        { year: '2022', title: 'Founded', desc: 'THE ELEGANT was born in Mumbai with a vision to bring world-class sportswear to India.' },
        { year: '2023', title: 'First Collection', desc: 'Launched our debut running and sneaker collection, selling out within 48 hours.' },
        { year: '2024', title: 'Pan-India Expansion', desc: 'Expanded to all major Indian cities with express delivery and 3 experience stores.' },
        { year: '2025', title: 'Digital Innovation', desc: 'Launched our mobile app and AI-powered size recommendation system.' },
        { year: '2026', title: 'The Future', desc: 'Expanding to new categories and planning our first international market entry.' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <div className="relative min-h-[60vh] bg-black flex items-center overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80"
                    alt="THE ELEGANT"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                <div className="container-custom relative z-10 py-24">
                    <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-4">About Us</p>
                    <h1 className="text-5xl md:text-7xl font-black font-display tracking-tight text-white mb-6 max-w-3xl leading-tight">
                        WE ARE THE ELEGANT.
                    </h1>
                    <p className="text-neutral-300 text-xl max-w-xl leading-relaxed">
                        India's premier destination for performance sportswear, lifestyle sneakers, and active clothing.
                    </p>
                </div>
            </div>

            {/* Mission */}
            <section className="bg-neutral-50 py-16 md:py-24">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">Our Mission</p>
                        <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight mb-6">
                            FOREVER FASTER. FOREVER STYLISH.
                        </h2>
                        <p className="text-neutral-600 text-lg leading-relaxed">
                            THE ELEGANT was founded on a simple belief: every person deserves world-class athletic and lifestyle wear at honest prices.
                            We curate the finest products from leading global brands, making elite performance accessible to all Indians who live
                            and breathe sport, fitness, and style.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 md:py-24">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-3">What Drives Us</p>
                        <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight">OUR VALUES</h2>
                    </div>
                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {values.map(({ icon: Icon, title, desc }) => (
                            <motion.div key={title} variants={itemVariants} className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                                <div className="p-3 bg-black text-white rounded-xl w-fit mb-4">
                                    <Icon size={22} />
                                </div>
                                <h3 className="font-black font-display uppercase tracking-tight text-lg mb-2">{title}</h3>
                                <p className="text-sm text-neutral-600 leading-relaxed">{desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Story / Timeline */}
            <section className="bg-black text-white py-16 md:py-24">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-3">Our Journey</p>
                        <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight">THE ELEGANT STORY</h2>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-8">
                        {milestones.map(({ year, title, desc }, i) => (
                            <div key={year} className="flex gap-6">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">
                                        {year.slice(2)}
                                    </div>
                                    {i < milestones.length - 1 && <div className="w-px flex-1 bg-neutral-700 mt-2" />}
                                </div>
                                <div className="pb-8">
                                    <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-1">{year}</p>
                                    <h4 className="font-black font-display uppercase tracking-tight text-white text-lg mb-2">{title}</h4>
                                    <p className="text-neutral-400 text-sm leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social proof / Stats */}
            <section className="py-16 md:py-24">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { number: '50,000+', label: 'Happy Customers' },
                            { number: '500+', label: 'Products Available' },
                            { number: '28+', label: 'Brands Curated' },
                            { number: '100%', label: 'Authentic Guarantee' },
                        ].map(({ number, label }) => (
                            <div key={label} className="p-6 border-2 border-neutral-200 rounded-2xl">
                                <div className="text-4xl md:text-5xl font-black font-display mb-2">{number}</div>
                                <p className="text-sm font-bold uppercase tracking-wider text-neutral-500">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-neutral-900 text-white py-16 md:py-24">
                <div className="container-custom text-center">
                    <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight mb-4">
                        JOIN THE MOVEMENT
                    </h2>
                    <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
                        Shop the latest collections and experience the THE ELEGANT difference.
                    </p>
                    <Link to="/collections/new-arrivals" className="btn bg-white text-black hover:bg-neutral-200 btn-lg uppercase flex items-center gap-2 w-fit mx-auto">
                        Shop Now <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
