import { useCallback, useRef, useState } from "react";
import { streamChat } from "../services/chatStream";
import { extractPreferences, loadPreferences, preferencesToString, savePreferences } from "../utils/chatPreferences";

const WELCOME_MESSAGE = {
    id: "welcome",
    role: "model",
    text: "Hi, I'm the MealMitra assistant. Tell me your budget or meal preference and I'll suggest a plan.",
    status: "complete",
    timestamp: Date.now(),
};

let idCounter = 0;
const nextId = () => `msg_${Date.now()}_${idCounter++}`;

export function useChat() {
    const [messages, setMessages] = useState([WELCOME_MESSAGE]);
    const [isStreaming, setIsStreaming] = useState(false);
    const summaryRef = useRef(""); // rolling conversation summary from the backend
    const prefsRef = useRef(loadPreferences());
    const abortControllerRef = useRef(null);

    const updateMessage = useCallback((id, patch) => {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    }, []);

    const runTurn = useCallback((userText, historyForRequest, modelMessageId) => {
        const controller = new AbortController();
        abortControllerRef.current = controller;
        setIsStreaming(true);

        streamChat({
            message: userText,
            history: historyForRequest,
            summary: summaryRef.current,
            userContext: preferencesToString(prefsRef.current),
            signal: controller.signal,
            onChunk: (delta) => {
                setMessages((prev) =>
                    prev.map((m) => (m.id === modelMessageId ? { ...m, text: m.text + delta } : m))
                );
            },
            onDone: ({ summary }) => {
                summaryRef.current = summary || summaryRef.current;
                updateMessage(modelMessageId, { status: "complete" });
                setIsStreaming(false);
            },
            onError: (message) => {
                updateMessage(modelMessageId, { status: "error", error: message });
                setIsStreaming(false);
            },
        })
            .catch(() => {
                updateMessage(modelMessageId, {
                    status: "error",
                    error: "The assistant hit an unexpected error. Please try again.",
                });
            })
            .finally(() => {
                setIsStreaming(false);
            });
    }, [updateMessage]);

    const send = useCallback(
        (text) => {
            const trimmed = text.trim();
            if (!trimmed || isStreaming) return;

            prefsRef.current = extractPreferences(trimmed, prefsRef.current);
            savePreferences(prefsRef.current);

            const historyForRequest = messages
                .filter((m) => m.status !== "error" && m.id !== "welcome")
                .map(({ role, text }) => ({ role, text }));

            const userMsg = { id: nextId(), role: "user", text: trimmed, status: "complete", timestamp: Date.now() };
            const modelMsgId = nextId();
            const modelMsg = { id: modelMsgId, role: "model", text: "", status: "streaming", timestamp: Date.now() };

            setMessages((prev) => [...prev, userMsg, modelMsg]);
            runTurn(trimmed, historyForRequest, modelMsgId);
        },
        [messages, isStreaming, runTurn]
    );

    const stop = useCallback(() => {
        abortControllerRef.current?.abort();
        setMessages((prev) =>
            prev.map((m) => (m.status === "streaming" ? { ...m, status: m.text ? "stopped" : "error", error: m.text ? undefined : "Stopped before any response arrived." } : m))
        );
        setIsStreaming(false);
    }, []);

    const regenerate = useCallback(() => {
        if (isStreaming) return;
        const lastUserIndex = [...messages].reverse().findIndex((m) => m.role === "user");
        if (lastUserIndex === -1) return;
        const idx = messages.length - 1 - lastUserIndex;
        const lastUserMsg = messages[idx];

        const historyForRequest = messages
            .slice(0, idx)
            .filter((m) => m.status !== "error" && m.id !== "welcome")
            .map(({ role, text }) => ({ role, text }));

        const modelMsgId = nextId();
        const modelMsg = { id: modelMsgId, role: "model", text: "", status: "streaming", timestamp: Date.now() };

        setMessages((prev) => [...prev.slice(0, idx + 1), modelMsg]);
        runTurn(lastUserMsg.text, historyForRequest, modelMsgId);
    }, [messages, isStreaming, runTurn]);

    return { messages, isStreaming, send, stop, regenerate };
}
