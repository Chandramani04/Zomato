const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Prefix: /api/cart
// All cart routes should be protected for users

router.post("/add", authMiddleware.authUserMiddleware, cartController.addToCart);
router.get("/", authMiddleware.authUserMiddleware, cartController.getCart);
router.delete("/remove/:id", authMiddleware.authUserMiddleware, cartController.removeFromCart);
router.delete("/clear", authMiddleware.authUserMiddleware, cartController.clearCart);

module.exports = router;
