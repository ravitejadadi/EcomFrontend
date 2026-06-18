import { RefreshCw, CheckCircle, XCircle, Clock, Package, CreditCard, AlertCircle } from 'lucide-react';

const ReturnsPage = () => {
    const eligibleItems = [
        'Unworn and unwashed items with original tags attached',
        'Items in original packaging or shoe box',
        'Accessories in original sealed packaging',
        'Items purchased in the last 30 days',
    ];

    const ineligibleItems = [
        'Items marked as "Final Sale" or "Non-Returnable"',
        'Worn, washed, or altered items',
        'Items without original tags',
        'Customised or personalised products',
        'Innerwear, socks, and swimwear for hygiene reasons',
    ];

    const steps = [
        { step: '01', title: 'Initiate Return', desc: 'Contact our support team or use the Return Request form. Provide your Order ID and reason for return.' },
        { step: '02', title: 'Pack Securely', desc: 'Pack the item(s) in the original packaging with all tags attached. Include a copy of your order confirmation.' },
        { step: '03', title: 'Schedule Pickup', desc: 'We\'ll arrange a free courier pickup from your address within 2–3 business days.' },
        { step: '04', title: 'Inspection', desc: 'Our quality team inspects the returned item(s) within 1–2 business days of receipt.' },
        { step: '05', title: 'Refund / Exchange', desc: 'Approved refunds are processed within 5–7 business days. Exchanges are dispatched immediately.' },
    ];

    const refundMethods = [
        { method: 'Original Payment Method', time: '5–7 Business Days', icon: CreditCard },
        { method: 'THE ELEGANT Store Credit', time: '1–2 Business Days (instant if COD)', icon: RefreshCw },
    ];

    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <div className="bg-black text-white py-16 md:py-24">
                <div className="container-custom text-center">
                    <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-4">Support</p>
                    <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight mb-4">RETURNS & EXCHANGES</h1>
                    <p className="text-neutral-400 text-lg max-w-xl mx-auto">
                        Not quite right? No worries. Easy 30-day returns with free pickup.
                    </p>
                </div>
            </div>

            <div className="container-custom py-16 md:py-20 space-y-16">
                {/* Policy Summary */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: Clock, title: '30-Day Window', desc: 'Return or exchange any eligible item within 30 days of delivery.' },
                        { icon: Package, title: 'Free Pickup', desc: 'We arrange a free courier pickup right from your door.' },
                        { icon: CreditCard, title: 'Quick Refunds', desc: 'Refunds processed within 5–7 business days to your original payment method.' },
                    ].map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100 text-center">
                            <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon size={24} />
                            </div>
                            <h3 className="font-black font-display uppercase tracking-tight text-lg mb-2">{title}</h3>
                            <p className="text-sm text-neutral-600">{desc}</p>
                        </div>
                    ))}
                </section>

                {/* Return Steps */}
                <section>
                    <h2 className="text-2xl md:text-3xl font-black font-display uppercase tracking-tight mb-8">How to Return</h2>
                    <div className="space-y-4">
                        {steps.map(({ step, title, desc }) => (
                            <div key={step} className="flex gap-6 p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm">
                                <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0">
                                    {step}
                                </div>
                                <div>
                                    <h4 className="font-black font-display uppercase tracking-tight mb-1">{title}</h4>
                                    <p className="text-sm text-neutral-600 leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Eligible / Ineligible */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle size={20} className="text-green-600" />
                            <h3 className="font-black font-display uppercase tracking-tight">Eligible for Returns</h3>
                        </div>
                        <ul className="space-y-3">
                            {eligibleItems.map(item => (
                                <li key={item} className="flex gap-3 text-sm text-neutral-700">
                                    <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                        <div className="flex items-center gap-2 mb-4">
                            <XCircle size={20} className="text-red-600" />
                            <h3 className="font-black font-display uppercase tracking-tight">Not Eligible</h3>
                        </div>
                        <ul className="space-y-3">
                            {ineligibleItems.map(item => (
                                <li key={item} className="flex gap-3 text-sm text-neutral-700">
                                    <XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Refund Methods */}
                <section>
                    <h2 className="text-2xl md:text-3xl font-black font-display uppercase tracking-tight mb-6">Refund Methods</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {refundMethods.map(({ method, time, icon: Icon }) => (
                            <div key={method} className="flex gap-4 p-5 bg-white border border-neutral-200 rounded-2xl shadow-sm">
                                <div className="p-3 bg-black text-white rounded-xl h-fit">
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-neutral-900 mb-1">{method}</h4>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} className="text-neutral-400" />
                                        <span className="text-sm text-neutral-600">{time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
                        <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">COD orders are refunded as store credit. To receive refund to bank account, please provide bank details to our support team.</p>
                    </div>
                </section>

                {/* CTA */}
                <div className="bg-black text-white rounded-2xl p-8 md:p-12 text-center">
                    <h3 className="text-2xl md:text-3xl font-black font-display uppercase tracking-tight mb-3">Start a Return</h3>
                    <p className="text-neutral-400 mb-6">Contact our support team to initiate your return or exchange.</p>
                    <a href="/contact" className="btn bg-white text-black hover:bg-neutral-200 uppercase">Contact Support</a>
                </div>
            </div>
        </div>
    );
};

export default ReturnsPage;
