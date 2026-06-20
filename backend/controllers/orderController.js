const Order = require("../models/Order");
const TiffinPlan = require("../models/TiffinPlan");
const mongoose = require("mongoose");
const validStatuses = ["Placed", "Preparing", "OutForDelivery", "Delivered", "Cancelled"];
const createOrder = async(req,res) =>{
    try{
        const { planId } = req.body;
        if (!mongoose.isValidObjectId(planId)) {
            return res.status(400).json({ message:"A valid plan is required" });
        }
        const plan = await TiffinPlan.findById(planId);
        if (!plan) {
            return res.status(404).json({ message:"The selected plan no longer exists" });
        }
        const order = await Order.create({
            userId:req.user.id,
            planId,
            paymentStatus:"Pending",
            orderStatus:"Placed"
        });
        res.status(201).json({
            message:"Order created successfully",
            order
        });

    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};
const getOrders = async(req,res)=>{
    try{
        const orders = await Order.find({
            userId:req.user.id
        }).populate("planId").sort({ createdAt:-1 });
        res.status(200).json(orders);
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};
const getAllOrders = async(req,res)=>{
    try{
        const orders = await Order.find().populate("userId","name email").populate("planId").sort({ createdAt:-1 });
        res.status(200).json(orders);

    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};
const updateOrderStatus = async(req,res)=>{
    try{
        const { orderStatus } = req.body;
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message:"Invalid order id" });
        if (!validStatuses.includes(orderStatus)) return res.status(400).json({ message:"Invalid order status" });
        const order = await Order.findById(req.params.id);
        if(!order){
            return res.status(404).json({
                message:"Order not found"
            });
        }
        order.orderStatus = orderStatus;
        await order.save();
        res.status(200).json({
            message:"Order updated successfully",
            order
        });

    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};
module.exports = {createOrder,getOrders,getAllOrders,updateOrderStatus};
