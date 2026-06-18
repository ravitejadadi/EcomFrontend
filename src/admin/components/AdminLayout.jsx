import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, ShoppingBag, Users, LogOut, ArrowLeft, Menu, X } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [adminName, setAdminName] = useState('Administrator');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Authenticate admin check
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (!token || !userStr) {
            navigate('/admin/login', { replace: true, state: { from: location } });
            return;
        }

        try {
            const user = JSON.parse(userStr);
            if (user.role !== 'admin') {
                alert('Access denied: You do not have administrator permissions.');
                navigate('/', { replace: true });
                return;
            }
            setAdminName(user.name);
        } catch (e) {
            localStorage.clear();
            navigate('/admin/login', { replace: true });
        }
    }, [navigate, location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin/login', { replace: true });
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Products', path: '/admin/products', icon: ShoppingBag },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
        { name: 'Users', path: '/admin/users', icon: Users },
    ];

    return (
        <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row">
            {/* Mobile Nav Top Bar */}
            <div className="md:hidden bg-neutral-900 text-white flex items-center justify-between p-4 shadow-md z-40">
                <div className="flex items-center gap-2">
                    <span className="font-display font-black text-xl tracking-wider">LUXE ADMIN</span>
                </div>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-1 hover:bg-neutral-800 rounded transition-colors"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar (Desktop & Mobile Menu) */}
            <aside className={`bg-neutral-900 text-white w-full md:w-64 flex-shrink-0 flex flex-col justify-between p-6 z-30 transition-transform duration-300 md:translate-x-0 ${
                mobileMenuOpen ? 'fixed inset-y-0 left-0 pt-20 md:pt-6' : 'hidden md:flex'
            }`}>
                <div className="space-y-8">
                    {/* Brand */}
                    <div className="hidden md:block">
                        <Link to="/admin/dashboard" className="font-display font-black text-2xl tracking-widest block">
                            LUXE <span className="text-xs text-neutral-400 block tracking-normal font-sans font-medium uppercase mt-1">Control Panel</span>
                        </Link>
                    </div>

                    {/* Nav Links */}
                    <nav className="space-y-1.5">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                                        isActive
                                            ? 'bg-white text-black'
                                            : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                                    }`}
                                >
                                    <Icon size={18} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer Controls */}
                <div className="mt-8 pt-6 border-t border-neutral-800 space-y-4">
                    <div className="text-sm px-4">
                        <p className="text-neutral-500 text-xs">Logged in as</p>
                        <p className="font-semibold text-neutral-200 truncate">{adminName}</p>
                    </div>

                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
                    >
                        <ArrowLeft size={16} />
                        <span>Customer Site</span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-900/20 w-full text-left transition-all"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Menu Backdrop */}
            {mobileMenuOpen && (
                <div
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                />
            )}

            {/* Main Content Pane */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
