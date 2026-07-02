const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/adminMiddleware");
const { createOrder, getOrders, getAllOrders, updateOrderStatus } = require("../controllers/orderController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/my", protect, getOrders);          // changed: /  →  /my  (avoids clash with /all)
router.put("/:id", protect, isAdmin, updateOrderStatus);
router.get("/all", protect, isAdmin, getAllOrders);

module.exports = router;