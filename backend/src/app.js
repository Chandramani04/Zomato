const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");
const cartRoutes = require("./routes/cart.routes");
const cors = require("cors");
const path = require("path");

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);
app.use("/api/cart", cartRoutes);

// -------- SERVE FRONTEND --------

const dirname1 = path.resolve();

app.use(express.static(path.join(dirname1, "dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname1, "dist", "index.html"));
});

module.exports = app;