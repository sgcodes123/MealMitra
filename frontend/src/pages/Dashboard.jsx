import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import OrderTracker from "../components/OrderTracker";
import api from "../services/api";
import Spinner from "../components/Spinner";
const statusStyles = {
    Delivered:      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    Cancelled:      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    Preparing:      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    OutForDelivery: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    Placed:         "bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300",
};

function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get("/orders/my");
                setOrders(response.data);
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Unable to load your orders.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const activeOrders  = orders.filter((o) => !["Delivered", "Cancelled"].includes(o.orderStatus));
    const orderHistory  = orders.filter((o) =>  ["Delivered", "Cancelled"].includes(o.orderStatus));

    const OrderCard = ({ order }) => (
        <article className="rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-[0_12px_35px_rgba(32,75,67,0.06)] dark:bg-[#1a2e2b] dark:border-white/10 dark:shadow-none">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
                        {order.planId?.mealType || "Meal plan"}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-[#173f3b] dark:text-emerald-100">
                        {order.planId?.title || "Plan unavailable"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {order.planId?.duration || "—"} subscription
                    </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.orderStatus] || statusStyles.Placed}`}>
                    {order.orderStatus === "OutForDelivery" ? "Out for delivery" : order.orderStatus}
                </span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-emerald-900/10 pt-4 text-sm dark:border-white/10">
                <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Price</p>
                    <p className="mt-1 font-semibold dark:text-slate-200">₹{order.planId?.price ?? "—"}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Payment</p>
                    <p className="mt-1 font-semibold dark:text-slate-200">{order.paymentStatus}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Ordered</p>
                    <p className="mt-1 font-semibold dark:text-slate-200">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            {!["Delivered", "Cancelled"].includes(order.orderStatus) && (
                <div className="mt-5 border-t border-emerald-900/10 pt-5 dark:border-white/10">
                    <OrderTracker order={order} />
                </div>
            )}

            {order.paymentStatus === "Pending" && (
                <Link
                    to={`/checkout/${order._id}`}
                    className="mt-4 block w-full rounded-xl bg-[#e9827c] py-2.5 text-center text-sm font-semibold text-white hover:bg-[#d9726c] transition-colors"
                >
                    Complete Payment →
                </Link>
            )}
        </article>
    );
    if (loading) return <Spinner />;
    return (
        <main className="min-h-screen bg-[#f1f8f5] text-slate-800 dark:bg-[#0f1a18] dark:text-slate-100">
            {/* Hero */}
            <section className="relative overflow-hidden border-b border-emerald-900/10 bg-[#dcefeb] px-5 py-16 sm:px-8 sm:py-20 dark:bg-[#0d2420] dark:border-white/10">
                <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full border-[44px] border-white/45 dark:border-white/10" />
                <div className="absolute bottom-8 right-[18%] h-3 w-20 rounded-full bg-[#e9827c] opacity-80" />
                <div className="relative mx-auto max-w-6xl">
                    <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800 dark:text-emerald-400">
                                Your dashboard
                            </p>
                            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[#173f3b] sm:text-5xl dark:text-emerald-100">
                                Welcome back{user?.name ? `, ${user.name}` : ""}.
                            </h1>
                            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                                Follow active subscriptions and revisit your completed orders.
                            </p>
                        </div>
                        <Link to="/plans" className="w-fit rounded-xl bg-[#173f3b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2d2a]">
                            Add another meal
                        </Link>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_360px] lg:py-16">
                <div>
                    {location.state?.orderCreated && (
                        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700/40 dark:text-emerald-300">
                            {location.state.orderCount || 1} meal order{location.state.orderCount === 1 ? " was" : "s were"} placed successfully.
                        </div>
                    )}
                    {error && (
                        <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:border-red-700/40 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {!orders.length ? (
                        <div className="rounded-2xl border border-dashed border-emerald-900/15 bg-white/70 px-6 py-16 text-center dark:bg-white/5 dark:border-white/10">
                            <h2 className="text-2xl font-semibold text-[#173f3b] dark:text-emerald-100">Your table is empty</h2>
                            <p className="mt-2 text-slate-500 dark:text-slate-400">Build your first breakfast, lunch, or dinner subscription.</p>
                            <Link to="/plans" className="mt-6 inline-block rounded-xl bg-[#173f3b] px-5 py-3 text-white hover:bg-[#0f2d2a] transition-colors">
                                Explore meal plans
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {/* Active orders */}
                            <div>
                                <div className="mb-5 flex items-end justify-between border-b border-emerald-900/15 pb-4 dark:border-white/10">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">Active subscriptions</p>
                                        <h2 className="mt-2 text-2xl font-semibold text-[#173f3b] dark:text-emerald-100">Active orders</h2>
                                    </div>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">{activeOrders.length} ongoing</span>
                                </div>
                                {activeOrders.length ? (
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        {activeOrders.map((order) => <OrderCard key={order._id} order={order} />)}
                                    </div>
                                ) : (
                                    <p className="rounded-2xl border border-dashed border-emerald-900/15 bg-white/60 p-7 text-sm text-slate-500 dark:bg-white/5 dark:border-white/10 dark:text-slate-400">
                                        No active orders right now.
                                    </p>
                                )}
                            </div>

                            {/* Order history */}
                            <div>
                                <div className="mb-5 flex items-end justify-between border-b border-emerald-900/15 pb-4 dark:border-white/10">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">Past activity</p>
                                        <h2 className="mt-2 text-2xl font-semibold text-[#173f3b] dark:text-emerald-100">Order history</h2>
                                    </div>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">{orderHistory.length} archived</span>
                                </div>
                                {orderHistory.length ? (
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        {orderHistory.map((order) => <OrderCard key={order._id} order={order} />)}
                                    </div>
                                ) : (
                                    <p className="rounded-2xl border border-dashed border-emerald-900/15 bg-white/60 p-7 text-sm text-slate-500 dark:bg-white/5 dark:border-white/10 dark:text-slate-400">
                                        Completed and cancelled orders will appear here.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <aside className="h-fit rounded-2xl bg-[#173f3b] p-7 text-white shadow-xl shadow-emerald-950/10 lg:sticky lg:top-8 dark:bg-[#0d2420] dark:border dark:border-white/10 dark:shadow-none">
                    <div className="mb-8 flex items-center justify-between">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#e9827c]" />
                        <span className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-200">At a glance</span>
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight">Your orders in numbers</h2>
                    <p className="mt-3 text-sm leading-6 text-emerald-50/75">A quick summary of everything you&apos;ve ordered.</p>
                    <div className="my-7 border-t border-white/15" />
                    <dl className="space-y-5 text-sm">
                        <div><dt className="text-emerald-200">Total orders</dt><dd className="mt-1 font-medium">{orders.length}</dd></div>
                        <div><dt className="text-emerald-200">Active now</dt><dd className="mt-1 font-medium">{activeOrders.length}</dd></div>
                        <div><dt className="text-emerald-200">Completed</dt><dd className="mt-1 font-medium">{orderHistory.filter((o) => o.orderStatus === "Delivered").length}</dd></div>
                    </dl>
                    <Link to="/plans" className="mt-8 block rounded-xl bg-white px-5 py-3.5 text-center text-sm font-semibold text-[#173f3b] transition hover:bg-emerald-50">
                        View Plans
                    </Link>
                    <p className="mt-4 text-center text-xs text-emerald-100/55">Add another meal anytime</p>
                </aside>
            </section>
        </main>
    );
}

export default Dashboard;