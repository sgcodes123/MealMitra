import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        if (!trimmedName) newErrors.name = "Name is required.";
        else if (trimmedName.length < 2) newErrors.name = "Name must contain at least 2 characters.";
        else if (trimmedName.length > 80) newErrors.name = "Name cannot exceed 80 characters.";
        if (!trimmedEmail) newErrors.email = "Email is required.";
        else if (trimmedEmail.length > 254) newErrors.email = "Email is too long.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) newErrors.email = "Enter a valid email address.";
        if (!password || !password.trim()) newErrors.password = "Password is required.";
        else if (password.length < 8) newErrors.password = "Password must contain at least 8 characters.";
        else if (password.length > 128) newErrors.password = "Password cannot exceed 128 characters.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");
        if (!validateForm() || isSubmitting) return;
        try {
            setIsSubmitting(true);
            await api.post("/auth/register", { name: name.trim(), email: email.trim().toLowerCase(), password });
            navigate("/login", { state: { registered: true } });
        } catch (error) {
            setServerError(error.response?.data?.message || error.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const clearFieldError = (field) => {
        setErrors((current) => ({ ...current, [field]: "" }));
        setServerError("");
    };

    const inputClass = (field) =>
        `w-full rounded-xl border bg-[#f8faf9] px-4 py-3 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-emerald-700/15 dark:bg-[#0f1a18] dark:text-slate-100 dark:placeholder:text-slate-500 ${
            errors[field]
                ? "border-red-400 focus:border-red-400"
                : "border-emerald-900/15 focus:border-emerald-700 dark:border-white/10 dark:focus:border-emerald-500"
        }`;

    return (
        <main className="min-h-screen bg-[#f1f8f5] text-slate-800 dark:bg-[#0f1a18] dark:text-slate-100">
            <section className="relative overflow-hidden border-b border-emerald-900/10 bg-[#dcefeb] px-5 py-16 sm:px-8 sm:py-20 dark:bg-[#0d2420] dark:border-white/10">
                <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full border-[44px] border-white/45 dark:border-white/10" />
                <div className="absolute bottom-8 right-[18%] h-3 w-20 rounded-full bg-[#e9827c] opacity-80" />
                <div className="relative mx-auto max-w-6xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800 dark:text-emerald-400">Get started</p>
                    <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[#173f3b] sm:text-5xl dark:text-emerald-100">
                        Create your account.
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                        Join MealMitra and start subscribing to healthy tiffin plans today.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
                <div className="mx-auto max-w-md">
                    <div className="rounded-2xl border border-emerald-900/10 bg-white p-8 shadow-[0_12px_35px_rgba(32,75,67,0.06)] dark:bg-[#1a2e2b] dark:border-white/10 dark:shadow-none">
                        <div className="mb-8 border-b border-emerald-900/15 pb-5 dark:border-white/10">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">New account</p>
                            <h2 className="mt-2 text-2xl font-semibold text-[#173f3b] dark:text-emerald-100">Sign up</h2>
                        </div>

                        {serverError && (
                            <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-700/40 dark:text-red-400">
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate className="space-y-5">
                            {[
                                { id: "name", label: "Full name", type: "text", placeholder: "Shaurya Gupta", value: name, setter: setName, autoComplete: "name" },
                                { id: "email", label: "Email address", type: "email", placeholder: "Example_eva01@gmail.com", value: email, setter: setEmail, autoComplete: "email" },
                                { id: "password", label: "Password", type: "password", placeholder: "Not less than 8 characters", value: password, setter: setPassword, autoComplete: "new-password" },
                            ].map(({ id, label, type, placeholder, value, setter, autoComplete }) => (
                                <div key={id}>
                                    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {label}
                                    </label>
                                    <input
                                        id={id}
                                        type={type}
                                        autoComplete={autoComplete}
                                        placeholder={placeholder}
                                        value={value}
                                        onChange={(e) => { setter(e.target.value); clearFieldError(id); }}
                                        aria-invalid={Boolean(errors[id])}
                                        className={inputClass(id)}
                                    />
                                    <p className="mt-1.5 min-h-[18px] text-xs text-red-600 dark:text-red-400">{errors[id]}</p>
                                </div>
                            ))}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-xl bg-[#173f3b] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0f2d2a] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? "Creating account..." : "Create account"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-emerald-700 hover:text-[#173f3b] dark:text-emerald-400 dark:hover:text-emerald-300">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Signup;