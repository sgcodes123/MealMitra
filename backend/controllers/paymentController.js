const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const { markOrderPaid } = require("./orderController");
const { sendOrderConfirmationEmail } = require("../utils/mailer");

const createRazorpayOrder = async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const { orderId } = req.body;
        const order = await Order.findById(orderId).populate("planId");
        if (!order) return res.status(404).json({ message: "Order not found" });
        if (order.userId.toString() !== req.user.id)
            return res.status(403).json({ message: "Unauthorized" });

        const razorpayOrder = await razorpay.orders.create({
            amount: order.planId.price * 100,
            currency: "INR",
            receipt: `receipt_${orderId}`,
            notes: { orderId: orderId.toString() },
        });

        res.status(200).json({
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("createRazorpayOrder error:", error);
        res.status(500).json({ message: "Payment initiation failed. Please try again." });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (expectedSignature !== razorpay_signature)
            return res.status(400).json({ message: "Payment verification failed." });

        const order = await markOrderPaid(orderId, razorpay_order_id, razorpay_payment_id);

        sendOrderConfirmationEmail(order.userId, order).catch((err) =>
            console.error("Email failed (non-critical):", err.message)
        );

        res.status(200).json({ message: "Payment verified", order });
    } catch (error) {
        console.error("verifyPayment error:", error);
        res.status(500).json({ message: "Payment verification failed. Please contact support." });
    }
};

module.exports = { createRazorpayOrder, verifyPayment };