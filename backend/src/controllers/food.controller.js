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
        res.status(200).json({
            success: true,
            message: "Food items fetched successfully",
            foodItems
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

        return res.status(200).json({
            success: true,
            message: "Food unsaved successfully"
        });
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    });

    res.status(200).json({
        success: true,
        message: "Food saved successfully",
        save
    });
}

module.exports = {createFood,getFoodItems,likeFood,saveFood};
