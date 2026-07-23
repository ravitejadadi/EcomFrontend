const Section = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-xl font-black font-display uppercase tracking-tight mb-3 text-neutral-900">{title}</h2>
        <div className="text-sm text-neutral-700 leading-relaxed space-y-3">{children}</div>
    </div>
);

const PrivacyPage = () => (
    <div className="animate-fade-in">
        <div className="bg-black text-white py-16 md:py-24">
            <div className="container-custom text-center">
                <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-4">Legal</p>
                <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight mb-4">PRIVACY POLICY</h1>
                <p className="text-neutral-400">Last Updated: June 2026</p>
            </div>
        </div>

        <div className="container-custom py-16 md:py-20">
            <div className="max-w-3xl mx-auto">
                <p className="text-neutral-600 mb-10 text-sm leading-relaxed border-l-4 border-black pl-4">
                    THE ELEGANT ("we", "us", "our") is committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our website and services.
                </p>

                <Section title="1. Information We Collect">
                    <p>We collect information you provide directly to us, such as when you create an account, place an order, or contact us for support:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Name, email address, phone number, and password</li>
                        <li>Shipping and billing address</li>
                        <li>Payment information (processed securely by our payment partners — we do not store card details)</li>
                        <li>Order history and preferences</li>
                        <li>Communications you send us</li>
                    </ul>
                    <p>We also collect information automatically when you use our website, including your IP address, browser type, pages visited, and referring URLs.</p>
                </Section>

                <Section title="2. How We Use Your Information">
                    <p>We use the information we collect to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Process and fulfill your orders</li>
                        <li>Send order confirmations, updates, and shipping notifications</li>
                        <li>Respond to your questions and provide customer support</li>
                        <li>Send promotional communications (you may opt out at any time)</li>
                        <li>Improve our website, products, and services</li>
                        <li>Prevent fraud and ensure security</li>
                        <li>Comply with legal obligations</li>
                    </ul>
                </Section>

                <Section title="3. Sharing Your Information">
                    <p>We do not sell your personal information. We may share your information with:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Service Providers:</strong> Payment processors, shipping partners, and cloud infrastructure providers who help us operate our business</li>
                        <li><strong>Legal Requirements:</strong> When required by law or to protect the rights, property, or safety of THE ELEGANT, our customers, or others</li>
                        <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                    </ul>
                </Section>

                <Section title="4. Cookies & Tracking">
                    <p>We use cookies and similar tracking technologies to improve your browsing experience, analyse site traffic, and personalise content. Types of cookies we use:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Essential Cookies:</strong> Required for the website to function (e.g., cart, login sessions)</li>
                        <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site</li>
                        <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                    </ul>
                    <p>You can control cookie preferences through your browser settings.</p>
                </Section>

                <Section title="5. Data Security">
                    <p>We implement industry-standard security measures including SSL encryption, secure password hashing, and restricted data access to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
                </Section>

                <Section title="6. Your Rights">
                    <p>Under applicable Indian data protection laws (IT Act 2000 and DPDP Act 2023), you have the right to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Access the personal data we hold about you</li>
                        <li>Correct inaccurate or incomplete data</li>
                        <li>Request deletion of your personal data</li>
                        <li>Opt out of marketing communications</li>
                        <li>Lodge a complaint with the Data Protection Board</li>
                    </ul>
                    <p>To exercise these rights, contact us at theelegant2327@gmail.com</p>
                </Section>

                <Section title="7. Children's Privacy">
                    <p>Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.</p>
                </Section>

                <Section title="8. Changes to This Policy">
                    <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by placing a prominent notice on our website. Your continued use of our services after changes constitutes acceptance of the updated policy.</p>
                </Section>

                <Section title="9. Contact Us">
                    <p>For privacy-related questions or concerns:</p>
                    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mt-2">
                        <p><strong>THE ELEGANT — Privacy Team</strong></p>
                        <p>Email: theelegant2327@gmail.com</p>
                        <p>Phone: 8125632327</p>
                        <p>Address: Tirupathi, Andhra Pradesh, India — 517501</p>
                    </div>
                </Section>
            </div>
        </div>
    </div>
);

export default PrivacyPage;
