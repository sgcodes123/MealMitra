import { useEffect, useState } from "react";
import api from "../services/api";
import Spinner from "../components/Spinner";

const emptyPlan = { title: "", description: "", mealType: "Breakfast", duration: "Daily", price: "" };
const orderStatuses = ["Placed", "Preparing", "OutForDelivery", "Delivered", "Cancelled"];

function AdminDashboard() {
    const [orders, setOrders]       = useState([]);
    const [plans, setPlans]         = useState([]);
    const [planForm, setPlanForm]   = useState(emptyPlan);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading]     = useState(true);
    const [saving, setSaving]       = useState(false);
    const [pageError, setPageError] = useState("");

    // Per-row state: { [orderId]: { saving: bool, error: string } }
    const [rowState, setRowState] = useState({});

    const loadOrders = async () => { const r = await api.get("/orders/all"); setOrders(r.data); };
    const loadPlans  = async () => { const r = await api.get("/plans");       setPlans(r.data);  };

    useEffect(() => {
        const init = async () => {
            try { await Promise.all([loadOrders(), loadPlans()]); }
            catch (e) { setPageError(e.response?.data?.message || "Unable to load admin data."); }
            finally { setLoading(false); }
        };
        init();
    }, []);

    const updateStatus = async (id, orderStatus) => {
        setRowState((cur) => ({ ...cur, [id]: { saving: true, error: "" } }));
        try {
            await api.put(`/orders/${id}`, { orderStatus });
            setOrders((cur) => cur.map((o) => o._id === id ? { ...o, orderStatus } : o));
            setRowState((cur) => ({ ...cur, [id]: { saving: false, error: "" } }));
        } catch (e) {
            setRowState((cur) => ({
                ...cur,
                [id]: { saving: false, error: e.response?.data?.message || "Update failed." },
            }));
        }
    };

    const handlePlanChange = (e) => {
        const { name, value } = e.target;
        setPlanForm((cur) => ({ ...cur, [name]: value }));
    };

    const submitPlan = async (e) => {
        e.preventDefault();
        try {
            setSaving(true); setPageError("");
            const payload = { ...planForm, price: Number(planForm.price) };
            if (editingId) { await api.put(`/plans/${editingId}`, payload); }
            else           { await api.post("/plans", payload); }
            await loadPlans();
            setPlanForm(emptyPlan); setEditingId(null);
        } catch (e) { setPageError(e.response?.data?.message || "Unable to save the plan."); }
        finally { setSaving(false); }
    };

    const editPlan = (plan) => {
        setEditingId(plan._id);
        setPlanForm({ title: plan.title, description: plan.description, mealType: plan.mealType, duration: plan.duration, price: String(plan.price) });
        document.getElementById("plan-form")?.scrollIntoView({ behavior: "smooth" });
    };

    const cancelEdit = () => { setEditingId(null); setPlanForm(emptyPlan); };

    const deletePlan = async (plan) => {
        if (!window.confirm(`Delete "${plan.title}"? Existing order records will be kept.`)) return;
        try {
            setPageError("");
            await api.delete(`/plans/${plan._id}`);
            setPlans((cur) => cur.filter((item) => item._id !== plan._id));
            if (editingId === plan._id) cancelEdit();
        } catch (e) { setPageError(e.response?.data?.message || "Unable to delete the plan."); }
    };

    const inputClass = "w-full rounded-xl border border-slate-200 bg-[#f8faf9] px-4 py-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 dark:bg-[#0f1a18] dark:border-white/10 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-500";

    if (loading) return <Spinner />;

    return (
        <main className="min-h-screen bg-[#f5f7f2] px-4 py-10 text-slate-900 sm:px-6 lg:px-8 dark:bg-[#0f1a18] dark:text-slate-100">
            <div className="mx-auto max-w-7xl space-y-10">

                {/* Header */}
                <header className="rounded-2xl bg-[#173f35] p-7 text-white sm:p-9 dark:bg-[#0d2420] dark:border dark:border-white/10">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">Administration</p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Orders and meal plans</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/75">Manage the menu, review subscriptions, and keep every order moving.</p>
                </header>

                {pageError && (
                    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-700/40 dark:text-red-400">
                        {pageError}
                    </div>
                )}

                {/* Stats */}
                <section className="grid gap-4 sm:grid-cols-3">
                    {[
                        { label: "Total orders",    value: orders.length,                                                                   color: "" },
                        { label: "Active orders",   value: orders.filter((o) => !["Delivered","Cancelled"].includes(o.orderStatus)).length, color: "text-emerald-700 dark:text-emerald-400" },
                        { label: "Published plans", value: plans.length,                                                                    color: "" },
                    ].map((stat) => (
                        <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-[#1a2e2b] dark:border-white/10 dark:shadow-none">
                            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                            <p className={`mt-2 text-3xl font-semibold ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </section>

                {/* Orders table */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:bg-[#1a2e2b] dark:border-white/10 dark:shadow-none">
                    <div className="sticky top-0 z-10 border-b border-slate-200 px-6 py-5 bg-white dark:bg-[#1a2e2b] dark:border-white/10">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">Current menu</p>
                        <h2 className="mt-1 text-xl font-semibold dark:text-emerald-100">Published plans</h2>
                    </div>
                    <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                        <table className="w-full min-w-[760px] text-left">
                            <thead className="sticky top-0 bg-[#eef3ed] text-xs font-semibold uppercase tracking-wider text-slate-600 dark:bg-[#0d2420] dark:text-slate-400">

                                <tr>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Plan</th>
                                    <th className="px-6 py-4">Duration</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-white/10">
                                {orders.map((order) => {
                                    const row = rowState[order._id] || { saving: false, error: "" };
                                    return (
                                        <tr key={order._id} className="dark:hover:bg-white/5">
                                            <td className="px-6 py-4">
                                                <p className="font-medium dark:text-slate-200">{order.userId?.name || "Unknown user"}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{order.userId?.email}</p>
                                            </td>
                                            <td className="px-6 py-4 dark:text-slate-300">{order.planId?.title || "Deleted plan"}</td>
                                            <td className="px-6 py-4 dark:text-slate-300">{order.planId?.duration || "—"}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            value={order.orderStatus}
                                                            disabled={row.saving}
                                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 disabled:opacity-50 dark:bg-[#0f1a18] dark:border-white/10 dark:text-slate-200"
                                                        >
                                                            {orderStatuses.map((s) => (
                                                                <option key={s} value={s}>{s === "OutForDelivery" ? "Out for delivery" : s}</option>
                                                            ))}
                                                        </select>
                                                        {row.saving && (
                                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-700/20 border-t-emerald-700" />
                                                        )}
                                                    </div>
                                                    {row.error && (
                                                        <p className="text-xs text-red-600 dark:text-red-400">{row.error}</p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {!orders.length && (
                                    <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">No orders found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Published plans */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:bg-[#1a2e2b] dark:border-white/10 dark:shadow-none">
                    <div className="border-b border-slate-200 px-6 py-5 dark:border-white/10">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">Current menu</p>
                        <h2 className="mt-1 text-xl font-semibold dark:text-emerald-100">Published plans</h2>
                    </div>
                   <div className="divide-y dark:divide-white/10 max-h-[480px] overflow-y-auto">
                        {plans.map((plan) => (
                            <article key={plan._id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="font-semibold dark:text-slate-200">{plan.title}</h3>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{plan.mealType} · {plan.duration} · ₹{plan.price}</p>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{plan.description}</p>
                                </div>
                                <div className="flex shrink-0 gap-2 sm:self-center">
                                    <button type="button" onClick={() => editPlan(plan)}
                                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10">
                                        Edit
                                    </button>
                                    <button type="button" onClick={() => deletePlan(plan)}
                                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-700/40 dark:text-red-400 dark:hover:bg-red-900/20">
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                        {!plans.length && (
                            <p className="p-8 text-center text-slate-500 dark:text-slate-400">No plans have been created yet.</p>
                        )}
                    </div>
                </section>

                {/* Add / Edit plan form */}
                <section>
                    <div className="mb-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">Menu editor</p>
                        <h2 className="mt-1 text-xl font-semibold dark:text-emerald-100">{editingId ? "Edit plan" : "Add a new plan"}</h2>
                    </div>
                    <form id="plan-form" onSubmit={submitPlan}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:bg-[#1a2e2b] dark:border-white/10 dark:shadow-none">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="title">Plan name</label>
                                <input id="title" name="title" required minLength="2" maxLength="100"
                                    value={planForm.title} onChange={handlePlanChange}
                                    placeholder="e.g. Classic Breakfast" className={inputClass} />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="description">Description</label>
                                <textarea id="description" name="description" required minLength="10" maxLength="500" rows="3"
                                    value={planForm.description} onChange={handlePlanChange}
                                    placeholder="Describe what's included in this plan" className={inputClass} />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="mealType">Meal type</label>
                                <select id="mealType" name="mealType" value={planForm.mealType} onChange={handlePlanChange} className={inputClass}>
                                    <option>Breakfast</option><option>Lunch</option><option>Dinner</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="duration">Duration</label>
                                <select id="duration" name="duration" value={planForm.duration} onChange={handlePlanChange} className={inputClass}>
                                    <option>Daily</option><option>Weekly</option><option>Monthly</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="price">Price (₹)</label>
                                <input id="price" name="price" type="number" required min="1" step="1"
                                    value={planForm.price} onChange={handlePlanChange}
                                    placeholder="In rupees" className={inputClass} />
                            </div>
                            <div className="flex items-end gap-3">
                                <button type="submit" disabled={saving}
                                    className="flex-1 rounded-xl bg-[#173f35] py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60">
                                    {saving ? "Saving..." : editingId ? "Update plan" : "Create plan"}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={cancelEdit}
                                        className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </section>

            </div>
        </main>
    );
}

export default AdminDashboard;