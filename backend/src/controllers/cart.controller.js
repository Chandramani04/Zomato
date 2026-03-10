const cartModel = require("../models/cart.model");
const foodModel = require("../models/food.model");

async function addToCart(req, res) {
    try {
        const { foodId } = req.body;
        const user = req.user;

        // Check if item already exists in cart
        const existingCartItem = await cartModel.findOne({
            user: user._id,
            food: foodId
        });

        if (existingCartItem) {
            // Increment quantity if it already exists
            existingCartItem.quantity += 1;
            await existingCartItem.save();
            
            return res.status(200).json({
                success: true,
                message: "Increased quantity in cart",
                cartItem: existingCartItem
            });
        }

        // Add new item to cart
        const cartItem = await cartModel.create({
            user: user._id,
            food: foodId,
            quantity: 1
        });

        res.status(201).json({
            success: true,
            message: "Added to cart successfully",
            cartItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add to cart",
            error: error.message
        });
    }
}

async function getCart(req, res) {
    try {
        const user = req.user;
        
        // Fetch cart items and populate the referenced food details
        const cartItems = await cartModel.find({ user: user._id }).populate('food');
        
        res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            cart: cartItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch cart",
            error: error.message
        });
    }
}

async function removeFromCart(req, res) {
    try {
        const { id } = req.params;
        const user = req.user;
        
        await cartModel.findOneAndDelete({ _id: id, user: user._id });
        
        res.status(200).json({
            success: true,
            message: "Item removed from cart"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to remove item",
            error: error.message
        });
    }
}

async function clearCart(req, res) {
    try {
        const user = req.user;
        
        await cartModel.deleteMany({ user: user._id });
        
        res.status(200).json({
            success: true,
            message: "Cart cleared"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to clear cart",
            error: error.message
        });
    }
}

module.exports = { addToCart, getCart, removeFromCart, clearCart };
