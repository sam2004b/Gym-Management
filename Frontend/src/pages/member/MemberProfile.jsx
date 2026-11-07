import { useEffect, useState } from "react";

function MemberProfile() {

  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchAttendance();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("http://localhost:5136/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setProfile(data);

    } catch (err) {
      console.error(err);
    }
  }

  async function fetchAttendance() {
    try {
      const res = await fetch("http://localhost:5136/api/Attendance/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setAttendance(data);

    } catch (err) {
      console.error(err);
    }
  }

  function calculateBMI() {

    if (!weight || !height) return;

    const heightMeters = height / 100;

    const bmiValue = (weight / (heightMeters * heightMeters)).toFixed(2);

    setBmi(bmiValue);
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-2">My Profile</h1>

      <p className="text-gray-500 mb-10">
        Manage your personal information and track your fitness
      </p>

      <div className="grid grid-cols-2 gap-6">

        {/* PERSONAL INFO */}

        <div className="border rounded-xl p-6">

          <h2 className="font-semibold mb-4">Personal Information</h2>

          {profile && (
            <div className="space-y-3">

              <div>
                <p className="text-gray-500">Full Name</p>
                <p className="font-semibold">{profile.fullName}</p>
              </div>

              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-semibold">{profile.email}</p>
              </div>

              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-semibold">{profile.phoneNumber}</p>
              </div>

              <div>
                <p className="text-gray-500">Member Since</p>
                <p className="font-semibold">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>

            </div>
          )}

        </div>

        {/* BMI CALCULATOR */}

        <div className="border rounded-xl p-6">

          <h2 className="font-semibold mb-2">BMI Calculator</h2>

          <p className="text-gray-500 mb-4">
            Calculate your Body Mass Index
          </p>

          <input
            type="number"
            placeholder="Enter weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-3"
          />

          <input
            type="number"
            placeholder="Enter height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-4"
          />

          <button
            onClick={calculateBMI}
            className="w-full bg-orange-500 text-white py-2 rounded-lg"
          >
            Calculate BMI
          </button>

          {bmi && (
            <p className="mt-4 font-semibold text-lg">
              Your BMI: {bmi}
            </p>
          )}

        </div>

      </div>

      <div className="border rounded-xl p-6 mt-6">

        <h2 className="font-semibold mb-2">Attendance History</h2>

        <p className="text-gray-500 mb-4">
          Your gym visit records
        </p>

        {attendance.length === 0 && (
          <p className="text-gray-500">No attendance records yet</p>
        )}

        {attendance.map((item, index) => (
          <div key={index} className="border-b py-3 flex justify-between">

            <div>
              <p>{new Date(item.checkInTime).toLocaleDateString()}</p>
              <p className="text-gray-500">
                Check-in: {new Date(item.checkInTime).toLocaleTimeString()}
              </p>
            </div>

            <div className="text-gray-500">
              Check-out: {item.checkOutTime
                ? new Date(item.checkOutTime).toLocaleTimeString()
                : "Active"}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default MemberProfile;