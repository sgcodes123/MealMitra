import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

const loadRazorpayScript = () =>
    new Promise((resolve) => {
        if (document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`)) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = RAZORPAY_SCRIPT;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

export default function CheckoutPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get("/orders/my");
                const found = res.data.find((o) => o._id === orderId);
                if (!found) throw new Error("Order not found");
                setOrder(found);
            } catch {
                setError("Could not load order details.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    const handlePayment = async () => {
        setPaying(true);
        setError("");

        const loaded = await loadRazorpayScript();
        if (!loaded) {
            setError("Failed to load payment gateway. Check your connection.");
            setPaying(false);
            return;
        }

        try {
            const { data } = await api.post("/payment/create-order", { orderId });

            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "MealMitra",
                description: order.planId.title,
                order_id: data.razorpayOrderId,
                handler: async (response) => {
                    try {
                        await api.post("/payment/verify", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId,
                        });
                        navigate(`/payment-success/${orderId}`);
                    } catch {
                        setError("Payment verification failed. Contact support.");
                    }
                },
                prefill: {
                    name: order.userId?.name || "",
                    email: order.userId?.email || "",
                },
                theme: { color: "#173f3b" },
                modal: {
                    ondismiss: () => setPaying(false),
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", () => {
                setError("Payment failed. Please try again.");
                setPaying(false);
            });
            rzp.open();
        } catch {
            setError("Could not initiate payment. Try again.");
            setPaying(false);
        }
    };

    if (loading)
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f1f8f5] dark:bg-[#0f1a18]">
                <p className="text-sm text-[#173f3b] dark:text-slate-400">Loading order...</p>
            </div>
        );

    if (error && !order)
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f1f8f5] dark:bg-[#0f1a18]">
                <p className="text-red-500 dark:text-red-400">{error}</p>
            </div>
        );

    const plan = order?.planId;

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f1f8f5] px-4 py-16 dark:bg-[#0f1a18]">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-[0_12px_35px_rgba(32,75,67,0.06)] dark:bg-[#1a2e2b] dark:border-white/10 dark:shadow-none">
                {/* Header */}
                <div className="bg-[#173f3b] px-8 py-6 dark:bg-[#0d2420]">
                    <p className="mb-1 text-xs uppercase tracking-widest text-[#dcefeb] dark:text-emerald-300">MealMitra</p>
                    <h1 className="text-2xl font-semibold text-white">Order Summary</h1>
                </div>

                {/* Plan details */}
                <div className="space-y-4 px-8 py-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="mb-1 text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Plan</p>
                            <p className="text-lg font-semibold text-[#173f3b] dark:text-emerald-100">{plan?.title}</p>
                        </div>
                        <span className="rounded-full bg-[#dcefeb] px-3 py-1 text-xs font-medium text-[#173f3b] dark:bg-emerald-900/40 dark:text-emerald-300">
                            {plan?.mealType}
                        </span>
                    </div>

                    <div className="space-y-3 border-t border-emerald-900/10 pt-4 dark:border-white/10">
                        <Row label="Duration" value={plan?.duration} />
                        <Row label="Description" value={plan?.description} />
                    </div>

                    <div className="flex items-center justify-between border-t border-emerald-900/10 pt-4 dark:border-white/10">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total payable</p>
                        <p className="text-2xl font-bold text-[#173f3b] dark:text-emerald-200">₹{plan?.price}</p>
                    </div>
                </div>

                {/* CTA */}
                <div className="px-8 pb-8">
                    {error && (
                        <p className="mb-3 text-center text-sm text-red-500 dark:text-red-400">{error}</p>
                    )}
                    <button
                        onClick={handlePayment}
                        disabled={paying}
                        className="w-full rounded-xl bg-[#e9827c] py-3 font-semibold text-white transition-colors duration-200 hover:bg-[#d9726c] disabled:opacity-60"
                    >
                        {paying ? "Opening payment..." : `Pay ₹${plan?.price}`}
                    </button>
                    <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
                        Secured by Razorpay · UPI · Cards · Net Banking
                    </p>
                </div>
            </div>
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex justify-between text-sm">
            <span className="text-slate-400 dark:text-slate-500">{label}</span>
            <span className="font-medium text-[#173f3b] dark:text-slate-200">{value}</span>
        </div>
    );
}