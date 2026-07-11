import { STATUS_STEPS } from "../constants/orderStatus";
export default function OrderTracker({ order, compact = false }) {
    const currentIndex = STATUS_STEPS.findIndex((s) => s.key === order.orderStatus);

    const timeline = (
        <div>
            {STATUS_STEPS.map((step, i) => {
                const done = i <= currentIndex;
                const active = i === currentIndex;
                const isLast = i === STATUS_STEPS.length - 1;

                return (
                    <div key={step.key} className="flex items-stretch gap-4">
                        <div className="flex flex-col items-center">
                            <div
                                className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all
                                    ${done
                                        ? "border-[#173f3b] bg-[#173f3b] dark:border-emerald-500 dark:bg-emerald-600"
                                        : "border-emerald-900/15 bg-white dark:border-white/15 dark:bg-[#1a2e2b]"
                                    }
                                    ${active ? "ring-4 ring-[#173f3b]/10 dark:ring-emerald-500/20" : ""}`}
                            >
                                {done ? (
                                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <div className="h-2 w-2 rounded-full bg-emerald-900/15 dark:bg-white/20" />
                                )}
                            </div>

                            {!isLast && (
                                <div
                                    className={`my-1 w-px flex-1 transition-colors
                                        ${i < currentIndex
                                            ? "bg-[#173f3b] dark:bg-emerald-500"
                                            : "bg-emerald-900/10 dark:bg-white/10"
                                        }`}
                                />
                            )}
                        </div>

                        <div className={isLast ? "pt-1" : "pb-6 pt-1"}>
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
    );

    if (compact) {
        return (
            <div>
                {timeline}
                <p className="mt-5 text-right text-xs text-slate-300 dark:text-slate-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <LastUpdated order={order} />
            </div>
        );
    }

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

            {timeline}

            <p className="mt-6 text-right text-xs text-slate-300 dark:text-slate-600">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
            <LastUpdated order={order} />
        </div>
    );
}

// Shows only when the order has been updated since it was placed (e.g. via a
// live status push), so freshly-placed orders don't show a redundant line.
function LastUpdated({ order }) {
    if (!order.updatedAt || order.updatedAt === order.createdAt) return null;
    return (
        <p className="mt-1 text-right text-[11px] text-slate-300 dark:text-slate-600">
            Last updated {new Date(order.updatedAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
        </p>
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