import { Link } from "react-router-dom";
import logo from "../assets/mealmitra-logo.png";


function IconSunrise(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M3 18h18" /><path d="M7 18a5 5 0 0 1 10 0" />
            <path d="M12 9V5" /><path d="m8 9-2-2" /><path d="m16 9 2-2" />
        </svg>
    );
}
function IconSun(props) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 3v2M12 19v2M3.2 3.2l1.4 1.4M19.4 19.4l1.4 1.4M3 12h2M19 12h2M3.2 20.8l1.4-1.4M19.4 4.6l1.4-1.4" />
        </svg>
    );
}
function IconMoon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
        </svg>
    );
}

const whyMealMitra = [
    "Fresh and healthy meals",
    "Daily doorstep delivery",
    "Affordable subscription plans",
    "Flexible monthly packages",
];

const services = [
    {
        label: "Morning",
        title: "Breakfast Plans",
        detail: "Start your day with healthy breakfast subscriptions.",
        icon: IconSunrise,
        image: "/images/breakfast.jpg",
        alt: "Healthy breakfast tiffin",
    },
    {
        label: "Midday",
        title: "Lunch Plans",
        detail: "Balanced meals delivered every afternoon.",
        icon: IconSun,
        image: "/images/lunch.jpg",
        alt: "Balanced lunch thali",
    },
    {
        label: "Evening",
        title: "Dinner Plans",
        detail: "Nutritious evening meals for a healthy lifestyle.",
        icon: IconMoon,
        image: "/images/dinner.jpg",
        alt: "Nutritious dinner plate",
    },
];
function Home() {
    const isLoggedIn = !!localStorage.getItem("token");
    return (
        <main className="min-h-screen bg-[#f1f8f5] text-slate-800 dark:bg-[#0f1a18] dark:text-slate-100">
            {/* Hero */}
            <section className="relative overflow-hidden border-b border-emerald-900/10 bg-[#dcefeb] px-5 py-16 sm:px-8 sm:py-20 dark:bg-[#0d2420] dark:border-white/10">
                <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full border-[44px] border-white/45 dark:border-white/10" />
                <div className="absolute bottom-8 right-[18%] h-3 w-20 rounded-full bg-[#e9827c] opacity-80" />

               <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_340px]">
                    {/* Left: copy */}
                    <div>
                        <div className="flex items-center gap-2">
                            <img src={logo} alt="" className="h-5 w-5" />
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800 dark:text-emerald-400">
                                MealMitra
                            </p>
                        </div>
                        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-tight text-[#173f3b] sm:text-5xl dark:text-emerald-100">
                            Healthy meals, delivered daily.
                        </h1>
                        <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-slate-600 dark:text-slate-300">
                            Affordable tiffin subscriptions for students, professionals, and families, built around real life, not the other way around.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link to="/plans" className="rounded-xl bg-[#173f3b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2d2a]">
                                View Plans
                            </Link>
                            <Link to={isLoggedIn ? "/dashboard" : "/signup"} className="rounded-xl border border-emerald-900/15 bg-white px-6 py-3 text-sm font-semibold text-[#173f3b] transition hover:bg-emerald-50 dark:bg-white/10 dark:border-white/15 dark:text-emerald-200 dark:hover:bg-white/20">
                                {isLoggedIn ? "Go to Dashboard" : "Get Started"}
                            </Link>
                        </div>
                    </div>

                    {/* Right: framed hero image (Rei-style circle accent behind a clean frame) */}
                    <div className="relative hidden justify-self-end lg:block">
                        {/* coral accent dot, echoing the brand */}
                        <span className="absolute -left-5 top-8 z-10 h-3 w-3 rounded-full bg-[#e9827c]" />
                        <div className="relative aspect-square w-full max-w-[320px] overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white shadow-[0_25px_60px_rgba(32,75,67,0.18)] dark:border-white/10 dark:bg-[#1a2e2b]">
                            <img
    src="/images/hero-thali.jpg"
    alt="A freshly packed MealMitra tiffin"
    className="h-full w-full object-cover"
    loading="eager"
/>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main content */}
            <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_360px] lg:py-16">
                <div>
                    <div className="mb-7 flex items-end justify-between border-b border-emerald-900/15 pb-4 dark:border-white/10">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                                On the menu
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold text-[#173f3b] dark:text-emerald-100">
                                Our services
                            </h2>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        {services.map((item) => (
                            <article
                                key={item.title}
                                className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-[0_12px_35px_rgba(32,75,67,0.06)] dark:bg-[#1a2e2b] dark:border-white/10 dark:shadow-none"
                            >
                                {/* card image */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-emerald-50 dark:bg-emerald-900/20">
                                    <img
                                        src={item.image}
                                        alt={item.alt}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                    <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-emerald-700 shadow-sm backdrop-blur dark:bg-[#0f1a18]/80 dark:text-emerald-400">
                                        <item.icon className="h-4 w-4" />
                                    </span>
                                </div>

                                <div className="p-6">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
                                        {item.label}
                                    </p>
                                    <p className="mt-1 text-lg font-semibold text-[#173f3b] dark:text-emerald-100">
                                        {item.title}
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                        {item.detail}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

              
                <aside className="h-fit rounded-2xl bg-[#173f3b] p-7 text-white shadow-xl shadow-emerald-950/10 lg:sticky lg:top-8 dark:bg-[#0d2420] dark:shadow-none dark:border dark:border-white/10">
                    <div className="mb-8 flex items-center justify-between">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#e9827c]" />
                        <span className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-200">
                            Why MealMitra
                        </span>
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight">
                        A simpler way to eat well
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-emerald-50/75">
                        No grocery runs, no last-minute cooking, just meals that show up.
                    </p>
                    <div className="my-7 border-t border-white/15" />
                    <ul className="space-y-4 text-sm">
                        {whyMealMitra.map((point) => (
                            <li key={point} className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#e9827c]" />
                                <span className="font-medium text-emerald-50">{point}</span>
                            </li>
                        ))}
                    </ul>
                    <Link to={isLoggedIn ? "/dashboard" : "/signup"} className="mt-8 block rounded-xl bg-white px-5 py-3.5 text-center text-sm font-semibold text-[#173f3b] transition hover:bg-emerald-50">
                        {isLoggedIn ? "Go to Dashboard" : "Get Started"}
                    </Link>
                </aside>
            </section>
        </main>
    );
}

export default Home;