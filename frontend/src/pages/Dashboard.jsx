import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const location = useLocation();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get("/orders");
                setOrders(response.data);
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Unable to load your orders.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const activeOrders = orders.filter((order) => !["Delivered", "Cancelled"].includes(order.orderStatus));
    const orderHistory = orders.filter((order) => ["Delivered", "Cancelled"].includes(order.orderStatus));

    const renderOrders = (items) => (
        <div className="grid gap-6 md:grid-cols-2">
            {items.map((order) => (
                <article key={order._id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="text-xl font-bold">{order.planId?.title || "Plan unavailable"}</h3>
                    {order.planId && (
                        <p className="mt-1 text-sm text-gray-600">{order.planId.mealType} · {order.planId.duration}</p>
                    )}
                    <p className="mt-4 text-2xl font-bold text-green-600">₹{order.planId?.price ?? "—"}</p>
                    <dl className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between"><dt className="text-gray-500">Order status</dt><dd className="font-semibold">{order.orderStatus}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Payment status</dt><dd className="font-semibold">{order.paymentStatus}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Ordered</dt><dd>{new Date(order.createdAt).toLocaleDateString()}</dd></div>
                    </dl>
                </article>
            ))}
        </div>
    );

    if (loading) return <p className="py-16 text-center">Loading your orders...</p>;

    return (
        <div className="mx-auto max-w-6xl px-6 py-12">
            <h1 className="mb-8 text-4xl font-bold">My Orders</h1>
            {location.state?.orderCreated && <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-700">Your order was placed successfully.</div>}
            {error && <div role="alert" className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}

            {orders.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                    <h2 className="text-2xl font-semibold">No orders yet</h2>
                    <p className="mt-2 text-gray-500">Choose a meal plan to get started.</p>
                    <Link to="/plans" className="mt-5 inline-block rounded-lg bg-green-600 px-5 py-3 text-white">Browse plans</Link>
                </div>
            ) : (
                <div className="space-y-12">
                    <section>
                        <h2 className="mb-5 text-2xl font-semibold">Active orders ({activeOrders.length})</h2>
                        {activeOrders.length ? renderOrders(activeOrders) : <p className="text-gray-500">You have no active orders.</p>}
                    </section>
                    <section>
                        <h2 className="mb-5 text-2xl font-semibold">Order history ({orderHistory.length})</h2>
                        {orderHistory.length ? renderOrders(orderHistory) : <p className="text-gray-500">Completed and cancelled orders will appear here.</p>}
                    </section>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
