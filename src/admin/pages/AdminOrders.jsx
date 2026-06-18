import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';
import { Eye, X, CheckCircle, Truck, RefreshCw, AlertCircle } from 'lucide-react';
import { apiFetch } from '../../utils/api';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('All');
    const [updatingId, setUpdatingId] = useState(null);

    const navigate = useNavigate();

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/orders');
            if (!res.ok) throw new Error('Failed to fetch orders');
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [navigate]);

    const handleUpdateStatus = async (orderId, newOrderStatus, newPaymentStatus) => {
        setUpdatingId(orderId);
        try {
            const res = await apiFetch(`/orders/${orderId}`, {
                method: 'PUT',
                body: JSON.stringify({ orderStatus: newOrderStatus, paymentStatus: newPaymentStatus }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Status update failed');

            // Update local state
            setOrders(orders.map((o) => (o._id === orderId ? data : o)));
            if (selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder(data);
            }
        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleOpenDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const filteredOrders = statusFilter === 'All'
        ? orders
        : orders.filter((o) => o.orderStatus === statusFilter);

    const statuses = ['All', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black font-display uppercase tracking-tight text-neutral-900">Orders</h1>
                <p className="text-neutral-500 text-sm mt-1">Monitor shipments, transactions, and customer fulfillments</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 border-b pb-4">
                {statuses.map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                            statusFilter === s
                                ? 'bg-black text-white'
                                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                        }`}
                    >
                        {s} ({s === 'All' ? orders.length : orders.filter(o => o.orderStatus === s).length})
                    </button>
                ))}
            </div>

            {/* Orders Listing Table */}
            <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-100">
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Recipient</th>
                                <th className="p-4">Products qty</th>
                                <th className="p-4">Total Amount</th>
                                <th className="p-4">Payment Status</th>
                                <th className="p-4">Fulfillment Status</th>
                                <th className="p-4 text-center">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-neutral-400">Loading orders dataset...</td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-neutral-400">No orders placed under this category.</td>
                                </tr>
                            ) : (
                                filteredOrders.map((o) => (
                                    <tr key={o._id} className="hover:bg-neutral-50/30">
                                        <td className="p-4 font-mono text-xs font-semibold text-neutral-900">
                                            #{o._id.substring(0, 10).toUpperCase()}...
                                        </td>
                                        <td className="p-4">
                                            <div className="font-semibold text-neutral-800">
                                                {o.shippingAddress.firstName} {o.shippingAddress.lastName}
                                            </div>
                                            <div className="text-[10px] text-neutral-500">{o.shippingAddress.email}</div>
                                        </td>
                                        <td className="p-4 text-neutral-600 font-semibold">
                                            {o.orderItems.reduce((sum, item) => sum + item.quantity, 0)} items
                                        </td>
                                        <td className="p-4 font-bold text-neutral-900">
                                            {formatCurrency(o.totalAmount)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-0.5 text-xs font-bold rounded ${
                                                o.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                                                o.paymentStatus === 'Failed' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {o.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-0.5 text-xs font-bold rounded uppercase ${
                                                o.orderStatus === 'Confirmed'  ? 'bg-emerald-100 text-emerald-800' :
                                                o.orderStatus === 'Delivered'  ? 'bg-green-100 text-green-800' :
                                                o.orderStatus === 'Cancelled'  ? 'bg-red-100 text-red-800' :
                                                o.orderStatus === 'Shipped'    ? 'bg-blue-100 text-blue-800' :
                                                o.orderStatus === 'Processing' ? 'bg-purple-100 text-purple-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {o.orderStatus}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => handleOpenDetails(o)}
                                                    className="p-2 text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
                                                    aria-label="View order details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto max-h-screen">
                    <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="p-6 border-b flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold font-display uppercase tracking-tight">Order Details</h2>
                                <p className="text-xs text-neutral-500 font-mono mt-0.5">#{selectedOrder._id.toUpperCase()}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-neutral-100 rounded-md">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
                            {/* Grid Section 1: Customer info and Status changer */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Shipping Address */}
                                <div className="space-y-2">
                                    <h3 className="font-bold text-neutral-900 uppercase tracking-wide text-xs">Shipping Address</h3>
                                    <div className="bg-neutral-50 border p-4 rounded-xl space-y-1 text-neutral-700 text-xs">
                                        <p className="font-bold text-neutral-800">{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                                        <p>{selectedOrder.shippingAddress.address}</p>
                                        <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
                                        <p className="pt-2 font-medium">📞 {selectedOrder.shippingAddress.phone}</p>
                                        <p>✉️ {selectedOrder.shippingAddress.email}</p>
                                    </div>
                                </div>

                                {/* Order & Payment Status adjusters */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-neutral-900 uppercase tracking-wide text-xs">Fulfillment Operations</h3>
                                    <div className="bg-neutral-50 border p-4 rounded-xl space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-neutral-500 uppercase">Order Status</label>
                                            <select
                                                disabled={updatingId !== null}
                                                value={selectedOrder.orderStatus}
                                                onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value, selectedOrder.paymentStatus)}
                                                className="input py-2 px-3 text-xs"
                                            >
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-neutral-500 uppercase">Payment Status</label>
                                            <select
                                                disabled={updatingId !== null}
                                                value={selectedOrder.paymentStatus}
                                                onChange={(e) => handleUpdateStatus(selectedOrder._id, selectedOrder.orderStatus, e.target.value)}
                                                className="input py-2 px-3 text-xs"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Paid">Paid</option>
                                                <option value="Failed">Failed</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Items Purchased list */}
                            <div className="space-y-3">
                                <h3 className="font-bold text-neutral-900 uppercase tracking-wide text-xs">Purchased items</h3>
                                <div className="border rounded-xl overflow-hidden divide-y divide-neutral-100">
                                    {selectedOrder.orderItems.map((item) => (
                                        <div key={`${item.id}-${item.variant.id}`} className="flex gap-4 p-4 items-center">
                                            <img
                                                src={item.image.url}
                                                alt={item.name}
                                                className="w-10 h-14 object-cover border rounded"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-neutral-900 line-clamp-1">{item.name}</p>
                                                <p className="text-[10px] text-neutral-500 mt-0.5">
                                                    Size: {item.variant.size} | Color: {item.variant.color} | Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <span className="font-bold text-neutral-900 text-xs">
                                                {formatCurrency(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section 3: Order Totals breakdown */}
                            <div className="border-t pt-4 flex flex-col items-end space-y-2">
                                <div className="w-64 space-y-1.5 text-xs">
                                    <div className="flex justify-between text-neutral-500">
                                        <span>Items Subtotal:</span>
                                        <span className="font-semibold">{formatCurrency(selectedOrder.totalAmount - selectedOrder.gstAmount - selectedOrder.shippingCost)}</span>
                                    </div>
                                    <div className="flex justify-between text-neutral-500">
                                        <span>GST (18% integrated):</span>
                                        <span className="font-semibold">{formatCurrency(selectedOrder.gstAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-neutral-500">
                                        <span>Shipping:</span>
                                        <span className="font-semibold">{selectedOrder.shippingCost === 0 ? 'FREE' : formatCurrency(selectedOrder.shippingCost)}</span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between font-bold text-sm text-neutral-900">
                                        <span>Transacted Total:</span>
                                        <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-neutral-50 border-t flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="btn btn-outline btn-sm uppercase"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
