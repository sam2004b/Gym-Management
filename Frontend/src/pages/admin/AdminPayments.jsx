import { useEffect, useState } from "react";

const API = "http://localhost:5136/api";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPayments: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/Payment/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setPayments(data);

      const totalRevenue = data.reduce(
        (sum, p) => sum + p.amount,
        0
      );

      const completed = data.filter(
        (p) => p.status.toLowerCase() === "completed"
      ).length;

      setStats({
        totalRevenue,
        totalPayments: data.length,
        completed,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const downloadReceipt = (p) => {
    const content = `
Receipt
-------------------------
Name: ${p.userName}
Amount: $${p.amount}
Plan: ${p.plan}
Method: ${p.method}
Status: ${p.status}
Date: ${new Date(p.createdAt).toLocaleDateString()}
Receipt ID: ${p.stripePaymentIntentId}
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${p.id}.txt`;
    a.click();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Payment Management
        </h1>
        <p className="text-gray-500">
          Track all payments and revenue
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Total Revenue</p>
          <h2 className="text-2xl font-bold">
            ${stats.totalRevenue.toFixed(2)}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Total Payments</p>
          <h2 className="text-2xl font-bold">
            {stats.totalPayments}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Completed</p>
          <h2 className="text-2xl font-bold">
            {stats.completed}
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {payments.map((p) => (
          <div
            key={p.id}
            className="bg-white p-6 rounded-xl shadow flex justify-between items-start"
          >
            <div>
              <p className="font-semibold text-lg">
                {p.userName}
              </p>

              <p className="text-gray-500 text-sm">
                {new Date(p.createdAt).toLocaleDateString()} •{" "}
                {p.stripePaymentIntentId}
              </p>

              <div className="flex gap-20 mt-4 text-sm">
                <div>
                  <p className="text-gray-500">Amount</p>
                  <p className="font-bold text-lg">
                    ${p.amount}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">
                    Payment Method
                  </p>
                  <p>{p.method}</p>
                </div>

                <div>
                  <p className="text-gray-500">Date</p>
                  <p>
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Plan</p>
                  <p className="capitalize">{p.plan}</p>
                </div>
              </div>

              <button
                onClick={() => downloadReceipt(p)}
                className="mt-4 border px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
              >
                ⬇ Download Receipt
              </button>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm ${
                p.status.toLowerCase() === "completed"
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {p.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPayments;