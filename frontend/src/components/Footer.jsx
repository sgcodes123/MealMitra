import { Link } from "react-router-dom";
import logo from "../assets/mealmitra-logo.png";

const quickLinks = [
    { label: "Home", to: "/" },
    { label: "Plans", to: "/plans" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
];

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-emerald-900/10 bg-white text-slate-600 dark:bg-[#0f1a18] dark:border-white/10 dark:text-slate-400">
            <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2.5">
                            <img src={logo} alt="MealMitra" className="h-9 w-9" />
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
                            Affordable, healthy meals delivered daily, built around your real schedule.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                            Quick links
                        </p>
                        <ul className="mt-4 space-y-2.5 text-sm">
                            {quickLinks.map((link) => (
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
                                <a href="mailto:hello@mealmitra.example" className="transition hover:text-[#173f3b] dark:hover:text-emerald-300">
                                    hello@mealmitra.example
                                </a>
                            </li>
                            <li>
                                <a href="tel:+919000012345" className="transition hover:text-[#173f3b] dark:hover:text-emerald-300">
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

export default Footer;
