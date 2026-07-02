const STATUS_STEPS = [
    { key: "Placed",         label: "Order Placed",     desc: "We've received your order." },
    { key: "Preparing",      label: "Preparing",        desc: "Your tiffin is being prepared." },
    { key: "OutForDelivery", label: "Out for Delivery", desc: "Your meal is on the way." },
    { key: "Delivered",      label: "Delivered",        desc: "Enjoy your meal!" },
];

export default function OrderTracker({ order }) {
    const currentIndex = STATUS_STEPS.findIndex((s) => s.key === order.orderStatus);

    return (
        <div className="rounded-2xl border border-emerald-900/10 bg-white p-6 dark:bg-[#1a2e2b] dark:border-white/10">
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <p className="mb-1 text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Order</p>
                    <p className="font-semibold text-[#173f3b] dark:text-emerald-100">{order.planId?.title}</p>
                    <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                        {order.planId?.mealType} · {order.planId?.duration}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-[#173f3b] dark:text-emerald-200">₹{order.planId?.price}</p>
                    <PaymentBadge status={order.paymentStatus} />
                </div>
            </div>

            <div className="relative">
               
                <div className="absolute left-[15px] top-4 bottom-4 w-px bg-emerald-900/10 dark:bg-white/10" />

                <div className="space-y-6">
                    {STATUS_STEPS.map((step, i) => {
                        const done = i <= currentIndex;
                        const active = i === currentIndex;

                        return (
                            <div key={step.key} className="relative flex items-start gap-4">
                                <div
                                    className={`z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all
                                        ${done
                                            ? "border-[#173f3b] bg-[#173f3b] dark:border-emerald-500 dark:bg-emerald-600"
                                            : "border-emerald-900/15 bg-white dark:border-white/15 dark:bg-[#1a2e2b]"
                                        }`}
                                >
                                    {done ? (
                                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <div className="h-2 w-2 rounded-full bg-emerald-900/15 dark:bg-white/20" />
                                    )}
                                </div>

                                <div className="pt-1">
                                    <p className={`text-sm font-semibold ${done ? "text-[#173f3b] dark:text-emerald-100" : "text-slate-300 dark:text-slate-600"}`}>
                                        {step.label}
                                        {active && (
                                            <span className="ml-2 rounded-full bg-[#dcefeb] px-2 py-0.5 align-middle text-[10px] font-medium text-[#173f3b] dark:bg-emerald-900/40 dark:text-emerald-300">
                                                Current
                                            </span>
                                        )}
                                    </p>
                                    <p className={`mt-0.5 text-xs ${done ? "text-slate-400 dark:text-slate-400" : "text-slate-300 dark:text-slate-600"}`}>
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <p className="mt-6 text-right text-xs text-slate-300 dark:text-slate-600">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
        </div>
    );
}

function PaymentBadge({ status }) {
    const map = {
        paid:    { label: "Paid",    cls: "bg-[#dcefeb] text-[#173f3b] dark:bg-emerald-900/40 dark:text-emerald-300" },
        pending: { label: "Pending", cls: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
        failed:  { label: "Failed",  cls: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" },
    };
    const style = map[status] || map.pending;
    return (
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${style.cls}`}>
            {style.label}
        </span>
    );
}
