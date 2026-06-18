import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Eye, EyeOff, User, Mail, Lock,
    AlertCircle, Key, CheckCircle, ArrowRight, ShieldCheck, ChevronLeft,
} from 'lucide-react';
import PhoneInputLib from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
// react-phone-input-2 ships CJS — Vite resolves the module object, not the component directly
const PhoneInput = PhoneInputLib.default ?? PhoneInputLib;
import { apiFetch } from '../utils/api';

// ─── Validation helpers ────────────────────────────────────────────────────────

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateName(v) {
    if (!v.trim()) return 'Full name is required.';
    if (v.trim().length < 2) return 'Name must be at least 2 characters.';
    if (v.trim().length > 50) return 'Name cannot exceed 50 characters.';
    if (!/^[a-zA-Z\s'-]+$/.test(v.trim())) return 'Name can only contain letters, spaces, hyphens, or apostrophes.';
    return '';
}

function validateEmail(v) {
    if (!v.trim()) return 'Email address is required.';
    if (!emailRegex.test(v.trim())) return 'Enter a valid email address (e.g. john@example.com).';
    return '';
}

function validateLoginPassword(v) {
    if (!v) return 'Password is required.';
    if (v.length < 6) return 'Password must be at least 6 characters.';
    return '';
}

function validateRegisterPassword(v) {
    if (!v) return 'Password is required.';
    if (v.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(v)) return 'Add at least one uppercase letter (A–Z).';
    if (!/[a-z]/.test(v)) return 'Add at least one lowercase letter (a–z).';
    if (!/[0-9]/.test(v)) return 'Add at least one number (0–9).';
    return '';
}

function validatePhone(raw) {
    const digits = raw.replace(/\D/g, '');
    // Format from react-phone-input-2 for India: 91XXXXXXXXXX (12 digits)
    if (digits.length !== 12) return 'Enter a valid 10-digit Indian mobile number.';
    const local = digits.slice(2); // strip 91
    if (!/^[6-9]\d{9}$/.test(local)) return 'Mobile number must start with 6, 7, 8, or 9.';
    return '';
}

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

// ─── FieldError ────────────────────────────────────────────────────────────────

function FieldError({ msg }) {
    if (!msg) return null;
    return (
        <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500 font-medium animate-fade-in">
            <AlertCircle size={12} className="shrink-0" />
            {msg}
        </p>
    );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

const AuthPage = () => {
    const [authMode, setAuthMode] = useState('email-login');
    const [showPassword, setShowPassword] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('91'); // react-phone-input-2 default
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    // Per-field inline errors
    const [fe, setFe] = useState({ name: '', email: '', password: '', phone: '', otp: '' });
    const setFieldError = (field, msg) => setFe(prev => ({ ...prev, [field]: msg }));
    const clearFieldError = (field) => setFe(prev => ({ ...prev, [field]: '' }));

    // Global states
    const [globalError, setGlobalError] = useState('');
    const [success, setSuccess] = useState(null); // { title, description }
    const [loading, setLoading] = useState(false);

    // Forgot-password specific
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotEmailError, setForgotEmailError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const switchMode = (mode) => {
        setAuthMode(mode);
        setGlobalError('');
        setSuccess(null);
        setFe({ name: '', email: '', password: '', phone: '', otp: '' });
        setOtpSent(false);
        setOtp('');
        setForgotEmail('');
        setForgotEmailError('');
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setGlobalError('');
        setSuccess(null);

        const emailErr = validateEmail(forgotEmail);
        if (emailErr) { setForgotEmailError(emailErr); return; }
        setForgotEmailError('');

        setLoading(true);
        try {
            // Backend generates the token, saves it, and sends the Gmail SMTP email
            const res = await apiFetch('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email: forgotEmail }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Unable to process your request.');

            setSuccess({
                title: 'Check your inbox!',
                description: data.message,
            });
        } catch (err) {
            setGlobalError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Validate all fields for the current mode; return true if clean
    const runValidation = useCallback(() => {
        let clean = true;
        const errors = { name: '', email: '', password: '', phone: '', otp: '' };

        if (authMode === 'otp') {
            if (!otpSent) {
                errors.phone = validatePhone(phone);
                if (errors.phone) clean = false;
            } else {
                if (!otp.trim()) {
                    errors.otp = 'Verification code is required.';
                    clean = false;
                } else if (!/^\d{6}$/.test(otp.trim())) {
                    errors.otp = 'Enter the 6-digit code sent to your phone.';
                    clean = false;
                }
            }
        } else {
            if (authMode === 'register') {
                errors.name = validateName(name);
                if (errors.name) clean = false;
            }
            errors.email = validateEmail(email);
            if (errors.email) clean = false;
            errors.password = authMode === 'register'
                ? validateRegisterPassword(password)
                : validateLoginPassword(password);
            if (errors.password) clean = false;
        }

        setFe(errors);
        return clean;
    }, [authMode, name, email, password, phone, otp, otpSent]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGlobalError('');
        setSuccess(null);

        if (!runValidation()) return;

        setLoading(true);

        try {
            if (authMode === 'otp') {
                if (!otpSent) {
                    const res = await apiFetch('/auth/send-otp', {
                        method: 'POST',
                        body: JSON.stringify({ phone: `+${phone}` }), // E.164: +91XXXXXXXXXX
                    });
                    const data = await res.json();
                    if (!res.ok) {
                        setFieldError('phone', data.message || 'Unable to send OTP. Please try again.');
                        return;
                    }
                    setOtpSent(true);
                    const local = phone.slice(2); // 10-digit
                    const masked = local.slice(0, 2) + 'XXXXXX' + local.slice(-2);
                    setSuccess({
                        title: 'OTP sent!',
                        description: `A 6-digit code was sent to +91 ${masked}. It expires in 10 minutes.`,
                    });
                } else {
                    const res = await apiFetch('/auth/verify-otp', {
                        method: 'POST',
                        body: JSON.stringify({ phone: `+${phone}`, otp }),
                    });
                    const data = await res.json();
                    if (!res.ok) {
                        setFieldError('otp', data.message || 'Incorrect code. Please try again.');
                        return;
                    }
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setSuccess({
                        title: 'Phone verified!',
                        description: 'Welcome to THE ELEGANT. Redirecting you now…',
                    });
                    setTimeout(() => {
                        if (data.user.role === 'admin') navigate('/admin/dashboard');
                        else navigate(from, { replace: true });
                    }, 1200);
                }
            } else if (authMode === 'email-login') {
                const res = await apiFetch('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password }),
                });
                const data = await res.json();
                if (!res.ok) {
                    // Show the exact backend message as a field error near the password field
                    setFieldError('password', data.message || 'Sign in failed. Please try again.');
                    return;
                }
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setSuccess({ title: 'Welcome back!', description: 'You\'ve signed in successfully. Redirecting…' });
                setTimeout(() => {
                    if (data.user.role === 'admin') navigate('/admin/dashboard');
                    else navigate(from, { replace: true });
                }, 1200);
            } else {
                // Register
                const res = await apiFetch('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ name, email, password }),
                });
                const data = await res.json();
                if (!res.ok) {
                    const msg = data.message || 'Registration failed. Please try again.';
                    // "User already exists" or similar → show as email field error
                    if (msg.toLowerCase().includes('exist') || msg.toLowerCase().includes('registered') || msg.toLowerCase().includes('email')) {
                        setFieldError('email', 'This email is already registered. Sign in instead?');
                    } else if (msg.toLowerCase().includes('name')) {
                        setFieldError('name', msg);
                    } else if (msg.toLowerCase().includes('password')) {
                        setFieldError('password', msg);
                    } else {
                        setGlobalError(msg);
                    }
                    return;
                }
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setSuccess({
                    title: 'Account created!',
                    description: 'Welcome to THE ELEGANT — your style journey starts now. Redirecting…',
                });
                setTimeout(() => {
                    if (data.user.role === 'admin') navigate('/admin/dashboard');
                    else navigate(from, { replace: true });
                }, 1500);
            }
        } catch (err) {
            setGlobalError(err.message || 'A network error occurred. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const pwStrength = authMode === 'register' ? getPasswordStrength(password) : null;

    return (
        <>
            {/* Override react-phone-input-2 default styles */}
            <style>{`
                .rpi-container { width: 100% !important; }
                .rpi-container .flag-dropdown {
                    background: #fafafa !important;
                    border: none !important;
                    border-right: 1px solid #e5e7eb !important;
                    border-radius: 0 !important;
                }
                .rpi-container .flag-dropdown.open { background: #fafafa !important; }
                .rpi-container .selected-flag {
                    padding: 0 12px !important;
                    background: transparent !important;
                    border-radius: 0 !important;
                }
                .rpi-container .selected-flag:hover,
                .rpi-container .selected-flag:focus {
                    background: #f3f4f6 !important;
                }
                .rpi-container input[type="tel"] {
                    height: 48px !important;
                    width: 100% !important;
                    border: none !important;
                    border-radius: 0 !important;
                    font-size: 14px !important;
                    padding-left: 14px !important;
                    background: transparent !important;
                    outline: none !important;
                    box-shadow: none !important;
                    color: #111 !important;
                    letter-spacing: 0.03em;
                }
                .rpi-container input::placeholder { color: #aaa !important; }
                @keyframes fade-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.2s ease both; }
                @keyframes slide-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                .animate-slide-in { animation: slide-in 0.3s ease both; }
            `}</style>

            <div className="min-h-screen flex bg-neutral-50">
                {/* ── Left hero panel ── */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-neutral-900 flex-col">
                    <img
                        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1000&q=80"
                        alt="THE ELEGANT"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    <div className="absolute bottom-16 left-16 right-16 text-white z-10">
                        <span className="px-3 py-1 bg-white text-black text-xs font-bold tracking-widest uppercase rounded-full mb-6 inline-block">
                            EST. 2026
                        </span>
                        <h1 className="text-5xl font-black font-display tracking-tight mb-4 leading-tight">
                            ELEVATE YOUR EVERYDAY STYLE.
                        </h1>
                        <p className="text-neutral-300 text-lg max-w-md">
                            Join the LUXE membership program to unlock exclusive collections, early drops, and complimentary shipping on all selections.
                        </p>
                    </div>
                </div>

                {/* ── Right form panel ── */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-16">
                    <div className="w-full max-w-md space-y-7">

                        {/* Title */}
                        <div className="text-center lg:text-left">
                            {authMode === 'forgot' && (
                                <button
                                    type="button"
                                    onClick={() => switchMode('email-login')}
                                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-neutral-500 hover:text-black transition-colors mb-4"
                                >
                                    <ChevronLeft size={14} /> Back to Sign In
                                </button>
                            )}
                            <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">
                                {authMode === 'register' ? 'Create Account'
                                    : authMode === 'forgot' ? 'Reset Password'
                                    : 'Welcome Back'}
                            </h2>
                            <p className="text-neutral-500 mt-2 text-sm leading-relaxed">
                                {authMode === 'register'
                                    ? 'Sign up to track purchases, manage wishlists, and unlock member benefits.'
                                    : authMode === 'forgot'
                                    ? 'Enter the email linked to your account and we\'ll send you a secure reset link.'
                                    : 'Sign in to access your personal dashboard and order history.'}
                            </p>
                        </div>

                        {/* Mode tabs — hidden during forgot flow */}
                        {authMode !== 'forgot' && <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-100 rounded-xl text-center text-xs font-bold uppercase tracking-wide">
                            {[
                                { id: 'email-login', label: 'Email Login' },
                                { id: 'otp', label: 'Phone OTP' },
                                { id: 'register', label: 'Register' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => switchMode(tab.id)}
                                    className={`py-2.5 rounded-lg transition-all duration-200 ${
                                        authMode === tab.id
                                            ? 'bg-white text-black shadow-sm font-black'
                                            : 'text-neutral-500 hover:text-black'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>}

                        {/* Global error — exact message, no wrapper noise */}
                        {globalError && (
                            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium animate-fade-in">
                                <AlertCircle size={16} className="shrink-0 text-red-500" />
                                <p>{globalError}</p>
                            </div>
                        )}

                        {/* Success banner */}
                        {success && (
                            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm animate-fade-in">
                                <CheckCircle size={18} className="shrink-0 mt-0.5 text-green-500" />
                                <div>
                                    <p className="font-semibold">{success.title}</p>
                                    <p className="text-green-600/80 text-xs mt-0.5">{success.description}</p>
                                </div>
                            </div>
                        )}

                        {/* ── Forgot password form ── */}
                        {authMode === 'forgot' && (
                            <form onSubmit={handleForgotPassword} className="space-y-5 animate-slide-in" noValidate>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5" htmlFor="forgot-email">
                                        Email Address
                                    </label>
                                    <div className={`relative flex items-center border rounded-xl overflow-hidden bg-white transition-all duration-200 ${
                                        forgotEmailError
                                            ? 'border-red-400 ring-1 ring-red-300'
                                            : 'border-neutral-300 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10'
                                    }`}>
                                        <span className="pl-4 text-neutral-400"><Mail size={17} /></span>
                                        <input
                                            id="forgot-email"
                                            type="email"
                                            autoComplete="email"
                                            value={forgotEmail}
                                            onChange={(e) => { setForgotEmail(e.target.value); setForgotEmailError(''); }}
                                            onBlur={() => setForgotEmailError(validateEmail(forgotEmail))}
                                            placeholder="name@example.com"
                                            className="flex-1 py-3 px-3 text-sm outline-none bg-transparent"
                                        />
                                    </div>
                                    <FieldError msg={forgotEmailError} />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !!success}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending reset link…
                                        </span>
                                    ) : (
                                        <>Send Reset Link <ArrowRight size={15} /></>
                                    )}
                                </button>
                                {success && (
                                    <p className="text-center text-sm text-neutral-500 pt-1">
                                        <button type="button" onClick={() => switchMode('email-login')} className="font-bold text-black hover:underline">
                                            Return to Sign In
                                        </button>
                                    </p>
                                )}
                            </form>
                        )}

                        {/* ── Login / OTP / Register forms ── */}
                        {authMode !== 'forgot' && <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                            {/* ── OTP flow ── */}
                            {authMode === 'otp' && (
                                <div className="space-y-5 animate-slide-in">
                                    {/* Phone with country picker */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                                            Mobile Number
                                        </label>
                                        <div className={`flex items-stretch border rounded-xl overflow-hidden transition-all duration-200 ${
                                            fe.phone
                                                ? 'border-red-400 ring-1 ring-red-300'
                                                : 'border-neutral-300 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10'
                                        } ${otpSent ? 'opacity-60 pointer-events-none bg-neutral-50' : 'bg-white'}`}>
                                            <PhoneInput
                                                country="in"
                                                onlyCountries={['in']}
                                                disableDropdown
                                                countryCodeEditable={false}
                                                value={phone}
                                                onChange={(val) => {
                                                    setPhone(val);
                                                    clearFieldError('phone');
                                                }}
                                                onBlur={() => setFieldError('phone', validatePhone(phone))}
                                                disabled={otpSent}
                                                placeholder="98765 43210"
                                                containerClass="rpi-container"
                                                inputProps={{ id: 'phone', autoComplete: 'tel' }}
                                            />
                                        </div>
                                        <FieldError msg={fe.phone} />
                                        <p className="text-xs text-neutral-400 mt-1.5">India (+91) only · 10-digit number required</p>
                                    </div>

                                    {/* OTP input (after sending) */}
                                    {otpSent && (
                                        <div className="animate-slide-in">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5" htmlFor="otp">
                                                6-Digit Verification Code
                                            </label>
                                            <div className={`relative flex items-center border rounded-xl overflow-hidden bg-white transition-all duration-200 ${
                                                fe.otp
                                                    ? 'border-red-400 ring-1 ring-red-300'
                                                    : 'border-neutral-300 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10'
                                            }`}>
                                                <span className="pl-4 text-neutral-400"><Key size={17} /></span>
                                                <input
                                                    id="otp"
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={6}
                                                    value={otp}
                                                    onChange={(e) => {
                                                        setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                                                        clearFieldError('otp');
                                                        setSuccess(null);
                                                    }}
                                                    onBlur={() => {
                                                        if (!otp.trim()) setFieldError('otp', 'Verification code is required.');
                                                        else if (!/^\d{6}$/.test(otp.trim())) setFieldError('otp', 'Enter the 6-digit code sent to your phone.');
                                                    }}
                                                    placeholder="_ _ _ _ _ _"
                                                    className="flex-1 py-3 px-3 text-sm outline-none bg-transparent tracking-[0.4em] font-mono"
                                                />
                                            </div>
                                            <FieldError msg={fe.otp} />
                                        </div>
                                    )}

                                    {/* OTP actions */}
                                    <div className="flex gap-2 pt-1">
                                        {otpSent && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOtpSent(false);
                                                    setOtp('');
                                                    setSuccess(null);
                                                    setFe(f => ({ ...f, otp: '' }));
                                                }}
                                                className="px-5 py-3 text-xs font-bold uppercase tracking-wide border-2 border-neutral-200 rounded-xl hover:border-black transition-all duration-200"
                                            >
                                                Change
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={loading || !!success || (otpSent && otp.length < 6)}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-black text-white text-sm font-bold uppercase tracking-wide rounded-xl hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                        >
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Processing…
                                                </span>
                                            ) : otpSent ? (
                                                <><ShieldCheck size={16} /> Verify &amp; Sign In</>
                                            ) : (
                                                <>Send OTP <ArrowRight size={15} /></>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ── Email login / Register ── */}
                            {authMode !== 'otp' && (
                                <div className="space-y-5 animate-slide-in">

                                    {/* Full name (register only) */}
                                    {authMode === 'register' && (
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5" htmlFor="name">
                                                Full Name
                                            </label>
                                            <div className={`relative flex items-center border rounded-xl overflow-hidden bg-white transition-all duration-200 ${
                                                fe.name
                                                    ? 'border-red-400 ring-1 ring-red-300'
                                                    : 'border-neutral-300 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10'
                                            }`}>
                                                <span className="pl-4 text-neutral-400"><User size={17} /></span>
                                                <input
                                                    id="name"
                                                    type="text"
                                                    autoComplete="name"
                                                    value={name}
                                                    onChange={(e) => { setName(e.target.value); clearFieldError('name'); }}
                                                    onBlur={() => setFieldError('name', validateName(name))}
                                                    placeholder="John Doe"
                                                    className="flex-1 py-3 px-3 text-sm outline-none bg-transparent"
                                                />
                                            </div>
                                            <FieldError msg={fe.name} />
                                        </div>
                                    )}

                                    {/* Email */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5" htmlFor="email">
                                            Email Address
                                        </label>
                                        <div className={`relative flex items-center border rounded-xl overflow-hidden bg-white transition-all duration-200 ${
                                            fe.email
                                                ? 'border-red-400 ring-1 ring-red-300'
                                                : 'border-neutral-300 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10'
                                        }`}>
                                            <span className="pl-4 text-neutral-400"><Mail size={17} /></span>
                                            <input
                                                id="email"
                                                type="email"
                                                autoComplete="email"
                                                value={email}
                                                onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }}
                                                onBlur={() => setFieldError('email', validateEmail(email))}
                                                placeholder="name@example.com"
                                                className="flex-1 py-3 px-3 text-sm outline-none bg-transparent"
                                            />
                                        </div>
                                        <FieldError msg={fe.email} />
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600" htmlFor="password">
                                                Password
                                            </label>
                                            {authMode === 'email-login' && (
                                                <button
                                                    type="button"
                                                    onClick={() => switchMode('forgot')}
                                                    className="text-xs text-neutral-400 hover:text-black transition-colors font-medium"
                                                >
                                                    Forgot password?
                                                </button>
                                            )}
                                        </div>
                                        <div className={`relative flex items-center border rounded-xl overflow-hidden bg-white transition-all duration-200 ${
                                            fe.password
                                                ? 'border-red-400 ring-1 ring-red-300'
                                                : 'border-neutral-300 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10'
                                        }`}>
                                            <span className="pl-4 text-neutral-400"><Lock size={17} /></span>
                                            <input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                                                value={password}
                                                onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); }}
                                                onBlur={() => setFieldError('password',
                                                    authMode === 'register'
                                                        ? validateRegisterPassword(password)
                                                        : validateLoginPassword(password)
                                                )}
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
                                        <FieldError msg={fe.password} />

                                        {/* Password strength bar (register only) */}
                                        {authMode === 'register' && password && (
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
                                                    <p className={`text-xs mt-1 font-medium transition-colors ${
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

                                        {/* Register requirements hint */}
                                        {authMode === 'register' && !password && (
                                            <p className="text-xs text-neutral-400 mt-1.5">
                                                Min 8 characters · 1 uppercase · 1 lowercase · 1 number
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || !!success}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-2"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Processing…
                                            </span>
                                        ) : authMode === 'email-login' ? (
                                            <>Sign In <ArrowRight size={15} /></>
                                        ) : (
                                            <>Create Account <ArrowRight size={15} /></>
                                        )}
                                    </button>

                                    {/* Switch mode link */}
                                    <p className="text-center text-sm text-neutral-500">
                                        {authMode === 'email-login' ? (
                                            <>New here?{' '}
                                                <button type="button" onClick={() => switchMode('register')} className="font-bold text-black hover:underline">
                                                    Create an account
                                                </button>
                                            </>
                                        ) : (
                                            <>Already have an account?{' '}
                                                <button type="button" onClick={() => switchMode('email-login')} className="font-bold text-black hover:underline">
                                                    Sign in
                                                </button>
                                            </>
                                        )}
                                    </p>
                                </div>
                            )}
                        </form>}

                        {/* Footer */}
                        <p className="text-center text-xs text-neutral-400 pt-2">
                            By continuing, you agree to THE ELEGANT's{' '}
                            <a href="/terms" className="underline hover:text-black transition-colors">Terms of Service</a>{' '}
                            and{' '}
                            <a href="/privacy" className="underline hover:text-black transition-colors">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuthPage;
