import { useEffect, useState } from "react";
import { getAllUsers, deleteUser, approveUser } from "../services/api";

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Member");
  const [processing, setProcessing] = useState(false);

  // ✅ Load all users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setProcessing(true);
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } finally {
      setProcessing(false);
    }
  };

  // ✅ Approve trainer
  const handleApprove = async (id) => {
    setProcessing(true);
    try {
      await approveUser(id);
      await loadUsers(); // refresh list
      alert("Trainer approved successfully!");
    } catch {
      alert("Error approving trainer.");
    } finally {
      setProcessing(false);
    }
  };

  // ✅ Filter users by tab (Member, Trainer, Admin)
  const filtered = users.filter(
    (u) => u.role?.toLowerCase() === tab.toLowerCase()
  );

  if (loading) return <div className="p-8">Loading users…</div>;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">User Management</h1>
          <p className="text-gray-500">
            Manage members, trainers, and administrators
          </p>
        </div>
        <button
          disabled
          className="bg-orange-600 text-white px-4 py-2 rounded-lg shadow opacity-50 cursor-not-allowed"
        >
          + Add User (coming soon)
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {["Member", "Trainer", "Admin"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full border text-sm font-medium ${
              tab === t
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {t}s ({users.filter((u) => u.role === t).length})
          </button>
        ))}
      </div>

      {/* User Cards */}
      {filtered.length === 0 ? (
        <div className="text-gray-500 text-sm">No {tab}s found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((u) => (
            <div
              key={u.id}
              className="border rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold text-lg">{u.fullName}</div>
                <span
                  className={`text-xs px-3 py-1 rounded-full capitalize ${
                    u.role === "Member"
                      ? "bg-green-100 text-green-700"
                      : u.role === "Trainer"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {u.role}
                </span>
              </div>

              <div className="text-sm text-gray-600">{u.email}</div>
              {u.phoneNumber && (
                <div className="text-sm text-gray-600 mt-1">
                  📞 {u.phoneNumber}
                </div>
              )}
              {u.address && (
                <div className="text-sm text-gray-600 mt-1">🏠 {u.address}</div>
              )}
              <div className="text-sm text-gray-500 mt-1">
                Status:{" "}
                {u.isApproved ? (
                  <span className="text-green-600 font-medium">Approved</span>
                ) : (
                  <span className="text-red-600 font-medium">Pending</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                {!u.isApproved && u.role === "Trainer" ? (
                  <button
                    disabled={processing}
                    onClick={() => handleApprove(u.id)}
                    className="flex-1 border border-green-600 text-green-600 rounded-lg py-1 hover:bg-green-50"
                  >
                    ✅ Approve
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 border rounded-lg py-1 text-gray-400 bg-gray-50 cursor-not-allowed"
                  >
                    Approved
                  </button>
                )}

                <button
                  disabled={processing}
                  onClick={() => handleDelete(u.id)}
                  className="flex-1 border rounded-lg py-1 text-red-600 hover:bg-red-50"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
