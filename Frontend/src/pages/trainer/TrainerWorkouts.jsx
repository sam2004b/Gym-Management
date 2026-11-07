import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../services/api";

export default function TrainerWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    durationInWeeks: 1,
    memberId: "",
    exercises: [
      { exerciseName: "", sets: 0, reps: 0, day: "" }
    ]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const w = await apiGet("/workout/my-workouts");
      const m = await apiGet("/workout/my-members");
      setWorkouts(w || []);
      setMembers(m || []);
    } catch (err) {
      console.error(err);
    }
  };

  function capitalize(word) {
    if (!word) return "";
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  const handleCreate = async () => {
    try {
      const { memberId, ...workoutData } = form;

      const cleanedWorkout = {
        ...workoutData,
        exercises: workoutData.exercises.map(ex => ({
          ...ex,
          day: capitalize(ex.day)
        }))
      };

      const res = await apiPost("/workout/create", cleanedWorkout);

      await apiPost("/workout/assign", {
        workoutPlanId: res.workoutId,
        memberId: memberId
      });

      setShowModal(false);
      fetchData();

    } catch (err) {
      console.error(err);
      alert("Error creating workout");
    }
  };

  const addExercise = () => {
    setForm({
      ...form,
      exercises: [
        ...form.exercises,
        { exerciseName: "", sets: 0, reps: 0, day: "" }
      ]
    });
  };

  const removeExercise = (index) => {
    const updated = [...form.exercises];
    updated.splice(index, 1);
    setForm({ ...form, exercises: updated });
  };

  const updateExercise = (index, field, value) => {
    const updated = [...form.exercises];
    updated[index][field] = value;
    setForm({ ...form, exercises: updated });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Workout Plans</h1>
          <p className="text-gray-500">
            Create and manage personalized workout plans
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 text-white px-5 py-2 rounded-lg"
        >
          + Create Plan
        </button>
      </div>

      <div className="space-y-6">
        {workouts.map((w) => (
          <div key={w.id} className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold">{w.title}</h2>
            <p className="text-gray-500 mb-3">{w.description}</p>

            <p className="text-sm mb-3">
              Duration: {w.durationInWeeks} weeks
            </p>

            <div>
              <p className="font-medium mb-2">
                Exercises ({w.exercises.length})
              </p>

              {w.exercises.map((ex, i) => (
                <div
                  key={i}
                  className="flex justify-between bg-gray-100 p-3 rounded-lg mb-2"
                >
                  <span>{i + 1}. {ex.exerciseName}</span>
                  <span>
                    {ex.sets} sets × {ex.reps} reps
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl w-[600px] max-h-[90vh] overflow-y-auto">

            <h2 className="text-2xl font-bold mb-4">
              Create Workout Plan
            </h2>

            <select
              className="w-full border p-2 rounded mb-4"
              onChange={(e) =>
                setForm({ ...form, memberId: e.target.value })
              }
            >
              <option value="">Select Member</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.fullName}
                </option>
              ))}
            </select>

            <input
              placeholder="Plan Title"
              className="w-full border p-2 rounded mb-3"
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              className="w-full border p-2 rounded mb-3"
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Duration (weeks)"
              className="w-full border p-2 rounded mb-4"
              onChange={(e) =>
                setForm({
                  ...form,
                  durationInWeeks: Number(e.target.value)
                })
              }
            />

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <p className="font-semibold">Exercises</p>
                <button onClick={addExercise}>+ Add</button>
              </div>

              {form.exercises.map((ex, i) => (
                <div key={i} className="border p-3 rounded mb-3">
                  <input
                    placeholder="Exercise Name"
                    className="w-full border p-2 mb-2"
                    onChange={(e) =>
                      updateExercise(i, "exerciseName", e.target.value)
                    }
                  />

                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Sets"
                      className="w-full border p-2"
                      onChange={(e) =>
                        updateExercise(i, "sets", Number(e.target.value))
                      }
                    />

                    <input
                      type="number"
                      placeholder="Reps"
                      className="w-full border p-2"
                      onChange={(e) =>
                        updateExercise(i, "reps", Number(e.target.value))
                      }
                    />
                  </div>

                  <input
                    placeholder="Day"
                    className="w-full border p-2 mt-2"
                    onChange={(e) =>
                      updateExercise(i, "day", e.target.value)
                    }
                  />

                  <button
                    onClick={() => removeExercise(i)}
                    className="text-red-500 mt-2"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3">
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