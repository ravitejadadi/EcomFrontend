import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { apiFetch } from '../utils/api';
import { formatCurrency } from '../utils/helpers';
import { useCart } from '../context/CartContext';

const WISHLIST_KEY = 'te_wishlist';

export const getWishlist = () => {
    try { return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]'); } catch { return []; }
};

export const toggleWishlist = (productId) => {
    const list = getWishlist();
    const exists = list.includes(productId);
    const updated = exists ? list.filter(id => id !== productId) : [...list, productId];
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('wishlist-updated'));
    return !exists;
};

export const isWishlisted = (productId) => getWishlist().includes(productId);

const WishlistPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlistIds, setWishlistIds] = useState(getWishlist);
    const { addToCart } = useCart();

    useEffect(() => {
        const syncWishlist = () => setWishlistIds(getWishlist());
        window.addEventListener('wishlist-updated', syncWishlist);
        return () => window.removeEventListener('wishlist-updated', syncWishlist);
    }, []);

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            if (wishlistIds.length === 0) { setProducts([]); setLoading(false); return; }
            setLoading(true);
            try {
                const res = await apiFetch('/products');
                if (res.ok) {
                    const all = await res.json();
                    setProducts(all.filter(p => wishlistIds.includes(p.id || p._id)));
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchWishlistProducts();
    }, [wishlistIds]);

    const handleRemove = (productId) => {
        toggleWishlist(productId);
    };

    const handleAddToCart = (product) => {
        if (!product.variants || product.variants.length === 0) return;
        const variant = product.variants.find(v => v.inStock) || product.variants[0];
        addToCart({ ...product, selectedVariant: variant, quantity: 1 });
    };

    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <div className="bg-black text-white py-16 md:py-20">
                <div className="container-custom">
                    <div className="flex items-center gap-3 mb-2">
                        <Heart size={28} className="fill-white" />
                        <p className="text-xs font-bold tracking-widest uppercase text-neutral-400">My List</p>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight">WISHLIST</h1>
                    <p className="text-neutral-400 mt-2">{wishlistIds.length} {wishlistIds.length === 1 ? 'item' : 'items'} saved</p>
                </div>
            </div>

            <div className="container-custom py-12 md:py-16">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black" />
                    </div>
                ) : wishlistIds.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
                            <Heart size={40} className="text-neutral-300" />
                        </div>
                        <h2 className="text-2xl font-black font-display uppercase tracking-tight mb-3">Your Wishlist is Empty</h2>
                        <p className="text-neutral-600 mb-8 max-w-sm">
                            Save your favourite items by tapping the heart icon on any product page.
                        </p>
                        <Link to="/" className="btn btn-primary uppercase flex items-center gap-2">
                            Browse Collections <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black font-display uppercase tracking-tight">Saved Items ({products.length})</h2>
                            <button
                                onClick={() => { localStorage.setItem(WISHLIST_KEY, '[]'); window.dispatchEvent(new Event('wishlist-updated')); }}
                                className="text-sm text-red-600 font-bold hover:underline flex items-center gap-1"
                            >
                                <Trash2 size={14} /> Clear All
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map(product => {
                                const mainImage = product.images?.[0]?.url;
                                const inStock = product.variants?.some(v => v.inStock) ?? product.inStock;
                                return (
                                    <div key={product.id || product._id} className="group bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                        <div className="relative aspect-product bg-neutral-100 overflow-hidden">
                                            <Link to={`/product/${product.slug}`}>
                                                <img
                                                    src={mainImage || 'https://via.placeholder.com/300x400?text=No+Image'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            </Link>
                                            <button
                                                onClick={() => handleRemove(product.id || product._id)}
                                                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                                                title="Remove from wishlist"
                                            >
                                                <Heart size={16} className="fill-red-500 text-red-500" />
                                            </button>
                                            {!inStock && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <span className="px-3 py-1.5 bg-black text-white text-xs font-bold uppercase rounded-full">Out of Stock</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <Link to={`/product/${product.slug}`}>
                                                <h3 className="font-bold text-neutral-900 text-sm mb-1 line-clamp-2 hover:underline">{product.name}</h3>
                                            </Link>
                                            <p className="text-xs text-neutral-500 mb-3 uppercase tracking-wide">{product.category}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="font-black text-neutral-900">{formatCurrency(product.price)}</span>
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={!inStock}
                                                    className="btn btn-primary btn-sm flex items-center gap-1.5 text-xs uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <ShoppingBag size={13} />
                                                    {inStock ? 'Add to Cart' : 'Sold Out'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="text-center mt-12">
                            <Link to="/" className="btn btn-outline uppercase flex items-center gap-2 w-fit mx-auto">
                                Continue Shopping <ArrowRight size={18} />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
