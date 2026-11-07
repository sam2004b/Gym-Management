import { Outlet } from "react-router-dom";
import MemberSidebar from "../components/Member/MemberSidebar";

function MemberLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <MemberSidebar />

      {/* Page Content */}
      <div className="flex-1 p-10">
        <Outlet />
      </div>

    </div>
  );
}

export default MemberLayout;