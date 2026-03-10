// connect to mongodb 
const mongoose = require("mongoose");
const mongoUrl = process.env.MONGODB_URL;
function connectDB(){
    mongoose.connect(mongoUrl).then(() => {
        console.log("Connected to MongoDB");
    }).catch((err) => {
          console.log(err);
    }); 
}

module.exports = connectDB;