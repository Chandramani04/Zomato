const express = require("express");
const router = express.Router();
const foodController = require("../controllers/food.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer"); 
const upload = multer({
    storage:multer.memoryStorage()
})

// prefix for all routes in this file is "/api/food" 
// all routes in this file will be protected by auth middleware

// food routes 
/* POST  /api/food/ [protected] */
router.post("/", authMiddleware.authFoodPartnerMiddleware, upload.single("video"), foodController.createFood);
/* GET /api/food/ [protected]  */
// this api will show all the food items available in the database to the USER 
router.get("/",authMiddleware.authUserMiddleware,foodController.getFoodItems)
 

router.post("/like",authMiddleware.authUserMiddleware,foodController.likeFood); 
// when user clicks on like button this api will be called 
// it will add the food item to the user's liked food items 

router.post("/save",authMiddleware.authUserMiddleware,foodController.saveFood);


module.exports = router;    