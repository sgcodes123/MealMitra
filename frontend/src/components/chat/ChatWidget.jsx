import { useEffect, useRef, useState } from "react";
import { useChat } from "../../hooks/useChat";
import MarkdownMessage from "./MarkdownMessage";

const SUGGESTED_PROMPTS = [
    "Suggest a plan under ₹2000/month",
    "What's good for lunch + dinner?",
    "Cheapest breakfast option?",
];

function ChatIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
        >
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-8Z" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
        >
            <path d="M6 6l12 12" />
            <path d="M18 6L6 18" />
        </svg>
    );
}

function FullscreenIcon({ minimized = false }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
        >
            {minimized ? (
                <>
                    <path d="M8 3v5H3" />
                    <path d="M16 3v5h5" />
                    <path d="M8 21v-5H3" />
                    <path d="M16 21v-5h5" />
                </>
            ) : (
                <>
                    <path d="M3 8V3h5" />
                    <path d="M16 3h5v5" />
                    <path d="M3 16v5h5" />
                    <path d="M21 16v5h-5" />
                </>
            )}
        </svg>
    );
}

function SendIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
        >
            <path d="M4 12h15" />
            <path d="M13 5l7 7-7 7" />
        </svg>
    );
}

function StopIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
            <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
    );
}

function CopyIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
        >
            <rect x="9" y="9" width="11" height="11" rx="1.5" />
            <path d="M5 15V6.5A1.5 1.5 0 0 1 6.5 5H15" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
        >
            <path d="M20 6L9 17l-5-5" />
        </svg>
    );
}

function RegenerateIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
        >
            <path d="M4 4v5h5" />
            <path d="M20 20v-5h-5" />
            <path d="M4.5 9a8 8 0 0 1 14-3.5L20 9" />
            <path d="M19.5 15a8 8 0 0 1-14 3.5L4 15" />
        </svg>
    );
}

function ChevronDownIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
        >
            <path d="M6 9l6 6 6-6" />
        </svg>
    );
}

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function Avatar({ role }) {
    if (role === "user") {
        return (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-900/10 text-[10px] font-medium text-[#173f3b] dark:bg-white/10 dark:text-emerald-300">
                You
            </div>
        );
    }

    return (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#173f3b] text-white">
            <ChatIcon />
        </div>
    );
}

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // Clipboard unavailable.
        }
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy response"
            className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-slate-400 hover:bg-emerald-900/5 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-white/5 dark:hover:text-slate-300"
        >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "Copied" : "Copy"}
        </button>
    );
}

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [input, setInput] = useState("");
    const [showScrollBtn, setShowScrollBtn] = useState(false);

    const { messages, isStreaming, send, stop, regenerate } = useChat();

    const scrollRef = useRef(null);
    const textareaRef = useRef(null);
    const isNearBottomRef = useRef(true);

    const scrollToBottom = (behavior = "smooth") => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior,
        });
    };

    useEffect(() => {
        if (open && isNearBottomRef.current) {
            scrollToBottom(messages.length <= 2 ? "auto" : "smooth");
        }
    }, [messages, open]);

    useEffect(() => {
        if (open) {
            textareaRef.current?.focus();
        }
    }, [open, isFullscreen]);

    const closeChat = () => {
        setOpen(false);
        setIsFullscreen(false);
    };

    const handleScroll = () => {
        const element = scrollRef.current;
        if (!element) return;

        const distanceFromBottom =
            element.scrollHeight - element.scrollTop - element.clientHeight;

        const nearBottom = distanceFromBottom < 60;

        isNearBottomRef.current = nearBottom;
        setShowScrollBtn(!nearBottom);
    };

    const submit = (text) => {
        send(text);
        isNearBottomRef.current = true;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!input.trim() || isStreaming) return;

        submit(input);
        setInput("");
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmit(event);
        }

        if (event.key === "Escape") {
            if (isFullscreen) {
                setIsFullscreen(false);
            } else {
                closeChat();
            }
        }
    };

    const lastMessage = messages[messages.length - 1];

    const canRegenerate =
        !isStreaming &&
        lastMessage &&
        lastMessage.role === "model" &&
        lastMessage.id !== "welcome";

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
            {open && (
                <div
                    className={
                        isFullscreen
                            ? "fixed inset-0 z-[60] flex h-dvh w-full flex-col overflow-hidden bg-white dark:bg-[#0f1a18]"
                            : "mb-3 flex h-[28rem] w-80 flex-col overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-xl dark:border-white/10 dark:bg-[#0f1a18] sm:w-96"
                    }
                >
                    <div className="flex items-center justify-between bg-[#173f3b] px-4 py-3 text-white">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                            </span>

                            <p className="text-sm font-medium">
                                MealMitra Assistant
                            </p>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsFullscreen((current) => !current)
                                }
                                aria-label={
                                    isFullscreen
                                        ? "Exit fullscreen"
                                        : "Enter fullscreen"
                                }
                                title={
                                    isFullscreen
                                        ? "Exit fullscreen"
                                        : "Fullscreen"
                                }
                                className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white"
                            >
                                <FullscreenIcon minimized={isFullscreen} />
                            </button>

                            <button
                                type="button"
                                onClick={closeChat}
                                aria-label="Close chat"
                                className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                    </div>

                    <div className="relative flex-1 overflow-hidden">
                        <div
                            ref={scrollRef}
                            onScroll={handleScroll}
                            className="h-full space-y-3 overflow-y-auto bg-[#f1f8f5] px-3 py-4 dark:bg-[#0f1a18]"
                        >
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`group flex items-end gap-2 ${
                                        message.role === "user"
                                            ? "flex-row-reverse"
                                            : ""
                                    }`}
                                >
                                    <Avatar role={message.role} />

                                    <div
                                        className={`flex max-w-[80%] flex-col ${
                                            message.role === "user"
                                                ? "items-end"
                                                : "items-start"
                                        }`}
                                    >
                                        <div
                                            className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                                                message.role === "user"
                                                    ? "bg-[#173f3b] text-white"
                                                    : message.status === "error"
                                                      ? "border border-red-200 bg-red-50 text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
                                                      : "bg-white text-slate-700 shadow-sm dark:bg-white/5 dark:text-slate-200"
                                            }`}
                                        >
                                            {message.role === "user" ? (
                                                <span className="whitespace-pre-wrap">
                                                    {message.text}
                                                </span>
                                            ) : message.status === "error" ? (
                                                message.error
                                            ) : message.status === "streaming" &&
                                              !message.text ? (
                                                <span className="flex items-center gap-1 py-0.5">
                                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-900/40 [animation-delay:-0.2s] dark:bg-emerald-400/60" />
                                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-900/40 [animation-delay:-0.1s] dark:bg-emerald-400/60" />
                                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-900/40 dark:bg-emerald-400/60" />
                                                </span>
                                            ) : (
                                                <MarkdownMessage
                                                    text={message.text}
                                                />
                                            )}
                                        </div>

                                        <div className="mt-0.5 flex items-center gap-2 px-1">
                                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                                {formatTime(message.timestamp)}
                                            </span>

                                            {message.role === "model" &&
                                                message.status === "complete" &&
                                                message.text && (
                                                    <span className="opacity-0 transition-opacity group-hover:opacity-100">
                                                        <CopyButton
                                                            text={message.text}
                                                        />
                                                    </span>
                                                )}

                                            {message.status === "stopped" && (
                                                <span className="text-[10px] italic text-slate-400 dark:text-slate-500">
                                                    stopped
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {canRegenerate && (
                                <div className="flex justify-start pl-8">
                                    <button
                                        type="button"
                                        onClick={regenerate}
                                        className="flex items-center gap-1 rounded-full border border-emerald-900/15 px-2.5 py-1 text-[11px] text-slate-500 hover:bg-white dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5"
                                    >
                                        <RegenerateIcon />
                                        Regenerate
                                    </button>
                                </div>
                            )}
                        </div>

                        {showScrollBtn && (
                            <button
                                type="button"
                                onClick={() => scrollToBottom()}
                                aria-label="Scroll to latest message"
                                className="absolute bottom-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-[#173f3b] text-white shadow-md"
                            >
                                <ChevronDownIcon />
                            </button>
                        )}
                    </div>

                    {messages.length === 1 && (
                        <div className="flex flex-wrap gap-1.5 border-t border-emerald-900/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-[#0f1a18]">
                            {SUGGESTED_PROMPTS.map((prompt) => (
                                <button
                                    type="button"
                                    key={prompt}
                                    onClick={() => submit(prompt)}
                                    className="rounded-full border border-emerald-900/15 px-2.5 py-1 text-xs text-slate-600 hover:bg-[#f1f8f5] dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="flex items-end gap-2 border-t border-emerald-900/10 bg-white p-2 dark:border-white/10 dark:bg-[#0f1a18]"
                    >
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(event) =>
                                setInput(event.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about plans, budget, meals… (Enter to send)"
                            maxLength={500}
                            rows={1}
                            className="max-h-24 flex-1 resize-none rounded-2xl border border-emerald-900/15 bg-transparent px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-[#173f3b] dark:border-white/10 dark:text-slate-200"
                        />

                        {isStreaming ? (
                            <button
                                type="button"
                                onClick={stop}
                                aria-label="Stop generating"
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-white"
                            >
                                <StopIcon />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                aria-label="Send message"
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#173f3b] text-white disabled:opacity-40"
                            >
                                <SendIcon />
                            </button>
                        )}
                    </form>
                </div>
            )}

            <button
                type="button"
                onClick={() => {
                    if (open) setIsFullscreen(false);
                    setOpen((current) => !current);
                }}
                aria-label={
                    open
                        ? "Close chat"
                        : "Open MealMitra assistant"
                }
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#173f3b] text-white shadow-lg transition-transform hover:scale-105 dark:shadow-black/40"
            >
                {open ? <CloseIcon /> : <ChatIcon />}
            </button>
        </div>
    );
}