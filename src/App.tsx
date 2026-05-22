import { useEffect, useState } from "react";
import type { Activity, ScheduledActivity, RawActivity } from "@/types";
import ActivityList from "@/components/ActivityList";
import DayColumn from "@/components/DayColumn";
import Header from "@/components/Header";
import ScheduleSection from "@/components/ScheduleSection";
import SchedulingModal from "@/components/SchedulingModal";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import possibleActivitiesData from "@/data/possibleActivities.json";

const RAW_ACTIVITIES = possibleActivitiesData as RawActivity[];
const ACTIVITIES: Activity[] = RAW_ACTIVITIES.map((activityItem) => ({
  id: String(activityItem.id),
  title: activityItem.title,
  tags: activityItem.tags,
  price: activityItem.price,
  description: activityItem.description,
}));

export default function App() {
  const [scheduled, setScheduled] = useLocalStorage<ScheduledActivity[]>(
    "trip-schedule",
    [],
  );
  const [activeDay, setActiveDay] = useState<1 | 2 | 3>(1);
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleUpdateItem = (activityId: string, updatedItem: ScheduledActivity) => {
    setScheduled(
      scheduled.map((scheduledItem) =>
        scheduledItem.activityId === activityId ? updatedItem : scheduledItem,
      ),
    );
  };

  const handleRemoveItem = (activityId: string) => {
    setScheduled(scheduled.filter((scheduledItem) => scheduledItem.activityId !== activityId));
  };

  const handleDropActivity = (activityId: string, targetDay: 1 | 2 | 3) => {
    const isAlreadyScheduled = scheduled.some(
      (scheduledItem) => scheduledItem.activityId === activityId,
    );
    if (isAlreadyScheduled) {
      return;
    }
    setActiveDay(targetDay);
    const matchedActivity = ACTIVITIES.find(
      (activityItem) => activityItem.id === activityId,
    );
    if (matchedActivity) {
      setActiveActivity(matchedActivity);
    }
  };

  const activeDayTotal = scheduled
    .filter((scheduledItem) => scheduledItem.day === activeDay)
    .reduce((accumulatedTotal, scheduledItem) => {
      const matchedActivity = ACTIVITIES.find(
        (activityItem) => activityItem.id === scheduledItem.activityId,
      );
      return accumulatedTotal + (matchedActivity?.price || 0);
    }, 0);

  const tripTotal = scheduled.reduce((accumulatedTotal, scheduledItem) => {
    const matchedActivity = ACTIVITIES.find(
      (activityItem) => activityItem.id === scheduledItem.activityId,
    );
    return accumulatedTotal + (matchedActivity?.price || 0);
  }, 0);

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleSaveActivity = (newItem: ScheduledActivity) => {
    setScheduled([...scheduled, newItem]);
    setActiveActivity(null);
  };

  return (
    <div
      className="min-h-screen p-8 md:p-12 transition-colors duration-300 font-sans antialiased"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <Header theme={theme} onThemeToggle={handleThemeToggle} />

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <section className="order-2 lg:order-1 lg:col-span-5 space-y-6">
            <h2 className="text-xl font-bold leading-tight tracking-tight">
              Ανακαλύψτε Δραστηριότητες
              <span className="text-xs font-medium pl-2" style={{ color: "var(--muted)" }}>
                ({ACTIVITIES.length})
              </span>
            </h2>
            <ActivityList
              activities={ACTIVITIES}
              onAddClick={setActiveActivity}
              scheduledIds={scheduled.map((scheduledItem) => scheduledItem.activityId)}
            />
          </section>

          <ScheduleSection
            activeDay={activeDay}
            onDaySelect={setActiveDay}
            activeDayTotal={activeDayTotal}
            tripTotal={tripTotal}
            hasScheduledItems={scheduled.length > 0}
            onClearAll={() => setScheduled([])}
          >
            <DayColumn
              day={activeDay}
              dayItems={scheduled.filter((scheduledItem) => scheduledItem.day === activeDay)}
              activities={ACTIVITIES}
              onUpdateItem={handleUpdateItem}
              onRemoveItem={handleRemoveItem}
              onDropActivity={(activityId) => handleDropActivity(activityId, activeDay)}
            />
          </ScheduleSection>
        </main>
      </div>

      {activeActivity && (
        <SchedulingModal
          activity={activeActivity}
          activeDay={activeDay}
          scheduled={scheduled}
          onClose={() => setActiveActivity(null)}
          onSave={handleSaveActivity}
        />
      )}
    </div>
  );
}
