import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency, validatePincode, validateMobile, validateEmail } from '../utils/helpers';
import { ArrowLeft, CheckCircle, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { apiFetch } from '../utils/api';

// Dynamically inject Razorpay checkout.js once
const loadRazorpayScript = () =>
    new Promise((resolve) => {
        if (document.getElementById('razorpay-sdk')) { resolve(true); return; }
        const script = document.createElement('script');
        script.id = 'razorpay-sdk';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

const CheckoutPage = () => {
    const { cart, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    // Wizard step tracking
    const [step, setStep] = useState(1);

    // Form inputs
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
        email: '',
    });

    // Payment choice
    const [paymentMethod, setPaymentMethod] = useState('UPI');

    // Errors & Loading state
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [createdOrder, setCreatedOrder] = useState(null);

    // Calculated amounts
    const subtotal = getCartTotal();
    const gstAmount = Math.round(subtotal * 0.18);
    const shippingCost = subtotal > 2500 ? 0 : 150;
    const totalAmount = subtotal + gstAmount + shippingCost;

    if (cart.length === 0 && !createdOrder) {
        return (
            <div className="container-custom py-20 text-center">
                <h2 className="text-3xl font-display font-bold mb-4">Your Cart is Empty</h2>
                <p className="text-neutral-600 mb-8">You must add products before completing checkout.</p>
                <Link to="/" className="btn btn-primary">Go Shopping</Link>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateStep1 = () => {
        const tempErrors = {};
        if (!formData.firstName.trim()) tempErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) tempErrors.lastName = 'Last name is required';
        if (!formData.address.trim()) tempErrors.address = 'Full address is required';
        if (!formData.city.trim()) tempErrors.city = 'City is required';
        if (!formData.state.trim()) tempErrors.state = 'State is required';

        if (!formData.pincode.trim()) {
            tempErrors.pincode = 'Pincode is required';
        } else if (!validatePincode(formData.pincode)) {
            tempErrors.pincode = 'Enter a valid 6-digit Indian pincode';
        }

        if (!formData.phone.trim()) {
            tempErrors.phone = 'Mobile number is required';
        } else if (!validateMobile(formData.phone)) {
            tempErrors.phone = 'Enter a valid 10-digit Indian mobile number';
        }

        if (!formData.email.trim()) {
            tempErrors.email = 'Email address is required';
        } else if (!validateEmail(formData.email)) {
            tempErrors.email = 'Enter a valid email address';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        if (validateStep1()) {
            setStep(2);
        }
    };

    // ── COD flow ──────────────────────────────────────────────────────────────
    const placeCodOrder = async () => {
        const res = await apiFetch('/orders', {
            method: 'POST',
            body: JSON.stringify({ orderItems: cart, shippingAddress: formData, paymentMethod }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to place order');
        return data;
    };

    // ── Razorpay flow ─────────────────────────────────────────────────────────
    const openRazorpay = async () => {
        const sdkLoaded = await loadRazorpayScript();
        if (!sdkLoaded) throw new Error('Failed to load Razorpay. Check your internet connection.');

        // Step 1 — create Razorpay order on backend
        const createRes = await apiFetch('/payment/create-order', {
            method: 'POST',
            body: JSON.stringify({ amount: totalAmount }),
        });
        const createData = await createRes.json();
        if (!createRes.ok) throw new Error(createData.message || 'Could not initiate payment');

        const { razorpayOrderId, amount, currency, key } = createData;

        // Step 2 — open Razorpay modal
        return new Promise((resolve, reject) => {
            const options = {
                key,
                amount,
                currency,
                name: 'THE ELEGANT',
                description: 'Secure Checkout',
                order_id: razorpayOrderId,
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: { color: '#000000' },
                modal: {
                    ondismiss: () => reject(new Error('Payment cancelled. Your cart is still saved.')),
                },
                handler: async (paymentResponse) => {
                    // Step 3 — verify signature + create order in DB
                    try {
                        const verifyRes = await apiFetch('/payment/verify', {
                            method: 'POST',
                            body: JSON.stringify({
                                razorpay_order_id: paymentResponse.razorpay_order_id,
                                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                                razorpay_signature: paymentResponse.razorpay_signature,
                                orderItems: cart,
                                shippingAddress: formData,
                                paymentMethod,
                            }),
                        });
                        const verifyData = await verifyRes.json();
                        if (!verifyRes.ok) throw new Error(verifyData.message || 'Payment verification failed');
                        resolve(verifyData);
                    } catch (err) {
                        reject(err);
                    }
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', (resp) => {
                reject(new Error(resp.error?.description || 'Payment failed. Please try again.'));
            });
            rzp.open();
        });
    };

    const handleSubmitOrder = async () => {
        setLoading(true);
        try {
            let order;
            if (paymentMethod === 'COD') {
                order = await placeCodOrder();
            } else {
                order = await openRazorpay();
            }
            setCreatedOrder(order);
            clearCart();
            setStep(3);
        } catch (error) {
            console.error('Order error:', error);
            alert(error.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Render step 3: Success Screen
    if (step === 3 && createdOrder) {
        return (
            <div className="container-custom py-16 md:py-24 max-w-2xl text-center">
                <div className="flex justify-center mb-6 text-green-600">
                    <CheckCircle size={80} />
                </div>
                <h1 className="text-4xl font-black font-display tracking-tight mb-2 uppercase">
                    Order Confirmed!
                </h1>
                <p className="text-neutral-500 mb-8">
                    Thank you for your order. We've sent details to <span className="font-semibold text-neutral-800">{formData.email}</span>.
                </p>

                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 mb-8 text-left space-y-4">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-neutral-500 font-medium">Order Number:</span>
                        <span className="font-bold text-neutral-900">{createdOrder._id}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-neutral-500 font-medium">Status:</span>
                        <span className="font-bold text-emerald-600 uppercase text-sm">{createdOrder.orderStatus}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-neutral-500 font-medium">Payment Mode:</span>
                        <span className="font-bold text-neutral-800">{createdOrder.paymentMethod}</span>
                    </div>
                    {createdOrder.razorpayPaymentId && (
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-neutral-500 font-medium">Payment ID:</span>
                            <span className="font-mono text-xs font-bold text-green-700">{createdOrder.razorpayPaymentId}</span>
                        </div>
                    )}
                    <div className="flex justify-between pb-1">
                        <span className="text-neutral-500 font-medium">Amount Transacted:</span>
                        <span className="font-bold text-neutral-900 text-lg">{formatCurrency(createdOrder.totalAmount)}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <Link to="/" className="btn btn-primary w-full max-w-sm uppercase">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-neutral-50 min-h-screen py-10">
            <div className="container-custom">
                {/* Back Button */}
                <button
                    onClick={() => {
                        if (step === 2) setStep(1);
                        else navigate(-1);
                    }}
                    className="flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-black mb-8 uppercase"
                >
                    <ArrowLeft size={16} /> Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Panel: Checkout Steps */}
                    <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-xl p-6 md:p-8">
                        {/* Steps Headers */}
                        <div className="flex items-center gap-4 border-b pb-6 mb-8">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                step === 1 ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-600'
                            }`}>
                                1
                            </span>
                            <span className="font-bold uppercase tracking-wider text-sm">Shipping</span>
                            <div className="flex-1 h-0.5 bg-neutral-200" />
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                step === 2 ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-600'
                            }`}>
                                2
                            </span>
                            <span className="font-bold uppercase tracking-wider text-sm">Payment</span>
                        </div>

                        {/* Step 1 Form */}
                        {step === 1 && (
                            <form onSubmit={handleNextStep} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className={`input ${errors.firstName ? 'input-error' : ''}`}
                                            placeholder="Rohit"
                                        />
                                        {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className={`input ${errors.lastName ? 'input-error' : ''}`}
                                            placeholder="Sharma"
                                        />
                                        {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Address Details</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className={`input ${errors.address ? 'input-error' : ''}`}
                                        placeholder="Flat, House no., Building, Company, Apartment, Street"
                                    />
                                    {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className={`input ${errors.city ? 'input-error' : ''}`}
                                            placeholder="Mumbai"
                                        />
                                        {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className={`input ${errors.state ? 'input-error' : ''}`}
                                            placeholder="Maharashtra"
                                        />
                                        {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Pincode</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            maxLength={6}
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            className={`input ${errors.pincode ? 'input-error' : ''}`}
                                            placeholder="400001"
                                        />
                                        {errors.pincode && <p className="text-red-500 text-xs">{errors.pincode}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Mobile Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            maxLength={10}
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={`input ${errors.phone ? 'input-error' : ''}`}
                                            placeholder="9876543210"
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`input ${errors.email ? 'input-error' : ''}`}
                                            placeholder="rohit.sharma@example.in"
                                        />
                                        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary w-full uppercase mt-4">
                                    Continue to Payment
                                </button>
                            </form>
                        )}

                        {/* Step 2 Form */}
                        {step === 2 && (
                            <div className="space-y-6 animate-fade-in">
                                <h3 className="text-lg font-bold font-display uppercase tracking-tight mb-4">Choose Payment Method</h3>

                                <div className="space-y-3">
                                    {[
                                        { id: 'UPI', name: 'UPI (GPay / PhonePe / Paytm)', icon: '📱' },
                                        { id: 'Card', name: 'Credit / Debit Card', icon: '💳' },
                                        { id: 'Net Banking', name: 'Net Banking', icon: '🏦' },
                                        { id: 'COD', name: 'Cash on Delivery (COD)', icon: '💵' },
                                    ].map((mode) => (
                                        <label
                                            key={mode.id}
                                            className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer hover:border-black transition-all ${
                                                paymentMethod === mode.id ? 'border-black bg-neutral-50' : 'border-neutral-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value={mode.id}
                                                    checked={paymentMethod === mode.id}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="w-4 h-4 text-black focus:ring-black border-neutral-300"
                                                />
                                                <span className="text-sm font-semibold">{mode.name}</span>
                                            </div>
                                            <span className="text-xl">{mode.icon}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="border-t pt-6 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="btn btn-outline flex-1 uppercase"
                                    >
                                        Go Back
                                    </button>
                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={handleSubmitOrder}
                                        className="btn btn-primary flex-1 uppercase"
                                    >
                                        {loading
                                            ? (paymentMethod === 'COD' ? 'Placing Order...' : 'Opening Payment...')
                                            : paymentMethod === 'COD'
                                                ? `Place Order — ${formatCurrency(totalAmount)}`
                                                : `Pay ${formatCurrency(totalAmount)} via Razorpay`
                                        }
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Order Summary */}
                    <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold font-display uppercase tracking-tight border-b pb-4 mb-4">Order Summary</h3>

                        {/* Items List */}
                        <div className="divide-y max-h-72 overflow-y-auto mb-6 scrollbar-thin">
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.variant.id}`} className="flex gap-3 py-3 first:pt-0">
                                    <img
                                        src={item.image.url}
                                        alt={item.image.alt}
                                        className="w-12 h-16 object-cover rounded-md border"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-semibold line-clamp-1">{item.name}</h4>
                                        <p className="text-[10px] text-neutral-500 mt-0.5">
                                            Size: {item.variant.size} | Color: {item.variant.color}
                                        </p>
                                        <p className="text-xs text-neutral-500 mt-1">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="text-xs font-bold">{formatCurrency(item.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Charges breakdown */}
                        <div className="border-t pt-4 space-y-2.5 text-sm">
                            <div className="flex justify-between text-neutral-600">
                                <span>Cart Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-neutral-600">
                                <span>GST (18% integrated)</span>
                                <span>{formatCurrency(gstAmount)}</span>
                            </div>
                            <div className="flex justify-between text-neutral-600">
                                <span>Delivery Charges</span>
                                <span>{shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}</span>
                            </div>
                            {shippingCost > 0 && (
                                <p className="text-[10px] text-blue-600 font-semibold">
                                    Add items worth {formatCurrency(2500 - subtotal)} more for free shipping!
                                </p>
                            )}
                            <div className="border-t pt-3 flex justify-between font-bold text-base text-neutral-900">
                                <span>Order Total</span>
                                <span>{formatCurrency(totalAmount)}</span>
                            </div>
                        </div>

                        {/* Security guarantees */}
                        <div className="mt-8 bg-neutral-50 border border-neutral-100 rounded-lg p-4 flex gap-3 text-neutral-600 text-xs">
                            <ShieldCheck size={20} className="text-green-600 flex-shrink-0" />
                            <div>
                                <p className="font-bold text-neutral-900 mb-0.5">Secure Payments & Shipping</p>
                                <p>Every order is checked, packed with care, and shipped via express delivery.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
