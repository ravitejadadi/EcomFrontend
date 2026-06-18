import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactPage = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(r => setTimeout(r, 800));
        setSubmitted(true);
        setLoading(false);
    };

    const contactInfo = [
        { icon: Phone, label: 'Customer Service', value: '1800-123-4567', sub: 'Mon–Sat, 9AM–9PM IST' },
        { icon: Mail, label: 'Email Us', value: 'support@theelegant.in', sub: 'Response within 24 hours' },
        { icon: MapPin, label: 'Head Office', value: 'Mumbai, Maharashtra, India', sub: '400001' },
        { icon: Clock, label: 'Working Hours', value: 'Mon–Sat: 9AM–9PM', sub: 'Sun: 11AM–6PM' },
    ];

    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <div className="bg-black text-white py-16 md:py-24">
                <div className="container-custom text-center">
                    <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-4">Support</p>
                    <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight mb-4">CONTACT US</h1>
                    <p className="text-neutral-400 text-lg max-w-xl mx-auto">
                        Our team is here to help. Reach out and we'll get back to you as soon as possible.
                    </p>
                </div>
            </div>

            <div className="container-custom py-16 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Contact Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-black font-display uppercase tracking-tight">Get in Touch</h2>
                        <div className="space-y-4">
                            {contactInfo.map(({ icon: Icon, label, value, sub }) => (
                                <div key={label} className="flex gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                                    <div className="p-2.5 bg-black text-white rounded-lg h-fit">
                                        <Icon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-0.5">{label}</p>
                                        <p className="font-bold text-neutral-900">{value}</p>
                                        <p className="text-xs text-neutral-500 mt-0.5">{sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-black text-white rounded-xl p-6">
                            <h3 className="font-black font-display uppercase tracking-tight mb-2">Store Locator</h3>
                            <p className="text-neutral-400 text-sm mb-4">Find THE ELEGANT experience stores near you across India.</p>
                            <a href="/stores" className="btn bg-white text-black hover:bg-neutral-200 btn-sm uppercase w-full text-center">
                                Find a Store
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        {submitted ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center h-full py-20 text-center"
                            >
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle size={40} className="text-green-600" />
                                </div>
                                <h3 className="text-2xl font-black font-display uppercase tracking-tight mb-3">Message Sent!</h3>
                                <p className="text-neutral-600 max-w-sm mb-8">
                                    Thank you for reaching out. Our support team will respond within 24 hours.
                                </p>
                                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                                    className="btn btn-primary uppercase">
                                    Send Another Message
                                </button>
                            </motion.div>
                        ) : (
                            <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
                                <h2 className="text-2xl font-black font-display uppercase tracking-tight mb-6">Send a Message</h2>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Your Name</label>
                                            <input
                                                name="name" value={form.name} onChange={handleChange} required
                                                className="input" placeholder="e.g. Arjun Sharma"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Email Address</label>
                                            <input
                                                name="email" type="email" value={form.email} onChange={handleChange} required
                                                className="input" placeholder="you@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Subject</label>
                                        <select name="subject" value={form.subject} onChange={handleChange} required className="input">
                                            <option value="">Select a topic...</option>
                                            <option>Order Status / Tracking</option>
                                            <option>Returns & Exchanges</option>
                                            <option>Product Enquiry</option>
                                            <option>Payment Issue</option>
                                            <option>Feedback & Suggestions</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Message</label>
                                        <textarea
                                            name="message" value={form.message} onChange={handleChange} required
                                            rows="5" className="input resize-none"
                                            placeholder="Describe your issue or question in detail..."
                                        />
                                    </div>
                                    <button type="submit" disabled={loading}
                                        className="btn btn-primary w-full uppercase flex items-center justify-center gap-2">
                                        {loading ? 'Sending...' : (<><Send size={16} /> Send Message</>)}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
