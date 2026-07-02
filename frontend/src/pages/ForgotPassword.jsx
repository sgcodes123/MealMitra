import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (loading) return;

        setMessage("");
        setError("");
        setLoading(true);
        try {
            const response = await api.post("/auth/forgot-password", {
                email: email.trim().toLowerCase(),
            });
            setMessage(response.data.message);
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "We could not send a reset email. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f1f8f5] px-5 py-16 text-slate-800 dark:bg-[#0f1a18] dark:text-slate-100 sm:px-8">
            <section className="mx-auto max-w-md rounded-2xl border border-emerald-900/10 bg-white p-8 shadow-[0_12px_35px_rgba(32,75,67,0.06)] dark:border-white/10 dark:bg-[#1a2e2b] dark:shadow-none">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                    Account recovery
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-[#173f3b] dark:text-emerald-100">
                    Forgot your password?
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Enter your account email and we&apos;ll send you a link to choose a new password.
                </p>

                {message && (
                    <div role="status" className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-700/40 dark:bg-emerald-900/30 dark:text-emerald-300">
                        {message}
                    </div>
                )}
                {error && (
                    <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700/40 dark:bg-red-900/20 dark:text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                    <div>
                        <label htmlFor="reset-email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Email address
                        </label>
                        <input
                            id="reset-email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                                setError("");
                            }}
                            required
                            placeholder="you@example.com"
                            className="w-full rounded-xl border border-emerald-900/15 bg-[#f8faf9] px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 dark:border-white/10 dark:bg-[#0f1a18] dark:text-slate-100 dark:focus:border-emerald-500 dark:placeholder:text-slate-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[#173f3b] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0f2d2a] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Sending link..." : "Send reset link"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    Remembered it?{" "}
                    <Link to="/login" className="font-medium text-emerald-700 hover:text-[#173f3b] dark:text-emerald-400 dark:hover:text-emerald-300">
                        Back to sign in
                    </Link>
                </p>
            </section>
        </main>
    );
}

export default ForgotPassword;
