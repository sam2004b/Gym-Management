import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5136/api/Notification/unread-count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) return;

      const data = await res.json();

      setCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Notification Count Error:", error);
    }
  };

  return (
    <Link
      to="notifications"
      className="relative flex items-center justify-center"
    >
      <div className="text-3xl cursor-pointer">
        🔔
      </div>

      {count > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
          {count}
        </span>
      )}
    </Link>
  );
}

export default NotificationBell;