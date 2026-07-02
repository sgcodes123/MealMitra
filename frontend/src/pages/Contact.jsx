const contactDetails = [
    { label: "Contact person", value: "Shaurya Gupta",              detail: "Customer care coordinator" },
    { label: "Email",          value: "hello@mealmitra.example",     detail: "Replies within one business day", href: "mailto:hello@mealmitra.example" },
    { label: "Mobile",         value: "+91 90000 12345",             detail: "Monday to Saturday, 9 AM–7 PM",   href: "tel:+919000012345" },
    { label: "Address",        value: "Random Office, Noida , Uttar Pradesh , India", detail: "Noida ,UP ,201309" },
];

function Contact() {
    return (
        <main className="min-h-screen bg-[#f1f8f5] text-slate-800 dark:bg-[#0f1a18] dark:text-slate-100">
            {/* Hero */}
            <section className="relative overflow-hidden border-b border-emerald-900/10 bg-[#dcefeb] px-5 py-16 sm:px-8 sm:py-20 dark:bg-[#0d2420] dark:border-white/10">
                <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full border-[44px] border-white/45 dark:border-white/10" />
                <div className="absolute bottom-8 right-[18%] h-3 w-20 rounded-full bg-[#e9827c] opacity-80" />
                <div className="relative mx-auto max-w-6xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800 dark:text-emerald-400">Contact MealMitra</p>
                    <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[#173f3b] sm:text-5xl dark:text-emerald-100">
                        Thoughtful support for healthier everyday meals.
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                        Questions about subscriptions, delivery schedules, or meal plans? Our team is here to make things clear and simple.
                    </p>
                </div>
            </section>

            <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_360px] lg:py-16">
                <div>
                    <div className="mb-7 flex items-end justify-between border-b border-emerald-900/15 pb-4 dark:border-white/10">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">Reach us</p>
                            <h2 className="mt-2 text-2xl font-semibold text-[#173f3b] dark:text-emerald-100">Contact information</h2>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {contactDetails.map((item, index) => (
                            <article key={item.label} className="rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-[0_12px_35px_rgba(32,75,67,0.06)] dark:bg-[#1a2e2b] dark:border-white/10 dark:shadow-none">
                                <div className="mb-8 flex items-center justify-between">
                                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
                                        {item.label}
                                    </span>
                                    <span className="font-mono text-xs text-slate-300 dark:text-slate-600">0{index + 1}</span>
                                </div>
                                {item.href ? (
                                    <a href={item.href} className="text-lg font-semibold text-[#173f3b] underline decoration-emerald-200 underline-offset-4 transition hover:decoration-[#e9827c] dark:text-emerald-200 dark:decoration-emerald-700">
                                        {item.value}
                                    </a>
                                ) : (
                                    <p className="text-lg font-semibold text-[#173f3b] dark:text-emerald-100">{item.value}</p>
                                )}
                                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.detail}</p>
                            </article>
                        ))}
                    </div>
                </div>

                <aside className="h-fit rounded-2xl bg-[#173f3b] p-7 text-white shadow-xl shadow-emerald-950/10 lg:sticky lg:top-8 dark:bg-[#0d2420] dark:border dark:border-white/10 dark:shadow-none">
                    <div className="mb-8 flex items-center justify-between">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#e9827c]" />
                        <span className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-200">Support desk</span>
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight">Need a quick answer?</h2>
                    <p className="mt-3 text-sm leading-6 text-emerald-50/75">Email is best for subscription changes. Call us for same-day delivery questions.</p>
                    <div className="my-7 border-t border-white/15" />
                    <dl className="space-y-5 text-sm">
                        <div><dt className="text-emerald-200">Response time</dt><dd className="mt-1 font-medium">Within 24 hours</dd></div>
                        <div><dt className="text-emerald-200">Service region</dt><dd className="mt-1 font-medium">Noida and nearby sectors</dd></div>
                        <div><dt className="text-emerald-200">Office hours</dt><dd className="mt-1 font-medium">Mon–Sat · 9:00 AM–7:00 PM</dd></div>
                    </dl>
                    <a href="mailto:hello@mealmitra.example" className="mt-8 block rounded-xl bg-white px-5 py-3.5 text-center text-sm font-semibold text-[#173f3b] transition hover:bg-emerald-50">
                        Write to our team
                    </a>
                    <p className="mt-4 text-center text-xs text-emerald-100/55">THE CONTACT DETAILS ARE CURRENTLY DEMO ONLY</p>
                </aside>
            </section>
        </main>
    );
}

export default Contact;