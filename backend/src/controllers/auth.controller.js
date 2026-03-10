const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// all database related operations will be async and will return promises 
// so we will use async/await to handle them 

async function registerUser(req,res){
    const {fullName, email, password} = req.body;

    // check if user already exists 
    const existingUser = await userModel.findOne({email}); 
    // find on the basis of email because we set email to be unique in user model
    if(existingUser){
        return res.status(400).json({message: "User already exists"});
    }

    // before creating user and saving it to database , we need to hash the password 
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user and save it to database 
    const user = await userModel.create({
        fullName, 
        email, 
        password: hashedPassword
    });

   
    // Cookie + JWT based authentication 
    const myJwtToken = jwt.sign({id: user._id}, process.env.JWT_SECRET );
    res.cookie("token", myJwtToken);

    res.status(201).json({
        message: "User registered successfully",
        _id: user._id,
        fullName: user.fullName,
        email: user.email 
        // we never send password to frontend in response
    })
   
}

async function loginUser(req,res){
    const {email, password} = req.body;

    // check if user exists 
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(400).json({message: "user doesn't exists"});
    }

    // check if password is correct 
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message: "incorrect passwords"});
    }

    // now user is verified , create token and store it in cookie 
    const myJwtToken = jwt.sign({id: user._id}, process.env.JWT_SECRET );
    res.cookie("token", myJwtToken);

    res.status(200).json({
        message: "User logged in successfully",
        _id: user._id,
        fullName: user.fullName,
        email: user.email 
        // we never send password to frontend in response
    })

}

async function logoutUser(req,res){
    res.clearCookie("token");
    res.status(200).json({message: "User logged out successfully"});
}


async function registerFoodPartner(req,res){
    const {name, email, password,contactName,phone,address} = req.body;

    // check if food partner already exists 
    const existingFoodPartner = await foodPartnerModel.findOne({email});
    if(existingFoodPartner){
        return res.status(400).json({message: "Food partner already exists"});
    }

    // before creating food partner and saving it to database , we need to hash the password 
    const hashedPassword = await bcrypt.hash(password, 10);

    // create food partner and save it to database 
    const foodPartner = await foodPartnerModel.create({
        name, 
        email, 
        password: hashedPassword,
        contactName,
        phone,
        address
    });

   
    // Cookie + JWT based authentication 
    const myJwtToken = jwt.sign({id: foodPartner._id}, process.env.JWT_SECRET );
    res.cookie("token", myJwtToken);

    res.status(201).json({
        message: "Food partner registered successfully",
        _id: foodPartner._id,
        name: foodPartner.name,
        email: foodPartner.email,
        contactName: foodPartner.contactName,
        phone: foodPartner.phone,
        address: foodPartner.address 
        // we never send password to frontend in response
    })
   
}

async function loginFoodPartner(req,res){
    const {email, password} = req.body;

    // check if food partner exists 
    const foodPartner = await foodPartnerModel.findOne({email});
    if(!foodPartner){
        return res.status(400).json({message: "Invalid credentials"});
    }

    // check if password is correct 
    const isPasswordCorrect = await bcrypt.compare(password, foodPartner.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message: "Invalid credentials"});
    }

    // now food partner is verified , create token and store it in cookie 
    const myJwtToken = jwt.sign({id: foodPartner._id}, process.env.JWT_SECRET );
    res.cookie("token", myJwtToken);

    res.status(200).json({
        message: "Food partner logged in successfully",
        _id: foodPartner._id,
        name: foodPartner.name,
        email: foodPartner.email 
    })
}

async function logoutFoodPartner(req,res){
    res.clearCookie("token");
    res.status(200).json({message: "Food partner logged out successfully"});
}

async function getMe(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized", role: null, id: null });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const userDocument = await userModel.findById(decoded.id);
        if (userDocument) {
            return res.status(200).json({ role: 'user', id: userDocument._id });
        }
        
        const foodPartnerDocument = await foodPartnerModel.findById(decoded.id);
        if (foodPartnerDocument) {
            return res.status(200).json({ role: 'partner', id: foodPartnerDocument._id });
        }

        return res.status(401).json({ message: "Unauthorized", role: null, id: null });
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized", role: null, id: null });
    }
}


module.exports = {registerUser,loginUser,logoutUser,registerFoodPartner,loginFoodPartner,logoutFoodPartner,getMe };