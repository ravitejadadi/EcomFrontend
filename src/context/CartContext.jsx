import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        // Load cart from localStorage on initialization
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, variant, quantity = 1) => {
        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex(
                (item) => item.id === product.id && item.variant.id === variant.id
            );

            if (existingItemIndex > -1) {
                // Update quantity if item already exists
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex].quantity += quantity;
                return updatedCart;
            } else {
                // Add new item
                return [
                    ...prevCart,
                    {
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: variant.price || product.price,
                        image: product.images[0],
                        variant,
                        quantity,
                    },
                ];
            }
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId, variantId) => {
        setCart((prevCart) =>
            prevCart.filter(
                (item) => !(item.id === productId && item.variant.id === variantId)
            )
        );
    };

    const updateQuantity = (productId, variantId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId, variantId);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId && item.variant.id === variantId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isCartOpen,
        setIsCartOpen,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
