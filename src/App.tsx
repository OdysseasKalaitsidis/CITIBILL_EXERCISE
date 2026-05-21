import { useEffect, useState } from "react";
import type { Activity, ScheduledActivity } from "@/types";
import ActivityList from "@/components/ActivityList";
import DayColumn from "@/components/DayColumn";
import ThemeToggle from "@/components/ThemeToggle";
import SchedulingModal from "@/components/SchedulingModal";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import possibleActivitiesData from "@/data/possibleActivities.json";

export default function App() {
  const [activities] = useState<Activity[]>(possibleActivitiesData as unknown as Activity[]);
  const [scheduled, setScheduled] = useLocalStorage<ScheduledActivity[]>("trip-schedule", []);
  const [activeDay, setActiveDay] = useState<1 | 2 | 3>(1);
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleUpdateItem = (activityId: string, updated: ScheduledActivity) => {
    setScheduled(scheduled.map((item) => (item.activityId === activityId ? updated : item)));
  };

  const handleRemoveItem = (activityId: string) => {
    setScheduled(scheduled.filter((item) => item.activityId !== activityId));
  };

  const handleDropActivity = (activityId: string, day: 1 | 2 | 3) => {
    if (scheduled.some((s) => String(s.activityId) === String(activityId))) return;
    setActiveDay(day);
    const activity = activities.find((a) => String(a.id) === String(activityId));
    if (activity) {
      setActiveActivity(activity);
    }
  };

  const activeDayTotal = scheduled
    .filter((item) => item.day === activeDay)
    .reduce((sum, item) => sum + (activities.find((a) => String(a.id) === String(item.activityId))?.price || 0), 0);

  return (
    <div 
      className="min-h-screen p-8 md:p-12 transition-colors duration-300 font-sans antialiased"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-7xl mx-auto space-y-[32px]">
        <header className="flex justify-between items-start pb-6">
          <div className="space-y-1">
            <h1 className="text-[2.2rem] md:text-[2.6rem] font-bold leading-tight tracking-tight">Travel Planner</h1>
            <p className="text-sm font-normal leading-relaxed" style={{ color: "var(--muted)" }}>
              Σχεδιάστε το ιδανικό τριήμερο ταξίδι σας, ορίζοντας δραστηριότητες και ώρες.
            </p>
          </div>
          <ThemeToggle theme={theme} onToggle={() => setTheme(theme === "light" ? "dark" : "light")} />
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-[32px] items-start">
          <section className="order-2 lg:order-1 lg:col-span-5 space-y-6">
            <h2 className="text-xl font-bold leading-tight tracking-tight">
              Ανακαλύψτε Δραστηριότητες
              <span className="text-[12px] font-medium pl-2" style={{ color: "var(--muted)" }}>
                ({activities.length})
              </span>
            </h2>
            <ActivityList
              activities={activities}
              onAddClick={setActiveActivity}
              scheduledIds={scheduled.map((s) => String(s.activityId))}
            />
          </section>

          <section className="order-1 lg:order-2 lg:col-span-7 lg:sticky lg:top-8 flex flex-col space-y-3">
            <h2 className="text-xl font-bold leading-tight tracking-tight">Το Πρόγραμμά Μου</h2>
            <div 
              className="rounded-[12px] p-6 flex flex-col min-h-[480px] transition-colors duration-200"
              style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
            >
              <div className="flex border-b mb-6" style={{ borderColor: "var(--border)" }}>
                {([1, 2, 3] as const).map((dayVal) => (
                  <button
                    key={dayVal}
                    type="button"
                    onClick={() => setActiveDay(dayVal)}
                    className="flex-1 py-3 text-center text-sm transition-all cursor-pointer border-b-2 focus:outline-none"
                    style={{
                      borderBottomColor: activeDay === dayVal ? "var(--accent)" : "transparent",
                      color: activeDay === dayVal ? "var(--text)" : "var(--muted)",
                      fontWeight: activeDay === dayVal ? 600 : 400,
                    }}
                  >
                    Ημέρα {dayVal}
                  </button>
                ))}
              </div>

              <div className="flex-grow flex flex-col">
                <DayColumn
                  day={activeDay}
                  dayItems={scheduled.filter((item) => item.day === activeDay)}
                  activities={activities}
                  onUpdateItem={handleUpdateItem}
                  onRemoveItem={handleRemoveItem}
                  onDropActivity={(actId) => handleDropActivity(actId, activeDay)}
                />
              </div>

              <div className="mt-6 pt-4 border-t flex justify-between items-center bg-transparent" style={{ borderColor: "var(--border)" }}>
                <span className="text-sm font-semibold" style={{ color: "var(--muted)" }}>Σύνολο Ημέρας:</span>
                <span className="text-[16px]" style={{ fontWeight: 700 }}>Σύνολο: {activeDayTotal.toFixed(2)}€</span>
              </div>
            </div>
            
            {scheduled.length > 0 && (
              <div className="flex justify-end px-2">
                <button
                  onClick={() => setScheduled([])}
                  className="text-xs transition-colors cursor-pointer border-none bg-transparent"
                  style={{ color: "var(--muted)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
                >
                  Καθαρισμός Όλων
                </button>
              </div>
            )}
          </section>
        </main>
      </div>

      {activeActivity && (
        <SchedulingModal
          activity={activeActivity}
          activeDay={activeDay}
          scheduled={scheduled}
          onClose={() => setActiveActivity(null)}
          onSave={(newItem) => {
            setScheduled([...scheduled, newItem]);
            setActiveActivity(null);
          }}
        />
      )}
    </div>
  );
}
