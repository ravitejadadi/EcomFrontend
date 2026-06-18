import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { formatCurrency } from '../utils/helpers';
import { Search, MapPin, Calendar, Clock, PackageCheck, AlertCircle } from 'lucide-react';
import { apiFetch } from '../utils/api';

const TrackOrderPage = () => {
    const location = useLocation();
    const [orderId, setOrderId] = useState(location.state?.directOrderId || '');
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchOrderDetails = async (id) => {
        setError('');
        setOrder(null);
        setLoading(true);

        try {
            const res = await apiFetch(`/orders/track/${id}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Order tracking failed. Double check the ID.');
            }

            setOrder(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (location.state?.directOrderId) {
            fetchOrderDetails(location.state.directOrderId);
        }
    }, [location.state]);

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!orderId.trim()) return;
        fetchOrderDetails(orderId.trim());
    };

    const statusSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentStepIndex = order ? statusSteps.indexOf(order.orderStatus) : -1;

    return (
        <div className="container-custom py-16 min-h-[70vh] max-w-4xl">
            {/* Page Title */}
            <div className="text-center space-y-3 mb-10">
                <h1 className="text-4xl font-black font-display tracking-tight uppercase">Track Shipment</h1>
                <p className="text-neutral-500 text-sm max-w-md mx-auto">
                    Enter your Order ID (from your confirmation screen or email) to view your package tracking status in real time.
                </p>
            </div>

            {/* Tracking Search Input */}
            <form onSubmit={handleTrack} className="bg-white border border-neutral-200 p-4 rounded-2xl shadow-sm flex gap-3 max-w-xl mx-auto mb-10">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                        type="text"
                        required
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="e.g. fb-order-5axr2z..."
                        className="w-full pl-10 pr-4 py-2.5 bg-transparent border-0 outline-none text-sm text-neutral-800 focus:ring-0"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary px-6 py-2.5 text-xs font-bold uppercase rounded-xl shrink-0"
                >
                    {loading ? 'Searching...' : 'Track Package'}
                </button>
            </form>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md flex gap-3 text-red-700 text-sm max-w-xl mx-auto mb-10 animate-fade-in">
                    <AlertCircle size={20} className="shrink-0" />
                    <div>
                        <span className="font-bold">Tracking Error:</span> {error}
                    </div>
                </div>
            )}

            {/* Order Tracking Details */}
            {order && (
                <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-10 animate-fade-in">
                    {/* Stepper */}
                    <div className="space-y-4">
                        <h3 className="font-bold uppercase tracking-wider text-xs text-neutral-500">Shipping Progress</h3>
                        <div className="relative flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 pt-6">
                            {/* Horizontal Line for desktop */}
                            <div className="hidden md:block absolute left-10 right-10 top-1/2 -translate-y-1/2 h-0.5 bg-neutral-200 -z-10" />
                            {/* Dynamic Fill Line for desktop */}
                            {currentStepIndex > 0 && (
                                <div
                                    className="hidden md:block absolute left-10 top-1/2 -translate-y-1/2 h-0.5 bg-black -z-10 transition-all duration-700"
                                    style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 80}%` }}
                                />
                            )}

                            {statusSteps.map((stepName, index) => {
                                const isCompleted = index <= currentStepIndex;
                                const isActive = index === currentStepIndex;

                                return (
                                    <div key={stepName} className="flex md:flex-col items-center gap-4 md:gap-3 z-10 w-full md:w-auto">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                                            isActive
                                                ? 'bg-black text-white border-black scale-110 shadow-lg'
                                                : isCompleted
                                                    ? 'bg-white text-black border-black font-extrabold'
                                                    : 'bg-neutral-100 text-neutral-400 border-neutral-200'
                                        }`}>
                                            {isCompleted ? '✓' : index + 1}
                                        </div>
                                        <div className="text-left md:text-center">
                                            <p className={`text-sm font-bold uppercase tracking-wider ${isCompleted ? 'text-black' : 'text-neutral-400'}`}>
                                                {stepName}
                                            </p>
                                            <p className="text-[10px] text-neutral-400 mt-0.5">
                                                {isActive ? 'Current Stage' : isCompleted ? 'Completed' : 'Upcoming'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t">
                        {/* Shipment Info */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-500">Delivery Information</h4>
                            <div className="bg-neutral-50 border rounded-xl p-5 space-y-3.5 text-xs text-neutral-700">
                                <div className="flex items-start gap-2.5">
                                    <MapPin size={16} className="text-neutral-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-neutral-900 mb-1">Shipping Destination</p>
                                        <p className="font-medium text-neutral-800">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                        <p>{order.shippingAddress.address}</p>
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5 border-t pt-3">
                                    <Calendar size={16} className="text-neutral-400" />
                                    <div>
                                        <span className="font-semibold text-neutral-500">Order Placed: </span>
                                        <span className="font-bold text-neutral-800">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5 border-t pt-3">
                                    <Clock size={16} className="text-neutral-400" />
                                    <div>
                                        <span className="font-semibold text-neutral-500">Last Update: </span>
                                        <span className="font-bold text-neutral-800">
                                            {new Date(order.updatedAt).toLocaleDateString('en-IN', {
                                                day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items Summary */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-500">Package Contents</h4>
                            <div className="border rounded-xl divide-y divide-neutral-100 max-h-60 overflow-y-auto scrollbar-thin">
                                {order.orderItems.map((item) => (
                                    <div key={`${item.id}-${item.variant.id}`} className="flex items-center gap-3 p-3 text-xs">
                                        <img src={item.image.url} alt={item.name} className="w-10 h-14 object-cover border rounded bg-neutral-100" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-neutral-800 truncate">{item.name}</p>
                                            <p className="text-[10px] text-neutral-500 mt-0.5">
                                                Size: {item.variant.size} | Color: {item.variant.color} | Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <span className="font-bold text-neutral-900">{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-neutral-50 border rounded-xl p-4 flex justify-between items-center text-sm font-bold">
                                <span className="text-neutral-500 uppercase tracking-wide text-xs">Total Amount Charged</span>
                                <span className="text-neutral-900">{formatCurrency(order.totalAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackOrderPage;
