import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { apiFetch } from '../utils/api';

function getPasswordStrength(pw) {
    if (!pw) return { score: 0, label: '', color: '' };
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    const map = [
        { label: '', color: '' },
        { label: 'Weak', color: 'bg-red-400' },
        { label: 'Fair', color: 'bg-yellow-400' },
        { label: 'Good', color: 'bg-blue-500' },
        { label: 'Strong', color: 'bg-green-500' },
    ];
    return { score: s, ...map[s] };
}

function validatePassword(v) {
    if (!v) return 'Password is required.';
    if (v.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(v)) return 'Add at least one uppercase letter (A–Z).';
    if (!/[a-z]/.test(v)) return 'Add at least one lowercase letter (a–z).';
    if (!/[0-9]/.test(v)) return 'Add at least one number (0–9).';
    return '';
}

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const pwStrength = getPasswordStrength(password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('Invalid reset link. Please request a new password reset from the login page.');
            return;
        }

        const pwErr = validatePassword(password);
        if (pwErr) { setPasswordError(pwErr); return; }
        setPasswordError('');

        setLoading(true);
        try {
            const res = await apiFetch('/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Password reset failed.');

            setSuccess(true);
            setTimeout(() => navigate('/auth'), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-6">
                <div className="max-w-md w-full text-center space-y-5">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle size={28} className="text-red-500" />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tight">Invalid Link</h1>
                    <p className="text-neutral-500 text-sm leading-relaxed">
                        This password reset link is missing or invalid. Please request a new one from the sign-in page.
                    </p>
                    <Link
                        to="/auth"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-800 transition-colors"
                    >
                        Go to Sign In <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.2s ease both; }
            `}</style>

            <div className="min-h-screen flex bg-neutral-50">
                {/* Left hero */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-neutral-900 flex-col">
                    <img
                        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1000&q=80"
                        alt="THE ELEGANT"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    <div className="absolute bottom-16 left-16 right-16 text-white z-10">
                        <span className="px-3 py-1 bg-white text-black text-xs font-bold tracking-widest uppercase rounded-full mb-6 inline-block">EST. 2026</span>
                        <h1 className="text-5xl font-black font-display tracking-tight mb-4 leading-tight">SECURE YOUR ACCOUNT.</h1>
                        <p className="text-neutral-300 text-lg max-w-md">
                            Choose a strong password to keep your LUXE account and order history safe.
                        </p>
                    </div>
                </div>

                {/* Right form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-16">
                    <div className="w-full max-w-md space-y-7">

                        {success ? (
                            <div className="text-center space-y-5 animate-fade-in">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle size={30} className="text-green-500" />
                                </div>
                                <h2 className="text-3xl font-black uppercase tracking-tight">Password Updated!</h2>
                                <p className="text-neutral-500 text-sm leading-relaxed">
                                    Your password has been reset successfully. You'll be redirected to the sign-in page in a moment.
                                </p>
                                <Link
                                    to="/auth"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-800 transition-colors"
                                >
                                    Sign In Now <ArrowRight size={14} />
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="text-center lg:text-left">
                                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">
                                        Set New Password
                                    </h2>
                                    <p className="text-neutral-500 mt-2 text-sm leading-relaxed">
                                        Choose a strong password for your THE ELEGANT account. This link expires in 10 minutes.
                                    </p>
                                </div>

                                {error && (
                                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-fade-in">
                                        <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
                                        <div>
                                            <p className="font-semibold">Could not reset password</p>
                                            <p className="text-red-600/80 text-xs mt-0.5">{error}</p>
                                            {(error.includes('invalid') || error.includes('expired')) && (
                                                <Link to="/auth" className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-red-700 underline hover:no-underline">
                                                    Request a new reset link
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5" htmlFor="new-password">
                                            New Password
                                        </label>
                                        <div className={`relative flex items-center border rounded-xl overflow-hidden bg-white transition-all duration-200 ${
                                            passwordError
                                                ? 'border-red-400 ring-1 ring-red-300'
                                                : 'border-neutral-300 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10'
                                        }`}>
                                            <span className="pl-4 text-neutral-400"><Lock size={17} /></span>
                                            <input
                                                id="new-password"
                                                type={showPassword ? 'text' : 'password'}
                                                autoComplete="new-password"
                                                value={password}
                                                onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                                                onBlur={() => setPasswordError(validatePassword(password))}
                                                placeholder="••••••••"
                                                className="flex-1 py-3 px-3 text-sm outline-none bg-transparent"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(p => !p)}
                                                className="pr-4 text-neutral-400 hover:text-black transition-colors"
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                            </button>
                                        </div>

                                        {passwordError && (
                                            <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500 font-medium animate-fade-in">
                                                <AlertCircle size={12} className="shrink-0" />
                                                {passwordError}
                                            </p>
                                        )}

                                        {/* Strength bar */}
                                        {password && (
                                            <div className="mt-2 animate-fade-in">
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4].map(i => (
                                                        <div
                                                            key={i}
                                                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                                i <= pwStrength.score ? pwStrength.color : 'bg-neutral-200'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                {pwStrength.label && (
                                                    <p className={`text-xs mt-1 font-medium ${
                                                        pwStrength.score <= 1 ? 'text-red-500' :
                                                        pwStrength.score === 2 ? 'text-yellow-500' :
                                                        pwStrength.score === 3 ? 'text-blue-500' : 'text-green-500'
                                                    }`}>
                                                        {pwStrength.label} password
                                                        {pwStrength.score < 4 && ' — add symbols or length to strengthen it'}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {!password && (
                                            <p className="text-xs text-neutral-400 mt-1.5">
                                                Min 8 characters · 1 uppercase · 1 lowercase · 1 number
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Updating password…
                                            </span>
                                        ) : (
                                            <>Reset Password <ArrowRight size={15} /></>
                                        )}
                                    </button>

                                    <p className="text-center text-sm text-neutral-500">
                                        Remember your password?{' '}
                                        <Link to="/auth" className="font-bold text-black hover:underline">
                                            Sign in
                                        </Link>
                                    </p>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
