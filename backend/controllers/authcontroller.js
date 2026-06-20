const user = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const registerUser = async (req,res) =>{
    try{
        const {name,email,password} = req.body;
        const normalizedName = typeof name === "string" ? name.trim() : "";
        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

        if (normalizedName.length < 2 || normalizedName.length > 80) {
            return res.status(400).json({ message:"Name must be between 2 and 80 characters" });
        }
        if (!emailPattern.test(normalizedEmail) || normalizedEmail.length > 254) {
            return res.status(400).json({ message:"A valid email address is required" });
        }
        if (typeof password !== "string" || password.trim().length < 8 || password.length > 128) {
            return res.status(400).json({ message:"Password must be between 8 and 128 characters" });
        }

        const userExists = await user.findOne({ email: normalizedEmail });
        if(userExists){
            return res.status(409).json({
                message:"An account with this email already exists"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const HashedPassWord = await bcrypt.hash(
            password,
            salt
        );
        const newUser = await user.create({
            name:normalizedName,
            email:normalizedEmail,
            password:HashedPassWord
        });
        res.status(201).json({
            message:"User registered successfully",
            user:{
                id:newUser._id,
                name:newUser.name,
                email:newUser.email,
                role:newUser.role
            }
        });

    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};
const loginUser = async (req,res) =>{
    try{
        const {email,password} = req.body;
        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
        if (!emailPattern.test(normalizedEmail) || typeof password !== "string" || !password) {
            return res.status(400).json({ message:"Email and password are required" });
        }
        const existingUser = await user.findOne({ email: normalizedEmail });
        if(!existingUser){
            return res.status(401).json({
                message : "Invalid email or password"
            });
        }
        const isMatch = await bcrypt.compare(
            password,
            existingUser.password
        );
        if(!isMatch){
            return res.status(401).json({
                message : "Invalid email or password"
            });
        }
        const token = jwt.sign(
            {
                id:existingUser._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );
        res.status(200).json({
            message : "Login Successful",
            token,
             user:{
                id:existingUser._id,
                name:existingUser.name,
                email:existingUser.email,
                role:existingUser.role
            }
        });

    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};
const getProfile = async(req,res) =>{
    res.status(200).json({
        message : "Protected profile route",
        user : req.user
    });
};
module.exports = {
    registerUser,
    loginUser,
    getProfile
};
