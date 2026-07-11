const TiffinPlan = require("../models/TiffinPlan");

const CACHE_TTL_MS = 30_000; 
let cachedPlans = null;
let cachedAt = 0;

async function getCachedPlans() {
    const now = Date.now();
    if (cachedPlans && now - cachedAt < CACHE_TTL_MS) {
        return cachedPlans;
    }
    const plans = await TiffinPlan.find().sort({ mealType: 1, price: 1 });
    cachedPlans = plans;
    cachedAt = now;
    return plans;
}

function invalidatePlanCache() {
    cachedPlans = null;
    cachedAt = 0;
}

module.exports = { getCachedPlans, invalidatePlanCache };