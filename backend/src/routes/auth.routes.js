const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// prefix for all routes in this file is "/api/auth" 

// user routes 
router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);
router.get("/user/logout", authController.logoutUser);

// food partner routes 
router.post("/foodpartner/register", authController.registerFoodPartner);
router.post("/foodpartner/login", authController.loginFoodPartner);
router.get("/foodpartner/logout", authController.logoutFoodPartner);

// general auth routes
router.get("/me", authController.getMe);



module.exports = router;    