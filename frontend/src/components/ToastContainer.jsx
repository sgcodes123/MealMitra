import { useToast } from "../context/useToast";

const styles = {
    success:
        "border-emerald-800/10 bg-white text-[#173f3b] dark:border-emerald-400/20 dark:bg-[#173f3b] dark:text-emerald-50",
    error:
        "border-red-200 bg-white text-red-700 dark:border-red-500/30 dark:bg-[#173f3b] dark:text-red-300",
    info:
        "border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-[#173f3b] dark:text-slate-200",
};

const iconWrap = {
    success: "text-emerald-600 dark:text-emerald-400",
    error: "text-red-500 dark:text-red-400",
    info: "text-slate-400 dark:text-slate-300",
};

function ToastIcon({ type }) {
    if (type === "error") {
        return (
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.5a.75.75 0 00-1.5 0v4a.75.75 0 001.5 0v-4zM10 14.25a.9.9 0 100-1.8.9.9 0 000 1.8z"
                    clipRule="evenodd"
                />
            </svg>
        );
    }
    if (type === "info") {
        return (
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-9.5a.75.75 0 00-1.5 0v4.25a.75.75 0 001.5 0V8.5zM10 6.1a.9.9 0 100-1.8.9.9 0 000 1.8z"
                    clipRule="evenodd"
                />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.86-10.36a.75.75 0 00-1.22-.87l-3.4 4.77-1.6-1.6a.75.75 0 10-1.06 1.06l2.25 2.25a.75.75 0 001.14-.09l3.89-5.52z"
                clipRule="evenodd"
            />
        </svg>
    );
}

export default function ToastContainer() {
    const { toasts, dismiss } = useToast();

    if (!toasts.length) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    role="status"
                    className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg shadow-black/5 animate-[toast-in_0.2s_ease-out] ${styles[toast.type]}`}
                >
                    <span className={`mt-0.5 shrink-0 ${iconWrap[toast.type]}`}>
                        <ToastIcon type={toast.type} />
                    </span>
                    <p className="flex-1 text-sm leading-snug">{toast.message}</p>
                    <button
                        onClick={() => dismiss(toast.id)}
                        aria-label="Dismiss"
                        className="shrink-0 text-current opacity-50 hover:opacity-90"
                    >
                        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                            <path d="M4.3 4.3a1 1 0 011.4 0L10 8.6l4.3-4.3a1 1 0 111.4 1.4L11.4 10l4.3 4.3a1 1 0 01-1.4 1.4L10 11.4l-4.3 4.3a1 1 0 01-1.4-1.4L8.6 10 4.3 5.7a1 1 0 010-1.4z" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
}