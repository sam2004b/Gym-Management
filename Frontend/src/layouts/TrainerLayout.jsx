import TrainerSidebar from "../components/trainer/TrainerSidebar";
import NotificationBell from "../components/NotificationBell";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../services/api";

export default function TrainerLayout() {
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await getProfile();
      setApproved(profile.isApproved);
    } catch (err) {
      console.error("Profile Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!approved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-lg max-w-lg text-center">
          <h1 className="text-3xl font-bold mb-4 text-orange-500">
            Trainer Approval Pending
          </h1>

          <p className="text-gray-600 mb-2">
            Your trainer account has not been approved by the administrator yet.
          </p>

          <p className="text-gray-600">
            Please wait until your account is approved before accessing trainer
            features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">

      <TrainerSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex justify-end items-center">
          <NotificationBell />
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>

      </div>

    </div>
  );
}