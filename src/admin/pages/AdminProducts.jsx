import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';
import { Plus, Search, Edit2, Trash2, X, UploadCloud, AlertCircle } from 'lucide-react';
import { apiFetch, apiUpload } from '../../utils/api';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [modalError, setModalError] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

    // Form states
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [compareAtPrice, setCompareAtPrice] = useState('');
    const [category, setCategory] = useState('Running');
    const [subcategory, setSubcategory] = useState('');
    const [gender, setGender] = useState('unisex');
    const [material, setMaterial] = useState('');
    const [careInstructions, setCareInstructions] = useState('');
    const [sizeGuide, setSizeGuide] = useState('standard');
    const [images, setImages] = useState([]);
    const [variants, setVariants] = useState([]);
    const [badges, setBadges] = useState([]);
    const [tags, setTags] = useState([]);

    // Temporary input for badges/tags/variants
    const [tempBadge, setTempBadge] = useState('');
    const [tempTag, setTempTag] = useState('');
    const [vSize, setVSize] = useState('');
    const [vColor, setVColor] = useState('');
    const [vSku, setVSku] = useState('');
    const [vPrice, setVPrice] = useState('');
    const [vInventory, setVInventory] = useState('');

    const navigate = useNavigate();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/products');
            if (!res.ok) throw new Error('Failed to fetch products');
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const openCreateModal = () => {
        setEditingProduct(null);
        setName('');
        setDescription('');
        setPrice('');
        setCompareAtPrice('');
        setCategory('Running');
        setSubcategory('');
        setGender('unisex');
        setMaterial('');
        setCareInstructions('');
        setSizeGuide('standard');
        setImages([]);
        setVariants([]);
        setBadges([]);
        setTags([]);
        setModalError('');
        setIsModalOpen(true);
    };

    const openEditModal = (p) => {
        setEditingProduct(p);
        setName(p.name);
        setDescription(p.description || '');
        setPrice(p.price);
        setCompareAtPrice(p.compareAtPrice || '');
        setCategory(p.category);
        setSubcategory(p.subcategory || '');
        setGender(p.gender || 'unisex');
        setMaterial(p.material || '');
        setCareInstructions(p.careInstructions || '');
        setSizeGuide(p.sizeGuide || 'standard');
        setImages(p.images || []);
        setVariants(p.variants || []);
        setBadges(p.badges || []);
        setTags(p.tags || []);
        setModalError('');
        setIsModalOpen(true);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        setModalError('');
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await apiUpload('/products/upload-image', formData);

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Image upload failed');

            const newImg = {
                id: 'img-' + Math.random().toString(36).substring(2, 7),
                url: data.url,
                alt: name || 'Product image',
                position: images.length + 1,
            };
            setImages([...images, newImg]);
        } catch (err) {
            console.error(err);
            setModalError(err.message);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleAddVariant = () => {
        if (!vSize || !vColor || !vPrice || !vInventory) {
            alert('Please specify size, color, price, and inventory for variant');
            return;
        }

        const newVariant = {
            id: 'vr-' + Math.random().toString(36).substring(2, 7),
            size: vSize,
            color: vColor,
            sku: vSku || `${name.substring(0, 3).toUpperCase()}-${vSize}-${vColor.substring(0, 2).toUpperCase()}`,
            price: Number(vPrice),
            inStock: Number(vInventory) > 0,
            inventory: Number(vInventory),
        };

        setVariants([...variants, newVariant]);
        setVSize('');
        setVColor('');
        setVSku('');
        setVPrice('');
        setVInventory('');
    };

    const handleRemoveVariant = (id) => {
        setVariants(variants.filter((v) => v.id !== id));
    };

    const handleAddBadge = () => {
        if (tempBadge && !badges.includes(tempBadge.toUpperCase())) {
            setBadges([...badges, tempBadge.toUpperCase()]);
            setTempBadge('');
        }
    };

    const handleAddTag = () => {
        if (tempTag && !tags.includes(tempTag.toLowerCase())) {
            setTags([...tags, tempTag.toLowerCase()]);
            setTempTag('');
        }
    };

    const handleRemoveImage = (id) => {
        setImages(images.filter((img) => img.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalError('');

        if (images.length === 0) {
            setModalError('Please upload at least one image');
            return;
        }
        if (variants.length === 0) {
            setModalError('Please define at least one product variant (size, color, stock)');
            return;
        }

        const payload = {
            name,
            description,
            price: Number(price),
            compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
            category,
            subcategory,
            gender,
            material,
            careInstructions,
            sizeGuide,
            images,
            variants,
            badges,
            tags,
        };

        const method = editingProduct ? 'PUT' : 'POST';
        const path = editingProduct ? `/products/${editingProduct.id}` : '/products';

        try {
            const res = await apiFetch(path, { method, body: JSON.stringify(payload) });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Operation failed');

            setIsModalOpen(false);
            fetchProducts();
        } catch (err) {
            console.error(err);
            setModalError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product from the inventory?')) return;

        try {
            const res = await apiFetch(`/products/${id}`, { method: 'DELETE' });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Deletion failed');

            fetchProducts();
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const CATEGORIES = ['All', 'Running', 'Sneakers', 'Mens Clothing', 'Womens Clothing', 'Kids', 'Accessories'];

    const filteredProducts = products.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black font-display uppercase tracking-tight text-neutral-900">Products</h1>
                    <p className="text-neutral-500 text-sm mt-1">Manage e-commerce inventory details and images catalog</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="btn btn-primary btn-sm flex items-center gap-1 self-start sm:self-auto uppercase"
                >
                    <Plus size={18} /> Add Product
                </button>
            </div>

            {/* Filters / Search */}
            <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm space-y-3">
                {/* Search row */}
                <div className="flex items-center gap-3">
                    <Search size={20} className="text-neutral-400 shrink-0" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products by name or category..."
                        className="flex-1 bg-transparent border-0 outline-none focus:ring-0 text-sm text-neutral-800"
                    />
                    {(searchQuery || selectedCategory !== 'All') && (
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                            className="text-xs font-bold text-neutral-400 hover:text-black uppercase tracking-wide flex items-center gap-1 shrink-0"
                        >
                            <X size={13} /> Clear
                        </button>
                    )}
                </div>

                {/* Category filter chips */}
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border transition-all duration-150 ${
                                selectedCategory === cat
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-neutral-600 border-neutral-300 hover:border-black hover:text-black'
                            }`}
                        >
                            {cat}
                            {cat !== 'All' && (
                                <span className={`ml-1.5 text-[10px] font-normal ${selectedCategory === cat ? 'text-neutral-300' : 'text-neutral-400'}`}>
                                    ({products.filter(p => p.category === cat).length})
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Catalog Grid/Table */}
            <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-100">
                                <th className="p-4">Image</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Base Price</th>
                                <th className="p-4">Inventory</th>
                                <th className="p-4">Stock Status</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-neutral-400">Loading products database...</td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-neutral-400">No products matching query found.</td>
                                </tr>
                            ) : (
                                filteredProducts.map((p) => (
                                    <tr key={p.id} className="hover:bg-neutral-50/30">
                                        <td className="p-4">
                                            <img
                                                src={p.images?.[0]?.url || 'https://via.placeholder.com/60x80'}
                                                alt={p.name}
                                                className="w-12 h-16 object-cover rounded border"
                                            />
                                        </td>
                                        <td className="p-4 font-bold text-neutral-800">{p.name}</td>
                                        <td className="p-4 text-neutral-600 font-medium">{p.category}</td>
                                        <td className="p-4 font-semibold text-neutral-900">{formatCurrency(p.price)}</td>
                                        <td className="p-4 font-semibold text-neutral-700">{p.inventory}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                                                p.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {p.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(p)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                    aria-label="Edit product"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                    aria-label="Delete product"
                                                >
                                                    <Trash2 size={16} />
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

            {/* Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto max-h-screen">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                        {/* Header */}
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-xl font-bold font-display uppercase tracking-tight">
                                {editingProduct ? 'Edit Product' : 'Create Product'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-neutral-100 rounded-md">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Error */}
                        {modalError && (
                            <div className="mx-6 mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md flex gap-3 text-red-700 text-sm">
                                <AlertCircle size={20} className="flex-shrink-0" />
                                <span>{modalError}</span>
                            </div>
                        )}

                        {/* Form Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
                            {/* Section 1: Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Product Name</label>
                                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="e.g. Rare Rabbit Chino" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Base Price (INR)</label>
                                        <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="input" placeholder="2999" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Compare At (INR)</label>
                                        <input type="number" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} className="input" placeholder="3999" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="input" placeholder="Describe materials, build quality, and feel..." />
                            </div>

                            {/* Section 2: Metadata */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Category</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
                                        <option value="Running">Running</option>
                                        <option value="Sneakers">Sneakers</option>
                                        <option value="Mens Clothing">Mens Clothing</option>
                                        <option value="Womens Clothing">Womens Clothing</option>
                                        <option value="Kids">Kids</option>
                                        <option value="Accessories">Accessories</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Sub-Category</label>
                                    <input type="text" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="input" placeholder="e.g. Polo T-shirts" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Target Gender</label>
                                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="input">
                                        <option value="unisex">Unisex</option>
                                        <option value="men">Men</option>
                                        <option value="women">Women</option>
                                        <option value="kids">Kids</option>
                                    </select>
                                </div>
                            </div>

                            {/* Section 3: Specs */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Material Composition</label>
                                    <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)} className="input" placeholder="e.g. 100% Pima Cotton" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Care Instructions</label>
                                    <input type="text" value={careInstructions} onChange={(e) => setCareInstructions(e.target.value)} className="input" placeholder="e.g. Wash cold, line dry" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Size Guide Template</label>
                                    <select value={sizeGuide} onChange={(e) => setSizeGuide(e.target.value)} className="input">
                                        <option value="standard">Standard Apparel</option>
                                        <option value="footwear">Footwear Chart</option>
                                        <option value="outerwear">Outerwear Chart</option>
                                        <option value="kids">Kids Chart</option>
                                    </select>
                                </div>
                            </div>

                            {/* Section 4: Image uploads */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 block">Product Gallery (WebP/JPEG)</label>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                    {images.map((img) => (
                                        <div key={img.id} className="relative aspect-[3/4] border rounded-lg overflow-hidden group bg-neutral-50">
                                            <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(img.id)}
                                                className="absolute top-1 right-1 p-1 bg-black bg-opacity-70 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="border-2 border-dashed border-neutral-300 rounded-lg aspect-[3/4] flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors bg-neutral-50">
                                        {uploadingImage ? (
                                            <span className="text-[10px] font-bold text-neutral-500">Uploading...</span>
                                        ) : (
                                            <>
                                                <UploadCloud size={24} className="text-neutral-400" />
                                                <span className="text-[10px] font-bold text-neutral-500 mt-1 uppercase">Upload Image</span>
                                            </>
                                        )}
                                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            {/* Section 5: Variants */}
                            <div className="border-t pt-6 space-y-4">
                                <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-800">Product Variants</h3>

                                {/* Variant Input fields */}
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end bg-neutral-50 p-4 border rounded-xl">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-neutral-500">Size</label>
                                        <input type="text" value={vSize} onChange={(e) => setVSize(e.target.value)} className="input py-2 px-3 text-sm" placeholder="e.g. M, 9" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-neutral-500">Color</label>
                                        <input type="text" value={vColor} onChange={(e) => setVColor(e.target.value)} className="input py-2 px-3 text-sm" placeholder="e.g. Navy Blue" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-neutral-500">SKU (Optional)</label>
                                        <input type="text" value={vSku} onChange={(e) => setVSku(e.target.value)} className="input py-2 px-3 text-sm" placeholder="Auto-generated" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-neutral-500">Price (INR)</label>
                                        <input type="number" value={vPrice} onChange={(e) => setVPrice(e.target.value)} className="input py-2 px-3 text-sm" placeholder="2999" />
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <div className="space-y-1 flex-1">
                                            <label className="text-[10px] font-bold uppercase text-neutral-500">Inventory Stock</label>
                                            <input type="number" value={vInventory} onChange={(e) => setVInventory(e.target.value)} className="input py-2 px-3 text-sm" placeholder="15" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddVariant}
                                            className="btn btn-primary py-2 px-4 h-10 mt-1 shrink-0 text-sm"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>

                                {/* Variants Table list */}
                                <div className="border rounded-lg overflow-hidden text-xs">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-neutral-50 border-b font-bold text-neutral-500">
                                                <th className="p-3">Size</th>
                                                <th className="p-3">Color</th>
                                                <th className="p-3">SKU</th>
                                                <th className="p-3">Price</th>
                                                <th className="p-3">Stock count</th>
                                                <th className="p-3 text-center">Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {variants.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="p-4 text-center text-neutral-400 font-medium">Please define variants above.</td>
                                                </tr>
                                            ) : (
                                                variants.map((v) => (
                                                    <tr key={v.id} className="hover:bg-neutral-50/50">
                                                        <td className="p-3 font-semibold">{v.size}</td>
                                                        <td className="p-3">{v.color}</td>
                                                        <td className="p-3 font-mono">{v.sku}</td>
                                                        <td className="p-3 font-semibold">{formatCurrency(v.price)}</td>
                                                        <td className="p-3 font-bold">{v.inventory}</td>
                                                        <td className="p-3 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveVariant(v.id)}
                                                                className="text-red-600 hover:text-red-700 font-bold"
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Section 6: Badges & Tags */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 block">Catalog Badges</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={tempBadge}
                                            onChange={(e) => setTempBadge(e.target.value)}
                                            className="input py-2 px-3 text-sm flex-1"
                                            placeholder="e.g. NEW, SALE, LIMITED"
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBadge())}
                                        />
                                        <button type="button" onClick={handleAddBadge} className="btn btn-outline py-2 px-4 text-sm font-semibold h-10">Add</button>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {badges.map((b) => (
                                            <span key={b} className="px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                                                {b}
                                                <button type="button" onClick={() => setBadges(badges.filter(item => item !== b))} className="text-neutral-400 hover:text-white"><X size={10} /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 block">Search Tags</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={tempTag}
                                            onChange={(e) => setTempTag(e.target.value)}
                                            className="input py-2 px-3 text-sm flex-1"
                                            placeholder="e.g. cotton, winter"
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                        />
                                        <button type="button" onClick={handleAddTag} className="btn btn-outline py-2 px-4 text-sm font-semibold h-10">Add</button>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {tags.map((t) => (
                                            <span key={t} className="px-2.5 py-1 bg-neutral-200 text-neutral-800 text-[10px] font-bold rounded-full flex items-center gap-1">
                                                #{t}
                                                <button type="button" onClick={() => setTags(tags.filter(item => item !== t))} className="text-neutral-500 hover:text-black"><X size={10} /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="border-t pt-6 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline flex-1 uppercase">Cancel</button>
                                <button type="submit" className="btn btn-primary flex-1 uppercase">Save Catalog Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
