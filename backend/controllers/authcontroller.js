const user = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("node:crypto");
const { sendPasswordResetEmail } = require("../utils/mailer");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordResetMessage = "If an account exists for that email, a reset link has been sent.";

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const normalizedName  = typeof name  === "string" ? name.trim()                   : "";
        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase()    : "";

        if (normalizedName.length < 2 || normalizedName.length > 80)
            return res.status(400).json({ message: "Name must be between 2 and 80 characters" });
        if (!emailPattern.test(normalizedEmail) || normalizedEmail.length > 254)
            return res.status(400).json({ message: "A valid email address is required" });
        if (typeof password !== "string" || password.trim().length < 8 || password.length > 128)
            return res.status(400).json({ message: "Password must be between 8 and 128 characters" });

        const userExists = await user.findOne({ email: normalizedEmail });
        if (userExists)
            return res.status(409).json({ message: "An account with this email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await user.create({
            name: normalizedName,
            email: normalizedEmail,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered successfully",
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
        });
    } catch (error) {
        console.error("registerUser error:", error);
        res.status(500).json({ message: "Registration failed. Please try again." });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

        if (!emailPattern.test(normalizedEmail) || typeof password !== "string" || !password)
            return res.status(400).json({ message: "Email and password are required" });

        const existingUser = await user.findOne({ email: normalizedEmail }).select("+authVersion");
        if (!existingUser)
            return res.status(401).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid email or password" });

        const token = jwt.sign(
            { id: existingUser._id, version: existingUser.authVersion || 0 },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
            },
        });
    } catch (error) {
        console.error("loginUser error:", error);
        res.status(500).json({ message: "Login failed. Please try again." });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const normalizedEmail = typeof req.body.email === "string"
            ? req.body.email.trim().toLowerCase()
            : "";

        if (!emailPattern.test(normalizedEmail) || normalizedEmail.length > 254)
            return res.status(400).json({ message: "A valid email address is required" });

        const existingUser = await user
            .findOne({ email: normalizedEmail })
            .select("+passwordResetRequestedAt");

        if (!existingUser)
            return res.status(200).json({ message: passwordResetMessage });

        const oneMinuteAgo = Date.now() - 60 * 1000;
        if (
            existingUser.passwordResetRequestedAt &&
            existingUser.passwordResetRequestedAt.getTime() > oneMinuteAgo
        ) {
            return res.status(200).json({ message: passwordResetMessage });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        existingUser.passwordResetToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        existingUser.passwordResetExpires    = new Date(Date.now() + 15 * 60 * 1000);
        existingUser.passwordResetRequestedAt = new Date();
        await existingUser.save({ validateBeforeSave: false });

        try {
            await sendPasswordResetEmail(existingUser, resetToken);
        } catch (emailError) {
            existingUser.passwordResetToken    = undefined;
            existingUser.passwordResetExpires  = undefined;
            await existingUser.save({ validateBeforeSave: false });
            console.error("Password reset email failed:", emailError.message);
            return res.status(503).json({
                message: "Reset email could not be sent. Please try again later.",
            });
        }

        return res.status(200).json({ message: passwordResetMessage });
    } catch (error) {
        console.error("forgotPassword error:", error);
        return res.status(500).json({ message: "Unable to process the request right now." });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!/^[a-f0-9]{64}$/i.test(token || ""))
            return res.status(400).json({ message: "This reset link is invalid or has expired." });
        if (typeof password !== "string" || password.trim().length < 8 || password.length > 128)
            return res.status(400).json({ message: "Password must be between 8 and 128 characters." });

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const existingUser = await user
            .findOne({
                passwordResetToken:   hashedToken,
                passwordResetExpires: { $gt: new Date() },
            })
            .select("+passwordResetToken +passwordResetExpires +authVersion");

        if (!existingUser)
            return res.status(400).json({ message: "This reset link is invalid or has expired." });

        existingUser.password                 = await bcrypt.hash(password, 10);
        existingUser.passwordResetToken       = undefined;
        existingUser.passwordResetExpires     = undefined;
        existingUser.passwordResetRequestedAt = undefined;
        existingUser.passwordChangedAt        = new Date();
        existingUser.authVersion              = (existingUser.authVersion || 0) + 1;
        await existingUser.save();

        return res.status(200).json({ message: "Password reset successfully. You can now sign in." });
    } catch (error) {
        console.error("resetPassword error:", error);
        return res.status(500).json({ message: "Unable to reset the password right now." });
    }
};

const getProfile = async (req, res) => {
    res.status(200).json({ message: "Protected profile route", user: req.user });
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword, getProfile };