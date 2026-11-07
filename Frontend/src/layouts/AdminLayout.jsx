import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import NotificationBell from "../components/NotificationBell";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">

      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex justify-end items-center">
          <NotificationBell />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;