import { Link } from "react-router-dom";

function Home() {
  return (
    <div>

      <section className="max-w-6xl mx-auto px-6 py-20">

        <div className="grid md:grid-cols-2 gap-12 items-center">

          <div>

            <h1 className="text-6xl font-bold text-slate-800 mb-6">
              Healthy Meals Delivered Daily
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              Affordable tiffin subscriptions for students,
              professionals and families.
            </p>

            <div className="flex gap-4">

              <Link
                to="/plans"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                View Plans
              </Link>

              <Link
                to="/signup"
                className="border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50"
              >
                Get Started
              </Link>

            </div>

          </div>

          <div className="bg-green-100 rounded-3xl p-10">

            <h2 className="text-2xl font-bold text-green-700 mb-4">
              Why MealMitra?
            </h2>

            <ul className="space-y-4 text-gray-700">

              <li>🥗 Fresh and healthy meals</li>

              <li>🚚 Daily doorstep delivery</li>

              <li>💰 Affordable subscription plans</li>

              <li>📅 Flexible monthly packages</li>

            </ul>

          </div>

        </div>

      </section>

      <section className="bg-white py-16">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-12">
            Our Services
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-3">
                Breakfast Plans
              </h3>

              <p className="text-gray-600">
                Start your day with healthy breakfast subscriptions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-3">
                Lunch Plans
              </h3>

              <p className="text-gray-600">
                Balanced meals delivered every afternoon.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-3">
                Dinner Plans
              </h3>

              <p className="text-gray-600">
                Nutritious evening meals for a healthy lifestyle.
              </p>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;