import { useEffect, useState } from "react";

function MemberMembership() {

  const [currentPlan, setCurrentPlan] = useState(null);

  const token = localStorage.getItem("token");

  const plans = [
    {
      name: "Monthly",
      type: "monthly",
      price: "$49.99",
      duration: "for 1 month"
    },
    {
      name: "Quarterly",
      type: "quarterly",
      price: "$129.99",
      duration: "for 3 months"
    },
    {
      name: "Yearly",
      type: "yearly",
      price: "$449.99",
      duration: "for 12 months"
    }
  ];

  useEffect(() => {
    fetchMembership();
  }, []);

  async function fetchMembership() {

    try {

      const res = await fetch(
        "http://localhost:5136/api/membership/subscriptions",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      console.log("Membership response:", data);

      if (data && data.length > 0) {
        setCurrentPlan(data[0]);
      } else {
        setCurrentPlan(null);
      }

    } catch (error) {
      console.log("Membership fetch error:", error);
    }

  }

  async function purchasePlan(type) {

    console.log("BUTTON CLICKED:", type);

    try {

      const res = await fetch(
        "http://localhost:5136/api/membership/purchase",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            subscriptionType: type
          })
        }
      );

      console.log("Purchase response status:", res.status);

      if (!res.ok) {

        const text = await res.text();
        console.log("Server error:", text);

        alert("Purchase failed");

        return;

      }

      alert("Membership purchased successfully");

      fetchMembership();

    } catch (error) {

      console.log("Purchase error:", error);

    }

  }

  return (

    <div>

      <h1 className="text-3xl font-bold mb-2">
        Membership Plans
      </h1>

      <p className="text-gray-500 mb-8">
        Choose the perfect plan for your fitness journey
      </p>

      {/* Current Membership */}

      {currentPlan && (

        <div className="border-2 border-orange-500 rounded-xl p-6 mb-10">

          <div className="flex justify-between items-center">

            <div>

              <h2 className="text-xl font-semibold">
                Current Membership
              </h2>

              <p className="text-gray-500 text-sm">
                Your active subscription
              </p>

            </div>

            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              Active
            </span>

          </div>

          <div className="grid grid-cols-3 mt-6">

            <div>

              <p className="text-gray-400 text-sm">
                Plan
              </p>

              <p className="font-semibold capitalize">
                {currentPlan.subscriptionType || "N/A"}
              </p>

            </div>

            <div>

              <p className="text-gray-400 text-sm">
                Valid Until
              </p>

              <p className="font-semibold">
                {currentPlan.validUntil
                  ? new Date(currentPlan.validUntil).toLocaleDateString()
                  : "N/A"}
              </p>

            </div>

            <div>

              <p className="text-gray-400 text-sm">
                Status
              </p>

              <p className="font-semibold text-green-600">
                Active
              </p>

            </div>

          </div>

        </div>

      )}

      {/* Membership Plans */}

      <div className="grid grid-cols-3 gap-6">

        {plans.map((plan) => {

          const isActive =
            currentPlan &&
            currentPlan.subscriptionType === plan.type;

          return (

            <div
              key={plan.type}
              className={`p-6 rounded-xl border bg-white ${
                isActive
                  ? "border-orange-500"
                  : "border-gray-200"
              }`}
            >

              <h3 className="text-xl font-semibold mb-2">
                {plan.name}
              </h3>

              <p className="text-3xl font-bold">
                {plan.price}
              </p>

              <p className="text-gray-500 mb-4">
                {plan.duration}
              </p>

              <ul className="text-sm text-gray-600 mb-6 space-y-1">

                <li>✔ Unlimited gym access</li>
                <li>✔ All classes included</li>
                <li>✔ Personal workout plans</li>
                <li>✔ Progress tracking</li>

              </ul>

              {isActive ? (

                <button className="w-full bg-gray-300 py-2 rounded-lg">
                  Current Plan
                </button>

              ) : (

                <button
                  onClick={() => purchasePlan(plan.type)}
                  className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
                >
                  Purchase Plan
                </button>

              )}

            </div>

          );

        })}

      </div>

    </div>

  );

}

export default MemberMembership;