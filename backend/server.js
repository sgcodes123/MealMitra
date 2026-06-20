const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const tiffinPlanRoutes = require("./routes/tiffinPlanRoutes");
const orderRoutes = require("./routes/orderRoutes");
dotenv.config();
//console.log("URI =", process.env.MONGO_URI);

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/plans",tiffinPlanRoutes);
app.use("/api/orders",orderRoutes);
const dns = require("node:dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);
connectDB();

app.get("/", (req, res) => {
    res.send("MealMitra API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`App is running on Port ${PORT}`);
});
