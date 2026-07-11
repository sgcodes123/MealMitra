const Order = require("../models/Order");
const TiffinPlan = require("../models/TiffinPlan");
const mongoose = require("mongoose");
const { emitOrderUpdate } = require("../socket");

const validStatuses = ["Placed", "Preparing", "OutForDelivery", "Delivered", "Cancelled"];

// Generates one delivery entry per day based on plan duration
const generateDeliveries = (duration) => {
    const counts = { Daily: 1, Weekly: 7, Monthly: 30 };
    const days = counts[duration] || 1;
    return Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
        status: "Placed",
    }));
};

const createOrder = async (req, res) => {
    try {
        const { planId } = req.body;
        if (!mongoose.isValidObjectId(planId))
            return res.status(400).json({ message: "A valid plan is required" });

        const plan = await TiffinPlan.findById(planId);
        if (!plan)
            return res.status(404).json({ message: "The selected plan no longer exists" });

        const order = await Order.create({
            userId: req.user.id,
            planId,
            paymentStatus: "Pending",
            orderStatus: "Placed",
            deliveries: generateDeliveries(plan.duration),
        });

        res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
        console.error("createOrder error:", error);
        res.status(500).json({ message: "Failed to create order. Please try again." });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .populate("planId")
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("getOrders error:", error);
        res.status(500).json({ message: "Failed to fetch orders. Please try again." });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "name email")
            .populate("planId")
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("getAllOrders error:", error);
        res.status(500).json({ message: "Failed to fetch orders. Please try again." });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;

        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ message: "Invalid order id" });
        if (!validStatuses.includes(orderStatus))
            return res.status(400).json({ message: "Invalid order status" });

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.orderStatus = orderStatus;
        await order.save();

        // Push the change to anyone watching this order in real time.
        emitOrderUpdate(order._id.toString(), {
            orderId: order._id.toString(),
            status: order.orderStatus,
            updatedAt: order.updatedAt,
        });

        res.status(200).json({ message: "Order updated successfully", order });
    } catch (error) {
        console.error("updateOrderStatus error:", error);
        res.status(500).json({ message: "Failed to update order. Please try again." });
    }
};

const markOrderPaid = async (orderId, razorpayOrderId, razorpayPaymentId) => {
    return await Order.findByIdAndUpdate(
        orderId,
        {
            paymentStatus: "Paid",
            orderStatus: "Placed",
            razorpayOrderId,
            razorpayPaymentId,
        },
        { returnDocument: "after" }
    ).populate("planId userId");
};

module.exports = { createOrder, getOrders, getAllOrders, updateOrderStatus, markOrderPaid };