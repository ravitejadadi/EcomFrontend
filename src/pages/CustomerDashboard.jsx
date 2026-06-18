import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { formatCurrency } from '../utils/helpers';
import { ShoppingBag, CreditCard, Clipboard, Calendar, ExternalLink } from 'lucide-react';
import { apiFetch } from '../utils/api';

const CustomerDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('Valued Customer');
    const [copiedId, setCopiedId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
            navigate('/auth', { replace: true });
            return;
        }

        try {
            const user = JSON.parse(userStr);
            setUserName(user.name);
        } catch (e) {
            navigate('/auth', { replace: true });
            return;
        }

        const fetchCustomerOrders = async () => {
            try {
                const res = await apiFetch('/orders');

                if (!res.ok) throw new Error('Failed to fetch user order details');
                const data = await res.json();
                setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerOrders();
    }, [navigate]);

    const handleCopy = (id) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="container-custom py-12 max-w-5xl space-y-10 animate-fade-in">
            {/* Header / Profile welcome bar */}
            <div className="bg-neutral-900 text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div>
                    <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Welcome back</p>
                    <h1 className="text-3xl font-black font-display tracking-tight uppercase mt-1">{userName}</h1>
                </div>
                <div className="flex gap-4">
                    <Link to="/track" className="px-4 py-2 border border-white/20 hover:bg-white hover:text-black rounded-lg text-xs font-bold uppercase tracking-wide transition-all">
                        Track Shipment
                    </Link>
                </div>
            </div>

            {/* Orders list segment */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-3 mb-6">
                    <ShoppingBag size={20} className="text-neutral-500" />
                    <h2 className="font-bold font-display uppercase tracking-tight text-neutral-800 text-lg">Purchase History</h2>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white border rounded-2xl p-12 text-center space-y-4 shadow-sm">
                        <ShoppingBag size={48} className="mx-auto text-neutral-300" />
                        <h3 className="text-lg font-bold">No orders placed yet</h3>
                        <p className="text-neutral-500 text-sm max-w-xs mx-auto">Browse our premium clothing collections and place your first order!</p>
                        <Link to="/" className="btn btn-primary btn-sm uppercase mt-4">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                {/* Order Metadata header bar */}
                                <div className="bg-neutral-50 px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                    <div className="flex flex-wrap items-center gap-4 text-neutral-600">
                                        <div className="flex items-center gap-1.5 font-semibold">
                                            <Calendar size={14} className="text-neutral-400" />
                                            <span>
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-semibold text-neutral-400">Order ID:</span>
                                            <span className="font-mono font-bold text-neutral-800">{order._id.substring(0, 12)}...</span>
                                            <button
                                                onClick={() => handleCopy(order._id)}
                                                className="p-1 hover:bg-neutral-200 rounded text-neutral-500 transition-colors"
                                                title="Copy full Order ID"
                                            >
                                                <Clipboard size={12} />
                                            </button>
                                            {copiedId === order._id && (
                                                <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded border border-green-200">Copied!</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                            order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                                            order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                            order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {order.orderStatus}
                                        </span>
                                        <Link
                                            to="/track"
                                            state={{ directOrderId: order._id }}
                                            className="text-[10px] font-bold text-neutral-600 hover:text-black flex items-center gap-1 border-b border-transparent hover:border-black transition-all"
                                        >
                                            TRACK SHIPMENT <ExternalLink size={12} />
                                        </Link>
                                    </div>
                                </div>

                                {/* Items details in order */}
                                <div className="p-6 divide-y divide-neutral-100">
                                    {order.orderItems.map((item) => (
                                        <div key={`${item.id}-${item.variant.id}`} className="flex gap-4 py-4 first:pt-0 last:pb-0 items-center text-xs">
                                            <img src={item.image.url} alt={item.name} className="w-10 h-14 object-cover border rounded bg-neutral-50" />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-neutral-800 truncate">{item.name}</h4>
                                                <p className="text-[10px] text-neutral-500 mt-0.5">
                                                    Size: {item.variant.size} | Color: {item.variant.color} | Quantity: {item.quantity}
                                                </p>
                                            </div>
                                            <span className="font-bold text-neutral-900 text-sm">{formatCurrency(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary details footer */}
                                <div className="bg-neutral-50/50 border-t px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                    <div className="flex items-center gap-1 text-neutral-500 font-semibold">
                                        <CreditCard size={14} className="text-neutral-400" />
                                        <span>Payment Mode: {order.paymentMethod}</span>
                                        <span className="mx-1.5 text-neutral-300">|</span>
                                        <span className={`font-bold ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                    <div className="text-sm font-bold flex gap-2">
                                        <span className="text-neutral-500 uppercase tracking-wide text-[10px] self-center">Transacted Total</span>
                                        <span className="text-neutral-950 font-display text-base">{formatCurrency(order.totalAmount)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;
