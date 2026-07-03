const { askGeminiOnce } = require("./gemini");
const KEEP_RECENT_TURNS = 10;
const SUMMARIZE_THRESHOLD = 12;

const SUMMARY_SYSTEM_PROMPT = [
    "You compress chat history for a tiffin-subscription assistant's memory.",
    "Given an optional prior summary and a block of older messages, write ONE updated summary.",
    "Keep only: user's stated budget, meal-type/duration preferences, plans already discussed or rejected, and open questions.",
    "Drop small talk and anything already resolved. Max 60 words. Plain prose, no bullet points, no preamble.",
].join(" ");


async function prepareContext(history, existingSummary) {
    if (history.length <= SUMMARIZE_THRESHOLD) {
        return { workingHistory: history, summary: existingSummary || "" };
    }

    const overflowCount = history.length - KEEP_RECENT_TURNS;
    const overflow = history.slice(0, overflowCount);
    const recent = history.slice(overflowCount);

    const overflowText = overflow.map((t) => `${t.role === "user" ? "User" : "Assistant"}: ${t.text}`).join("\n");
    const summaryInput = existingSummary
        ? `Prior summary: ${existingSummary}\n\nOlder messages to fold in:\n${overflowText}`
        : `Older messages to summarize:\n${overflowText}`;

    try {
        const summary = await askGeminiOnce(SUMMARY_SYSTEM_PROMPT, [{ role: "user", text: summaryInput }], {
            maxOutputTokens: 120,
        });
        return { workingHistory: recent, summary };
    } catch (err) {
        
        console.error("conversation summarization failed:", err.message);
        return { workingHistory: recent, summary: existingSummary || "" };
    }
}

module.exports = { prepareContext, KEEP_RECENT_TURNS, SUMMARIZE_THRESHOLD };