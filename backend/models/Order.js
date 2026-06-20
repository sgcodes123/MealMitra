const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        planId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"TiffinPlan",
            required:true
        },
        paymentStatus:{
            type:String,
            enum:["Pending","Paid","Failed"],
            required:true
        },
        orderStatus:{
            type:String,
            enum:[
                    "Placed",
                    "Preparing",
                    "OutForDelivery",
                    "Delivered",
                    "Cancelled"
            ],
            default:"Placed"
        }
    },
    {
        timestamps:true
    }

);
module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);