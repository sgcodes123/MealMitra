const express = require("express");
const router = express.Router();
const {
    createPlan,
    getAllPlans,
    updatePlan,
    deletePlan
} = require("../controllers/tiffinPlanController");
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
router.post("/", protect, isAdmin, createPlan);
router.get("/", getAllPlans);

router.put("/:id", protect, isAdmin, updatePlan);
router.delete("/:id", protect, isAdmin, deletePlan);
module.exports = router;
