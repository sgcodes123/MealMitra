import { createContext, useCallback, useRef, useState } from "react";
// eslint-disable-next-line react-refresh/only-export-components
export const ToastContext = createContext();

const AUTO_DISMISS_MS = 4000;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const idRef = useRef(0);

    const dismiss = useCallback((id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const push = useCallback(
        (message, { type = "success", duration = AUTO_DISMISS_MS } = {}) => {
            const id = ++idRef.current;
            setToasts((current) => [...current, { id, message, type }]);
            if (duration) {
                setTimeout(() => dismiss(id), duration);
            }
            return id;
        },
        [dismiss]
    );

    const toast = {
        success: (message, opts) => push(message, { ...opts, type: "success" }),
        error: (message, opts) => push(message, { ...opts, type: "error" }),
        info: (message, opts) => push(message, { ...opts, type: "info" }),
    };

    return (
        <ToastContext.Provider value={{ toasts, toast, dismiss }}>
            {children}
        </ToastContext.Provider>
    );
}