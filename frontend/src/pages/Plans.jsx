import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Spinner from "../components/Spinner";
const durations = ["Daily", "Weekly", "Monthly"];
const meals = [
    { type: "Breakfast", label: "Start your morning" },
    { type: "Lunch",     label: "Power through the afternoon" },
    { type: "Dinner",    label: "End the day well" },
];

function Plans() {
    const [plans, setPlans] = useState([]);
    const [duration, setDuration] = useState("Monthly");
    const [selectedPlans, setSelectedPlans] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const loadPlans = async () => {
            try {
                const response = await api.get("/plans");
                setPlans(response.data);
            } catch (requestError) {
                setError(requestError.response?.data?.message || "We could not load the meal plans.");
            } finally {
                setLoading(false);
            }
        };
        loadPlans();
    }, []);

    const visiblePlans = useMemo(() => plans.filter((p) => p.duration === duration), [plans, duration]);
    const selected = Object.values(selectedPlans);
    const total = selected.reduce((sum, p) => sum + Number(p.price), 0);

    const changeDuration = (next) => { setDuration(next); setSelectedPlans({}); setError(""); };

    const togglePlan = (plan) => {
        setSelectedPlans((cur) => {
            if (cur[plan.mealType]?._id === plan._id) {
                const next = { ...cur }; delete next[plan.mealType]; return next;
            }
            return { ...cur, [plan.mealType]: plan };
        });
    };

    const placeOrders = async () => {
        if (!selected.length) { setError("Select at least one meal plan before continuing."); return; }
        if (!localStorage.getItem("token")) { navigate("/login", { state: { from: "/plans" } }); return; }
        try {
            setSubmitting(true); setError("");
            for (const plan of selected) await api.post("/orders", { planId: plan._id });
            navigate("/dashboard", { state: { orderCreated: true, orderCount: selected.length } });
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Your order could not be completed.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <main className="min-h-screen bg-[#f1f8f5] text-slate-800 dark:bg-[#0f1a18] dark:text-slate-100">

            {/* Hero */}
            <section className="relative overflow-hidden border-b border-emerald-900/10 bg-[#dcefeb] px-5 py-16 sm:px-8 sm:py-20 dark:bg-[#0d2420] dark:border-white/10">
                <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full border-[44px] border-white/45 dark:border-white/10" />
                <div className="absolute bottom-8 right-[18%] h-3 w-20 rounded-full bg-[#e9827c] opacity-80" />
                <div className="relative mx-auto max-w-6xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800 dark:text-emerald-400">Build your subscription</p>
                    <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[#173f3b] sm:text-5xl dark:text-emerald-100">
                        Good food, on your schedule.
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                        Choose a duration, then add breakfast, lunch, dinner — or any combination you actually need.
                    </p>
                    <div className="mt-8 inline-flex rounded-xl border border-emerald-900/10 bg-white/70 p-1 backdrop-blur-sm dark:bg-white/10 dark:border-white/10">
                        {durations.map((item) => (
                            <button key={item} type="button" onClick={() => changeDuration(item)}
                                className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${duration === item ? "bg-[#173f3b] text-white shadow-sm" : "text-slate-600 hover:bg-emerald-50 dark:text-slate-300 dark:hover:bg-white/10"}`}>
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main */}
            <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_320px] lg:py-16">
                <div>
                    {error && (
                        <div role="alert" className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-700/40 dark:text-red-400">
                            {error}
                        </div>
                    )}
                    <div className="space-y-10">
                        {meals.map((meal) => {
                            const mealPlans = visiblePlans.filter((p) => p.mealType === meal.type);
                            return (
                                <div key={meal.type}>
                                    <div className="mb-5 flex items-end justify-between border-b border-emerald-900/15 pb-4 dark:border-white/10">
                                        <div>
                                            <h2 className="text-2xl font-semibold text-[#173f3b] dark:text-emerald-100">{meal.type}</h2>
                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{meal.label}</p>
                                        </div>
                                        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Select one</span>
                                    </div>

                                    {mealPlans.length ? (
                                        <div className="grid gap-4 md:grid-cols-2">
                                            {mealPlans.map((plan) => {
                                                const isSelected = selectedPlans[meal.type]?._id === plan._id;
                                                return (
                                                    <button key={plan._id} type="button" aria-pressed={isSelected} onClick={() => togglePlan(plan)}
                                                        className={`group rounded-2xl border p-5 text-left transition ${
                                                            isSelected
                                                                ? "border-emerald-700 bg-emerald-50 ring-1 ring-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-500 dark:ring-emerald-500"
                                                                : "border-emerald-900/10 bg-white shadow-[0_12px_35px_rgba(32,75,67,0.06)] hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:bg-[#1a2e2b] dark:border-white/10 dark:hover:border-emerald-600 dark:shadow-none"
                                                        }`}>
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div>
                                                                <h3 className="text-lg font-semibold text-[#173f3b] dark:text-emerald-100">{plan.title}</h3>
                                                                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{plan.description}</p>
                                                            </div>
                                                            <span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${isSelected ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-300 dark:border-white/20"}`}>
                                                                {isSelected ? "✓" : ""}
                                                            </span>
                                                        </div>
                                                        <div className="mt-5 flex items-end justify-between border-t border-emerald-900/10 pt-4 dark:border-white/10">
                                                            <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{duration}</span>
                                                            <span className="text-xl font-semibold text-[#173f3b] dark:text-emerald-200">₹{plan.price}</span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-emerald-900/15 bg-white/60 p-7 text-sm text-slate-500 dark:bg-white/5 dark:border-white/10 dark:text-slate-400">
                                            No {duration.toLowerCase()} {meal.type.toLowerCase()} plans available yet.
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Aside */}
                <aside className="h-fit rounded-2xl bg-[#173f3b] p-7 text-white shadow-xl shadow-emerald-950/10 lg:sticky lg:top-8 dark:bg-[#0d2420] dark:border dark:border-white/10 dark:shadow-none">
                    <div className="mb-8 flex items-center justify-between">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#e9827c]" />
                        <span className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-200">Your selection</span>
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight">{duration} plan</h2>
                    <p className="mt-3 text-sm leading-6 text-emerald-50/75">Select from the meal sections on the left.</p>
                    <div className="my-7 border-t border-white/15" />
                    <dl className="space-y-5 text-sm">
                        {meals.map((meal) => {
                            const plan = selectedPlans[meal.type];
                            return (
                                <div key={meal.type} className="flex items-start justify-between gap-4">
                                    <div>
                                        <dt className="text-emerald-200">{meal.type}</dt>
                                        <dd className="mt-1 font-medium">{plan?.title || "Not selected"}</dd>
                                    </div>
                                    <span className="mt-1 shrink-0 font-medium">{plan ? `₹${plan.price}` : "—"}</span>
                                </div>
                            );
                        })}
                    </dl>
                    <div className="my-7 border-t border-white/15" />
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-emerald-200">Total</span>
                        <span className="text-2xl font-semibold">₹{total}</span>
                    </div>
                    <button type="button" disabled={submitting || !selected.length} onClick={placeOrders}
                        className="mt-8 w-full rounded-xl bg-white px-5 py-3.5 text-center text-sm font-semibold text-[#173f3b] transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50">
                        {submitting ? "Creating orders..." : `Continue with ${selected.length || 0} meal${selected.length === 1 ? "" : "s"}`}
                    </button>
                    <p className="mt-4 text-center text-xs text-emerald-100/55">You can add more meals after signing in</p>
                </aside>
            </section>
        </main>
    );
}

export default Plans;