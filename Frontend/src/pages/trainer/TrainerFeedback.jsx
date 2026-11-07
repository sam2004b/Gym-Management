import { useEffect, useState } from "react";
import { apiGet } from "../../services/api";

export default function TrainerFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const data = await apiGet("/Feedback/trainer");
      setFeedbacks(data || []);

      if (data && data.length > 0) {
        const avg =
          data.reduce((sum, f) => sum + f.rating, 0) / data.length;
        setAverage(avg.toFixed(1));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">
        Feedback & Reviews
      </h1>

      <p className="text-gray-500 mb-6">
        See what members are saying about your classes
      </p>

      <div className="bg-white p-6 rounded-2xl mb-6">
        <p className="text-gray-500 mb-2">Overall Rating</p>

        <div className="flex items-center gap-4">
          <h2 className="text-4xl font-bold">{average || "0.0"}</h2>

          <div className="flex text-orange-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>
                {i < Math.round(average) ? "★" : "☆"}
              </span>
            ))}
          </div>
        </div>

        <p className="text-gray-400 text-sm mt-1">
          Based on {feedbacks.length} reviews
        </p>
      </div>

      <div className="space-y-4">
        {feedbacks.map((f) => (
          <div key={f.id} className="bg-white p-5 rounded-2xl">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold">{f.memberName}</p>
                <p className="text-sm text-gray-500">
                  {f.className} • {new Date(f.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-orange-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>
                    {i < f.rating ? "★" : "☆"}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-gray-600">{f.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}