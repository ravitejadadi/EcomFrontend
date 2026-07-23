const Section = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-xl font-black font-display uppercase tracking-tight mb-3 text-neutral-900">{title}</h2>
        <div className="text-sm text-neutral-700 leading-relaxed space-y-3">{children}</div>
    </div>
);

const TermsPage = () => (
    <div className="animate-fade-in">
        <div className="bg-black text-white py-16 md:py-24">
            <div className="container-custom text-center">
                <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-4">Legal</p>
                <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight mb-4">TERMS & CONDITIONS</h1>
                <p className="text-neutral-400">Last Updated: June 2026</p>
            </div>
        </div>

        <div className="container-custom py-16 md:py-20">
            <div className="max-w-3xl mx-auto">
                <p className="text-neutral-600 mb-10 text-sm leading-relaxed border-l-4 border-black pl-4">
                    Please read these Terms and Conditions carefully before using the THE ELEGANT website. By accessing or using our services, you agree to be bound by these Terms.
                </p>

                <Section title="1. Acceptance of Terms">
                    <p>By using our website (theelegant.in) and placing orders, you confirm that you are at least 18 years of age, or have the consent of a parent or guardian, and that you accept these Terms and Conditions in full.</p>
                </Section>

                <Section title="2. Products & Pricing">
                    <p>We strive to ensure all product information, descriptions, and prices are accurate. However:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Prices are displayed in Indian Rupees (INR) and include applicable taxes (GST)</li>
                        <li>We reserve the right to modify prices at any time without notice</li>
                        <li>In the event of a pricing error, we will notify you before processing your order</li>
                        <li>Product images are for illustration purposes only; actual colours may vary slightly</li>
                        <li>All products are subject to availability</li>
                    </ul>
                </Section>

                <Section title="3. Order Process">
                    <p>By placing an order on our website:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>You make an offer to purchase the selected products at the listed price</li>
                        <li>We accept your order when we send you an order confirmation email</li>
                        <li>We reserve the right to refuse or cancel any order at our discretion</li>
                        <li>Orders cannot be modified after 2 hours of placement</li>
                    </ul>
                </Section>

                <Section title="4. Payment">
                    <p>Payment must be made in full at the time of order. We accept UPI, credit/debit cards, net banking, and Cash on Delivery (COD) for eligible orders. All online transactions are secured with SSL encryption. THE ELEGANT is not liable for any payment failures due to third-party payment gateway issues.</p>
                </Section>

                <Section title="5. Shipping & Delivery">
                    <p>Delivery timelines are estimates and may be affected by factors outside our control (public holidays, weather, etc.). THE ELEGANT is not liable for delays caused by third-party courier partners. Risk of loss and title for products pass to you upon delivery.</p>
                </Section>

                <Section title="6. Returns & Refunds">
                    <p>Our return and refund policy is governed by our separate Returns & Exchanges Policy, which forms part of these Terms. Refunds are at our sole discretion and subject to product inspection.</p>
                </Section>

                <Section title="7. Intellectual Property">
                    <p>All content on this website, including text, graphics, logos, images, and software, is the property of THE ELEGANT or its content suppliers and is protected by Indian copyright laws. You may not reproduce, distribute, or create derivative works without our prior written consent.</p>
                </Section>

                <Section title="8. User Accounts">
                    <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorised use of your account. We reserve the right to terminate accounts that violate these Terms.</p>
                </Section>

                <Section title="9. Prohibited Use">
                    <p>You agree not to use our website to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Engage in any unlawful activity</li>
                        <li>Attempt to gain unauthorised access to our systems</li>
                        <li>Transmit spam, viruses, or malicious code</li>
                        <li>Scrape or copy content without permission</li>
                        <li>Manipulate prices, inventory, or exploit technical errors</li>
                    </ul>
                </Section>

                <Section title="10. Limitation of Liability">
                    <p>To the maximum extent permitted by law, THE ELEGANT shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products. Our total liability in any matter arising from these Terms shall not exceed the amount you paid for the relevant order.</p>
                </Section>

                <Section title="11. Governing Law">
                    <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Tirupathi, Andhra Pradesh. If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force.</p>
                </Section>

                <Section title="12. Changes to Terms">
                    <p>We reserve the right to update these Terms at any time. Changes will be posted on this page with an updated date. Your continued use of our services after changes constitutes acceptance of the revised Terms.</p>
                </Section>

                <Section title="13. Contact">
                    <p>For questions about these Terms:</p>
                    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mt-2">
                        <p><strong>THE ELEGANT — Legal Team</strong></p>
                        <p>Email: theelegant2327@gmail.com</p>
                        <p>Phone: 8125632327</p>
                        <p>Address: Tirupathi, Andhra Pradesh, India — 517501</p>
                    </div>
                </Section>
            </div>
        </div>
    </div>
);

export default TermsPage;
