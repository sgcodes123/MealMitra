import { Link } from "react-router-dom";

function NotFound() {
    return (
        <main className="min-h-screen bg-[#f1f8f5] dark:bg-[#0f1a18] flex items-center justify-center px-5">
            <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-400">
                    404
                </p>
                <h1 className="mt-4 text-5xl font-semibold tracking-tight text-[#173f3b] dark:text-emerald-100">
                    Page not found.
                </h1>
                <p className="mt-5 text-base text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    The page you're looking for doesn't exist or may have been moved.
                </p>
                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                    <Link
                        to="/"
                        className="rounded-xl bg-[#173f3b] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0f2d2a] transition-colors"
                    >
                        Go home
                    </Link>
                    <Link
                        to="/plans"
                        className="rounded-xl border border-emerald-900/15 px-6 py-3 text-sm font-semibold text-[#173f3b] hover:bg-emerald-50 transition-colors dark:border-white/10 dark:text-emerald-300 dark:hover:bg-white/10"
                    >
                        View plans
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default NotFound;