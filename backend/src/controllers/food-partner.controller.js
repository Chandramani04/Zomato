const foodModel = require("../models/food.model");
const foodPartnerModel = require("../models/foodpartner.model");


const getFoodPartnerById = async (req, res) => {
    try {
        const foodPartnerId = req.params.id;
        const foodPartner = await foodPartnerModel.findById(foodPartnerId);
        // all the food items created by this food partner
        const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId });
        
        if(!foodPartner){
            return res.status(404).json({ message: "Food partner not found" });
        }
        res.status(200).json({
            message:"Food partner found",
            // foodPartner,
            // foodItems:foodItemsByFoodPartner
            foodPartner:{
                ...foodPartner.toObject(),
                foodItems:foodItemsByFoodPartner
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const { uploadFile } = require("../storage/service");
const { v4: uuidv4 } = require("uuid");

const updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload an image for the avatar." });
        }

        const fileUploadResponse = await uploadFile(req.file.buffer, uuidv4());
        
        const foodPartnerId = req.foodPartner._id;
        const updatedPartner = await foodPartnerModel.findByIdAndUpdate(
            foodPartnerId,
            { avatar: fileUploadResponse.url },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Avatar updated successfully",
            avatar: updatedPartner.avatar
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getFoodPartnerById,
    updateAvatar
}