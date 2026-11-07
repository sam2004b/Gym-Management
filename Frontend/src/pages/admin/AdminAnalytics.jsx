import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API = "http://localhost:5136/api";

const AdminAnalytics = () => {
  const [stats, setStats] = useState({});
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const token = localStorage.getItem("token");

    const [usersRes, paymentsRes, membershipsRes] = await Promise.all([
      fetch(`${API}/auth/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API}/Payment/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API}/membership/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const users = await usersRes.json();
    const payments = await paymentsRes.json();
    const memberships = await membershipsRes.json();

    const members = users.filter((u) => u.role === "member");

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    const avgRevenue =
      payments.length > 0 ? totalRevenue / payments.length : 0;

    const activeMemberships = memberships.filter(
      (m) => m.isActive
    ).length;

    const now = new Date();
    const currentMonth = now.getMonth();

    const thisMonthUsers = members.filter(
      (u) => new Date(u.createdAt).getMonth() === currentMonth
    ).length;

    const lastMonthUsers = members.filter(
      (u) =>
        new Date(u.createdAt).getMonth() === currentMonth - 1
    ).length;

    const growth =
      lastMonthUsers === 0
        ? 0
        : ((thisMonthUsers - lastMonthUsers) /
            lastMonthUsers) *
          100;

    setStats({
      totalMembers: members.length,
      activeMemberships,
      totalRevenue,
      avgRevenue,
      memberGrowth: growth.toFixed(0),
    });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

    const revenueChart = months.map((m, i) => {
      const total = payments
        .filter((p) => new Date(p.createdAt).getMonth() === i)
        .reduce((sum, p) => sum + p.amount, 0);

      return { name: m, revenue: total };
    });

    setRevenueData(revenueChart);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Analytics & Reports
        </h1>
        <p className="text-gray-500">
          Visualize your gym's performance data
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Total Members</p>
          <h2 className="text-3xl font-bold">
            {stats.totalMembers}
          </h2>
          <p className="text-green-500 text-sm">
            +{stats.memberGrowth}% from last month
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Active Memberships</p>
          <h2 className="text-3xl font-bold">
            {stats.activeMemberships}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Total Revenue</p>
          <h2 className="text-3xl font-bold">
            ${stats.totalRevenue?.toFixed(2)}
          </h2>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <p className="font-semibold">Revenue Trend</p>
        <p className="text-gray-500 text-sm mb-4">
          Monthly revenue over time
        </p>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={revenueData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <p className="font-semibold text-lg mb-2">
          Key Metrics
        </p>
        <p className="text-gray-500 text-sm mb-4">
          Important performance indicators
        </p>

        <div className="grid grid-cols-4 gap-4">
          <div className="border rounded-xl p-4">
            <p className="text-gray-500">Avg. Attendance</p>
            <p className="text-2xl font-bold">2</p>
            <p className="text-sm text-gray-500">
              visits per member
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-gray-500">Retention Rate</p>
            <p className="text-2xl font-bold">92%</p>
            <p className="text-green-500 text-sm">
              +3% from last month
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-gray-500">Avg. Revenue</p>
            <p className="text-2xl font-bold">
              ${stats.avgRevenue?.toFixed(0)}
            </p>
            <p className="text-sm text-gray-500">
              per payment
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-gray-500">Member Growth</p>
            <p className="text-2xl font-bold">
              +{stats.memberGrowth}
            </p>
            <p className="text-green-500 text-sm">
              this month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;