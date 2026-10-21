import { useEffect, useMemo, useState } from "react";
import {
  getCurrentMembership,
  getAttendanceSummary,
  getClassesCount,
  getWorkoutActiveCount,
  getAttendanceRecent,
  getProfile,
  getAllUsers,
  getAllUserMemberships,
} from "../services/api";

function Card({ title, icon, children }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-600">{title}</div>
        <div className="text-gray-400">{icon}</div>
      </div>
      {children}
    </div>
  );
}

function formatDate(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString(undefined, {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Shared hooks — always top-level
  const [membership, setMembership] = useState(null);
  const [attendance, setAttendance] = useState({ totalVisits: 0, recent: [] });
  const [classesCount, setClassesCount] = useState(0);
  const [workoutsCount, setWorkoutsCount] = useState(0);

  const [adminStats, setAdminStats] = useState({
    totalMembers: 0,
    activeMemberships: 0,
    totalRevenue: 0,
    recentMemberships: [],
    recentPayments: [],
  });

  // 👉 Hook for derived value (safe outside conditional)
  const daysRemaining = useMemo(() => {
    if (!membership?.endDate) return null;
    const diff =
      (new Date(membership.endDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24);
    return Math.floor(diff);
  }, [membership]);

  useEffect(() => {
    (async () => {
      try {
        const userRes = await getProfile();
        const u = userRes.data;
        setUser(u);

        if (u.role === "Admin") {
          const [usersRes, membershipsRes] = await Promise.all([
            getAllUsers(),
            getAllUserMemberships(),
          ]);

          const users = usersRes.data || [];
          const memberships = membershipsRes.data || [];

          const totalMembers = users.length;
          const activeMemberships = memberships.filter(
            (m) => m.status === "Active"
          ).length;
          const totalRevenue = memberships.reduce(
            (sum, m) => sum + (m.price || 0),
            0
          );

          const recentMemberships = memberships
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
            .slice(0, 5);

          const recentPayments = memberships
            .filter((m) => m.price)
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
            .slice(0, 5);

          setAdminStats({
            totalMembers,
            activeMemberships,
            totalRevenue,
            recentMemberships,
            recentPayments,
          });
        } else {
          // Member dashboard data
          const [m, s, c, w, r] = await Promise.allSettled([
            getCurrentMembership(),
            getAttendanceSummary(),
            getClassesCount(),
            getWorkoutActiveCount(),
            getAttendanceRecent(5),
          ]);

          if (m.status === "fulfilled") setMembership(m.value.data);
          if (s.status === "fulfilled") setAttendance(s.value.data);
          if (c.status === "fulfilled") setClassesCount(c.value.data.count ?? 0);
          if (w.status === "fulfilled") setWorkoutsCount(w.value.data.count ?? 0);
          if (r.status === "fulfilled")
            setAttendance((prev) => ({ ...prev, recent: r.value.data || [] }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🟠 Loading state
  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="animate-pulse text-gray-500">Loading dashboard…</div>
      </div>
    );
  }

  // 🟢 Admin Dashboard
  if (user?.role === "Admin") {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <h1 className="text-4xl font-extrabold mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 mb-6">
            Overview of your gym management system
          </p>

          {/* Top grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <Card title="Total Members" icon="👥">
              <div className="text-2xl font-bold">{adminStats.totalMembers}</div>
              <div className="text-gray-500 text-sm">Registered users</div>
            </Card>

            <Card title="Active Memberships" icon="🏅">
              <div className="text-2xl font-bold">
                {adminStats.activeMemberships}
              </div>
              <div className="text-gray-500 text-sm">Current subscriptions</div>
            </Card>

            <Card title="Total Revenue" icon="💰">
              <div className="text-2xl font-bold">
                ${adminStats.totalRevenue.toFixed(2)}
              </div>
              <div className="text-gray-500 text-sm">From memberships</div>
            </Card>
          </div>

          {/* Bottom grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
            {/* Recent Memberships */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="text-lg font-semibold mb-4">
                Recent Memberships
              </div>
              <div className="divide-y">
                {adminStats.recentMemberships.length === 0 && (
                  <div className="text-sm text-gray-500">No data yet.</div>
                )}
                {adminStats.recentMemberships.map((m, i) => (
                  <div key={i} className="py-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{m.userFullName}</div>
                      <div className="text-sm text-gray-500">
                        {formatDate(m.startDate)}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        m.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Payments */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="text-lg font-semibold mb-4">Recent Payments</div>
              <div className="divide-y">
                {adminStats.recentPayments.length === 0 && (
                  <div className="text-sm text-gray-500">No payments yet.</div>
                )}
                {adminStats.recentPayments.map((p, i) => (
                  <div key={i} className="py-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{p.userFullName}</div>
                      <div className="text-sm text-gray-500">
                        {formatDate(p.startDate)}
                      </div>
                    </div>
                    <div className="font-semibold text-gray-800">
                      ${p.price?.toFixed(2) ?? "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🟢 Member Dashboard
   const greetingName = user?.fullName?.split(" ")[0] || "Member";


  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <h1 className="text-4xl font-extrabold mb-2">
          Welcome back, {greetingName}!
        </h1>
        <p className="text-gray-500 mb-6">Here's your fitness overview</p>

        {/* Member Dashboard cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <Card title="Membership Status" icon="🧾">
            <div className="text-2xl font-bold">
              {membership?.status ?? "Inactive"}
            </div>
            <div className="text-gray-500 text-sm">
              {daysRemaining !== null
                ? `${daysRemaining} days remaining`
                : "No active plan"}
            </div>
          </Card>
          <Card title="Attendance" icon="📈">
            <div className="text-2xl font-bold">
              {attendance?.totalVisits ?? 0}
            </div>
            <div className="text-gray-500 text-sm">Total visits</div>
          </Card>
          <Card title="Workout Plans" icon="💪">
            <div className="text-2xl font-bold">{workoutsCount}</div>
            <div className="text-gray-500 text-sm">Active plans</div>
          </Card>
          <Card title="Available Classes" icon="📅">
            <div className="text-2xl font-bold">{classesCount}</div>
            <div className="text-gray-500 text-sm">Classes to book</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
