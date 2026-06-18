import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { apiFetch } from '../../utils/api';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // If already authenticated as admin, skip login
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.role === 'admin') {
                    navigate('/admin/dashboard', { replace: true });
                }
            } catch (e) {
                localStorage.clear();
            }
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Invalid credentials');
            }

            if (data.user.role !== 'admin') {
                throw new Error('Access denied: Unauthorized account type');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/admin/dashboard', { replace: true });
        } catch (err) {
            console.error('Admin login error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-6">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl space-y-6 text-white">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black tracking-widest font-display">
                        LUXE <span className="text-neutral-500 font-sans font-bold text-xs uppercase tracking-normal">Admin</span>
                    </h1>
                    <p className="text-neutral-400 text-sm">
                        Enter administrator credentials to access dashboard
                    </p>
                </div>

                {error && (
                    <div className="p-4 bg-red-950/50 border border-red-800 rounded-lg flex gap-3 text-red-400 text-sm animate-fade-in">
                        <AlertCircle size={20} className="flex-shrink-0" />
                        <div>
                            <span className="font-bold">Error:</span> {error}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Email Address</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-500">
                                <Mail size={18} />
                            </span>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@luxe.com"
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-500">
                                <Lock size={18} />
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-3 pl-10 pr-10 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white hover:bg-neutral-200 text-black py-3 rounded-lg font-bold text-sm uppercase transition-all duration-300 mt-6 shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                        {loading ? 'Logging In...' : 'Verify Credentials'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
