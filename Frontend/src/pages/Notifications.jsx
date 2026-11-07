import { useEffect, useState } from "react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5136/api/Notification",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setNotifications(data || []);
    } catch (error) {
      console.error("Notification Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(
        `http://localhost:5136/api/Notification/${id}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(
        `http://localhost:5136/api/Notification/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
          No notifications found.
        </div>
      ) : (
        <div className="space-y-4">

          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow p-5 border-l-4 ${
                notification.isRead
                  ? "border-gray-300"
                  : "border-orange-500"
              }`}
            >
              <div className="flex justify-between items-start">

                <div>
                  <h3 className="font-semibold text-lg">
                    {notification.title}
                  </h3>

                  <p className="text-gray-600 mt-1">
                    {notification.message}
                  </p>

                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">

                  {!notification.isRead && (
                    <button
                      onClick={() =>
                        markAsRead(notification.id)
                      }
                      className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
                    >
                      Mark Read
                    </button>
                  )}

                  <button
                    onClick={() =>
                      deleteNotification(notification.id)
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default Notifications;