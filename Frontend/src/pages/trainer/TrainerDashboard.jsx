import { useEffect, useState } from "react";
import { apiGet } from "../../services/api";

export default function TrainerDashboard() {
  const [classes, setClasses] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const classData = await apiGet("/classes/my-classes");
      const feedbackData = await apiGet("/Feedback/trainer");
      const workoutData = await apiGet("/workout/my-workouts");

      setClasses(Array.isArray(classData) ? classData : [classData]);
      setFeedback(feedbackData || []);
      setWorkouts(workoutData || []);
    } catch (err) {
      console.error("Dashboard Error:", err.message);
    }
  };

  const avgRating =
    feedback.length > 0
      ? (
          feedback.reduce((sum, f) => sum + f.rating, 0) /
          feedback.length
        ).toFixed(1)
      : 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">
        Welcome back, Trainer!
      </h1>
      <p className="text-gray-500 mb-6">
        Here's your training overview
      </p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <StatCard title="My Classes" value={classes.length} />
        <StatCard title="Workout Plans" value={workouts.length} />
        <StatCard title="Average Rating" value={avgRating} />
        <StatCard title="Reviews" value={feedback.length} />
      </div>

      {/* Sections */}
      <div className="grid grid-cols-2 gap-6">
        {/* Classes */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">My Classes</h2>

          {classes.length === 0 ? (
            <p className="text-gray-400">No classes found</p>
          ) : (
            classes.map((cls) => (
              <div key={cls.id} className="flex justify-between border-b py-3">
                <div>
                  <p className="font-medium">{cls.className}</p>
                  <p className="text-sm text-gray-500">
                    {cls.day} at {cls.time}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  {cls.capacity} capacity
                </p>
              </div>
            ))
          )}
        </div>

        {/* Feedback */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            Recent Feedback
          </h2>

          {feedback.length === 0 ? (
            <p className="text-gray-400">No feedback yet</p>
          ) : (
            feedback.map((f) => (
              <div key={f.id} className="mb-4">
                <p className="font-medium">{f.className}</p>
                <p className="text-sm text-gray-500 mb-1">
                  {f.message}
                </p>

                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < f.rating ? "⭐" : "☆"}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
}