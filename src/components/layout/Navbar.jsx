import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import theElegantLogo from '../../assets/images/the_elegant_logo.png';

const womenLogo = '/womenslogo.png';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isWomenSection = location.pathname.toLowerCase().includes('women');
    const activeLogo = isWomenSection ? womenLogo : theElegantLogo;

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [user, setUser] = useState(null);
    const { getCartCount, setIsCartOpen } = useCart();

    const checkUser = () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch (e) {
                setUser(null);
            }
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        checkUser();
        window.addEventListener('focus', checkUser);
        return () => window.removeEventListener('focus', checkUser);
    }, [location]);

    const handleSignOut = () => {
        localStorage.clear();
        setUser(null);
        setProfileOpen(false);
        navigate('/');
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const megaMenuData = {
        'New': {
            featured: [
                { name: 'New Arrivals', href: '/collections/new-arrivals', highlight: true },
                { name: 'Launch Calendar', href: '/collections/launch-calendar' },
                { name: 'Trending Now', href: '/collections/trending' },
            ],
            categories: [
                { name: "Men's New", href: '/collections/mens-new' },
                { name: "Women's New", href: '/collections/womens-new' },
                { name: "Kids' New", href: '/collections/kids-new' },
            ]
        },
        'Men': {
            featured: [
                { name: 'Bestsellers', href: '/collections/men-bestsellers', highlight: true },
                { name: 'New Arrivals', href: '/collections/mens-new' },
                { name: 'Sale', href: '/collections/men-sale', sale: true },
            ],
            categories: [
                { name: 'Clothing', href: '/collections/mens-clothing' },
                { name: 'Footwear', href: '/collections/men-footwear' },
                { name: 'Accessories', href: '/collections/men-accessories' },
            ]
        },
        'Women': {
            featured: [
                { name: 'Bestsellers', href: '/collections/women-bestsellers', highlight: true },
                { name: 'New Arrivals', href: '/collections/womens-new' },
                { name: 'Sale', href: '/collections/women-sale', sale: true },
            ],
            categories: [
                { name: 'Clothing', href: '/collections/womens-clothing' },
                { name: 'Footwear', href: '/collections/women-footwear' },
                { name: 'Accessories', href: '/collections/women-accessories' },
            ]
        },
        'Sports': {
            featured: [
                { name: 'Running', href: '/collections/running', highlight: true },
                { name: 'Badminton', href: '/collections/badminton' },
            ],
            categories: []
        },
        'Kids': {
            featured: [
                { name: 'New Arrivals', href: '/collections/kids-new', highlight: true },
                { name: 'Bestsellers', href: '/collections/kids-bestsellers' },
                { name: 'Sale', href: '/collections/kids-sale', sale: true },
            ],
            categories: [
                { name: 'Boys (2-8Y)', href: '/collections/boys' },
                { name: 'Girls (2-8Y)', href: '/collections/girls' },
                { name: 'Infants (0-2Y)', href: '/collections/infants' },
            ]
        },
    };

    const mainMenuItems = [
        { name: 'New', hasMenu: true },
        { name: 'Men', hasMenu: true },
        { name: 'Women', hasMenu: true },
        { name: 'Sports', hasMenu: true },
        { name: 'Kids', hasMenu: true },
        { name: 'Sale', href: '/collections/sale', highlight: true },
    ];

    return (
        <>
            {/* Top Announcement Bar */}
            <div className="bg-black text-white text-center py-2.5 px-4 text-xs md:text-sm font-medium tracking-wide">
                <p className="flex items-center justify-center gap-2">
                    <span className="hidden md:inline">⚡</span>
                    FREE SHIPPING ON ORDERS ABOVE ₹2,500 | 30-DAY EASY RETURNS
                    <span className="hidden md:inline">⚡</span>
                </p>
            </div>

            {/* Main Navbar */}
            <nav
                className={`sticky top-0 z-50 bg-white transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-sm'
                    }`}
            >
                <div className="container-custom">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        {/* Logo */}
                        <Link
                            to="/"
                            className="hover:opacity-80 transition-opacity flex-shrink-0"
                        >
                            {isWomenSection ? (
                                <div className="h-14 md:h-16 w-28 md:w-36 overflow-hidden flex items-center justify-center rounded-sm bg-white">
                                    <img
                                        src={womenLogo}
                                        alt="The Elegant — Women"
                                        className="w-full h-auto object-cover object-top scale-110"
                                        style={{ marginTop: '-4px' }}
                                    />
                                </div>
                            ) : (
                                <img
                                    src={theElegantLogo}
                                    alt="The Elegant"
                                    className="h-24 md:h-36 w-34"
                                />
                            )}
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                            {mainMenuItems.map((item) => (
                                <div
                                    key={item.name}
                                    className="relative group"
                                    onMouseEnter={() => item.hasMenu && setActiveMenu(item.name)}
                                    onMouseLeave={() => setActiveMenu(null)}
                                >
                                    {item.href ? (
                                        <Link
                                            to={item.href}
                                            className={`px-3 lg:px-4 py-2 text-sm lg:text-base font-semibold transition-colors rounded-md ${item.highlight
                                                ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                                                : 'text-neutral-900 hover:bg-neutral-100'
                                                }`}
                                        >
                                            {item.name}
                                        </Link>
                                    ) : (
                                        <button
                                            className="px-3 lg:px-4 py-2 text-sm lg:text-base font-semibold text-neutral-900 hover:bg-neutral-100 transition-colors rounded-md flex items-center gap-1"
                                        >
                                            {item.name}
                                            {item.hasMenu && <ChevronDown size={16} className="opacity-60" />}
                                        </button>
                                    )}

                                    {/* Mega Menu Dropdown */}
                                    {item.hasMenu && activeMenu === item.name && megaMenuData[item.name] && (
                                        <div className="absolute left-0 top-full pt-2 animate-fade-in">
                                            <div className="bg-white shadow-2xl rounded-lg p-6 min-w-[280px] border border-neutral-100">
                                                {/* Featured Section */}
                                                <div className="mb-4 pb-4 border-b border-neutral-200">
                                                    <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
                                                        Featured
                                                    </h3>
                                                    <div className="space-y-1">
                                                        {megaMenuData[item.name].featured.map((subItem) => (
                                                            <Link
                                                                key={subItem.name}
                                                                to={subItem.href}
                                                                className={`block px-3 py-2 text-sm rounded-md transition-colors ${subItem.highlight
                                                                    ? 'font-bold text-neutral-900 hover:bg-neutral-100'
                                                                    : subItem.sale
                                                                        ? 'text-red-600 font-semibold hover:bg-red-50'
                                                                        : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50'
                                                                    }`}
                                                            >
                                                                {subItem.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Categories Section */}
                                                <div>
                                                    <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
                                                        Shop by Category
                                                    </h3>
                                                    <div className="space-y-1">
                                                        {megaMenuData[item.name].categories.map((subItem) => (
                                                            <Link
                                                                key={subItem.name}
                                                                to={subItem.href}
                                                                className="block px-3 py-2 text-sm text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-colors"
                                                            >
                                                                {subItem.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right Icons */}
                        <div className="flex items-center space-x-2 md:space-x-4">
                            {/* Search */}
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                aria-label="Search"
                            >
                                <Search size={20} />
                            </button>

                            {/* User Account - Hidden on mobile */}
                            <div className="relative">
                                {user ? (
                                    <>
                                        <button
                                            onClick={() => setProfileOpen(!profileOpen)}
                                            className="hidden md:flex items-center gap-1.5 px-3 py-2 hover:bg-neutral-100 rounded-lg transition-colors text-sm font-bold text-neutral-800"
                                        >
                                            <User size={18} />
                                            <span className="truncate max-w-[80px]">Hi, {user.name.split(' ')[0]}</span>
                                        </button>
                                        
                                        {profileOpen && (
                                            <div className="absolute right-0 top-full mt-2 bg-white border border-neutral-200 rounded-lg shadow-xl p-4 min-w-[160px] text-xs font-semibold space-y-2 z-50 animate-fade-in">
                                                {user.role === 'admin' && (
                                                    <Link
                                                        to="/admin"
                                                        onClick={() => setProfileOpen(false)}
                                                        className="block py-1.5 px-2 hover:bg-neutral-50 rounded text-neutral-800"
                                                    >
                                                        Admin Panel
                                                    </Link>
                                                )}
                                                <Link
                                                    to="/dashboard"
                                                    onClick={() => setProfileOpen(false)}
                                                    className="block py-1.5 px-2 hover:bg-neutral-50 rounded text-neutral-800"
                                                >
                                                    My Orders
                                                </Link>
                                                <Link
                                                    to="/track"
                                                    onClick={() => setProfileOpen(false)}
                                                    className="block py-1.5 px-2 hover:bg-neutral-50 rounded text-neutral-800"
                                                >
                                                    Track Order
                                                </Link>
                                                <button
                                                    onClick={handleSignOut}
                                                    className="w-full text-left py-1.5 px-2 hover:bg-red-50 text-red-600 rounded"
                                                >
                                                    Sign Out
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        to="/auth"
                                        className="hidden md:block p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                        aria-label="Account Login"
                                    >
                                        <User size={20} />
                                    </Link>
                                )}
                            </div>

                            {/* Wishlist - Hidden on mobile */}
                            <Link
                                to="/wishlist"
                                className="hidden md:block p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                aria-label="Wishlist"
                            >
                                <Heart size={20} />
                            </Link>

                            {/* Shopping Cart */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                aria-label="Shopping cart"
                            >
                                <ShoppingBag size={20} />
                                {getCartCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {getCartCount()}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search Bar Overlay */}
                {searchOpen && (
                    <div className="border-t border-neutral-200 bg-white animate-slide-down">
                        <div className="container-custom py-4">
                            <div className="relative max-w-2xl mx-auto">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search for products..."
                                    className="w-full pl-12 pr-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-black focus:outline-none text-base"
                                    autoFocus
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-neutral-200 bg-white animate-slide-down max-h-[80vh] overflow-y-auto">
                        <div className="container-custom py-4">
                            <div className="space-y-1">
                                {mainMenuItems.map((item) => (
                                    <div key={item.name}>
                                        {item.href ? (
                                            <Link
                                                to={item.href}
                                                className={`block px-4 py-3 text-base font-semibold rounded-lg transition-colors ${item.highlight
                                                    ? 'text-red-600 hover:bg-red-50'
                                                    : 'text-neutral-900 hover:bg-neutral-100'
                                                    }`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => setActiveMenu(activeMenu === item.name ? null : item.name)}
                                                    className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                                >
                                                    {item.name}
                                                    <ChevronDown
                                                        size={20}
                                                        className={`transition-transform ${activeMenu === item.name ? 'rotate-180' : ''
                                                            }`}
                                                    />
                                                </button>
                                                {activeMenu === item.name && megaMenuData[item.name] && (
                                                    <div className="ml-4 mt-1 space-y-1 pb-2">
                                                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-4 py-2">
                                                            Featured
                                                        </div>
                                                        {megaMenuData[item.name].featured.map((subItem) => (
                                                            <Link
                                                                key={subItem.name}
                                                                to={subItem.href}
                                                                className={`block px-4 py-2 text-sm rounded-lg transition-colors ${subItem.sale
                                                                    ? 'text-red-600 font-semibold hover:bg-red-50'
                                                                    : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50'
                                                                    }`}
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                            >
                                                                {subItem.name}
                                                            </Link>
                                                        ))}
                                                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-4 py-2 mt-2">
                                                            Categories
                                                        </div>
                                                        {megaMenuData[item.name].categories.map((subItem) => (
                                                            <Link
                                                                key={subItem.name}
                                                                to={subItem.href}
                                                                className="block px-4 py-2 text-sm text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors"
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                            >
                                                                {subItem.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Mobile Bottom Icons */}
                            <div className="mt-6 pt-6 border-t border-neutral-200 grid grid-cols-3 gap-4">
                                {user ? (
                                    user.role === 'admin' ? (
                                        <Link
                                            to="/admin"
                                            className="flex flex-col items-center space-y-1 text-neutral-600 hover:text-neutral-900"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <User size={24} className="text-neutral-900" />
                                            <span className="text-xs font-bold uppercase">Admin</span>
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                handleSignOut();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="flex flex-col items-center space-y-1 text-red-600 hover:text-red-700"
                                        >
                                            <User size={24} />
                                            <span className="text-xs font-bold uppercase">Sign Out</span>
                                        </button>
                                    )
                                ) : (
                                    <Link
                                        to="/auth"
                                        className="flex flex-col items-center space-y-1 text-neutral-600 hover:text-neutral-900"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <User size={24} />
                                        <span className="text-xs font-medium">Login</span>
                                    </Link>
                                )}
                                <Link
                                    to="/wishlist"
                                    className="flex flex-col items-center space-y-1 text-neutral-600 hover:text-neutral-900"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Heart size={24} />
                                    <span className="text-xs font-medium">Wishlist</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setSearchOpen(true);
                                    }}
                                    className="flex flex-col items-center space-y-1 text-neutral-600 hover:text-neutral-900"
                                >
                                    <Search size={24} />
                                    <span className="text-xs font-medium">Search</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;
