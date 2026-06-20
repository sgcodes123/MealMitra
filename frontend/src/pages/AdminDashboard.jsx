import { useEffect, useState } from "react";
import api from "../services/api";

const emptyPlan = {
    title: "",
    description: "",
    mealType: "Breakfast",
    duration: "Daily",
    price: "",
};

const orderStatuses = ["Placed", "Preparing", "OutForDelivery", "Delivered", "Cancelled"];

function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [plans, setPlans] = useState([]);
    const [planForm, setPlanForm] = useState(emptyPlan);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const loadOrders = async () => {
        const response = await api.get("/orders/all");
        setOrders(response.data);
    };

    const loadPlans = async () => {
        const response = await api.get("/plans");
        setPlans(response.data);
    };

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                await Promise.all([loadOrders(), loadPlans()]);
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Unable to load admin data.");
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, []);

    const updateStatus = async (id, orderStatus) => {
        try {
            setError("");
            await api.put(`/orders/${id}`, { orderStatus });
            setOrders((current) => current.map((order) => order._id === id ? { ...order, orderStatus } : order));
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to update the order.");
        }
    };

    const handlePlanChange = (event) => {
        const { name, value } = event.target;
        setPlanForm((current) => ({ ...current, [name]: value }));
    };

    const submitPlan = async (event) => {
        event.preventDefault();
        try {
            setSaving(true);
            setError("");
            const payload = { ...planForm, price: Number(planForm.price) };
            if (editingId) {
                await api.put(`/plans/${editingId}`, payload);
            } else {
                await api.post("/plans", payload);
            }
            await loadPlans();
            setPlanForm(emptyPlan);
            setEditingId(null);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to save the plan.");
        } finally {
            setSaving(false);
        }
    };

    const editPlan = (plan) => {
        setEditingId(plan._id);
        setPlanForm({
            title: plan.title,
            description: plan.description,
            mealType: plan.mealType,
            duration: plan.duration,
            price: String(plan.price),
        });
        document.getElementById("plan-form")?.scrollIntoView({ behavior: "smooth" });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setPlanForm(emptyPlan);
    };

    const deletePlan = async (plan) => {
        if (!window.confirm(`Delete “${plan.title}”? Existing order records will be kept.`)) return;
        try {
            setError("");
            await api.delete(`/plans/${plan._id}`);
            setPlans((current) => current.filter((item) => item._id !== plan._id));
            if (editingId === plan._id) cancelEdit();
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to delete the plan.");
        }
    };

    if (loading) return <p className="py-16 text-center">Loading admin dashboard...</p>;

    return (
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <header className="mb-8">
                <p className="text-sm font-medium text-green-700">Administration</p>
                <h1 className="mt-1 text-4xl font-bold">MealMitra dashboard</h1>
            </header>

            {error && <div role="alert" className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}

            <section className="mb-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border bg-white p-5"><p className="text-sm text-gray-500">Total orders</p><p className="mt-2 text-3xl font-bold">{orders.length}</p></div>
                <div className="rounded-xl border bg-white p-5"><p className="text-sm text-gray-500">Active orders</p><p className="mt-2 text-3xl font-bold">{orders.filter((order) => !["Delivered", "Cancelled"].includes(order.orderStatus)).length}</p></div>
                <div className="rounded-xl border bg-white p-5"><p className="text-sm text-gray-500">Published plans</p><p className="mt-2 text-3xl font-bold">{plans.length}</p></div>
            </section>

            <section className="mb-12 overflow-hidden rounded-xl border bg-white">
                <div className="border-b px-6 py-4"><h2 className="text-xl font-semibold">Orders</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left">
                        <thead className="bg-gray-50 text-sm text-gray-600"><tr><th className="px-6 py-3">Customer</th><th className="px-6 py-3">Plan</th><th className="px-6 py-3">Duration</th><th className="px-6 py-3">Status</th></tr></thead>
                        <tbody className="divide-y">
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td className="px-6 py-4"><p className="font-medium">{order.userId?.name || "Unknown user"}</p><p className="text-sm text-gray-500">{order.userId?.email}</p></td>
                                    <td className="px-6 py-4">{order.planId?.title || "Deleted plan"}</td>
                                    <td className="px-6 py-4">{order.planId?.duration || "—"}</td>
                                    <td className="px-6 py-4">
                                        <select value={order.orderStatus} onChange={(event) => updateStatus(order._id, event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2">
                                            {orderStatuses.map((status) => <option key={status} value={status}>{status === "OutForDelivery" ? "Out for delivery" : status}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {!orders.length && <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">No orders found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="grid gap-8 lg:grid-cols-[360px_1fr]">
                <form id="plan-form" onSubmit={submitPlan} className="h-fit rounded-xl border bg-white p-6">
                    <h2 className="mb-5 text-xl font-semibold">{editingId ? "Edit plan" : "Add a plan"}</h2>
                    <label className="mb-1 block text-sm font-medium" htmlFor="title">Plan name</label>
                    <input id="title" name="title" required minLength="2" maxLength="100" value={planForm.title} onChange={handlePlanChange} className="mb-4 w-full rounded-lg border p-3" />
                    <label className="mb-1 block text-sm font-medium" htmlFor="description">Description</label>
                    <textarea id="description" name="description" required minLength="10" maxLength="500" rows="4" value={planForm.description} onChange={handlePlanChange} className="mb-4 w-full rounded-lg border p-3" />
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="mb-1 block text-sm font-medium" htmlFor="mealType">Meal</label><select id="mealType" name="mealType" value={planForm.mealType} onChange={handlePlanChange} className="mb-4 w-full rounded-lg border p-3"><option>Breakfast</option><option>Lunch</option><option>Dinner</option></select></div>
                        <div><label className="mb-1 block text-sm font-medium" htmlFor="duration">Duration</label><select id="duration" name="duration" value={planForm.duration} onChange={handlePlanChange} className="mb-4 w-full rounded-lg border p-3"><option>Daily</option><option>Weekly</option><option>Monthly</option></select></div>
                    </div>
                    <label className="mb-1 block text-sm font-medium" htmlFor="price">Price (₹)</label>
                    <input id="price" name="price" type="number" required min="1" step="1" value={planForm.price} onChange={handlePlanChange} className="mb-5 w-full rounded-lg border p-3" />
                    <button disabled={saving} className="w-full rounded-lg bg-green-600 py-3 text-white disabled:opacity-60">{saving ? "Saving..." : editingId ? "Update plan" : "Create plan"}</button>
                    {editingId && <button type="button" onClick={cancelEdit} className="mt-2 w-full rounded-lg border py-3">Cancel</button>}
                </form>

                <div className="overflow-hidden rounded-xl border bg-white">
                    <div className="border-b px-6 py-4"><h2 className="text-xl font-semibold">Plans</h2></div>
                    <div className="divide-y">
                        {plans.map((plan) => (
                            <article key={plan._id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                                <div><h3 className="font-semibold">{plan.title}</h3><p className="mt-1 text-sm text-gray-500">{plan.mealType} · {plan.duration} · ₹{plan.price}</p><p className="mt-2 text-sm text-gray-600">{plan.description}</p></div>
                                <div className="flex shrink-0 gap-2"><button type="button" onClick={() => editPlan(plan)} className="rounded-lg border px-4 py-2">Edit</button><button type="button" onClick={() => deletePlan(plan)} className="rounded-lg border border-red-200 px-4 py-2 text-red-700">Delete</button></div>
                            </article>
                        ))}
                        {!plans.length && <p className="p-8 text-center text-gray-500">No plans have been created.</p>}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default AdminDashboard;
