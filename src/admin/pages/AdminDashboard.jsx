import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';
import { TrendingUp, ShoppingBag, ShoppingCart, Users, AlertTriangle, ArrowRight } from 'lucide-react';
import { apiFetch } from '../../utils/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await apiFetch('/dashboard');
                if (!res.ok) throw new Error('Failed to load dashboard statistics');
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-10 text-red-600">
                <p>Failed to load dashboard metrics. Ensure backend is running.</p>
            </div>
        );
    }

    const cards = [
        { title: 'Total Revenue', value: formatCurrency(stats.totalSales), icon: TrendingUp, color: 'bg-emerald-100 text-emerald-800' },
        { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-blue-100 text-blue-800' },
        { title: 'Active Products', value: stats.totalProducts, icon: ShoppingBag, color: 'bg-amber-100 text-amber-800' },
        { title: 'Registered Customers', value: stats.totalCustomers, icon: Users, color: 'bg-purple-100 text-purple-800' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black font-display uppercase tracking-tight text-neutral-900">Dashboard</h1>
                <p className="text-neutral-500 text-sm mt-1">Overview of your online boutique store operations</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
                            <div className="space-y-2">
                                <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">{card.title}</span>
                                <p className="text-2xl font-bold font-display text-neutral-900">{card.value}</p>
                            </div>
                            <div className={`p-3.5 rounded-xl ${card.color}`}>
                                <Icon size={24} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Orders Table */}
                <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
                    <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                        <h2 className="font-bold font-display uppercase tracking-tight text-neutral-900">Recent Orders</h2>
                        <button onClick={() => navigate('/admin/orders')} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                            VIEW ALL <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-100">
                                    <th className="p-4">Order ID</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Total</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {stats.recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-neutral-400">No orders placed yet.</td>
                                    </tr>
                                ) : (
                                    stats.recentOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-neutral-50/50 cursor-pointer" onClick={() => navigate('/admin/orders')}>
                                            <td className="p-4 font-mono text-xs font-semibold text-neutral-900">{order._id.substring(0, 8)}...</td>
                                            <td className="p-4 font-medium text-neutral-800">
                                                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                            </td>
                                            <td className="p-4 font-semibold text-neutral-900">{formatCurrency(order.totalAmount)}</td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-full ${
                                                    order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                    order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                    order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                            <td className="p-4 text-xs text-neutral-500">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-neutral-50/50 border-t" />
                </div>

                {/* Side Panels */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Status Pie Summary */}
                    <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4">
                        <h2 className="font-bold font-display uppercase tracking-tight text-neutral-900 border-b pb-3">Status Breakdown</h2>
                        <div className="space-y-2.5">
                            {[
                                { name: 'Pending', count: stats.statusBreakdown.Pending, color: 'bg-yellow-500' },
                                { name: 'Processing', count: stats.statusBreakdown.Processing, color: 'bg-amber-600' },
                                { name: 'Shipped', count: stats.statusBreakdown.Shipped, color: 'bg-blue-500' },
                                { name: 'Delivered', count: stats.statusBreakdown.Delivered, color: 'bg-green-500' },
                                { name: 'Cancelled', count: stats.statusBreakdown.Cancelled, color: 'bg-red-500' },
                            ].map((status, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full ${status.color}`} />
                                        <span className="font-medium text-neutral-600">{status.name}</span>
                                    </div>
                                    <span className="font-bold text-neutral-900">{status.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stock Alert Summary */}
                    <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4">
                        <h2 className="font-bold font-display uppercase tracking-tight text-neutral-900 border-b pb-3 flex items-center gap-2">
                            <AlertTriangle size={18} className="text-amber-500" />
                            <span>Low Stock Alert</span>
                        </h2>
                        <div className="divide-y divide-neutral-100">
                            {stats.lowStockProducts.length === 0 ? (
                                <p className="text-sm text-neutral-400 py-3">All products catalog are well stocked!</p>
                            ) : (
                                stats.lowStockProducts.map((p) => (
                                    <div key={p.id} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0 text-sm">
                                        <div className="min-w-0 pr-2">
                                            <p className="font-semibold text-neutral-800 truncate">{p.name}</p>
                                            <span className="text-[10px] text-neutral-500 uppercase font-medium">{p.category}</span>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                            p.inventory === 0 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {p.inventory} left
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
