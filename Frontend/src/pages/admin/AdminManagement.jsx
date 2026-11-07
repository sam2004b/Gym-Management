import { useEffect, useState } from "react";

const API = "http://localhost:5136/api";

const AdminManagement = () => {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("members");
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/auth/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };


  const members = users.filter(
    (u) =>
      u.role?.toLowerCase() === "member" &&
      u.isActive === true
  );

  const trainers = users.filter(
    (u) =>
      u.role?.toLowerCase() === "trainer" &&
      u.isActive === true
  );

  const displayedUsers =
    activeTab === "members" ? members : trainers;


  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Are you sure to delete this user?")) return;

    try {
      await fetch(`${API}/auth/admin/delete-user/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUsers(); 
    } catch (err) {
      console.error("Delete error:", err);
    }
  };


  const handleApprove = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`${API}/auth/admin/approve-trainer/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectedTrainer(null);
      fetchUsers(); 
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">
        User Management
      </h1>

      <p className="text-gray-500 mb-6">
        Manage members and trainers
      </p>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("members")}
          className={`px-4 py-2 rounded-full ${
            activeTab === "members"
              ? "bg-gray-200 font-semibold"
              : "text-gray-500"
          }`}
        >
          Members ({members.length})
        </button>

        <button
          onClick={() => setActiveTab("trainers")}
          className={`px-4 py-2 rounded-full ${
            activeTab === "trainers"
              ? "bg-gray-200 font-semibold"
              : "text-gray-500"
          }`}
        >
          Trainers ({trainers.length})
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {displayedUsers.length === 0 ? (
          <p className="text-gray-400">No users found</p>
        ) : (
          displayedUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white p-5 rounded-xl border"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-lg">
                    {user.fullName}
                  </h2>

                  <p className="text-gray-500 text-sm">
                    {user.email}
                  </p>

                
                  <p className="text-sm mt-2">
                    Status:{" "}
                    {user.role?.toLowerCase() === "trainer"
                      ? user.isApproved
                        ? "Approved"
                        : "Pending"
                      : user.isActive
                      ? "Active"
                      : "Inactive"}
                  </p>

                  <p className="text-sm text-gray-400">
                    Joined:{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>

          
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
                  {user.role}
                </span>
              </div>

            
              {user.role?.toLowerCase() === "trainer" && (
                <div className="flex gap-2 mt-4">
                  {!user.isApproved && (
                    <button
                      onClick={() => setSelectedTrainer(user)}
                      className="flex-1 border rounded-lg py-2"
                    >
                      Approve / Reject
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-3 border rounded-lg text-red-500"
                  >
                    🗑
                  </button>
                </div>
              )}

    
              {user.role?.toLowerCase() === "member" && (
                <div className="mt-4">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-3 border rounded-lg text-red-500"
                  >
                    🗑 Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    
      {selectedTrainer && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-80">
            <h2 className="font-semibold mb-4">
              Manage Trainer
            </h2>

            <p className="mb-4">
              {selectedTrainer.fullName}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  handleApprove(selectedTrainer.id)
                }
                className="flex-1 bg-green-500 text-white py-2 rounded"
              >
                Approve
              </button>

              
              <button
                onClick={() =>
                  handleDelete(selectedTrainer.id)
                }
                className="flex-1 bg-red-500 text-white py-2 rounded"
              >
                Reject
              </button>
            </div>

            <button
              onClick={() => setSelectedTrainer(null)}
              className="mt-4 w-full border py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;