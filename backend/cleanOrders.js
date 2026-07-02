const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const Order = require("./models/Order");
const TiffinPlan = require("./models/TiffinPlan");
dotenv.config();
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const clean = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // populate planId — any order where it comes back null is orphaned
        const orders = await Order.find().populate("planId");
        const orphaned = orders.filter((order) => !order.planId);

        if (!orphaned.length) {
            console.log("No orphaned orders found.");
            process.exit(0);
        }

        const ids = orphaned.map((o) => o._id);
        await Order.deleteMany({ _id: { $in: ids } });
        console.log(`Deleted ${ids.length} orphaned orders.`);

        process.exit(0);
    } catch (error) {
        console.error("Cleanup failed:", error);
        process.exit(1);
    }
};

clean();