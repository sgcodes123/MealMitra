const TiffinPlan = require("../models/TiffinPlan");
const mongoose = require("mongoose");

const mealTypes = ["Breakfast", "Lunch", "Dinner"];
const durations = ["Daily", "Weekly", "Monthly"];

const validatePlan = ({ title, description, mealType, duration, price }, partial = false) => {
    if (!partial || title !== undefined) {
        if (typeof title !== "string" || title.trim().length < 2 || title.trim().length > 100) return "Plan name must be between 2 and 100 characters";
    }
    if (!partial || description !== undefined) {
        if (typeof description !== "string" || description.trim().length < 10 || description.trim().length > 500) return "Description must be between 10 and 500 characters";
    }
    if (!partial || mealType !== undefined) {
        if (!mealTypes.includes(mealType)) return "Meal type must be Breakfast, Lunch, or Dinner";
    }
    if (!partial || duration !== undefined) {
        if (!durations.includes(duration)) return "Duration must be Daily, Weekly, or Monthly";
    }
    if (!partial || price !== undefined) {
        if (!Number.isFinite(Number(price)) || Number(price) <= 0) return "Price must be greater than zero";
    }
    return null;
};
const createPlan = async (req,res) => {
    try{
        const{
            title,
            description,
            mealType,
            duration,
            price
        } = req.body;
        const validationError = validatePlan(req.body);
        if (validationError) return res.status(400).json({ message: validationError });
        const plan = await TiffinPlan.create({
            title:title.trim(),
            description:description.trim(),
            mealType,
            duration,
            price:Number(price)
        });
        res.status(201).json({
            message : "Plan created Successfully",
            plan
        });
    }catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};
const getAllPlans = async (req,res) =>{
    try{
        const plans = await TiffinPlan.find().sort({ mealType: 1, price: 1 });
        res.status(200).json(plans);
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};
const updatePlan = async(req,res) =>{
    try{
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message:"Invalid plan id" });
        const validationError = validatePlan(req.body, true);
        if (validationError) return res.status(400).json({ message: validationError });
        const updates = { ...req.body };
        if (typeof updates.title === "string") updates.title = updates.title.trim();
        if (typeof updates.description === "string") updates.description = updates.description.trim();
        if (updates.price !== undefined) updates.price = Number(updates.price);
        const plan = await TiffinPlan.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new:true,
                runValidators:true
            }
        );
        if(!plan){
            return res.status(404).json({
                message:"Plan not found"
            });
        }
        res.status(200).json({
            message:"Plan updated successfully",
            plan
        });

    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};
const deletePlan = async(req,res) =>{
    try{
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message:"Invalid plan id" });
        const plan = await TiffinPlan.findByIdAndDelete(
            req.params.id
        );
        if(!plan){
            return res.status(404).json({
                message:"Plan not found"
            });
        }
        res.status(200).json({
            message:"Plan deleted successfully"
        });
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};
module.exports = {
    createPlan,
    getAllPlans,
    updatePlan,
    deletePlan
};
