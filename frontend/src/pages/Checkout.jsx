import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Checkout.css';

const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18"></path>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/cart', {
                    withCredentials: true
                });

                if (response.data && response.data.success) {
                    setCartItems(response.data.cart);
                }
            } catch (err) {
                setError("Failed to load cart items.");
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.food?.price || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    const handleRemove = async (itemId) => {
        try {
            const response = await axios.delete(`http://localhost:3000/api/cart/remove/${itemId}`, {
                withCredentials: true
            });
            if (response.data?.success) {
                setCartItems(prev => prev.filter(item => item._id !== itemId));
            }
        } catch (error) {
            console.error("Failed to remove item", error);
        }
    };

    const handleClearCart = async () => {
        try {
            const response = await axios.delete('http://localhost:3000/api/cart/clear', {
                withCredentials: true
            });
            if (response.data?.success) {
                setCartItems([]);
            }
        } catch (error) {
            console.error("Failed to clear cart", error);
        }
    };

    if (loading) {
        return <div className="checkout-container" style={{ textAlign: 'center', marginTop: '50px' }}>Loading cart...</div>;
    }

    if (error) {
        return <div className="checkout-container" style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;
    }

    return (
        <div className="checkout-container">
            <div className="checkout-inner">
                <div className="checkout-header-center">
                <h1>Your Food Cart</h1>
                <p>Review your items and proceed to checkout</p>
            </div>

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <h2>Your cart is empty</h2>
                    <p>Go back to the feed and discover some amazing food!</p>
                </div>
            ) : (
                <>
                    <div className="cart-items-list">
                        {cartItems.map(item => (
                            <div key={item._id} className="cart-item-card">
                                <div className="cart-item-image">
                                    <video src={item.food?.video} muted loop playsInline autoPlay />
                                </div>
                                <div className="cart-item-details">
                                    <h3 className="cart-item-title">{item.food?.name}</h3>
                                    <p className="cart-item-subtitle">{item.food?.name}</p>
                                    <span className="cart-item-price">₹{item.food?.price || 0}</span>
                                </div>
                                <button className="delete-btn" onClick={() => handleRemove(item._id)} aria-label="Remove item">
                                    <TrashIcon />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="checkout-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Total Items</span>
                            <span className="summary-value">{cartItems.length}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery Fee</span>
                            <span className="summary-value">₹40</span>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>₹{calculateTotal() + 40}</span>
                        </div>

                        <button className="btn-place-order" onClick={() => alert("Order Placed Successfully!")}>
                            Checkout
                        </button>
                        
                        <button className="btn-clear-cart" onClick={handleClearCart}>
                            Clear Cart
                        </button>
                    </div>
                </>
            )}
            </div>
        </div>
    );
};

export default Checkout;
