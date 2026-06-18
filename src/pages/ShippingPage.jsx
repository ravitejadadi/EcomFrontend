import { Truck, Clock, MapPin, Package, AlertCircle, CheckCircle } from 'lucide-react';

const ShippingPage = () => {
    const shippingOptions = [
        {
            icon: Truck,
            title: 'Standard Delivery',
            time: '5–7 Business Days',
            cost: '₹99',
            detail: 'Available for all pin codes across India',
            free: false,
        },
        {
            icon: Package,
            title: 'Express Delivery',
            time: '2–3 Business Days',
            cost: '₹199',
            detail: 'Available in major metros: Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune',
            free: false,
        },
        {
            icon: CheckCircle,
            title: 'Free Standard Shipping',
            time: '5–7 Business Days',
            cost: 'FREE',
            detail: 'On all orders above ₹2,500',
            free: true,
        },
    ];

    const faqs = [
        { q: 'How do I track my order?', a: 'Once your order ships, you\'ll receive a confirmation email with a tracking link. You can also track anytime on the Track Order page using your Order ID.' },
        { q: 'Do you ship internationally?', a: 'Currently, THE ELEGANT ships within India only. International shipping is coming soon.' },
        { q: 'What happens if I miss a delivery?', a: 'Our courier partner will attempt delivery up to 3 times. After that, the package is returned to our warehouse and a full refund is processed.' },
        { q: 'Can I change my delivery address after placing an order?', a: 'Address changes are possible within 2 hours of placing your order. Please contact customer support immediately.' },
    ];

    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <div className="bg-black text-white py-16 md:py-24">
                <div className="container-custom text-center">
                    <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-4">Support</p>
                    <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight mb-4">SHIPPING & DELIVERY</h1>
                    <p className="text-neutral-400 text-lg max-w-xl mx-auto">
                        Fast, reliable delivery across India. Free shipping on orders above ₹2,500.
                    </p>
                </div>
            </div>

            <div className="container-custom py-16 md:py-20 space-y-16">
                {/* Shipping Options */}
                <section>
                    <h2 className="text-2xl md:text-3xl font-black font-display uppercase tracking-tight mb-8">Delivery Options</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {shippingOptions.map(({ icon: Icon, title, time, cost, detail, free }) => (
                            <div key={title} className={`rounded-2xl p-6 border-2 ${free ? 'border-black bg-black text-white' : 'border-neutral-200 bg-white'}`}>
                                <div className={`p-3 rounded-xl w-fit mb-4 ${free ? 'bg-white text-black' : 'bg-neutral-100 text-black'}`}>
                                    <Icon size={24} />
                                </div>
                                <h3 className="font-black font-display text-lg uppercase tracking-tight mb-1">{title}</h3>
                                <div className={`text-2xl font-black mb-3 ${free ? 'text-white' : 'text-neutral-900'}`}>{cost}</div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock size={14} className={free ? 'text-neutral-300' : 'text-neutral-500'} />
                                    <span className={`text-sm font-semibold ${free ? 'text-neutral-300' : 'text-neutral-600'}`}>{time}</span>
                                </div>
                                <p className={`text-sm ${free ? 'text-neutral-400' : 'text-neutral-500'}`}>{detail}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Timeline */}
                <section className="bg-neutral-50 rounded-2xl p-8 md:p-12">
                    <h2 className="text-2xl md:text-3xl font-black font-display uppercase tracking-tight mb-8">Order Timeline</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { step: '01', title: 'Order Placed', desc: 'You receive a confirmation email immediately' },
                            { step: '02', title: 'Processing', desc: 'We verify and pack your order within 24 hours' },
                            { step: '03', title: 'Dispatched', desc: 'Handed to courier. Tracking email sent' },
                            { step: '04', title: 'Delivered', desc: 'Package arrives at your doorstep' },
                        ].map(({ step, title, desc }) => (
                            <div key={step} className="text-center">
                                <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 font-black text-lg">{step}</div>
                                <h4 className="font-black font-display uppercase tracking-tight mb-2">{title}</h4>
                                <p className="text-sm text-neutral-600">{desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Important Notes */}
                <section>
                    <h2 className="text-2xl md:text-3xl font-black font-display uppercase tracking-tight mb-6">Important Notes</h2>
                    <div className="space-y-3">
                        {[
                            'Delivery times are estimates and may vary due to public holidays or extreme weather conditions.',
                            'Orders placed after 3PM IST are processed on the next business day.',
                            'Cash on Delivery (COD) is available for orders up to ₹10,000.',
                            'Bulky items (e.g., large shoe boxes) may incur an additional handling fee of ₹50.',
                            'We currently do not ship to PO Boxes or APO/FPO addresses.',
                        ].map((note, i) => (
                            <div key={i} className="flex gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                                <AlertCircle size={18} className="text-neutral-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-neutral-700">{note}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQs */}
                <section>
                    <h2 className="text-2xl md:text-3xl font-black font-display uppercase tracking-tight mb-6">Shipping FAQs</h2>
                    <div className="space-y-4">
                        {faqs.map(({ q, a }) => (
                            <div key={q} className="border border-neutral-200 rounded-xl p-6">
                                <h4 className="font-bold text-neutral-900 mb-2">{q}</h4>
                                <p className="text-sm text-neutral-600 leading-relaxed">{a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <div className="bg-black text-white rounded-2xl p-8 md:p-12 text-center">
                    <h3 className="text-2xl md:text-3xl font-black font-display uppercase tracking-tight mb-3">Need Help?</h3>
                    <p className="text-neutral-400 mb-6">Our support team is available Mon–Sat, 9AM to 9PM IST.</p>
                    <a href="/contact" className="btn bg-white text-black hover:bg-neutral-200 uppercase">Contact Support</a>
                </div>
            </div>
        </div>
    );
};

export default ShippingPage;
