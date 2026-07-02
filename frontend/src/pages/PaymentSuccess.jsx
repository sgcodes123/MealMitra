import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function PaymentSuccess() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get("/orders/my");
                const found = res.data.find((o) => o._id === orderId);
                setOrder(found);
            } catch {
                // fail silently
            }
        };
        fetchOrder();
    }, [orderId]);

    return (
        <div className="min-h-screen bg-[#f8fbfa] flex items-center justify-center px-4 dark:bg-[#0f1a18]">
            <div className="w-full max-w-md text-center">
                {/* Checkmark */}
                <div className="w-20 h-20 bg-[#dcefeb] rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-emerald-900/40">
                    <svg className="w-10 h-10 text-[#173f3b] dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-[#173f3b] text-2xl font-bold mb-2 dark:text-emerald-100">Payment Successful</h1>
                <p className="text-gray-500 text-sm mb-8 dark:text-slate-400">
                    Your order is confirmed. A confirmation email is on its way.
                </p>

                {order && (
                    <div className="bg-white border border-[#e5ede9] rounded-2xl p-6 text-left mb-6 space-y-3 dark:bg-[#1a2e2b] dark:border-white/10">
                        <Detail label="Plan"       value={order.planId?.title} />
                        <Detail label="Meal Type"  value={order.planId?.mealType} />
                        <Detail label="Duration"   value={order.planId?.duration} />
                        <Detail label="Amount"     value={`₹${order.planId?.price}`} highlight />
                        <Detail label="Payment ID" value={order.razorpayPaymentId} mono />
                        <div className="flex justify-between items-center text-sm pt-1">
                            <span className="text-gray-400 dark:text-slate-500">Order Status</span>
                            <span className="bg-[#dcefeb] text-[#173f3b] px-3 py-0.5 rounded-full text-xs font-semibold dark:bg-emerald-900/40 dark:text-emerald-300">
                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                            </span>
                        </div>
                    </div>
                )}

                <div className="flex gap-3">
                    <Link to="/dashboard" className="flex-1 bg-[#173f3b] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#0f2e2b] transition-colors text-center">
                        Go to Dashboard
                    </Link>
                    <Link to="/plans" className="flex-1 border border-[#173f3b] text-[#173f3b] text-sm font-semibold py-3 rounded-xl hover:bg-[#f0f7f5] transition-colors text-center dark:border-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-900/20">
                        Browse Plans
                    </Link>
                </div>
            </div>
        </div>
    );
}

function Detail({ label, value, highlight, mono }) {
    return (
        <div className="flex justify-between text-sm">
            <span className="text-gray-400 dark:text-slate-500">{label}</span>
            <span className={`font-medium ${highlight ? "text-[#e9827c] text-base font-bold" : "text-[#173f3b] dark:text-slate-200"} ${mono ? "font-mono text-xs" : ""}`}>
                {value || "—"}
            </span>
        </div>
    );
}