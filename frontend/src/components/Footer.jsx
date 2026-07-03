import { Link } from "react-router-dom";
import logo from "../assets/mealmitra-logo.png";

const customerLinks = [
    { label: "Home", to: "/" },
    { label: "Plans", to: "/plans" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
];

const adminLinks = [
    { label: "Admin dashboard", to: "/admin" },
    { label: "View public website", to: "/" },
    { label: "View meal plans", to: "/plans" },
    { label: "Contact page", to: "/contact" },
];

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        return null;
    }
}

function AdminFooter({ year, user }) {
    return (
        <footer className="border-t border-emerald-900/10 bg-emerald-50 text-slate-700 transition-colors dark:border-emerald-700/30 dark:bg-[#102523] dark:text-slate-300">
            <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Admin brand */}
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl border border-emerald-900/10 bg-white p-1.5 shadow-sm dark:border-white/10 dark:bg-white/10 dark:shadow-none">
                                <img
                                    src={logo}
                                    alt="MealMitra"
                                    className="h-9 w-9"
                                />
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-lg font-semibold leading-tight text-[#173f3b] dark:text-white">
                                        MealMitra
                                    </p>

                                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">
                                        Admin
                                    </span>
                                </div>

                                <p className="text-xs text-emerald-700 dark:text-emerald-200/70">
                                    Operations dashboard
                                </p>
                            </div>
                        </div>

                        <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600 dark:text-slate-400">
                            Manage meal plans, customer orders, payments and
                            platform operations.
                        </p>
                    </div>

                    {/* Admin navigation */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                            Admin navigation
                        </p>

                        <ul className="mt-4 space-y-2.5 text-sm">
                            {adminLinks.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="transition hover:text-[#173f3b] dark:hover:text-white"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Admin session */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                            Current session
                        </p>

                        <div className="mt-4 rounded-xl border border-emerald-900/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                            <p className="text-sm font-medium text-[#173f3b] dark:text-white">
                                {user?.name || "Administrator"}
                            </p>

                            {user?.email && (
                                <p className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">
                                    {user.email}
                                </p>
                            )}

                            <div className="mt-3 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />

                                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                    Admin access active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-emerald-900/10 pt-6 text-xs text-slate-500 dark:border-white/10 dark:text-slate-500 sm:flex-row">
                    <p>© {year} MealMitra-SG Admin Portal.</p>
                    <p>Restricted to authorized administrators.</p>
                </div>
            </div>
        </footer>
    );
}

function CustomerFooter({ year }) {
    return (
        <footer className="border-t border-emerald-900/10 bg-white text-slate-600 transition-colors dark:border-white/10 dark:bg-[#0f1a18] dark:text-slate-400">
            <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2.5">
                            <img
                                src={logo}
                                alt="MealMitra"
                                className="h-9 w-9"
                            />

                            <div>
                                <p className="text-lg font-semibold leading-tight text-[#173f3b] dark:text-emerald-300">
                                    MealMitra
                                </p>

                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Healthy Tiffin Subscription
                                </p>
                            </div>
                        </div>

                        <p className="mt-4 max-w-xs text-sm leading-6">
                            Affordable, healthy meals delivered daily, built
                            around your real schedule.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                            Quick links
                        </p>

                        <ul className="mt-4 space-y-2.5 text-sm">
                            {customerLinks.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="transition hover:text-[#173f3b] dark:hover:text-emerald-300"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                            Get in touch
                        </p>

                        <ul className="mt-4 space-y-2.5 text-sm">
                            <li>
                                <a
                                    href="mailto:hello@mealmitra.example"
                                    className="transition hover:text-[#173f3b] dark:hover:text-emerald-300"
                                >
                                    hello@mealmitra.example
                                </a>
                            </li>

                            <li>
                                <a
                                    href="tel:+919000012345"
                                    className="transition hover:text-[#173f3b] dark:hover:text-emerald-300"
                                >
                                    +91 90000 12345
                                </a>
                            </li>

                            <li>Noida, Uttar Pradesh, India</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-emerald-900/10 pt-6 text-xs text-slate-500 dark:border-white/10 dark:text-slate-500 sm:flex-row">
                    <p>© {year} MealMitra-SG. All rights reserved.</p>
                    <p>Made for healthier everyday eating.</p>
                </div>
            </div>
        </footer>
    );
}

function Footer() {
    const year = new Date().getFullYear();
    const user = getCurrentUser();
    const isAdmin = user?.role === "admin";

    if (isAdmin) {
        return <AdminFooter year={year} user={user} />;
    }

    return <CustomerFooter year={year} />;
}

export default Footer;