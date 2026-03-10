const foodModel = require("../models/food.model");
const {uploadFile} = require("../storage/service");
const {v4: uuidv4} = require("uuid");
const likesModel = require("../models/likes.model");
const saveModel = require("../models/save.model");


async function createFood(req,res){

   if (!req.file) {
      return res.status(400).json({
         success: false,
         message: "Please upload a video file using the 'video' field name."
      });
   }

   const fileUploadResponse = await uploadFile(req.file.buffer,uuidv4());    
   
   const foodItem = await foodModel.create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    video: fileUploadResponse.url,
    foodPartner: req.foodPartner._id
   });

//    res.json({message: "Food created successfully",foodItem});
   res.status(201).json({
      success: true,
      message: "Food created successfully",
      foodItem
   })

}

async function getFoodItems(req,res){
    try {
        const foodItems = await foodModel.find();
        let mappedFoodItems = foodItems;

        // If user is logged in, check which items they have liked and saved
        if (req.user) {
            const userLikes = await likesModel.find({ user: req.user._id });
            const likedFoodIds = new Set(userLikes.map(like => like.food.toString()));
            
            const userSaves = await saveModel.find({ user: req.user._id });
            const savedFoodIds = new Set(userSaves.map(save => save.food.toString()));

            mappedFoodItems = foodItems.map(item => {
                const itemObj = item.toObject();
                itemObj.isLiked = likedFoodIds.has(item._id.toString());
                itemObj.isSaved = savedFoodIds.has(item._id.toString());
                return itemObj;
            });
        }

        res.status(200).json({
            success: true,
            message: "Food items fetched successfully",
            foodItems: mappedFoodItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch food items",
            error: error.message
        });
    }
}

async function likeFood(req,res){
    const {foodId} = req.body; 
    const user = req.user;

    const existingLike = await likesModel.findOne({
        user: user._id,
        food: foodId
    });

    if(existingLike){
        await likesModel.deleteOne({
            user: user._id,
            food: foodId
        });

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        });
        

        return res.status(200).json({
            success: true,
            message: "Food unliked successfully"
        });
    }

    const like = await likesModel.create({
        user: user._id,
        food: foodId
    });

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }
    });

    res.status(200).json({
        success: true,
        message: "Food liked successfully",
        like
    });
}

async function saveFood(req,res){
    const {foodId}  = req.body;
    const user = req.user;

    const existingSave = await saveModel.findOne({
        user: user._id,
        food: foodId
    });

    if(existingSave){
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        });
        
        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { saveCount: -1 }
        });

        return res.status(200).json({
            success: true,
            message: "Food unsaved successfully"
        });
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    });

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { saveCount: 1 }
    });

    res.status(200).json({
        success: true,
        message: "Food saved successfully",
        save
    });
}

async function getSavedFoodItems(req, res) {
    try {
        const userSaves = await saveModel.find({ user: req.user._id }).populate('food');
        
        // Extract the food objects
        let foodItems = userSaves.map(save => save.food).filter(food => food !== null);

        // Check which items are liked
        const userLikes = await likesModel.find({ user: req.user._id });
        const likedFoodIds = new Set(userLikes.map(like => like.food.toString()));

        let mappedFoodItems = foodItems.map(item => {
            const itemObj = item.toObject();
            itemObj.isLiked = likedFoodIds.has(item._id.toString());
            itemObj.isSaved = true; // Since it's from their saved items
            return itemObj;
        });

        res.status(200).json({
            success: true,
            message: "Saved food items fetched successfully",
            foodItems: mappedFoodItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch saved food items",
            error: error.message
        });
    }
}

async function deleteFood(req, res) {
    try {
        const foodId = req.params.id;
        const foodPartnerId = req.foodPartner._id;

        const foodItem = await foodModel.findById(foodId);

        if (!foodItem) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        if (foodItem.foodPartner.toString() !== foodPartnerId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this item" });
        }

        await foodModel.findByIdAndDelete(foodId);

        // Also clean up likes, saves, and cart items that reference this food
        await likesModel.deleteMany({ food: foodId });
        await saveModel.deleteMany({ food: foodId });
        const cartModel = require("../models/cart.model");
        if (cartModel) {
            await cartModel.deleteMany({ food: foodId });
        }

        res.status(200).json({
            success: true,
            message: "Food item deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete food item",
            error: error.message
        });
    }
}

module.exports = {createFood,getFoodItems,likeFood,saveFood,getSavedFoodItems,deleteFood};
