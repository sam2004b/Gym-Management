import { useEffect, useMemo, useState } from "react";
import { getWorkoutPlans, getExercises } from "../services/api";

function PlanCard({ plan, expanded, onToggle, exercises }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left px-6 py-5 hover:bg-gray-50 flex items-center justify-between"
      >
        <div>
          <h3 className="text-xl font-semibold">{plan.title}</h3>
          {plan.description && (
            <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
          )}
        </div>
        <span className="text-gray-400">{expanded ? "▴" : "▾"}</span>
      </button>

      {expanded && (
        <div className="px-6 pb-6">
          <h4 className="font-semibold mb-3">Exercises</h4>

          {exercises.loading && (
            <div className="text-sm text-gray-500">Loading exercises…</div>
          )}

          {!exercises.loading && exercises.items.length === 0 && (
            <div className="text-sm text-gray-500">
              No exercises in this plan yet.
            </div>
          )}

          <div className="space-y-4">
            {exercises.items.map((ex, idx) => (
              <div
                key={ex.id || idx}
                className="rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold">
                    {idx + 1}. {ex.name}
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="bg-gray-100 rounded-lg px-3 py-1">
                      <div className="uppercase text-[10px] tracking-wider text-gray-500">
                        Sets
                      </div>
                      <div className="text-center font-medium">{ex.sets}</div>
                    </div>
                    <div className="bg-gray-100 rounded-lg px-3 py-1">
                      <div className="uppercase text-[10px] tracking-wider text-gray-500">
                        Reps
                      </div>
                      <div className="text-center font-medium">{ex.reps}</div>
                    </div>
                  </div>
                </div>
                {ex.note && (
                  <div className="text-sm text-gray-600 mt-2">{ex.note}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Workout() {
  const [plans, setPlans] = useState({ loading: true, items: [] });
  const [expanded, setExpanded] = useState(new Set());
  const [exerciseCache, setExerciseCache] = useState({});

  const togglePlan = async (planId) => {
    const copy = new Set(expanded);
    if (copy.has(planId)) {
      copy.delete(planId);
      setExpanded(copy);
      return;
    }
    copy.add(planId);
    setExpanded(copy);

    if (!exerciseCache[planId]) {
      setExerciseCache((prev) => ({
        ...prev,
        [planId]: { loading: true, items: [] },
      }));
      try {
        const res = await getExercises(planId);
        setExerciseCache((prev) => ({
          ...prev,
          [planId]: { loading: false, items: res.data || [] },
        }));
      } catch (e) {
        setExerciseCache((prev) => ({
          ...prev,
          [planId]: { loading: false, items: [] },
        }));
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getWorkoutPlans(1, 20);
        const items = res?.data?.items ?? [];
        if (mounted) setPlans({ loading: false, items });
      } catch (e) {
        if (mounted) setPlans({ loading: false, items: [] });
      }
    })();
    return () => (mounted = false);
  }, []);

  const hasPlans = useMemo(() => plans.items.length > 0, [plans.items]);

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-2">My Workout Plans</h1>
      <p className="text-gray-600 mb-6">
        Personalized workout plans assigned by your trainer.
      </p>

      {plans.loading && (
        <div className="text-sm text-gray-500">Loading plans…</div>
      )}

      {!plans.loading && !hasPlans && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600">
          No workout plans available yet. Please check back later.
        </div>
      )}

      {!plans.loading &&
        hasPlans &&
        plans.items.map((p) => (
          <PlanCard
            key={p.id}
            plan={p}
            expanded={expanded.has(p.id)}
            onToggle={() => togglePlan(p.id)}
            exercises={exerciseCache[p.id] || { loading: false, items: [] }}
          />
        ))}
    </div>
  );
}
