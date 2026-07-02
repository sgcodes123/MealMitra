// Usage:
// import Spinner from "../components/Spinner";
// <Spinner /> — centered full screen (default, for page loads)
// <Spinner inline /> — small inline spinner (for buttons etc)

export default function Spinner({ inline = false }) {
    if (inline) {
        return (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        );
    }

    return (
        <div className="min-h-[65vh] flex items-center justify-center bg-[#f1f8f5] dark:bg-[#0f1a18]">
            <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-emerald-900/20 border-t-[#173f3b] dark:border-white/10 dark:border-t-emerald-400" />
                <p className="text-sm text-slate-400 dark:text-slate-500">Loading…</p>
            </div>
        </div>
    );
}