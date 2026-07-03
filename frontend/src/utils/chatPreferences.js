
const BUDGET_RE = /₹\s?(\d{2,6})/;
const MEAL_KEYWORDS = ["breakfast", "lunch", "dinner"];
const DURATION_KEYWORDS = ["daily", "weekly", "monthly"];
const DIET_KEYWORDS = ["veg", "vegetarian", "non-veg", "non vegetarian", "vegan"];

const STORAGE_KEY = "mealmitra_chat_preferences";

export function loadPreferences() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
        return {};
    }
}

export function savePreferences(prefs) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
        // localStorage unavailable (private mode etc.)
    }
}

export function extractPreferences(text, prefs = {}) {
    const lower = text.toLowerCase();
    const next = { ...prefs };

    const budgetMatch = text.match(BUDGET_RE);
    if (budgetMatch) next.budget = Number(budgetMatch[1]);

    const meals = MEAL_KEYWORDS.filter((k) => lower.includes(k));
    if (meals.length) next.meals = Array.from(new Set([...(prefs.meals || []), ...meals]));

    const duration = DURATION_KEYWORDS.find((k) => lower.includes(k));
    if (duration) next.duration = duration;

    const diet = DIET_KEYWORDS.find((k) => lower.includes(k));
    if (diet) next.diet = diet;

    return next;
}

export function preferencesToString(prefs) {
    const parts = [];
    if (prefs.budget) parts.push(`budget around ₹${prefs.budget}`);
    if (prefs.meals?.length) parts.push(`interested in ${prefs.meals.join("/")}`);
    if (prefs.duration) parts.push(`prefers ${prefs.duration} billing`);
    if (prefs.diet) parts.push(`diet preference: ${prefs.diet}`);
    return parts.join("; ");
}