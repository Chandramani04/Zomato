// create server 
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");
const cartRoutes = require("./routes/cart.routes");
const cors = require("cors");

// middlewares 
app.use(express.json()); // a middleware to make data readable from request body 
app.use(cookieParser()); // a middleware to parse cookies 
app.use(cors({origin: "http://localhost:5173", credentials: true})); // a middleware to handle CORS 

app.get("/", (req, res) => {
    res.send("Hello World! from app.js");   
});

// using this middleware ,we are adding a prefix "/api/auth" to all the routes in auth.routes.js 
// and now when user hits "/api/auth/user/register" , it will be redirected to "/user/register" in auth.routes.js 
app.use("/api/auth", authRoutes); // add a prefix and redirect to routes present in authRoutes
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);
app.use("/api/cart", cartRoutes);

// we created server in app.js but will start it in server.js , so we export app
module.exports = app;
