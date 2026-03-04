const foodPartnerModel = require("../models/foodpartner.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");


// we have attached a token to the cookie using controllers 
// with every request from client , cookie will also be sent to server 

async function authFoodPartnerMiddleware(req,res,next){
    
    const token = req.cookies.token; // syntax to get a value from cookie -> req.cookies.cookieName
    if(!token){
        // if token is not present  -> then it means the food partner is not logged in 
        return res.status(401).json({message: "Unauthorized"});
    }
    // now verify the token 
    try {

        /*
        since we encoded the id of the food partner in the token using jwt.sign({id: foodPartner._id}, process.env.JWT_SECRET )
        now we can also decode the id of the food partner from the encoded token using jwt.verify(token, process.env.JWT_SECRET) 
        */
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // if token doesn't verify -> throws an error 
        // now token has been verified and decoded =>  food partner is authenticated 
        // get the actual food partner from the database using the decoded id 
        const foodPartnerDocument = await foodPartnerModel.findById(decoded.id); 
        if(!foodPartnerDocument){
            // if food partner is not found -> then it means the food partner is not logged in  
            return res.status(401).json({message: "Unauthorized"});
        }
        // now food partner is authenticated and authorized -> pass control to next middleware with req and res object  
        // and attach the actual informations we got from the database to the req object 
        // till now , req object doesn't have any information about the food partner , so we are attaching it to the req object  
        req.foodPartner = foodPartnerDocument; // another way of adding a property to an object , we can also do req["foodPartner"] = foodPartnerDB


        /*
        future middleware and controller will get : 
        1. req.foodPartner -> actual food partner document from database
        2. req.token -> the token that was sent from the client 

        we do not verify it again in future middleware and controller because it is already verified here 

        */

        next();
    } catch (error) {
        return res.status(401).json({message: "Unauthorized"});
    }
}

async function authUserMiddleware(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message: "Please login first"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userDocument = await userModel.findById(decoded.id);
        if(!userDocument){
            return res.status(401).json({message: "Unauthorized"});
        }
        req.user = userDocument;
        next();
    } catch (error) {
        return res.status(401).json({message: "Unauthorized"});
    }
}

module.exports = {authFoodPartnerMiddleware, authUserMiddleware};