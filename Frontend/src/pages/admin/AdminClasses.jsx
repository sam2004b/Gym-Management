import { useEffect, useState } from "react";

const API = "http://localhost:5136/api";

const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    className: "",
    description: "",
    day: "",
    startTime: "",
    capacity: "",
    trainerId: "",
  });

  useEffect(() => {
    fetchClasses();
    fetchTrainers();
  }, []);


  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/classes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setClasses(data);
    } catch (err) {
      console.error(err);
    }
  };


  const fetchTrainers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/auth/trainers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setTrainers(data);
    } catch (err) {
      console.error(err);
    }
  };


  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API}/classes/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          className: form.className,
          description: form.description, 
          day: form.day.toLowerCase(),
          time: form.startTime + ":00",
          capacity: Number(form.capacity),
          trainerId: form.trainerId,
        }),
      });

      setShowModal(false);
      fetchClasses();
    } catch (err) {
      console.error(err);
    }
  };


  const grouped = classes.reduce((acc, c) => {
    const day = c.day || "Other";
    if (!acc[day]) acc[day] = [];
    acc[day].push(c);
    return acc;
  }, {});

  return (
    <div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Class Management</h1>
          <p className="text-gray-500">
            Create and manage gym classes
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 text-white px-5 py-2 rounded-lg font-medium"
        >
          + Create Class
        </button>
      </div>


      {Object.entries(grouped).map(([day, cls]) => (
        <div key={day} className="mb-8">
          <h2 className="text-lg font-semibold mb-4 capitalize">
            {day}
          </h2>

          <div className="grid grid-cols-2 gap-6">
            {cls.map((c, i) => (
              <div
                key={i}
                className="border rounded-xl p-5 bg-white shadow-sm"
              >
                <p className="text-lg font-semibold">
                  {c.className}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  {c.description || "Gym session"}
                </p>

                <p className="text-sm mt-3">
                  🕒 {c.time}
                </p>

              
                <p className="text-sm">
                  👥 {c.bookedCount}/{c.capacity} booked
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  Trainer: {c.trainerName || "Not assigned"}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}


      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white w-[500px] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Create New Class
              </h2>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

        
            <input
              placeholder="Class Name"
              className="w-full border p-3 rounded-lg mb-3"
              onChange={(e) =>
                setForm({ ...form, className: e.target.value })
              }
            />

      
            <textarea
              placeholder="Brief description"
              className="w-full border p-3 rounded-lg mb-3"
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <div className="flex gap-3 mb-3">
              <select
                className="w-1/2 border p-3 rounded-lg"
                onChange={(e) =>
                  setForm({ ...form, day: e.target.value })
                }
              >
                <option>Select day</option>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
              </select>

              <input
                type="number"
                placeholder="Capacity"
                className="w-1/2 border p-3 rounded-lg"
                onChange={(e) =>
                  setForm({ ...form, capacity: e.target.value })
                }
              />
            </div>

            <input
              type="time"
              className="w-full border p-3 rounded-lg mb-3"
              onChange={(e) =>
                setForm({ ...form, startTime: e.target.value })
              }
            />

            <select
              className="w-full border p-3 rounded-lg mb-4"
              onChange={(e) =>
                setForm({ ...form, trainerId: e.target.value })
              }
            >
              <option>Select Trainer</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.fullName}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg"
              >
                Create Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClasses;