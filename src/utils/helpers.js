// Format currency in INR
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Calculate discount percentage
export const calculateDiscount = (originalPrice, salePrice) => {
    if (!originalPrice || !salePrice) return 0;
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

// Truncate text
export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Generate slug from string
export const generateSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
};

// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Check if element is in viewport
export const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// Validate Indian pincode
export const validatePincode = (pincode) => {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
};

// Validate Indian mobile number
export const validateMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
};

// Validate email
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Get image URL with optimization
export const getOptimizedImageUrl = (url, width = 800, quality = 80) => {
    // For Unsplash images
    if (url.includes('unsplash.com')) {
        return `${url}&w=${width}&q=${quality}&fm=webp`;
    }
    return url;
};

// Class name utility (similar to clsx)
export const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
};
