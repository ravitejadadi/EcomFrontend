import { useState } from 'react';
import { Ruler } from 'lucide-react';

const SizeGuidePage = () => {
    const [activeTab, setActiveTab] = useState('apparel-men');

    const tabs = [
        { id: 'apparel-men', label: "Men's Apparel" },
        { id: 'apparel-women', label: "Women's Apparel" },
        { id: 'footwear', label: 'Footwear' },
        { id: 'kids', label: 'Kids' },
    ];

    const charts = {
        'apparel-men': {
            title: "Men's Apparel Size Chart",
            headers: ['Size', 'Chest (in)', 'Waist (in)', 'Hip (in)', 'Shoulder (in)'],
            rows: [
                ['XS', '34–36', '28–30', '34–36', '15.5'],
                ['S', '36–38', '30–32', '36–38', '16.5'],
                ['M', '38–40', '32–34', '38–40', '17.5'],
                ['L', '40–42', '34–36', '40–42', '18.5'],
                ['XL', '42–44', '36–38', '42–44', '19.5'],
                ['XXL', '44–46', '38–40', '44–46', '20.5'],
                ['3XL', '46–48', '40–42', '46–48', '21.5'],
            ],
        },
        'apparel-women': {
            title: "Women's Apparel Size Chart",
            headers: ['Size', 'Bust (in)', 'Waist (in)', 'Hip (in)', 'Shoulder (in)'],
            rows: [
                ['XS', '31–33', '24–26', '34–36', '13.5'],
                ['S', '33–35', '26–28', '36–38', '14'],
                ['M', '35–37', '28–30', '38–40', '14.5'],
                ['L', '37–39', '30–32', '40–42', '15'],
                ['XL', '39–41', '32–34', '42–44', '15.5'],
                ['XXL', '41–43', '34–36', '44–46', '16'],
            ],
        },
        'footwear': {
            title: 'Footwear Size Chart',
            headers: ['UK Size', 'EU Size', 'US (Men)', 'US (Women)', 'Foot Length (cm)'],
            rows: [
                ['5', '38', '6', '7', '23.5'],
                ['6', '39', '7', '8', '24.5'],
                ['7', '40', '8', '9', '25.5'],
                ['8', '41', '9', '10', '26.5'],
                ['9', '42', '10', '11', '27.5'],
                ['10', '43', '11', '12', '28.5'],
                ['11', '44', '12', '13', '29.5'],
                ['12', '45', '13', '—', '30.5'],
            ],
        },
        'kids': {
            title: "Kids' Size Chart",
            headers: ['Age', 'Height (cm)', 'Chest (in)', 'Waist (in)', 'Shoe (UK)'],
            rows: [
                ['3–4 yrs', '95–105', '21–22', '20–21', '8–9'],
                ['4–5 yrs', '105–115', '22–23', '21–22', '9–10'],
                ['5–6 yrs', '115–120', '23–24', '22–23', '10–11'],
                ['6–7 yrs', '120–125', '24–25', '22.5–23.5', '11–12'],
                ['7–8 yrs', '125–130', '25–26', '23–24', '12–13'],
                ['8–9 yrs', '130–135', '26–27', '23.5–24.5', '13–1'],
                ['9–10 yrs', '135–140', '27–28', '24–25', '1–2'],
                ['10–12 yrs', '140–152', '28–30', '24.5–26', '2–4'],
            ],
        },
    };

    const tips = [
        { icon: '📏', title: 'Measure Accurately', desc: 'Use a soft measuring tape. Measure over light clothing, not outerwear.' },
        { icon: '🧘', title: 'Stand Naturally', desc: 'Stand relaxed when measuring. Don\'t pull the tape too tight or too loose.' },
        { icon: '👟', title: 'Foot Measurement', desc: 'Measure your foot at end of day when feet are largest. Measure both feet.' },
        { icon: '🔄', title: 'Between Sizes', desc: 'If between sizes, go up for tops and jackets, and down for bottoms.' },
    ];

    const chart = charts[activeTab];

    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <div className="bg-black text-white py-16 md:py-24">
                <div className="container-custom text-center">
                    <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-4">Support</p>
                    <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight mb-4">SIZE GUIDE</h1>
                    <p className="text-neutral-400 text-lg max-w-xl mx-auto">
                        Find your perfect fit with our comprehensive size charts. All measurements are in inches unless stated.
                    </p>
                </div>
            </div>

            <div className="container-custom py-16 md:py-20 space-y-12">
                {/* Measurement Tips */}
                <section>
                    <h2 className="text-2xl md:text-3xl font-black font-display uppercase tracking-tight mb-6">How to Measure</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {tips.map(({ icon, title, desc }) => (
                            <div key={title} className="bg-neutral-50 rounded-xl p-5 border border-neutral-100">
                                <div className="text-3xl mb-3">{icon}</div>
                                <h4 className="font-bold text-neutral-900 mb-1">{title}</h4>
                                <p className="text-sm text-neutral-600">{desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Size Charts */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <Ruler size={22} className="text-neutral-600" />
                        <h2 className="text-2xl md:text-3xl font-black font-display uppercase tracking-tight">Size Charts</h2>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2 text-sm font-bold uppercase rounded-lg transition-all ${
                                    activeTab === tab.id ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-neutral-100 bg-neutral-50">
                            <h3 className="font-black font-display uppercase tracking-tight">{chart.title}</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-neutral-100">
                                        {chart.headers.map(h => (
                                            <th key={h} className="p-4 text-left text-xs font-bold uppercase tracking-wider text-neutral-500 whitespace-nowrap">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {chart.rows.map((row, i) => (
                                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}>
                                            {row.map((cell, j) => (
                                                <td key={j} className={`p-4 ${j === 0 ? 'font-black text-neutral-900' : 'text-neutral-700 font-medium'}`}>
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="bg-black text-white rounded-2xl p-8 text-center">
                    <h3 className="text-2xl font-black font-display uppercase tracking-tight mb-2">Still Unsure?</h3>
                    <p className="text-neutral-400 mb-5">Our styling team can help you find the perfect fit.</p>
                    <a href="/contact" className="btn bg-white text-black hover:bg-neutral-200 uppercase">Ask a Stylist</a>
                </div>
            </div>
        </div>
    );
};

export default SizeGuidePage;
