import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (password.length < 8 || password.length > 128) {
            setError("Password must be between 8 and 128 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setError("The passwords do not match.");
            return;
        }
        if (loading) return;

        setLoading(true);
        try {
            await api.post(`/auth/reset-password/${encodeURIComponent(token)}`, { password });
            setCompleted(true);
            window.setTimeout(() => {
                navigate("/login", { replace: true, state: { passwordReset: true } });
            }, 1500);
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "We could not reset your password. Please request a new link."
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
                    Choose a new password
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Use at least 8 characters. Your reset link works once and expires after 15 minutes.
                </p>

                {completed ? (
                    <div role="status" className="mt-7 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-700/40 dark:bg-emerald-900/30 dark:text-emerald-300">
                        Password reset successfully. Taking you to sign in…
                    </div>
                ) : (
                    <>
                        {error && (
                            <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700/40 dark:bg-red-900/20 dark:text-red-400">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                            <div>
                                <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    New password
                                </label>
                                <input
                                    id="new-password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                    minLength={8}
                                    maxLength={128}
                                    className="w-full rounded-xl border border-emerald-900/15 bg-[#f8faf9] px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 dark:border-white/10 dark:bg-[#0f1a18] dark:text-slate-100 dark:focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Confirm new password
                                </label>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    required
                                    minLength={8}
                                    maxLength={128}
                                    className="w-full rounded-xl border border-emerald-900/15 bg-[#f8faf9] px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 dark:border-white/10 dark:bg-[#0f1a18] dark:text-slate-100 dark:focus:border-emerald-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-[#173f3b] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0f2d2a] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? "Resetting password..." : "Reset password"}
                            </button>
                        </form>
                    </>
                )}

                <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    <Link to="/forgot-password" className="font-medium text-emerald-700 hover:text-[#173f3b] dark:text-emerald-400 dark:hover:text-emerald-300">
                        Request a new link
                    </Link>
                </p>
            </section>
        </main>
    );
}

export default ResetPassword;
