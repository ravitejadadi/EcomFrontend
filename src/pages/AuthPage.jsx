import { useState, useCallback } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
    Eye, EyeOff, User, Mail, Lock,
    AlertCircle, CheckCircle, ArrowRight, ChevronLeft, Phone, Key
} from 'lucide-react';
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

const VALID_MODES = ['email-login', 'otp', 'register'];

const AuthPage = () => {
    const [searchParams] = useSearchParams();
    const modeParam = searchParams.get('mode');
    const [authMode, setAuthMode] = useState(VALID_MODES.includes(modeParam) ? (modeParam === 'social' ? 'otp' : modeParam) : 'email-login');
    const [showPassword, setShowPassword] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // OTP specific states
    const [phone, setPhone] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [needRegistration, setNeedRegistration] = useState(false);
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');

    // OTP inline errors
    const [phoneError, setPhoneError] = useState('');
    const [otpCodeError, setOtpCodeError] = useState('');
    const [regNameError, setRegNameError] = useState('');
    const [regEmailError, setRegEmailError] = useState('');

    // Per-field inline errors
    const [fe, setFe] = useState({ name: '', email: '', password: '' });
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
        setFe({ name: '', email: '', password: '' });
        setForgotEmail('');
        setForgotEmailError('');
        
        // Reset OTP states
        setPhone('');
        setOtpCode('');
        setOtpSent(false);
        setNeedRegistration(false);
        setRegName('');
        setRegEmail('');
        setPhoneError('');
        setOtpCodeError('');
        setRegNameError('');
        setRegEmailError('');
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
            const res = await apiFetch('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email: forgotEmail }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Unable to process your request.');
            setSuccess({ title: 'Check your inbox!', description: data.message });
        } catch (err) {
            setGlobalError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        setGlobalError('');
        setSuccess(null);
        setPhoneError('');

        const trimmedPhone = phone.trim();
        if (!trimmedPhone) {
            setPhoneError('Phone number is required.');
            return;
        }
        if (!/^\d{10}$/.test(trimmedPhone)) {
            setPhoneError('Enter a valid 10-digit mobile number.');
            return;
        }

        setLoading(true);
        try {
            const res = await apiFetch('/auth/otp/send', {
                method: 'POST',
                body: JSON.stringify({ phone: `91${trimmedPhone}` }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to send OTP.');
            setOtpSent(true);
            setSuccess({ title: 'OTP Sent!', description: 'Please check your mobile phone for the verification code.' });
        } catch (err) {
            setGlobalError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        if (e) e.preventDefault();
        setGlobalError('');
        setSuccess(null);
        setOtpCodeError('');

        const trimmedOtp = otpCode.trim();
        if (!trimmedOtp) {
            setOtpCodeError('Verification code is required.');
            return;
        }

        setLoading(true);
        try {
            const res = await apiFetch('/auth/otp/verify', {
                method: 'POST',
                body: JSON.stringify({ phone: `91${phone.trim()}`, otp: trimmedOtp }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'OTP verification failed. Please try again.');

            if (data.status === 'need_registration') {
                setNeedRegistration(true);
                setSuccess({ title: 'OTP Verified!', description: 'Please complete your profile to finish registration.' });
            } else {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setSuccess({ title: 'Welcome back!', description: 'Verification successful. Redirecting…' });
                setTimeout(() => {
                    if (data.user.role === 'admin') navigate('/admin/dashboard');
                    else navigate(from, { replace: true });
                }, 1200);
            }
        } catch (err) {
            setGlobalError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpRegister = async (e) => {
        if (e) e.preventDefault();
        setGlobalError('');
        setSuccess(null);
        setRegNameError('');
        setRegEmailError('');

        let hasError = false;
        const nameErr = validateName(regName);
        if (nameErr) {
            setRegNameError(nameErr);
            hasError = true;
        }
        const emailErr = validateEmail(regEmail);
        if (emailErr) {
            setRegEmailError(emailErr);
            hasError = true;
        }

        if (hasError) return;

        setLoading(true);
        try {
            const res = await apiFetch('/auth/otp/register', {
                method: 'POST',
                body: JSON.stringify({
                    phone: `91${phone.trim()}`,
                    otp: otpCode.trim(),
                    name: regName.trim(),
                    email: regEmail.trim()
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Registration failed. Please try again.');

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setSuccess({
                title: 'Account created!',
                description: 'Welcome to THE ELEGANT — profile setup completed. Redirecting…',
            });
            setTimeout(() => {
                if (data.user.role === 'admin') navigate('/admin/dashboard');
                else navigate(from, { replace: true });
            }, 1200);
        } catch (err) {
            setGlobalError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Validate all fields for the current mode; return true if clean
    const runValidation = useCallback(() => {
        let clean = true;
        const errors = { name: '', email: '', password: '' };

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

        setFe(errors);
        return clean;
    }, [authMode, name, email, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGlobalError('');
        setSuccess(null);

        if (!runValidation()) return;

        setLoading(true);

        try {
            if (authMode === 'email-login') {
                const res = await apiFetch('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password }),
                });
                const data = await res.json();
                if (!res.ok) {
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
            <style>{`
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
                            Join THE ELEGANT membership program to unlock exclusive collections, early drops, and complimentary shipping on all selections.
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
                                    : authMode === 'otp' ? 'OTP Sign In'
                                    : 'Welcome Back'}
                            </h2>
                            <p className="text-neutral-500 mt-2 text-sm leading-relaxed">
                                {authMode === 'register'
                                    ? 'Sign up to track purchases, manage wishlists, and unlock member benefits.'
                                    : authMode === 'forgot'
                                    ? 'Enter the email linked to your account and we\'ll send you a secure reset link.'
                                    : authMode === 'otp'
                                    ? 'Sign in or register securely using a mobile verification code.'
                                    : 'Sign in to access your personal dashboard and order history.'}
                            </p>
                        </div>

                        {/* Mode tabs — hidden during forgot flow */}
                        {authMode !== 'forgot' && (
                            <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-100 rounded-xl text-center text-xs font-bold uppercase tracking-wide">
                                {[
                                    { id: 'email-login', label: 'Email Login' },
                                    { id: 'otp', label: 'OTP Login' },
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
                            </div>
                        )}

                        {/* Global error */}
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

                        {/* ── OTP Login/Register ── */}
                        {authMode === 'otp' && (
                            <div className="space-y-6 animate-slide-in">
                                {!needRegistration ? (
                                    !otpSent ? (
                                        /* Step 1: Request OTP */
                                        <form onSubmit={handleSendOtp} className="space-y-5" noValidate>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5" htmlFor="otp-phone">
                                                    Mobile Number
                                                </label>
                                                <div className={`relative flex items-center border rounded-xl overflow-hidden bg-white transition-all duration-200 ${
                                                    phoneError
                                                        ? 'border-red-400 ring-1 ring-red-300'
                                                        : 'border-neutral-300 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10'
                                                }`}>
                                                    <span className="pl-4 text-neutral-400"><Phone size={17} /></span>
                                                    <span className="pl-3 pr-2 text-sm font-bold text-neutral-500 border-r border-neutral-200 select-none">
                                                        +91
                                                    </span>
                                                    <input
                                                        id="otp-phone"
                                                        type="tel"
                                                        value={phone}
                                                        onChange={(e) => { 
                                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                            setPhone(val); 
                                                            setPhoneError(''); 
                                                        }}
                                                        placeholder="9876543210"
                                                        className="flex-1 py-3 px-3 text-sm outline-none bg-transparent font-medium"
                                                    />
                                                </div>
                                                <FieldError msg={phoneError} />
                                                <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed">
                                                    Enter your 10-digit mobile number. The country prefix (+91) is locked to India.
                                                </p>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading || !!success}
                                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                            >
                                                {loading ? (
                                                    <span className="flex items-center gap-2">
                                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Sending OTP…
                                                    </span>
                                                ) : (
                                                    <>Send Verification OTP <ArrowRight size={15} /></>
                                                )}
                                            </button>
                                        </form>
                                    ) : (
                                        /* Step 2: Verify OTP */
                                        <form onSubmit={handleVerifyOtp} className="space-y-5" noValidate>
                                            <div>
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600" htmlFor="otp-code">
                                                        Enter Verification Code
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setOtpSent(false); setOtpCode(''); setOtpCodeError(''); }}
                                                        className="text-xs text-neutral-400 hover:text-black transition-colors font-medium underline"
                                                    >
                                                        Change number
                                                    </button>
                                                </div>
                                                <div className={`relative flex items-center border rounded-xl overflow-hidden bg-white transition-all duration-200 ${
                                                    otpCodeError
                                                        ? 'border-red-400 ring-1 ring-red-300'
                                                        : 'border-neutral-300 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10'
                                                }`}>
                                                    <span className="pl-4 text-neutral-400"><Key size={17} /></span>
                                                    <input
                                                        id="otp-code"
                                                        type="text"
                                                        value={otpCode}
                                                        onChange={(e) => { setOtpCode(e.target.value); setOtpCodeError(''); }}
                                                        placeholder="••••••"
                                                        maxLength={6}
                                                        className="flex-1 py-3 px-3 text-sm outline-none bg-transparent tracking-widest font-mono text-center font-bold text-lg"
                                                    />
                                                </div>
                                                <FieldError msg={otpCodeError} />
                                                <div className="flex justify-between items-center mt-2">
                                                    <p className="text-[11px] text-neutral-400">
                                                        Code sent to +91 {phone}
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={handleSendOtp}
                                                        disabled={loading}
                                                        className="text-[11px] font-bold text-black hover:underline disabled:opacity-50"
                                                    >
                                                        Resend Code
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                            >
                                                {loading ? (
                                                    <span className="flex items-center gap-2">
                                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Verifying…
                                                    </span>
                                                ) : (
                                                    <>Verify & Sign In <ArrowRight size={15} /></>
                                                )}
                                            </button>
                                        </form>
                                    )
                                ) : (
                                    /* Step 3: Profile Registration for new user */
                                    <form onSubmit={handleOtpRegister} className="space-y-5" noValidate>
                                        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl mb-4">
                                            <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                                                ✦ Phone number verified (+91 {phone}). Since you are signing up for the first time, please fill in your details to create an account.
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5" htmlFor="reg-name">
                                                Full Name
                                            </label>
                                            <div className={`relative flex items-center border rounded-xl overflow-hidden bg-white transition-all duration-200 ${
                                                regNameError
                                                    ? 'border-red-400 ring-1 ring-red-300'
                                                    : 'border-neutral-300 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10'
                                            }`}>
                                                <span className="pl-4 text-neutral-400"><User size={17} /></span>
                                                <input
                                                    id="reg-name"
                                                    type="text"
                                                    value={regName}
                                                    onChange={(e) => { setRegName(e.target.value); setRegNameError(''); }}
                                                    placeholder="John Doe"
                                                    className="flex-1 py-3 px-3 text-sm outline-none bg-transparent"
                                                />
                                            </div>
                                            <FieldError msg={regNameError} />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5" htmlFor="reg-email">
                                                Email Address
                                            </label>
                                            <div className={`relative flex items-center border rounded-xl overflow-hidden bg-white transition-all duration-200 ${
                                                regEmailError
                                                    ? 'border-red-400 ring-1 ring-red-300'
                                                    : 'border-neutral-300 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10'
                                            }`}>
                                                <span className="pl-4 text-neutral-400"><Mail size={17} /></span>
                                                <input
                                                    id="reg-email"
                                                    type="email"
                                                    value={regEmail}
                                                    onChange={(e) => { setRegEmail(e.target.value); setRegEmailError(''); }}
                                                    placeholder="name@example.com"
                                                    className="flex-1 py-3 px-3 text-sm outline-none bg-transparent"
                                                />
                                            </div>
                                            <FieldError msg={regEmailError} />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                        >
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Completing profile…
                                                </span>
                                            ) : (
                                                <>Complete Profile & Sign In <ArrowRight size={15} /></>
                                            )}
                                        </button>
                                    </form>
                                )}

                                <p className="text-center text-sm text-neutral-500 pt-2">
                                    Prefer standard login?{' '}
                                    <button type="button" onClick={() => switchMode('email-login')} className="font-bold text-black hover:underline">
                                        Sign in with password
                                    </button>
                                </p>
                            </div>
                        )}

                        {/* ── Email Login / Register forms ── */}
                        {authMode !== 'forgot' && authMode !== 'otp' && (
                            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
                            </form>
                        )}

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
