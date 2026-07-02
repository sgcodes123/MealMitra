import { Link } from "react-router-dom";

function IconLeaf(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M5 21c8 0 13-5 13-13V5h-3C7 5 3 9 3 17v4" />
            <path d="M5 21 14 12" />
        </svg>
    );
}
function IconTruck(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M3 7h11v8H3z" /><path d="M14 10h4l3 3v2h-7z" />
            <circle cx="7" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" />
        </svg>
    );
}
function IconWallet(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="3" y="6" width="18" height="13" rx="2" />
            <path d="M3 10h18" /><circle cx="16" cy="14" r="1.2" fill="currentColor" stroke="none" />
        </svg>
    );
}

const whyChooseUs = [
    { title: "Nutrition, planned",       detail: "Carefully planned meals designed for a healthier lifestyle.",      icon: IconLeaf },
    { title: "On time, every time",      detail: "Fresh meals delivered consistently to your doorstep.",             icon: IconTruck },
    { title: "Built around your budget", detail: "Flexible pricing options suitable for every budget.",              icon: IconWallet },
];

const platformFeatures = [
    "Breakfast Plans", "Lunch Plans", "Dinner Plans",
    "Daily Subscriptions", "Weekly Subscriptions", "Monthly Subscriptions",
    "Secure Login System", "Order Tracking Dashboard",
];

function About() {
    return (
        <main className="min-h-screen bg-[#f1f8f5] text-slate-800 dark:bg-[#0f1a18] dark:text-slate-100">
            {/* Hero */}
            <section className="relative overflow-hidden border-b border-emerald-900/10 bg-[#dcefeb] px-5 py-16 sm:px-8 sm:py-20 dark:bg-[#0d2420] dark:border-white/10">
                <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full border-[44px] border-white/45 dark:border-white/10" />
                <div className="absolute bottom-8 right-[18%] h-3 w-20 rounded-full bg-[#e9827c] opacity-80" />
                <div className="relative mx-auto max-w-6xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800 dark:text-emerald-400">About MealMitra</p>
                    <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[#173f3b] sm:text-5xl dark:text-emerald-100">
                        Healthy meals made simple.
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                        MealMitra helps students, professionals, and families enjoy nutritious food through flexible tiffin subscriptions, built around real life, not the other way around.
                    </p>
                </div>
            </section>

            <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_360px] lg:py-16">
                <div>
                    <div className="mb-7 border-b border-emerald-900/15 pb-4 dark:border-white/10">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">Why MealMitra</p>
                        <h2 className="mt-2 text-2xl font-semibold text-[#173f3b] dark:text-emerald-100">Built for everyday eating</h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                            We aim to make healthy, affordable, and convenient meals accessible to everyone through a simple subscription-based platform. Whether you need breakfast, lunch, or dinner, MealMitra has a plan for you.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        {whyChooseUs.map((item) => (
                            <article key={item.title} className="rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-[0_12px_35px_rgba(32,75,67,0.06)] dark:bg-[#1a2e2b] dark:border-white/10 dark:shadow-none">
                                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <p className="text-lg font-semibold text-[#173f3b] dark:text-emerald-100">{item.title}</p>
                                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.detail}</p>
                            </article>
                        ))}
                    </div>
                </div>

                <aside className="h-fit rounded-2xl bg-[#173f3b] p-7 text-white shadow-xl shadow-emerald-950/10 lg:sticky lg:top-8 dark:bg-[#0d2420] dark:border dark:border-white/10 dark:shadow-none">
                    <div className="mb-8 flex items-center justify-between">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#e9827c]" />
                        <span className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-200">At a glance</span>
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight">The platform in numbers</h2>
                    <p className="mt-3 text-sm leading-6 text-emerald-50/75">A simple set of plans, built to fit around a real schedule.</p>
                    <div className="my-7 border-t border-white/15" />
                    <dl className="space-y-5 text-sm">
                        <div><dt className="text-emerald-200">Meal categories</dt><dd className="mt-1 font-medium">Breakfast, lunch, dinner</dd></div>
                        <div><dt className="text-emerald-200">Subscription types</dt><dd className="mt-1 font-medium">Daily, weekly, monthly</dd></div>
                        <div><dt className="text-emerald-200">Platform access</dt><dd className="mt-1 font-medium">24/7 , Order anytime</dd></div>
                    </dl>
                    <Link to="/plans" className="mt-8 block rounded-xl bg-white px-5 py-3.5 text-center text-sm font-semibold text-[#173f3b] transition hover:bg-emerald-50">
                        View Plans
                    </Link>
                    <p className="mt-4 text-center text-xs text-emerald-100/55">Plans and pricing shown at checkout</p>
                </aside>
            </section>

            {/* Platform features */}
            <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 lg:pb-20">
                <div className="rounded-2xl border border-emerald-900/10 bg-white p-7 shadow-[0_12px_35px_rgba(32,75,67,0.06)] sm:p-10 dark:bg-[#1a2e2b] dark:border-white/10 dark:shadow-none">
                    <div className="mb-8 flex items-end justify-between border-b border-emerald-900/15 pb-4 dark:border-white/10">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">On the platform</p>
                            <h2 className="mt-2 text-2xl font-semibold text-[#173f3b] dark:text-emerald-100">Platform features</h2>
                        </div>
                    </div>
                    <div className="grid gap-x-10 gap-y-4 text-sm sm:grid-cols-2">
                        {platformFeatures.map((feature) => (
                            <p key={feature} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs text-white">✓</span>
                                {feature}
                            </p>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default About;