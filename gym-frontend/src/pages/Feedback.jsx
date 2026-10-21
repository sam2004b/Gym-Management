import { useEffect, useState } from "react";
import {
  submitFeedback,
  getMyFeedback,
  getTrainerFeedback,
  deleteFeedback,
  getTrainers,
  getProfile,
} from "../services/api";
import StarRating from "../components/StarRating";

export default function Feedback() {
  const [role, setRole] = useState("Member");
  const [me, setMe] = useState(null);
  const [trainers, setTrainers] = useState([]);

  const [trainerId, setTrainerId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [myFeedback, setMyFeedback] = useState({ loading: true, items: [] });
  const [trainerFeedback, setTrainerFeedbackList] = useState({
    loading: false,
    items: [],
  });

  useEffect(() => {
    (async () => {
      const res = await getProfile();
      const user = res?.data;
      setMe(user);
      setRole(user?.role);

      const t = await getTrainers();
      setTrainers(t.data);

      if (user?.role === "Member") {
        const my = await getMyFeedback();
        setMyFeedback({ loading: false, items: my?.data || [] });
      } else if (user?.role === "Trainer") {
        const tf = await getTrainerFeedback(user.id);
        setTrainerFeedbackList({ loading: false, items: tf?.data || [] });
      }
    })();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = { rating, comment, trainerId };
      const res = await submitFeedback(payload);

      if (res?.data) {
        setRating(5);
        setComment("");
        const my = await getMyFeedback();
        setMyFeedback({ loading: false, items: my?.data || [] });
      }
    } catch (err) {
      console.error("Submit failed", err);
      alert("Error submitting feedback. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    await deleteFeedback(id);
    const my = await getMyFeedback();
    setMyFeedback({ loading: false, items: my?.data || [] });
  };

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-2">Feedback & Reviews</h1>
      <p className="text-gray-600 mb-6">
        Share your experience with trainers.
      </p>

      {role === "Member" && (
        <>
          {/* FORM */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Submit Feedback</h2>
            <form onSubmit={submit} className="space-y-4">
              <select
                className="border p-2 rounded w-full"
                value={trainerId}
                onChange={(e) => setTrainerId(e.target.value)}
                required
              >
                <option value="">Select Trainer</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName}
                  </option>
                ))}
              </select>

              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <StarRating value={rating} onChange={setRating} />
              </div>

              <textarea
                className="border p-2 rounded w-full"
                rows={3}
                placeholder="Write your feedback..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button
                disabled={submitting}
                className="bg-orange-500 text-white px-4 py-2 rounded w-full"
              >
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          </div>

          {/* LIST */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">My Previous Feedback</h2>

            {myFeedback.items.length === 0 && (
              <div className="text-sm text-gray-500">
                You haven’t posted any feedback yet.
              </div>
            )}

            <div className="space-y-4">
              {myFeedback.items.map((f) => (
                <div
                  key={f.id}
                  className="rounded-xl border border-gray-200 p-4 flex items-start justify-between"
                >
                  <div>
                    <div className="font-semibold mb-1 text-orange-500">
                      {"★".repeat(f.rating)}
                    </div>
                    <div className="text-gray-700">{f.comment}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(f.createdAtUtc).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => onDelete(f.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
