const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}`;

const CONNECT_TIMEOUT_MS = 15_000; 
const IDLE_TIMEOUT_MS = 20_000; 
const MAX_CONNECT_RETRIES = 2;

const GENERATION_CONFIG = {
    temperature: 0.4,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 400,
};

const SAFETY_SETTINGS = [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
];

function requireApiKey() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
    return apiKey;
}

function toContents(history) {
    return history.map((turn) => ({
        role: turn.role,
        parts: [{ text: turn.text }],
    }));
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


async function askGeminiOnce(systemInstruction, history, { maxOutputTokens = 150 } = {}) {
    const apiKey = requireApiKey();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CONNECT_TIMEOUT_MS);

    try {
        const response = await fetch(`${BASE_URL}:generateContent`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
            signal: controller.signal,
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemInstruction }] },
                contents: toContents(history),
                generationConfig: { ...GENERATION_CONFIG, maxOutputTokens },
                safetySettings: SAFETY_SETTINGS,
            }),
        });

        if (!response.ok) {
            const errText = await response.text().catch(() => "");
            throw new Error(`Gemini API error (${response.status}): ${errText}`);
        }

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
        if (!text) throw new Error("Gemini API returned an empty response");
        return text.trim();
    } finally {
        clearTimeout(timeout);
    }
}
async function streamGemini(systemInstruction, history, { onText, externalSignal }) {
    const apiKey = requireApiKey();
    let attempt = 0;
    let sawFirstByte = false;

    while (true) {
        const controller = new AbortController();
        const onExternalAbort = () => controller.abort();
        externalSignal?.addEventListener("abort", onExternalAbort);

        let watchdog = setTimeout(() => controller.abort(), CONNECT_TIMEOUT_MS);
        const resetWatchdog = (ms) => {
            clearTimeout(watchdog);
            watchdog = setTimeout(() => controller.abort(), ms);
        };

        try {
            const response = await fetch(`${BASE_URL}:streamGenerateContent?alt=sse`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
                signal: controller.signal,
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: systemInstruction }] },
                    contents: toContents(history),
                    generationConfig: GENERATION_CONFIG,
                    safetySettings: SAFETY_SETTINGS,
                }),
            });

            if (!response.ok) {
                const errText = await response.text().catch(() => "");
                throw new Error(`Gemini API error (${response.status}): ${errText}`);
            }

            sawFirstByte = true;
            let full = "";
            let buffer = "";
            const decoder = new TextDecoder();

            const processEvent = (eventBlock) => {
                const jsonStr = eventBlock
                    .split(/\r?\n/)
                    .filter((line) => line.startsWith("data:"))
                    .map((line) => line.slice(5).trimStart())
                    .join("\n")
                    .trim();
                if (!jsonStr || jsonStr === "[DONE]") return;

                let parsed;
                try {
                    parsed = JSON.parse(jsonStr);
                } catch {
                    return;
                }

                const finishReason = parsed?.candidates?.[0]?.finishReason;
                if (finishReason && finishReason !== "STOP") {
                    throw new Error(`Generation stopped: ${finishReason}`);
                }

                const delta = parsed?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
                if (delta) {
                    full += delta;
                    onText(delta);
                }
            };

            for await (const chunk of response.body) {
                resetWatchdog(IDLE_TIMEOUT_MS);
                buffer += decoder.decode(chunk, { stream: true });

                const events = buffer.split(/\r?\n\r?\n/);
                buffer = events.pop();
                events.forEach(processEvent);
            }

            buffer += decoder.decode();
            if (buffer.trim()) processEvent(buffer);

            clearTimeout(watchdog);
            if (!full) throw new Error("Gemini API returned an empty response");
            return full;
        } catch (err) {
            clearTimeout(watchdog);
            if (externalSignal?.aborted) {
                const abortErr = new Error("Generation stopped by user");
                abortErr.code = "USER_ABORTED";
                throw abortErr;
            }
           
            if (!sawFirstByte && attempt < MAX_CONNECT_RETRIES) {
                attempt += 1;
                await sleep(300 * 2 ** attempt);
                continue;
            }
            throw err;
        } finally {
            externalSignal?.removeEventListener("abort", onExternalAbort);
        }
    }
}

module.exports = { askGeminiOnce, streamGemini };
