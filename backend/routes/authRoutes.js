const express = require("express");
const router = express.Router();
const {
    registerUser, 
    loginUser,
    forgotPassword,
    resetPassword,
    getProfile
} = require("../controllers/authcontroller");
const protect = require("../middleware/authMiddleware");
router.get("/profile",protect,getProfile);
router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password/:token",resetPassword);
module.exports = router;
