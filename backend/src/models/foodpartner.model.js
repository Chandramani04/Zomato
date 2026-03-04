const mongoose = require("mongoose");

const foodPartnerSchema = new mongoose.Schema({
    name: { // restaurant name 
        type: String,
        required: true
    },
    contactName:{ // food partner name 
        type: String,
        required: true
    },
    phone:{ // food partner phone number 
        type: String,
        required: true
    },
    address:{
        type:String,
        required: true

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }    
})

const foodPartnerModel = mongoose.model("FoodPartner", foodPartnerSchema);

module.exports = foodPartnerModel;