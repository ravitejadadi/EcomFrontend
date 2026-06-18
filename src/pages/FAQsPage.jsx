import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqData = [
    {
        category: 'Orders & Payments',
        faqs: [
            { q: 'How do I place an order?', a: 'Browse our collections, select your size and color, add to cart, and proceed to checkout. You can check out as a guest or sign in for a faster experience.' },
            { q: 'What payment methods do you accept?', a: 'We accept UPI (GPay, PhonePe, Paytm), Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking, and Cash on Delivery (COD) for orders up to ₹10,000.' },
            { q: 'Can I modify or cancel my order?', a: 'Orders can be modified or cancelled within 2 hours of placement. After that, the order enters processing and cannot be changed. Contact our support team immediately if you need to make changes.' },
            { q: 'Is my payment information secure?', a: 'Yes. All payments are processed through PCI-DSS compliant payment gateways. We do not store your card details on our servers.' },
            { q: 'Will I receive an order confirmation?', a: 'Yes, you\'ll receive an email confirmation immediately after placing your order. If you don\'t see it, check your spam folder or contact support.' },
        ],
    },
    {
        category: 'Shipping & Delivery',
        faqs: [
            { q: 'How long does delivery take?', a: 'Standard delivery takes 5–7 business days. Express delivery (available in major metros) takes 2–3 business days.' },
            { q: 'How do I track my order?', a: 'Once your order ships, you\'ll receive a tracking link via email. You can also use our Track Order page with your Order ID.' },
            { q: 'Do you offer free shipping?', a: 'Yes! All orders above ₹2,500 qualify for free standard shipping across India.' },
            { q: 'Do you ship internationally?', a: 'Currently, we only ship within India. International shipping is coming soon — sign up for our newsletter to be notified.' },
        ],
    },
    {
        category: 'Returns & Exchanges',
        faqs: [
            { q: 'What is your return policy?', a: 'We offer a 30-day return policy for all eligible items. Items must be unworn, unwashed, and with original tags attached.' },
            { q: 'How do I initiate a return?', a: 'Contact our support team with your Order ID and reason for return. We\'ll schedule a free pickup within 2–3 business days.' },
            { q: 'How long do refunds take?', a: 'Refunds are processed within 5–7 business days after we receive and inspect the returned item.' },
            { q: 'Can I exchange for a different size?', a: 'Yes! We offer free exchanges for different sizes, subject to stock availability. Exchanges are dispatched within 24 hours of receiving your return.' },
        ],
    },
    {
        category: 'Products & Sizing',
        faqs: [
            { q: 'How do I find my size?', a: 'Visit our Size Guide page for comprehensive size charts covering apparel, footwear, and kids\' items. If in doubt, size up.' },
            { q: 'Are your products authentic?', a: 'Absolutely. All THE ELEGANT products are 100% authentic and sourced directly. We guarantee the quality of every item we sell.' },
            { q: 'Do you restock sold-out items?', a: 'Popular items are regularly restocked. Enable email notifications on the product page to be alerted when your size is back.' },
        ],
    },
    {
        category: 'Account & Loyalty',
        faqs: [
            { q: 'Do I need an account to shop?', a: 'No, you can check out as a guest. However, creating an account lets you track orders, save addresses, and view order history.' },
            { q: 'How do I reset my password?', a: 'On the login page, click "Forgot Password" and enter your email. You\'ll receive a reset link within 5 minutes.' },
            { q: 'Is there a loyalty or rewards program?', a: 'A loyalty program is coming soon! Sign up for our newsletter to be among the first to know when it launches.' },
        ],
    },
];

const FAQItem = ({ q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-neutral-200 rounded-xl overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-neutral-50 transition-colors"
            >
                <span className="font-bold text-neutral-900 pr-4">{q}</span>
                <ChevronDown
                    size={18}
                    className={`flex-shrink-0 text-neutral-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open && (
                <div className="px-5 pb-5 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-4">
                    {a}
                </div>
            )}
        </div>
    );
};

const FAQsPage = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const categories = ['All', ...faqData.map(d => d.category)];

    const filtered = activeCategory === 'All' ? faqData : faqData.filter(d => d.category === activeCategory);

    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <div className="bg-black text-white py-16 md:py-24">
                <div className="container-custom text-center">
                    <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-4">Support</p>
                    <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight mb-4">FAQs</h1>
                    <p className="text-neutral-400 text-lg max-w-xl mx-auto">
                        Answers to the most common questions about shopping with THE ELEGANT.
                    </p>
                </div>
            </div>

            <div className="container-custom py-16 md:py-20">
                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-10">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 text-sm font-bold uppercase rounded-lg transition-all ${
                                activeCategory === cat ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-10">
                    {filtered.map(({ category, faqs }) => (
                        <div key={category}>
                            <h2 className="text-lg font-black font-display uppercase tracking-tight text-neutral-900 mb-4 pb-2 border-b border-neutral-200">
                                {category}
                            </h2>
                            <div className="space-y-3">
                                {faqs.map(faq => (
                                    <FAQItem key={faq.q} {...faq} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still have questions */}
                <div className="mt-16 bg-black text-white rounded-2xl p-8 md:p-12 text-center">
                    <h3 className="text-2xl md:text-3xl font-black font-display uppercase tracking-tight mb-3">Still Have Questions?</h3>
                    <p className="text-neutral-400 mb-6">Our customer support team is available Mon–Sat, 9AM–9PM IST.</p>
                    <a href="/contact" className="btn bg-white text-black hover:bg-neutral-200 uppercase">Contact Us</a>
                </div>
            </div>
        </div>
    );
};

export default FAQsPage;
