const BASE_URL = import.meta.env?.VITE_API_URL || "/api";
const CONNECT_TIMEOUT_MS = 15_000;
const STREAM_IDLE_TIMEOUT_MS = 45_000;

function readWithTimeout(reader, timeoutMs) {
    let timeoutId;
    return Promise.race([
        reader.read(),
        new Promise((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error("STREAM_TIMEOUT")), timeoutMs);
        }),
    ]).finally(() => clearTimeout(timeoutId));
}

/**
 *
 * @param {object} params
 * @param {string} params.message
 * @param {{role:string,text:string}[]} params.history
 * @param {string} params.summary
 * @param {string} params.userContext
 * @param {AbortSignal} params.signal
 * @param {(delta: string) => void} params.onChunk
 * @param {(final: {text: string, summary: string}) => void} params.onDone
 * @param {(message: string) => void} params.onError
 */
export async function streamChat({ message, history, summary, userContext, signal, onChunk, onDone, onError }) {
    const controller = new AbortController();
    const abortFromCaller = () => controller.abort();
    signal?.addEventListener("abort", abortFromCaller, { once: true });

    let connectTimedOut = false;
    const connectTimeout = setTimeout(() => {
        connectTimedOut = true;
        controller.abort();
    }, CONNECT_TIMEOUT_MS);

    let response;
    try {
        const token = localStorage.getItem("token");
        response = await fetch(`${BASE_URL}/chatbot`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ message, history, summary, userContext }),
            signal: controller.signal,
        });
    } catch (err) {
        signal?.removeEventListener("abort", abortFromCaller);
        if (signal?.aborted) return;
        if (connectTimedOut) {
            onError("The assistant server took too long to respond. Please try again.");
            return;
        }
        if (err.name === "AbortError") return;
        onError("Couldn't reach the assistant. Check your connection and try again.");
        return;
    } finally {
        clearTimeout(connectTimeout);
    }

    if (!response.ok || !response.body) {
        let msg = "The assistant is unavailable right now.";
        try {
            const data = await response.json();
            if (data?.message) msg = data.message;
        } catch {
            /* Default body */
        }
        onError(msg);
        signal?.removeEventListener("abort", abortFromCaller);
        return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let terminalEventReceived = false;

    const processEvent = (eventBlock) => {
        const lines = eventBlock.split(/\r?\n/);
        const eventType = lines.find((line) => line.startsWith("event:"))?.slice(6).trim();
        const dataText = lines
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.slice(5).trimStart())
            .join("\n");
        if (!eventType || !dataText) return;

        let payload;
        try {
            payload = JSON.parse(dataText);
        } catch {
            return;
        }

        if (eventType === "chunk") onChunk(payload.text || "");
        else if (eventType === "done") {
            terminalEventReceived = true;
            onDone(payload);
        } else if (eventType === "error") {
            terminalEventReceived = true;
            onError(payload.message || "The assistant is unavailable right now.");
        }
    };

    try {
        while (true) {
            const { done, value } = await readWithTimeout(reader, STREAM_IDLE_TIMEOUT_MS);
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const events = buffer.split(/\r?\n\r?\n/);
            buffer = events.pop();

            events.forEach(processEvent);
            if (terminalEventReceived) {
                await reader.cancel();
                break;
            }
        }

        buffer += decoder.decode();
        if (buffer.trim()) processEvent(buffer);

        if (!terminalEventReceived && !signal?.aborted) {
            onError("The assistant connection closed before a response arrived. Please try again.");
        }
    } catch (err) {
        if (signal?.aborted) return;
        if (err.message === "STREAM_TIMEOUT") {
            controller.abort();
            onError("The assistant took too long to reply. Please try again.");
        } else if (err.name !== "AbortError") {
            onError("Connection interrupted. Please try again.");
        }
    } finally {
        signal?.removeEventListener("abort", abortFromCaller);
        reader.releaseLock();
    }
}
