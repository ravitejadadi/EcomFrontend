import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Truck, RefreshCw, Shield, ChevronRight } from 'lucide-react';
import { getProductBySlug, products } from '../data/products';
import { useCart } from '../context/CartContext';
import { formatCurrency, calculateDiscount } from '../utils/helpers';
import ProductCard from '../components/product/ProductCard';
import { motion } from 'framer-motion';
import { apiFetch } from '../utils/api';
import { toggleWishlist, isWishlisted } from './WishlistPage';

const ProductDetailPage = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [allProducts, setAllProducts] = useState(products);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [wishlisted, setWishlisted] = useState(false);

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                const res = await apiFetch(`/products/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                } else {
                    throw new Error('Not found');
                }
            } catch (err) {
                console.log('Using static fallback for PDP product:', err.message);
                const local = getProductBySlug(slug);
                setProduct(local);
            } finally {
                setLoading(false);
            }
        };

        const fetchAllProducts = async () => {
            try {
                const res = await apiFetch('/products');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setAllProducts(data);
                    }
                }
            } catch (err) {
                console.log('Using static fallback for PDP related products:', err.message);
            }
        };

        fetchProductData();
        fetchAllProducts();
        window.scrollTo(0, 0);
    }, [slug]);

    useEffect(() => {
        if (product && product.variants.length > 0) {
            setSelectedVariant(product.variants[0]);
            setSelectedImage(0);
            setWishlisted(isWishlisted(product.id || product._id));
        }
    }, [product]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container-custom py-20 text-center">
                <h1 className="text-3xl font-display font-bold mb-4">Product Not Found</h1>
                <p className="text-neutral-600 mb-8">
                    The product you're looking for doesn't exist.
                </p>
                <Link to="/collections/all" className="btn btn-primary">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const discount = product.compareAtPrice
        ? calculateDiscount(product.compareAtPrice, product.price)
        : 0;

    const handleAddToCart = () => {
        if (selectedVariant) {
            addToCart(product, selectedVariant, quantity);
        }
    };

    const relatedProducts = allProducts
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const uniqueSizes = [...new Set(product.variants.map((v) => v.size))];

    return (
        <div>
            {/* Breadcrumb */}
            <div className="container-custom py-6 border-b border-neutral-200">
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Link to="/" className="hover:text-neutral-900">
                        Home
                    </Link>
                    <ChevronRight size={16} />
                    <Link to={`/collections/${product.category.toLowerCase()}`} className="hover:text-neutral-900">
                        {product.category}
                    </Link>
                    <ChevronRight size={16} />
                    <span className="text-neutral-900">{product.name}</span>
                </div>
            </div>

            {/* Product Section */}
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Images */}
                    <div>
                        {/* Main Image */}
                        <motion.div
                            key={selectedImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="aspect-product bg-neutral-100 rounded-lg overflow-hidden mb-4"
                        >
                            <img
                                src={product.images[selectedImage].url}
                                alt={product.images[selectedImage].alt}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        {/* Thumbnail Images */}
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square bg-neutral-100 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                                ? 'border-neutral-900'
                                                : 'border-transparent hover:border-neutral-300'
                                            }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={image.alt}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        {/* Badges */}
                        {product.badges && product.badges.length > 0 && (
                            <div className="flex gap-2 mb-4">
                                {product.badges.map((badge) => (
                                    <span
                                        key={badge}
                                        className={`badge ${badge === 'NEW'
                                                ? 'badge-new'
                                                : badge === 'SALE'
                                                    ? 'badge-sale'
                                                    : badge === 'LIMITED'
                                                        ? 'badge-limited'
                                                        : 'badge-bestseller'
                                            }`}
                                    >
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl font-bold">
                                {formatCurrency(product.price)}
                            </span>
                            {product.compareAtPrice && (
                                <>
                                    <span className="text-xl text-neutral-500 line-through">
                                        {formatCurrency(product.compareAtPrice)}
                                    </span>
                                    <span className="badge badge-sale text-sm">
                                        {discount}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-neutral-700 mb-8 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Size Selection */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <label className="font-semibold">Select Size</label>
                                <Link to="/size-guide" className="text-sm text-neutral-600 hover:text-neutral-900 underline">
                                    Size Guide
                                </Link>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                {uniqueSizes.map((size) => {
                                    const variant = product.variants.find((v) => v.size === size);
                                    const isSelected = selectedVariant?.size === size;
                                    const isAvailable = variant?.inStock;

                                    return (
                                        <button
                                            key={size}
                                            onClick={() => isAvailable && setSelectedVariant(variant)}
                                            disabled={!isAvailable}
                                            className={`py-3 px-4 border-2 rounded-md font-medium transition-all ${isSelected
                                                    ? 'border-neutral-900 bg-neutral-900 text-white'
                                                    : isAvailable
                                                        ? 'border-neutral-300 hover:border-neutral-900'
                                                        : 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed line-through'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="mb-8">
                            <label className="font-semibold mb-3 block">Quantity</label>
                            <div className="flex items-center border border-neutral-300 rounded-md w-32">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-3 hover:bg-neutral-100 transition-colors"
                                >
                                    -
                                </button>
                                <span className="flex-1 text-center font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-3 hover:bg-neutral-100 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <div className="flex gap-4 mb-8">
                            <button
                                onClick={handleAddToCart}
                                disabled={!selectedVariant?.inStock}
                                className="btn btn-primary flex-1 btn-lg"
                            >
                                {selectedVariant?.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            <button
                                onClick={() => { const pid = product.id || product._id; setWishlisted(toggleWishlist(pid)); }}
                                className={`btn btn-outline p-4 ${wishlisted ? 'bg-neutral-900 text-white' : ''}`}
                                aria-label="Add to wishlist"
                            >
                                <Heart size={24} className={wishlisted ? 'fill-current' : ''} />
                            </button>
                        </div>

                        {/* Features */}
                        <div className="space-y-4 border-t border-neutral-200 pt-8">
                            <div className="flex items-start gap-3">
                                <Truck className="text-neutral-600 flex-shrink-0 mt-1" size={20} />
                                <div>
                                    <p className="font-medium">Free Shipping</p>
                                    <p className="text-sm text-neutral-600">
                                        On orders above ₹2,500
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <RefreshCw className="text-neutral-600 flex-shrink-0 mt-1" size={20} />
                                <div>
                                    <p className="font-medium">Easy Returns</p>
                                    <p className="text-sm text-neutral-600">
                                        30-day return policy
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Shield className="text-neutral-600 flex-shrink-0 mt-1" size={20} />
                                <div>
                                    <p className="font-medium">Secure Checkout</p>
                                    <p className="text-sm text-neutral-600">
                                        100% secure payments
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="mt-8 space-y-4">
                            <details className="border-t border-neutral-200 pt-4">
                                <summary className="font-semibold cursor-pointer">
                                    Product Details
                                </summary>
                                <div className="mt-4 space-y-2 text-sm text-neutral-700">
                                    <p><strong>Material:</strong> {product.material}</p>
                                    <p><strong>Care Instructions:</strong> {product.careInstructions}</p>
                                    <p><strong>SKU:</strong> {selectedVariant?.sku}</p>
                                </div>
                            </details>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="bg-neutral-50 py-16">
                    <div className="container-custom">
                        <h2 className="text-3xl font-display font-bold mb-8">
                            You May Also Like
                        </h2>
                        <div className="product-grid">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default ProductDetailPage;
