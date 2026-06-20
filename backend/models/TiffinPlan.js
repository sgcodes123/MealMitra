const mongoose = require("mongoose");
const tiffinPlanSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
            trim:true,
            minlength:2,
            maxlength:100
        },
        description: {
            type:String,
            required:true,
            trim:true,
            minlength:10,
            maxlength:500
        },
        mealType: {
            type:String,
            enum:["Breakfast","Lunch","Dinner"],
            required:true
        },
        duration: {
            type:String,
            enum:["Daily","Weekly","Monthly"],
            required:true
        },
        price: {
            type:Number,
            required:true,
            min:1
        }
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model(
    "TiffinPlan",
    tiffinPlanSchema
);
