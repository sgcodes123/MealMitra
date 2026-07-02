import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            if (response.data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f1f8f5] text-slate-800 dark:bg-[#0f1a18] dark:text-slate-100">
            {/* Hero */}
            <section className="relative overflow-hidden border-b border-emerald-900/10 bg-[#dcefeb] px-5 py-16 sm:px-8 sm:py-20 dark:bg-[#0d2420] dark:border-white/10">
                <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full border-[44px] border-white/45 dark:border-white/10" />
                <div className="absolute bottom-8 right-[18%] h-3 w-20 rounded-full bg-[#e9827c] opacity-80" />
                <div className="relative mx-auto max-w-6xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800 dark:text-emerald-400">
                        Welcome back
                    </p>
                    <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[#173f3b] sm:text-5xl dark:text-emerald-100">
                        Sign in to MealMitra.
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                        Your tiffin subscriptions and order history are waiting for you.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
                <div className="mx-auto max-w-md">
                    <div className="rounded-2xl border border-emerald-900/10 bg-white p-8 shadow-[0_12px_35px_rgba(32,75,67,0.06)] dark:bg-[#1a2e2b] dark:border-white/10 dark:shadow-none">
                        <div className="mb-8 border-b border-emerald-900/15 pb-5 dark:border-white/10">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                                Your account
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold text-[#173f3b] dark:text-emerald-100">
                                Login
                            </h2>
                        </div>

                        {location.state?.registered && (
                            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700/40 dark:text-emerald-300">
                                Account created successfully. Please sign in.
                            </div>
                        )}
                        {location.state?.passwordReset && (
                            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700/40 dark:text-emerald-300">
                                Password reset successfully. Please sign in with your new password.
                            </div>
                        )}
                        {error && (
                            <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-700/40 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    placeholder="Example_eva02@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-emerald-900/15 bg-[#f8faf9] px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 dark:bg-[#0f1a18] dark:border-white/10 dark:text-slate-100 dark:focus:border-emerald-500 dark:placeholder:text-slate-500"
                                />
                            </div>
                            <div>
                                <div className="mb-1.5 flex items-center justify-between gap-4">
                                    <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Password
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-xs font-semibold text-emerald-700 hover:text-[#173f3b] dark:text-emerald-400 dark:hover:text-emerald-300"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <input
                                    id="login-password"
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-emerald-900/15 bg-[#f8faf9] px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 dark:bg-[#0f1a18] dark:border-white/10 dark:text-slate-100 dark:focus:border-emerald-500 dark:placeholder:text-slate-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-[#173f3b] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0f2d2a] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                            Don&apos;t have an account?{" "}
                            <Link to="/signup" className="font-medium text-emerald-700 hover:text-[#173f3b] dark:text-emerald-400 dark:hover:text-emerald-300">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Login;
