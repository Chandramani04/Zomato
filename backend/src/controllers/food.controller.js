const foodModel = require("../models/food.model");
const {uploadFile} = require("../storage/service");
const {v4: uuidv4} = require("uuid");


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

module.exports = {createFood,getFoodItems};
