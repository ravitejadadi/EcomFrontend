import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { products as fallbackProducts } from '../data/products';
import { ChevronDown } from 'lucide-react';
import { apiFetch } from '../utils/api';

const CollectionPage = () => {
    const { category } = useParams();
    const [products, setProducts] = useState(fallbackProducts);
    const [sortBy, setSortBy] = useState('featured');
    const [filters, setFilters] = useState({
        priceRange: 'all',
        size: 'all',
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await apiFetch('/products');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setProducts(data);
                    }
                }
            } catch (err) {
                console.log('Using static fallback products on CollectionPage:', err.message);
            }
        };
        fetchProducts();
    }, []);

    // Filter products based on category and filters
    let filteredProducts = products;

    if (category && category !== 'all') {
        if (category === 'new-arrivals') {
            filteredProducts = products.filter((p) => p.badges?.includes('NEW'));
        } else if (category === 'sale') {
            filteredProducts = products.filter((p) => p.badges?.includes('SALE'));
        } else if (category === 'bestsellers') {
            filteredProducts = products.filter((p) => p.badges?.includes('BESTSELLER'));
        } else if (category === 'men' || category === 'women') {
            // Filter by gender for parent categories
            filteredProducts = products.filter(
                (p) => p.gender === category || p.gender === 'unisex'
            );
        } else {
            // Normalize the category slug for matching
            const normalizedSlug = category.toLowerCase().replace(/-/g, ' ');

            // Handle composite categories (e.g., "mens-clothing", "men-accessories")
            if (category.startsWith('mens-') || category.startsWith('men-')) {
                const subCategory = category.replace(/^mens?-/, '');
                filteredProducts = products.filter((p) => {
                    const matchesGender = p.gender === 'men' || p.gender === 'unisex';
                    const matchesCategory =
                        p.category.toLowerCase().includes(subCategory) ||
                        p.subcategory.toLowerCase().includes(subCategory) ||
                        p.tags.some(tag => tag.toLowerCase().includes(subCategory));
                    return matchesGender && matchesCategory;
                });
            } else if (category.startsWith('womens-') || category.startsWith('women-')) {
                const subCategory = category.replace(/^womens?-/, '');
                filteredProducts = products.filter((p) => {
                    const matchesGender = p.gender === 'women' || p.gender === 'unisex';
                    const matchesCategory =
                        p.category.toLowerCase().includes(subCategory) ||
                        p.subcategory.toLowerCase().includes(subCategory) ||
                        p.tags.some(tag => tag.toLowerCase().includes(subCategory));
                    return matchesGender && matchesCategory;
                });
            } else {
                // Match by category name, subcategory, or tags
                filteredProducts = products.filter((p) =>
                    p.category.toLowerCase().replace(/-/g, ' ') === normalizedSlug ||
                    p.subcategory.toLowerCase().replace(/-/g, ' ') === normalizedSlug ||
                    p.tags.some(tag => tag.toLowerCase() === category) ||
                    p.category.toLowerCase().includes(normalizedSlug) ||
                    p.subcategory.toLowerCase().includes(normalizedSlug)
                );
            }
        }
    }

    // Apply price filter
    if (filters.priceRange !== 'all') {
        filteredProducts = filteredProducts.filter((p) => {
            if (filters.priceRange === 'under-2000') return p.price < 2000;
            if (filters.priceRange === '2000-5000') return p.price >= 2000 && p.price <= 5000;
            if (filters.priceRange === 'above-5000') return p.price > 5000;
            return true;
        });
    }

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-low-high') return a.price - b.price;
        if (sortBy === 'price-high-low') return b.price - a.price;
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        return 0; // featured
    });

    const getCategoryTitle = () => {
        if (!category || category === 'all') return 'All Products';
        if (category === 'new-arrivals') return 'New Arrivals';
        if (category === 'bestsellers') return 'Bestsellers';
        if (category === 'sale') return 'Sale';
        if (category === 'men') return "Men's Collection";
        if (category === 'women') return "Women's Collection";
        return category.charAt(0).toUpperCase() + category.slice(1);
    };

    return (
        <div className="container-custom py-12">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-display font-bold mb-2">
                    {getCategoryTitle()}
                </h1>
                <p className="text-neutral-600">
                    {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
                </p>
            </div>

            {/* Filters & Sort */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 pb-8 border-b border-neutral-200">
                {/* Price Filter */}
                <div className="relative w-full sm:w-auto sm:flex-initial">
                    <select
                        value={filters.priceRange}
                        onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                        className="w-full appearance-none bg-white border border-neutral-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-neutral-900 cursor-pointer text-sm sm:text-base"
                    >
                        <option value="all">All Prices</option>
                        <option value="under-2000">Under ₹2,000</option>
                        <option value="2000-5000">₹2,000 - ₹5,000</option>
                        <option value="above-5000">Above ₹5,000</option>
                    </select>
                    <ChevronDown
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500"
                        size={16}
                    />
                </div>

                {/* Sort */}
                <div className="relative w-full sm:w-auto sm:flex-initial sm:ml-auto">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full appearance-none bg-white border border-neutral-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-neutral-900 cursor-pointer text-sm sm:text-base"
                    >
                        <option value="featured">Featured</option>
                        <option value="newest">Newest</option>
                        <option value="price-low-high">Price: Low to High</option>
                        <option value="price-high-low">Price: High to Low</option>
                    </select>
                    <ChevronDown
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500"
                        size={16}
                    />
                </div>
            </div>

            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
                <div className="product-grid">
                    {sortedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-xl text-neutral-600 mb-4">No products found</p>
                    <p className="text-neutral-500">Try adjusting your filters</p>
                </div>
            )}
        </div>
    );
};

export default CollectionPage;
