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

module.exports = {
    getFoodPartnerById
}