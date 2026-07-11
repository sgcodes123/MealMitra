require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dns = require("node:dns");
const connectDB = require("./config/db");
const { initSocket } = require("./socket");
const authRoutes = require("./routes/authRoutes");
const tiffinPlanRoutes = require("./routes/tiffinPlanRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

dns.setServers(["1.1.1.1", "8.8.8.8"]);
connectDB();

const app = express();

app.use(helmet());

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim());
app.use(cors({ origin: allowedOrigins, credentials: true }));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests. Please try again later." },
});
app.use("/api", apiLimiter);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/plans", tiffinPlanRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.get("/", (req, res) => {
    res.send("MealMitra API running");
});

app.use(notFound);
app.use(errorHandler);

const httpServer = http.createServer(app);
initSocket(httpServer, allowedOrigins);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`App is running on Port ${PORT}`);
});