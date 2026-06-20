const mongoose = require("mongoose");
const connectDB =  async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
        console.log("Ready State:", mongoose.connection.readyState);
    }catch(error){
        console.error("MongoDB Error:");
    console.error(error);
        process.exit(1);
    }
};
module.exports = connectDB;