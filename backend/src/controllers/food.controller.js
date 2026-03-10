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

module.exports = {createFood,getFoodItems,likeFood,saveFood};
