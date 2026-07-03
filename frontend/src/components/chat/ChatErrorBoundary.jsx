import { Component } from "react";

export default class ChatErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("ChatWidget crashed:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed bottom-5 right-5 z-50 rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm text-red-600 shadow-lg dark:border-red-900/40 dark:bg-[#0f1a18] dark:text-red-400">
                    The chat assistant hit a problem and needs a refresh.
                </div>
            );
        }
        return this.props.children;
    }
}