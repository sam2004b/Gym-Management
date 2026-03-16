import { useEffect, useState } from "react";

function MemberDashboard() {

  const [membershipStatus, setMembershipStatus] = useState("None");
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [classesCount, setClassesCount] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMembership();
    fetchAttendance();
    fetchWorkouts();
    fetchClasses();
  }, []);

  async function fetchMembership() {
    try {
      const res = await fetch("http://localhost:5136/api/membership/subscriptions", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (data && data.length > 0) {
        setMembershipStatus("Active");
      } else {
        setMembershipStatus("None");
      }

    } catch (error) {
      console.error("Membership error:", error);
    }
  }

  async function fetchAttendance() {
    try {
      const res = await fetch("http://localhost:5136/api/Attendance/history", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setAttendanceCount(data.length || 0);

    } catch (error) {
      console.error("Attendance error:", error);
    }
  }

  async function fetchWorkouts() {
    try {
      const res = await fetch("http://localhost:5136/api/workout/my-workouts", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setWorkoutCount(data.length || 0);

    } catch (error) {
      console.error("Workout error:", error);
    }
  }

  async function fetchClasses() {
    try {
      const res = await fetch("http://localhost:5136/api/WorkoutSession/my-calendar", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setClassesCount(data.length || 0);

    } catch (error) {
      console.error("Classes error:", error);
    }
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-2">
        Welcome back!
      </h1>

      <p className="text-gray-500 mb-10">
        Here's your fitness overview
      </p>

      <div className="grid grid-cols-4 gap-6">

        <div className="border rounded-xl p-6">
          <p className="text-gray-500 mb-2">Membership Status</p>
          <p className="text-3xl font-bold">{membershipStatus}</p>
        </div>

        <div className="border rounded-xl p-6">
          <p className="text-gray-500 mb-2">Attendance</p>
          <p className="text-3xl font-bold">{attendanceCount}</p>
        </div>

        <div className="border rounded-xl p-6">
          <p className="text-gray-500 mb-2">Workout Plans</p>
          <p className="text-3xl font-bold">{workoutCount}</p>
        </div>

        <div className="border rounded-xl p-6">
          <p className="text-gray-500 mb-2">Available Classes</p>
          <p className="text-3xl font-bold">{classesCount}</p>
        </div>

      </div>

    </div>
  );
}

export default MemberDashboard;