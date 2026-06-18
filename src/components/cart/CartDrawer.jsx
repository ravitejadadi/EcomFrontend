import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

const CartDrawer = () => {
    const {
        cart,
        isCartOpen,
        setIsCartOpen,
        removeFromCart,
        updateQuantity,
        getCartTotal,
    } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                            <h2 className="text-xl font-display font-semibold">
                                Shopping Cart ({cart.length})
                            </h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-neutral-100 rounded-md transition-colors"
                                aria-label="Close cart"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <ShoppingBag size={64} className="text-neutral-300 mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                                    <p className="text-neutral-600 mb-6">
                                        Add some items to get started!
                                    </p>
                                    <Link
                                        to="/collections/all"
                                        onClick={() => setIsCartOpen(false)}
                                        className="btn btn-primary"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div
                                            key={`${item.id}-${item.variant.id}`}
                                            className="flex gap-4 pb-4 border-b border-neutral-200 last:border-0"
                                        >
                                            {/* Product Image */}
                                            <Link
                                                to={`/product/${item.slug}`}
                                                onClick={() => setIsCartOpen(false)}
                                                className="flex-shrink-0"
                                            >
                                                <img
                                                    src={item.image.url}
                                                    alt={item.image.alt}
                                                    className="w-20 h-24 object-cover rounded-md"
                                                />
                                            </Link>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    to={`/product/${item.slug}`}
                                                    onClick={() => setIsCartOpen(false)}
                                                    className="font-medium text-sm hover:text-neutral-600 transition-colors line-clamp-2"
                                                >
                                                    {item.name}
                                                </Link>
                                                <p className="text-xs text-neutral-600 mt-1">
                                                    Size: {item.variant.size} | Color: {item.variant.color}
                                                </p>
                                                <p className="text-sm font-semibold mt-2">
                                                    {formatCurrency(item.price)}
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3 mt-3">
                                                    <div className="flex items-center border border-neutral-300 rounded-md">
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.variant.id,
                                                                    item.quantity - 1
                                                                )
                                                            }
                                                            className="p-1 hover:bg-neutral-100 transition-colors"
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="px-3 text-sm font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.variant.id,
                                                                    item.quantity + 1
                                                                )
                                                            }
                                                            className="p-1 hover:bg-neutral-100 transition-colors"
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeFromCart(item.id, item.variant.id)}
                                                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="border-t border-neutral-200 p-6 space-y-4">
                                {/* Subtotal */}
                                <div className="flex justify-between items-center text-lg font-semibold">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(getCartTotal())}</span>
                                </div>

                                {/* Shipping Note */}
                                <p className="text-xs text-neutral-600">
                                    Shipping and taxes calculated at checkout
                                </p>

                                {/* Checkout Button */}
                                <Link
                                    to="/checkout"
                                    onClick={() => setIsCartOpen(false)}
                                    className="btn btn-primary w-full text-center"
                                >
                                    Proceed to Checkout
                                </Link>

                                {/* Continue Shopping */}
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="btn btn-outline w-full"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
