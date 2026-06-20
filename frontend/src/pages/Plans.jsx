import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const mealTypes = ["Breakfast", "Lunch", "Dinner"];

function Plans() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [orderingId, setOrderingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await api.get("/plans");
                setPlans(response.data);
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Unable to load meal plans.");
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handleSubscription = async (planId) => {
        if (!localStorage.getItem("token")) {
            navigate("/login", { state: { from: "/plans" } });
            return;
        }

        try {
            setOrderingId(planId);
            setError("");
            await api.post("/orders", { planId });
            navigate("/dashboard", { state: { orderCreated: true } });
        } catch (requestError) {
            setError(requestError.response?.data?.message || "The order could not be placed.");
        } finally {
            setOrderingId(null);
        }
    };

    if (loading) return <p className="py-16 text-center">Loading meal plans...</p>;

    return (
        <div className="mx-auto max-w-6xl px-6 py-12">
            <h1 className="mb-3 text-center text-4xl font-bold">Meal Plans</h1>
            <p className="mb-10 text-center text-gray-600">Choose a meal and subscription duration that fits your routine.</p>

            {error && <div role="alert" className="mb-8 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}

            {mealTypes.map((mealType) => {
                const matchingPlans = plans.filter((plan) => plan.mealType === mealType);
                return (
                    <section key={mealType} className="mb-12">
                        <h2 className="mb-6 text-3xl font-semibold">{mealType} Plans</h2>
                        {matchingPlans.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-gray-300 p-6 text-gray-500">No {mealType.toLowerCase()} plans are available yet.</p>
                        ) : (
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {matchingPlans.map((plan) => (
                                    <article key={plan._id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                        <h3 className="mb-3 text-2xl font-bold">{plan.title}</h3>
                                        <p className="mb-4 min-h-12 text-gray-600">{plan.description}</p>
                                        <p className="mb-4 text-sm font-medium text-gray-600">{plan.duration} subscription</p>
                                        <p className="mb-5 text-3xl font-bold text-green-600">₹{plan.price}</p>
                                        <button
                                            type="button"
                                            disabled={orderingId !== null}
                                            onClick={() => handleSubscription(plan._id)}
                                            className="w-full rounded-lg bg-green-600 py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {orderingId === plan._id ? "Placing order..." : `Choose ${plan.duration}`}
                                        </button>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                );
            })}
        </div>
    );
}

export default Plans;
