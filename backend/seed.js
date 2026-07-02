const mongoose = require("mongoose");
const dotenv = require("dotenv");
const TiffinPlan = require("./models/TiffinPlan");
const dns = require("node:dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const plans = [
    // ── BREAKFAST · DAILY ──
    {
        title: "Classic Breakfast",
        description: "Poha with peas, a seasonal sabzi, and a glass of warm milk.",
        mealType: "Breakfast",
        duration: "Daily",
        price: 80,
    },
    {
        title: "South Indian Breakfast",
        description: "2 idlis with sambar, coconut chutney, and filter coffee.",
        mealType: "Breakfast",
        duration: "Daily",
        price: 90,
    },

    // ── BREAKFAST · WEEKLY ──
    {
        title: "Classic Breakfast",
        description: "Poha with peas, a seasonal sabzi, and a glass of warm milk.",
        mealType: "Breakfast",
        duration: "Weekly",
        price: 499,
    },
    {
        title: "South Indian Breakfast",
        description: "2 idlis with sambar, coconut chutney, and filter coffee.",
        mealType: "Breakfast",
        duration: "Weekly",
        price: 559,
    },

    // ── BREAKFAST · MONTHLY ──
    {
        title: "Classic Breakfast",
        description: "Poha with peas, a seasonal sabzi, and a glass of warm milk.",
        mealType: "Breakfast",
        duration: "Monthly",
        price: 1799,
    },
    {
        title: "South Indian Breakfast",
        description: "2 idlis with sambar, coconut chutney, and filter coffee.",
        mealType: "Breakfast",
        duration: "Monthly",
        price: 1999,
    },

    // ── LUNCH · DAILY ──
    {
        title: "Homestyle Lunch",
        description: "2 rotis, dal tadka, seasonal sabzi, steamed rice, and pickle.",
        mealType: "Lunch",
        duration: "Daily",
        price: 120,
    },
    {
        title: "Premium Lunch",
        description: "3 rotis, paneer sabzi, dal makhani, rice, salad, and curd.",
        mealType: "Lunch",
        duration: "Daily",
        price: 160,
    },

    // ── LUNCH · WEEKLY ──
    {
        title: "Homestyle Lunch",
        description: "2 rotis, dal tadka, seasonal sabzi, steamed rice, and pickle.",
        mealType: "Lunch",
        duration: "Weekly",
        price: 749,
    },
    {
        title: "Premium Lunch",
        description: "3 rotis, paneer sabzi, dal makhani, rice, salad, and curd.",
        mealType: "Lunch",
        duration: "Weekly",
        price: 999,
    },

    // ── LUNCH · MONTHLY ──
    {
        title: "Homestyle Lunch",
        description: "2 rotis, dal tadka, seasonal sabzi, steamed rice, and pickle.",
        mealType: "Lunch",
        duration: "Monthly",
        price: 2699,
    },
    {
        title: "Premium Lunch",
        description: "3 rotis, paneer sabzi, dal makhani, rice, salad, and curd.",
        mealType: "Lunch",
        duration: "Monthly",
        price: 3599,
    },

    // ── DINNER · DAILY ──
    {
        title: "Light Dinner",
        description: "2 rotis, dal, a light sabzi, and curd.",
        mealType: "Dinner",
        duration: "Daily",
        price: 110,
    },
    {
        title: "Hearty Dinner",
        description: "3 rotis, shahi paneer or chicken curry, rice, raita, and salad.",
        mealType: "Dinner",
        duration: "Daily",
        price: 150,
    },

    // ── DINNER · WEEKLY ──
    {
        title: "Light Dinner",
        description: "2 rotis, dal, a light sabzi, and curd.",
        mealType: "Dinner",
        duration: "Weekly",
        price: 699,
    },
    {
        title: "Hearty Dinner",
        description: "3 rotis, shahi paneer or chicken curry, rice, raita, and salad.",
        mealType: "Dinner",
        duration: "Weekly",
        price: 929,
    },

    // ── DINNER · MONTHLY ──
    {
        title: "Light Dinner",
        description: "2 rotis, dal, a light sabzi, and curd.",
        mealType: "Dinner",
        duration: "Monthly",
        price: 2499,
    },
    {
        title: "Hearty Dinner",
        description: "3 rotis, shahi paneer or chicken curry, rice, raita, and salad.",
        mealType: "Dinner",
        duration: "Monthly",
        price: 3299,
    },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        await TiffinPlan.deleteMany({});
        console.log("Cleared existing plans");

        await TiffinPlan.insertMany(plans);
        console.log(`Seeded ${plans.length} plans successfully`);

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seed();