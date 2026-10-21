import { useEffect, useState } from "react";
import {
  getAllUsers,
  getAllMemberships,
  getAttendanceSummary,
  getAllPayments,
} from "../services/api";

function StatCard({ title, value, note }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">
      <div className="text-sm text-gray-600 mb-1">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{note}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMemberships: 0,
    totalRevenue: 0,
    totalAttendance: 0,
  });

  const [recentMemberships, setRecentMemberships] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);

  async function loadDashboardData() {
    try {
      // ✅ Fetch users (to count members/trainers)
      const usersRes = await getAllUsers();
      const users = usersRes?.data || [];
      const memberCount = users.filter(
        (u) => u.role === "Member" || u.role === "Trainer"
      ).length;

      // ✅ Fetch memberships
      const membershipRes = await getAllMemberships();
      const allMemberships = membershipRes?.data || [];
      const activeMemberships = allMemberships.filter(
        (m) => m.status === "Active"
      );

      // ✅ Fetch attendance summary
      const attendanceRes = await getAttendanceSummary();
      const totalAttendance = attendanceRes?.data?.totalVisits ?? 0;

      // ✅ Fetch payments (if available)
      let paymentsRes;
      try {
        paymentsRes = await getAllPayments();
      } catch {
        paymentsRes = { data: [] }; // fallback if not implemented yet
      }

      const totalRevenue = paymentsRes.data?.reduce(
        (sum, p) => sum + (p.amount ?? 0),
        0
      );

      // ✅ Update all stats
      setStats({
        totalMembers: memberCount,
        activeMemberships: activeMemberships.length,
        totalRevenue: totalRevenue || 0,
        totalAttendance,
      });

      // ✅ Show recent data
      setRecentMemberships(
        activeMemberships.slice(-3).reverse()
      );
      setRecentPayments(
        (paymentsRes.data || []).slice(-3).reverse()
      );
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  }

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // 🔄 Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 md:p-8">
      {/* ✅ Header */}
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Overview of your gym management system
      </p>

      {/* ✅ Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Members" value={stats.totalMembers} note="Trainers + Members" />
        <StatCard title="Active Memberships" value={stats.activeMemberships} note="Current subscriptions" />
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} note="From all payments" />
        <StatCard title="Total Attendance" value={stats.totalAttendance} note="Total gym visits" />
      </div>

      {/* ✅ Recent Memberships & Payments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* === Recent Memberships === */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Memberships</h2>
          {recentMemberships.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent memberships found.</p>
          ) : (
            recentMemberships.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between border-b py-2 last:border-none"
              >
                <div>
                  <div className="font-medium">{m.memberName || "Unknown"}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(m.startDate).toLocaleDateString()}
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    m.status === "Active" ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {m.status}
                </span>
              </div>
            ))
          )}
        </div>

        {/* === Recent Payments === */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Payments</h2>
          {recentPayments.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent payments found.</p>
          ) : (
            recentPayments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border-b py-2 last:border-none"
              >
                <div>
                  <div className="font-medium">{p.userName || "Unknown"}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(p.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="font-semibold text-gray-800">
                  ${p.amount?.toFixed(2) ?? "0.00"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
