import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../services/api";

export default function TrainerClasses() {
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    className: "",
    day: "",
    time: "",
    capacity: "",
    description: "",
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await apiGet("/classes/my-classes");
      setClasses(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      const decoded = JSON.parse(atob(token.split(".")[1]));

      const trainerId =
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

      const payload = {
        className: form.className,
        day: form.day,
        time: form.time + ":00",
        capacity: Number(form.capacity),
        description: form.description,
        trainerId: trainerId,
      };

      await apiPost("/classes/create", payload);

      setShowModal(false);
      setForm({
        className: "",
        day: "",
        time: "",
        capacity: "",
        description: "",
      });

      fetchClasses();
    } catch (err) {
      console.error("Create error:", err);
    }
  };

  const grouped = classes.reduce((acc, cls) => {
    if (!acc[cls.day]) acc[cls.day] = [];
    acc[cls.day].push(cls);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Classes</h1>
          <p className="text-gray-500">
            View and manage your class schedule
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600"
        >
          + Create
        </button>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-gray-400">No classes found</p>
      ) : (
        Object.entries(grouped).map(([day, dayClasses]) => (
          <div key={day} className="mb-6">
            <h2 className="font-semibold text-lg mb-3 capitalize">
              {day}
            </h2>

            <div className="grid grid-cols-2 gap-6">
              {dayClasses.map((cls) => (
                <ClassCard key={cls.id} cls={cls} />
              ))}
            </div>
          </div>
        ))
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl w-[400px]">
            <h2 className="text-xl font-semibold mb-4">
              Create Class
            </h2>

            <input
              placeholder="Class Name"
              className="input mb-2"
              value={form.className}
              onChange={(e) =>
                setForm({ ...form, className: e.target.value })
              }
            />

            <input
              placeholder="Day"
              className="input mb-2"
              value={form.day}
              onChange={(e) =>
                setForm({ ...form, day: e.target.value })
              }
            />

            <input
              type="time"
              className="input mb-2"
              value={form.time}
              onChange={(e) =>
                setForm({ ...form, time: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Capacity"
              className="input mb-2"
              value={form.capacity}
              onChange={(e) =>
                setForm({ ...form, capacity: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              className="input mb-2"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="bg-orange-500 text-white px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClassCard({ cls }) {
  const booked = 0;
  const percentage = cls.capacity
    ? (booked / cls.capacity) * 100
    : 0;

  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <h3 className="font-semibold text-lg">{cls.className}</h3>

      <p className="text-sm text-gray-500 mb-2">
        {cls.description}
      </p>

      <p className="text-sm">⏰ {cls.time}</p>
      <p className="text-sm">
        👥 {booked}/{cls.capacity} spots filled
      </p>

      <div className="w-full h-2 bg-gray-200 rounded mt-2">
        <div
          className="h-2 bg-orange-500 rounded"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}