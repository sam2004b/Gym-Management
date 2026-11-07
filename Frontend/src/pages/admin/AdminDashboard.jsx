import { useEffect, useState } from "react";
import StatCard from "../../components/admin/StatCard";

const API = "http://localhost:5136/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMemberships: 0,
    revenue: 0,
    payments: 0,
  });

  const [recentMemberships, setRecentMemberships] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);

  const [userMap, setUserMap] = useState({}); 

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        usersRes,
        trainersRes,
        membershipRes,
        paymentRes,
      ] = await Promise.all([
        fetch(`${API}/auth/admin/users`, { headers }),
        fetch(`${API}/auth/trainers`, { headers }),
        fetch(`${API}/membership/admin/all`, { headers }),
        fetch(`${API}/Payment/admin/all`, { headers }),
      ]);

      const users = await usersRes.json();
      const trainers = await trainersRes.json();
      const memberships = await membershipRes.json();
      const payments = await paymentRes.json();

    
      const map = {};
      users.forEach((u) => {
        map[u.id] = u.name || u.email;
      });
      setUserMap(map);

     
      const totalMembers = trainers.length;
      const activeMemberships = users.length;

      const totalRevenue = payments.reduce(
        (sum, p) => sum + (p.amount || 0),
        0
      );

      setStats({
        totalMembers,
        activeMemberships,
        revenue: totalRevenue,
        payments: payments.length,
      });


      const sortedMemberships = [...memberships]
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        .slice(0, 5);

      const sortedPayments = [...payments]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setRecentMemberships(sortedMemberships);
      setRecentPayments(sortedPayments);

    } catch (err) {
      console.error("Dashboard API Error:", err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
      <p className="text-gray-500 mb-6">
        Overview of your gym management system
      </p>


      <div className="grid grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Total Trainers"
          value={stats.totalMembers}
          subtitle="Registered trainers"
        />

        <StatCard
          title="Total Members"
          value={stats.activeMemberships}
          subtitle="Registered users"
        />

        <StatCard
          title="Total Revenue"
          value={`$${stats.revenue.toFixed(2)}`}
          subtitle={`From ${stats.payments} payments`}
        />
      </div>


      <div className="grid grid-cols-2 gap-6">
        
  
        <div className="bg-white p-5 rounded-xl border">
          <h2 className="font-semibold mb-4">Recent Memberships</h2>

          {recentMemberships.length === 0 ? (
            <p className="text-gray-400 text-sm">No memberships yet</p>
          ) : (
            recentMemberships.map((m, index) => (
              <div
                key={index}
                className="flex justify-between items-center mt-4"
              >
                <div>
                  <p>
                    {userMap[m.userId] || "User"}
                  </p>

                  <p className="text-xs text-gray-400">
                    {new Date(m.startDate).toLocaleDateString()}
                  </p>
                </div>

                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                  active
                </span>
              </div>
            ))
          )}
        </div>

        <div className="bg-white p-5 rounded-xl border">
          <h2 className="font-semibold mb-4">Recent Payments</h2>

          {recentPayments.length === 0 ? (
            <p className="text-gray-400 text-sm">No payments yet</p>
          ) : (
            recentPayments.map((p, index) => (
              <div
                key={index}
                className="flex justify-between items-center mt-4"
              >
                <div>
                  <p>
                    {userMap[p.userId] || "Membership"}
                  </p>

                  <p className="text-xs text-gray-400">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <p className="font-semibold">
                  ${p.amount || 0}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;