import { useEffect, useState } from "react";

const API = "http://localhost:5136/api";

const AdminMembership = () => {
  const [memberships, setMemberships] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please login again.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [usersRes, membershipRes] = await Promise.all([
        fetch(`${API}/auth/admin/users`, { headers }),
        fetch(`${API}/membership/admin/all`, { headers }),
      ]);

   
      if (usersRes.status === 401 || membershipRes.status === 401) {
        setError("Unauthorized. Please login again.");
        return;
      }

      const users = await usersRes.json();
      const membershipsData = await membershipRes.json();

      console.log("MEMBERSHIPS:", membershipsData);

      
      const map = {};
      users.forEach((u) => {
        map[u.id] = {
          name: u.fullName,
          email: u.email,
        };
      });

      setUserMap(map);
      setMemberships(membershipsData);

    } catch (err) {
      console.error("Membership API Error:", err);
      setError("Failed to load memberships");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">
        Membership Management
      </h1>

      <p className="text-gray-500 mb-6">
        View and manage all gym memberships
      </p>


      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

   
      <div className="space-y-4">
        {memberships.length === 0 ? (
          <p className="text-gray-400">
            No memberships found
          </p>
        ) : (
          memberships.map((m, index) => {
            const user = userMap[m.userId];

            return (
              <div
                key={index}
                className="bg-white p-5 rounded-xl border flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold text-lg">
                    {user?.name || "User"}
                  </h2>

                  <p className="text-gray-500 text-sm">
                    {user?.email || "N/A"}
                  </p>

                  <div className="flex gap-10 mt-4 text-sm">
                    <div>
                      <p className="text-gray-400">Plan</p>
                      <p className="font-medium capitalize">
                        {m.subscriptionType}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400">
                        Start Date
                      </p>
                      <p className="font-medium">
                        {new Date(
                          m.startDate
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400">
                        End Date
                      </p>
                      <p className="font-medium">
                        {new Date(
                          m.expiryDate
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400">Price</p>
                      <p className="font-medium">
                        ${m.price}
                      </p>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    m.isActive
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {m.isActive ? "active" : "expired"}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminMembership;