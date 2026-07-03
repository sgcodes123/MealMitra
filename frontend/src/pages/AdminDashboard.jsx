import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Spinner from "../components/Spinner";

const emptyPlan = {
    title: "",
    description: "",
    mealType: "Breakfast",
    duration: "Daily",
    price: "",
};

const orderStatuses = [
    "Placed",
    "Preparing",
    "OutForDelivery",
    "Delivered",
    "Cancelled",
];

const completedStatuses = ["Delivered", "Cancelled"];

function formatStatus(status) {
    return status === "OutForDelivery" ? "Out for delivery" : status;
}

function orderMatchesSearch(order, search) {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return [
        order.userId?.name,
        order.userId?.email,
        order.planId?.title,
        order.planId?.mealType,
        order.planId?.duration,
        order.orderStatus,
        order.paymentStatus,
    ].some((value) =>
        String(value || "")
            .toLowerCase()
            .includes(query)
    );
}

function planMatchesSearch(plan, search) {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return [
        plan.title,
        plan.description,
        plan.mealType,
        plan.duration,
        plan.price,
    ].some((value) =>
        String(value || "")
            .toLowerCase()
            .includes(query)
    );
}

function SearchIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
        </svg>
    );
}

function PaymentBadge({ status }) {
    const styles = {
        Paid: "bg-emerald-700/10 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300",
        Pending:
            "bg-amber-600/10 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300",
        Failed:
            "bg-red-600/10 text-red-700 dark:bg-red-400/10 dark:text-red-300",
    };

    return (
        <span
            className={`inline-flex h-6 items-center rounded-md px-2 text-[11px] font-medium ${
                styles[status] || styles.Pending
            }`}
        >
            {status || "Pending"}
        </span>
    );
}

function OrderSection({
    title,
    eyebrow,
    description,
    orders,
    search,
    onSearchChange,
    rowState,
    updateStatus,
    emptyMessage,
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-[0_12px_35px_rgba(32,75,67,0.05)] dark:border-white/10 dark:bg-[#1a2e2b] dark:shadow-none">
            <div className="border-b border-emerald-900/10 px-5 py-5 dark:border-white/10 sm:px-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                            {eyebrow}
                        </p>

                        <div className="mt-2 flex items-center gap-3">
                            <h2 className="text-2xl font-semibold tracking-tight text-[#173f3b] dark:text-emerald-100">
                                {title}
                            </h2>

                            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-emerald-900/5 px-2 text-xs font-medium text-emerald-800 dark:bg-white/10 dark:text-emerald-300">
                                {orders.length}
                            </span>
                        </div>

                        <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            {description}
                        </p>
                    </div>

                    <div className="relative w-full lg:max-w-sm">
                        <label className="sr-only">
                            Search {title.toLowerCase()}
                        </label>

                        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400 dark:text-slate-500">
                            <SearchIcon />
                        </span>

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                onSearchChange(event.target.value)
                            }
                            placeholder="Search customer, meal or status..."
                            className="h-11 w-full rounded-xl border border-emerald-900/10 bg-[#f8faf9] py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition-colors duration-200 placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 dark:border-white/10 dark:bg-[#0f1a18] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/10"
                        />
                    </div>
                </div>
            </div>

            <div className="max-h-[430px] overflow-auto">
                <table className="w-full min-w-[900px] text-left">
                    <thead className="sticky top-0 z-10 bg-[#eef3ed] text-xs font-medium uppercase tracking-[0.08em] text-slate-500 dark:bg-[#0d2420] dark:text-slate-400">
                        <tr>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Meal plan</th>
                            <th className="px-6 py-4">Duration</th>
                            <th className="px-6 py-4">Payment</th>
                            <th className="px-6 py-4">Order status</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-emerald-900/[0.07] dark:divide-white/[0.07]">
                        {orders.map((order) => {
                            const row = rowState[order._id] || {
                                saving: false,
                                error: "",
                            };

                            return (
                                <tr
                                    key={order._id}
                                    className="transition-colors duration-150 hover:bg-[#f8faf9] dark:hover:bg-white/[0.035]"
                                >
                                    <td className="px-6 py-5 align-middle">
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                            {order.userId?.name ||
                                                "Unknown customer"}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            {order.userId?.email || "No email"}
                                        </p>
                                    </td>

                                    <td className="px-6 py-5 align-middle">
                                        <p className="text-sm font-medium text-[#173f3b] dark:text-emerald-100">
                                            {order.planId?.title ||
                                                "Deleted plan"}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            {order.planId?.mealType ||
                                                "Unknown meal"}
                                        </p>
                                    </td>

                                    <td className="px-6 py-5 align-middle text-sm text-slate-600 dark:text-slate-300">
                                        {order.planId?.duration || "—"}
                                    </td>

                                    <td className="px-6 py-5 align-middle">
                                        <PaymentBadge
                                            status={order.paymentStatus}
                                        />
                                    </td>

                                    <td className="px-6 py-5 align-middle">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2.5">
                                                <select
                                                    aria-label={`Update status for ${
                                                        order.userId?.name ||
                                                        "customer"
                                                    }`}
                                                    value={order.orderStatus}
                                                    disabled={row.saving}
                                                    onChange={(event) =>
                                                        updateStatus(
                                                            order._id,
                                                            event.target.value
                                                        )
                                                    }
                                                    className="h-10 w-44 rounded-lg border border-emerald-900/15 bg-[#f8faf9] px-3 text-sm text-slate-700 outline-none transition-colors duration-200 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-[#0f1a18] dark:text-slate-200 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/10"
                                                >
                                                    {orderStatuses.map(
                                                        (status) => (
                                                            <option
                                                                key={status}
                                                                value={status}
                                                            >
                                                                {formatStatus(
                                                                    status
                                                                )}
                                                            </option>
                                                        )
                                                    )}
                                                </select>

                                                {row.saving && (
                                                    <span
                                                        className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-900/15 border-t-emerald-700 dark:border-white/15 dark:border-t-emerald-400"
                                                        aria-label="Saving status"
                                                    />
                                                )}
                                            </div>

                                            {row.error && (
                                                <p className="text-xs text-red-600 dark:text-red-400">
                                                    {row.error}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {!orders.length && (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="px-6 py-14 text-center text-sm text-slate-500 dark:text-slate-400"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [plans, setPlans] = useState([]);
    const [planForm, setPlanForm] = useState(emptyPlan);
    const [editingId, setEditingId] = useState(null);

    const [ongoingSearch, setOngoingSearch] = useState("");
    const [completedSearch, setCompletedSearch] = useState("");
    const [planSearch, setPlanSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pageError, setPageError] = useState("");
    const [rowState, setRowState] = useState({});

    const loadOrders = async () => {
        const response = await api.get("/orders/all");
        setOrders(response.data);
    };

    const loadPlans = async () => {
        const response = await api.get("/plans");
        setPlans(response.data);
    };

    useEffect(() => {
        const initialize = async () => {
            try {
                await Promise.all([loadOrders(), loadPlans()]);
            } catch (error) {
                setPageError(
                    error.response?.data?.message ||
                        "Unable to load admin data."
                );
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, []);

    const ongoingOrders = useMemo(
        () =>
            orders.filter(
                (order) =>
                    !completedStatuses.includes(order.orderStatus) &&
                    orderMatchesSearch(order, ongoingSearch)
            ),
        [orders, ongoingSearch]
    );

    const completedOrders = useMemo(
        () =>
            orders.filter(
                (order) =>
                    completedStatuses.includes(order.orderStatus) &&
                    orderMatchesSearch(order, completedSearch)
            ),
        [orders, completedSearch]
    );

    const filteredPlans = useMemo(
        () =>
            plans.filter((plan) =>
                planMatchesSearch(plan, planSearch)
            ),
        [plans, planSearch]
    );

    const totalOngoingOrders = orders.filter(
        (order) => !completedStatuses.includes(order.orderStatus)
    ).length;

    const totalCompletedOrders = orders.filter((order) =>
        completedStatuses.includes(order.orderStatus)
    ).length;

    const updateStatus = async (id, orderStatus) => {
        setRowState((current) => ({
            ...current,
            [id]: { saving: true, error: "" },
        }));

        try {
            await api.put(`/orders/${id}`, { orderStatus });

            setOrders((current) =>
                current.map((order) =>
                    order._id === id
                        ? { ...order, orderStatus }
                        : order
                )
            );

            setRowState((current) => ({
                ...current,
                [id]: { saving: false, error: "" },
            }));
        } catch (error) {
            setRowState((current) => ({
                ...current,
                [id]: {
                    saving: false,
                    error:
                        error.response?.data?.message ||
                        "Update failed.",
                },
            }));
        }
    };

    const handlePlanChange = (event) => {
        const { name, value } = event.target;

        setPlanForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const submitPlan = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setPageError("");

            const payload = {
                ...planForm,
                price: Number(planForm.price),
            };

            if (editingId) {
                await api.put(`/plans/${editingId}`, payload);
            } else {
                await api.post("/plans", payload);
            }

            await loadPlans();
            setPlanForm(emptyPlan);
            setEditingId(null);
        } catch (error) {
            setPageError(
                error.response?.data?.message ||
                    "Unable to save the plan."
            );
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

        document
            .getElementById("plan-form")
            ?.scrollIntoView({ behavior: "smooth" });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setPlanForm(emptyPlan);
    };

    const deletePlan = async (plan) => {
        const confirmed = window.confirm(
            `Delete "${plan.title}"? Existing order records will be kept.`
        );

        if (!confirmed) return;

        try {
            setPageError("");
            await api.delete(`/plans/${plan._id}`);

            setPlans((current) =>
                current.filter((item) => item._id !== plan._id)
            );

            if (editingId === plan._id) {
                cancelEdit();
            }
        } catch (error) {
            setPageError(
                error.response?.data?.message ||
                    "Unable to delete the plan."
            );
        }
    };

    const inputClass =
        "h-11 w-full rounded-xl border border-emerald-900/10 bg-[#f8faf9] px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors duration-200 placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 dark:border-white/10 dark:bg-[#0f1a18] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/10";

    if (loading) return <Spinner />;

    return (
        <main className="min-h-screen bg-[#f1f8f5] text-slate-800 dark:bg-[#0f1a18] dark:text-slate-100">
            <section className="border-b border-emerald-900/10 bg-[#dcefeb] px-5 py-12 dark:border-white/10 dark:bg-[#0d2420] sm:px-8 sm:py-14">
                <div className="mx-auto max-w-7xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-800 dark:text-emerald-400">
                        Administration
                    </p>

                    <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#173f3b] dark:text-emerald-100 sm:text-4xl">
                        Orders and meal plans
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                        Manage the menu, review subscriptions and keep
                        every customer order moving.
                    </p>
                </div>
            </section>

            <div className="mx-auto max-w-7xl space-y-10 px-5 py-10 sm:px-8 sm:py-12">
                {pageError && (
                    <div
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700/40 dark:bg-red-900/20 dark:text-red-400"
                    >
                        {pageError}
                    </div>
                )}

                <section className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            label: "Total orders",
                            value: orders.length,
                        },
                        {
                            label: "Ongoing orders",
                            value: totalOngoingOrders,
                        },
                        {
                            label: "Completed orders",
                            value: totalCompletedOrders,
                        },
                        {
                            label: "Published meal plans",
                            value: plans.length,
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="flex min-h-28 flex-col justify-between rounded-2xl border border-emerald-900/10 bg-white p-5 shadow-[0_12px_35px_rgba(32,75,67,0.04)] transition-colors duration-200 hover:border-emerald-900/20 dark:border-white/10 dark:bg-[#1a2e2b] dark:shadow-none dark:hover:border-white/20"
                        >
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {stat.label}
                            </p>

                            <p className="mt-4 text-2xl font-semibold tracking-tight text-[#173f3b] dark:text-emerald-100">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </section>

                <OrderSection
                    title="Ongoing orders"
                    eyebrow="Active customer orders"
                    description="Orders currently being prepared or delivered."
                    orders={ongoingOrders}
                    search={ongoingSearch}
                    onSearchChange={setOngoingSearch}
                    rowState={rowState}
                    updateStatus={updateStatus}
                    emptyMessage={
                        ongoingSearch
                            ? "No ongoing orders match your search."
                            : "There are no ongoing orders."
                    }
                />

                <OrderSection
                    title="Completed orders"
                    eyebrow="Order history"
                    description="Delivered and cancelled customer orders."
                    orders={completedOrders}
                    search={completedSearch}
                    onSearchChange={setCompletedSearch}
                    rowState={rowState}
                    updateStatus={updateStatus}
                    emptyMessage={
                        completedSearch
                            ? "No completed orders match your search."
                            : "There are no completed orders."
                    }
                />

                <section className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-[0_12px_35px_rgba(32,75,67,0.05)] dark:border-white/10 dark:bg-[#1a2e2b] dark:shadow-none">
                    <div className="border-b border-emerald-900/10 px-5 py-5 dark:border-white/10 sm:px-6">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                                    Current menu
                                </p>

                                <div className="mt-2 flex items-center gap-3">
                                    <h2 className="text-2xl font-semibold tracking-tight text-[#173f3b] dark:text-emerald-100">
                                        Published meal plans
                                    </h2>

                                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-emerald-900/5 px-2 text-xs font-medium text-emerald-800 dark:bg-white/10 dark:text-emerald-300">
                                        {filteredPlans.length}
                                    </span>
                                </div>
                            </div>

                            <div className="relative w-full lg:max-w-sm">
                                <label
                                    htmlFor="plan-search"
                                    className="sr-only"
                                >
                                    Search meal plans
                                </label>

                                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400 dark:text-slate-500">
                                    <SearchIcon />
                                </span>

                                <input
                                    id="plan-search"
                                    type="search"
                                    value={planSearch}
                                    onChange={(event) =>
                                        setPlanSearch(event.target.value)
                                    }
                                    placeholder="Search meal plans..."
                                    className="h-11 w-full rounded-xl border border-emerald-900/10 bg-[#f8faf9] py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition-colors duration-200 placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 dark:border-white/10 dark:bg-[#0f1a18] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="max-h-[480px] divide-y divide-emerald-900/[0.07] overflow-y-auto dark:divide-white/[0.07]">
                        {filteredPlans.map((plan) => (
                            <article
                                key={plan._id}
                                className="flex flex-col gap-5 px-5 py-5 transition-colors duration-150 hover:bg-[#f8faf9] dark:hover:bg-white/[0.035] sm:flex-row sm:items-center sm:justify-between sm:px-6"
                            >
                                <div className="max-w-3xl">
                                    <h3 className="text-base font-medium text-[#173f3b] dark:text-emerald-100">
                                        {plan.title}
                                    </h3>

                                    <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
                                        {plan.mealType} · {plan.duration} · ₹
                                        {plan.price}
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                        {plan.description}
                                    </p>
                                </div>

                                <div className="flex shrink-0 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => editPlan(plan)}
                                        className="h-10 rounded-lg border border-emerald-900/15 bg-white px-4 text-sm font-medium text-[#173f3b] transition-colors duration-150 hover:bg-emerald-50 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:hover:bg-white/5"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => deletePlan(plan)}
                                        className="h-10 rounded-lg border border-red-700/20 bg-transparent px-4 text-sm font-medium text-red-700 transition-colors duration-150 hover:bg-red-50 dark:border-red-400/20 dark:text-red-400 dark:hover:bg-red-900/10"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}

                        {!filteredPlans.length && (
                            <p className="p-12 text-center text-sm text-slate-500 dark:text-slate-400">
                                {planSearch
                                    ? "No meal plans match your search."
                                    : "No meal plans have been created yet."}
                            </p>
                        )}
                    </div>
                </section>

                <section>
                    <div className="mb-5 border-b border-emerald-900/10 pb-4 dark:border-white/10">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                            Menu editor
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#173f3b] dark:text-emerald-100">
                            {editingId
                                ? "Edit meal plan"
                                : "Add a new meal plan"}
                        </h2>
                    </div>

                    <form
                        id="plan-form"
                        onSubmit={submitPlan}
                        className="rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-[0_12px_35px_rgba(32,75,67,0.05)] dark:border-white/10 dark:bg-[#1a2e2b] dark:shadow-none sm:p-8"
                    >
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="title"
                                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                >
                                    Plan name
                                </label>

                                <input
                                    id="title"
                                    name="title"
                                    required
                                    minLength="2"
                                    maxLength="100"
                                    value={planForm.title}
                                    onChange={handlePlanChange}
                                    placeholder="e.g. Classic Breakfast"
                                    className={inputClass}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="description"
                                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                >
                                    Description
                                </label>

                                <textarea
                                    id="description"
                                    name="description"
                                    required
                                    minLength="10"
                                    maxLength="500"
                                    rows="4"
                                    value={planForm.description}
                                    onChange={handlePlanChange}
                                    placeholder="Describe what's included in this plan"
                                    className={`${inputClass} h-auto resize-y py-3`}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="mealType"
                                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                >
                                    Meal type
                                </label>

                                <select
                                    id="mealType"
                                    name="mealType"
                                    value={planForm.mealType}
                                    onChange={handlePlanChange}
                                    className={inputClass}
                                >
                                    <option>Breakfast</option>
                                    <option>Lunch</option>
                                    <option>Dinner</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="duration"
                                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                >
                                    Duration
                                </label>

                                <select
                                    id="duration"
                                    name="duration"
                                    value={planForm.duration}
                                    onChange={handlePlanChange}
                                    className={inputClass}
                                >
                                    <option>Daily</option>
                                    <option>Weekly</option>
                                    <option>Monthly</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="price"
                                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                >
                                    Price (₹)
                                </label>

                                <input
                                    id="price"
                                    name="price"
                                    type="number"
                                    required
                                    min="1"
                                    step="1"
                                    value={planForm.price}
                                    onChange={handlePlanChange}
                                    placeholder="In rupees"
                                    className={inputClass}
                                />
                            </div>

                            <div className="flex items-end gap-3">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="h-11 flex-1 rounded-xl bg-[#173f3b] px-5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#0f2d2a] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingId
                                          ? "Update plan"
                                          : "Create plan"}
                                </button>

                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="h-11 flex-1 rounded-xl border border-emerald-900/15 bg-white px-5 text-sm font-medium text-[#173f3b] transition-colors duration-150 hover:bg-emerald-50 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:hover:bg-white/5"
                                    >
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