const express = require("express");
const router = express.Router();
const foodPartnerController = require("../controllers/food-partner.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// prefix for all routes in this file is "/api/food-partner" 
// all routes in this file will be protected by auth middleware

// show all the food items posted by a specific food partner to the user
/* GET /api/food-partner/:id [protected] */
router.get("/:id",authMiddleware.authGeneralMiddleware,foodPartnerController.getFoodPartnerById)

const multer = require("multer"); 
const upload = multer({
    storage:multer.memoryStorage()
});

// Update the avatar for a food partner
router.put("/avatar", authMiddleware.authFoodPartnerMiddleware, upload.single("avatar"), foodPartnerController.updateAvatar);

module.exports = router;     