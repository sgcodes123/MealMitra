require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("node:dns");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const tiffinPlanRoutes = require("./routes/tiffinPlanRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

dns.setServers(["1.1.1.1", "8.8.8.8"]);
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/plans", tiffinPlanRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
    res.send("MealMitra API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`App is running on Port ${PORT}`);
});
{/*app.get("/test-email", async (req, res) => {
    const { sendOrderConfirmationEmail } = require("./utils/mailer");
    try {
        await sendOrderConfirmationEmail(
            { name: "Test User", email: "shauryagupta2006@gmail.com" }, // ← your personal email
            {
                planId: { title: "Test Plan", mealType: "Lunch", duration: "Monthly", price: 999 },
                orderStatus: "Placed",
                razorpayPaymentId: "pay_test123",
                createdAt: new Date(),
            }
        );
        res.send("Email sent successfully!");
    } catch (err) {
        res.status(500).send("Email failed: " + err.message);
    }
});*/}