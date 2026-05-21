import { useEffect, useState } from "react";
import type { Activity, ScheduledActivity } from "@/types";
import ActivityList from "@/components/ActivityList";
import DayColumn from "@/components/DayColumn";
import ThemeToggle from "@/components/ThemeToggle";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import possibleActivitiesData from "@/data/possibleActivities.json";
import { Calendar, Clock, AlertTriangle } from "lucide-react";

// Helper to construct tomorrow's date at specified hour in format YYYY-MM-DDTHH:MM
const getTomorrowDateTimeString = (hour: number) => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const dateVal = String(d.getDate()).padStart(2, "0");
  const hr = String(hour).padStart(2, "0");
  return `${year}-${month}-${dateVal}T${hr}:00`;
};

// 48 time slots in 30-minute intervals
const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hours = String(Math.floor(i / 2)).padStart(2, "0");
  const minutes = i % 2 === 0 ? "00" : "30";
  return `${hours}:${minutes}`;
});

export default function App() {
  // 1. Data States (Loaded from JSON)
  const [activities] = useState<Activity[]>(possibleActivitiesData as Activity[]);

  // States specified by the user
  const [scheduled, setScheduled] = useLocalStorage<ScheduledActivity[]>("trip-schedule", []);
  const [filterText, setFilterText] = useState("");
  const [sortBy, setSortBy] = useState<"title_asc" | "title_desc" | "cost_asc" | "cost_desc" | null>(null);

  // Theme state - defaults to light
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");

  // Active day in Itinerary
  const [activeDay, setActiveDay] = useState<1 | 2 | 3>(1);

  // Scheduling dialog states
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [scheduleDay, setScheduleDay] = useState<1 | 2 | 3>(1);
  const [scheduleStart, setScheduleStart] = useState("");
  const [scheduleEnd, setScheduleEnd] = useState("");

  // Apply Theme on load/change
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Validation function specified by the user
  const validateAdd = (
    activity: Activity,
    _day: number,
    start: string,
    end: string,
    scheduledList: ScheduledActivity[]
  ): string | null => {
    // 1. Ήδη επιλεγμένη
    if (scheduledList.some((s) => s.activityId === activity.id)) {
      return "Η δραστηριότητα έχει ήδη επιλεγεί";
    }

    // 2. end > start
    if (new Date(end) <= new Date(start)) {
      return "Το τέλος πρέπει να είναι μετά την αρχή";
    }

    // 3. Max 7 ώρες
    const hours = (new Date(end).getTime() - new Date(start).getTime()) / 36e5;
    if (hours > 7) {
      return "Μέγιστη διάρκεια 7 ώρες";
    }

    return null;
  };

  // Derived validation error calculated during render
  const validationError = (activeActivity && scheduleStart && scheduleEnd)
    ? validateAdd(activeActivity, scheduleDay, scheduleStart, scheduleEnd, scheduled)
    : null;

  // Open scheduler dialog
  const handleAddClick = (activity: Activity) => {
    setActiveActivity(activity);
    setScheduleDay(activeDay); // Match active day by default
    setScheduleStart(getTomorrowDateTimeString(9));
    setScheduleEnd(getTomorrowDateTimeString(12));
  };

  // Save proposed scheduled activity
  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeActivity || validationError) return;

    const newItem: ScheduledActivity = {
      activityId: activeActivity.id,
      day: scheduleDay,
      startDateTime: scheduleStart,
      endDateTime: scheduleEnd,
    };

    setScheduled([...scheduled, newItem]);
    setActiveActivity(null);
  };

  // Update item inside Day Column
  const handleUpdateItem = (activityId: string, updated: ScheduledActivity) => {
    setScheduled(scheduled.map((item) => (item.activityId === activityId ? updated : item)));
  };

  // Remove item
  const handleRemoveItem = (activityId: string) => {
    setScheduled(scheduled.filter((item) => item.activityId !== activityId));
  };

  // Filter out scheduled IDs
  const scheduledIds = scheduled.map((s) => s.activityId);

  // Active Day Total calculation
  const activeDayTotal = scheduled
    .filter((item) => item.day === activeDay)
    .reduce((sum, item) => {
      const activity = activities.find((a) => a.id === item.activityId);
      return sum + (activity ? activity.cost : 0);
    }, 0);

  return (
    <div 
      className="min-h-screen p-8 md:p-12 transition-colors duration-300 font-sans antialiased"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div className="max-w-7xl mx-auto space-y-[32px]">
        {/* Navigation/Header bar */}
        <header className="flex justify-between items-start pb-6">
          <div className="space-y-1">
            <h1 className="text-[2.2rem] md:text-[2.6rem] font-bold leading-tight tracking-tight" style={{ color: "var(--text)" }}>
              Travel Planner
            </h1>
            <p className="text-sm font-normal leading-relaxed" style={{ color: "var(--muted)" }}>
              Σχεδιάστε το ιδανικό τριήμερο ταξίδι σας, ορίζοντας δραστηριότητες και ώρες.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} onToggle={() => setTheme(theme === "light" ? "dark" : "light")} />
          </div>
        </header>

        {/* Main Content Layout */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-[32px] items-start">
          
          {/* Left Column (5/12 width): Activities Explorer */}
          <section className="order-2 lg:order-1 lg:col-span-5 space-y-6">
            <h2 className="text-xl font-bold leading-tight tracking-tight" style={{ color: "var(--text)" }}>
              Ανακαλύψτε Δραστηριότητες
              <span className="text-[12px] font-medium pl-2" style={{ color: "var(--muted)" }}>
                ({activities.length})
              </span>
            </h2>
            <ActivityList
              activities={activities}
              filterText={filterText}
              onFilterTextChange={setFilterText}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              onAddClick={handleAddClick}
              scheduledIds={scheduledIds}
            />
          </section>

          {/* Right Column (7/12 width): Day Itinerary Panel */}
          <section className="order-1 lg:order-2 lg:col-span-7 lg:sticky lg:top-8 flex flex-col space-y-3">
            <h2 className="text-xl font-bold leading-tight tracking-tight" style={{ color: "var(--text)" }}>
              Το Πρόγραμμά Μου
            </h2>

            <div 
              className="rounded-[12px] p-6 flex flex-col min-h-[480px] transition-colors duration-200"
              style={{
                backgroundColor: "var(--bg)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow)",
              }}
            >
              {/* Day Tabs */}
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

              {/* Day Column Content */}
              <div className="flex-grow flex flex-col">
                <DayColumn
                  day={activeDay}
                  dayItems={scheduled.filter((item) => item.day === activeDay)}
                  activities={activities}
                  onUpdateItem={handleUpdateItem}
                  onRemoveItem={handleRemoveItem}
                />
              </div>

              {/* Day Total at bottom of Right Panel */}
              <div className="mt-6 pt-4 border-t flex justify-between items-center bg-transparent" style={{ borderColor: "var(--border)" }}>
                <span className="text-sm font-semibold" style={{ color: "var(--muted)" }}>Σύνολο Ημέρας:</span>
                <span 
                  className="text-[16px]"
                  style={{ fontWeight: 700, color: "var(--text)" }}
                >
                  Σύνολο: {activeDayTotal.toFixed(2)}€
                </span>
              </div>
            </div>
            
            {/* Clean, minimalist controls */}
            {scheduled.length > 0 && (
              <div className="flex justify-end px-2">
                <button
                  onClick={() => setScheduled([])}
                  className="text-xs transition-colors cursor-pointer border-none bg-transparent"
                  style={{ color: "var(--muted)" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--text)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
                >
                  Καθαρισμός Όλων
                </button>
              </div>
            )}
          </section>

        </main>
      </div>

      {/* Minimal Centered Scheduling Dialog */}
      {activeActivity && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]"
          onClick={() => setActiveActivity(null)}
        >
          <div 
            className="p-6 sm:max-w-[420px] rounded-[12px] w-full focus:outline-none"
            style={{
              backgroundColor: "var(--bg)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="space-y-2 text-left">
                <h3 className="text-lg font-bold leading-tight" style={{ color: "var(--text)" }}>
                  Προσθήκη Δραστηριότητας
                </h3>
                <p className="text-sm font-normal leading-relaxed" style={{ color: "var(--muted)" }}>
                  Προγραμματίστε τη μέρα και τις ώρες διεξαγωγής για το: <span className="font-semibold" style={{ color: "var(--text)" }}>{activeActivity.title}</span>
                </p>
              </div>

              <form onSubmit={handleSaveSchedule} className="space-y-6">
                {/* Day selector */}
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-wider font-bold flex items-center gap-2" style={{ color: "var(--muted)" }}>
                    <Calendar className="w-4 h-4" style={{ color: "var(--muted)" }} strokeWidth={2} />
                    Επιλογή Ημέρας
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([1, 2, 3] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setScheduleDay(d)}
                        className="py-2 px-3 rounded-[8px] border text-xs font-semibold transition-all cursor-pointer focus:outline-none"
                        style={{
                          backgroundColor: scheduleDay === d ? "var(--text)" : "transparent",
                          borderColor: "var(--border)",
                          color: scheduleDay === d ? "var(--bg)" : "var(--text)",
                        }}
                      >
                        Ημέρα {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time slot selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Από Selector */}
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider font-bold flex items-center gap-2" style={{ color: "var(--muted)" }}>
                      <Clock className="w-4 h-4" style={{ color: "var(--muted)" }} strokeWidth={2} />
                      Από
                    </label>
                    <select
                      value={scheduleStart.split("T")[1]?.substring(0, 5) || "09:00"}
                      onChange={(e) => {
                        const datePart = scheduleStart ? scheduleStart.split("T")[0] : getTomorrowDateTimeString(0).split("T")[0];
                        setScheduleStart(`${datePart}T${e.target.value}`);
                      }}
                      className="w-full py-2 px-3 text-sm font-normal rounded-[8px] focus:outline-none cursor-pointer"
                      style={{ 
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--bg)",
                        color: "var(--text)"
                      }}
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot} className="bg-[var(--bg)] text-[var(--text)]">
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Έως Selector */}
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider font-bold flex items-center gap-2" style={{ color: "var(--muted)" }}>
                      <Clock className="w-4 h-4" style={{ color: "var(--muted)" }} strokeWidth={2} />
                      Έως
                    </label>
                    <select
                      value={scheduleEnd.split("T")[1]?.substring(0, 5) || "12:00"}
                      onChange={(e) => {
                        const datePart = scheduleEnd ? scheduleEnd.split("T")[0] : getTomorrowDateTimeString(0).split("T")[0];
                        setScheduleEnd(`${datePart}T${e.target.value}`);
                      }}
                      className="w-full py-2 px-3 text-sm font-normal rounded-[8px] focus:outline-none cursor-pointer"
                      style={{ 
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--bg)",
                        color: "var(--text)"
                      }}
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot} className="bg-[var(--bg)] text-[var(--text)]">
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Error Banner */}
                {validationError && (
                  <div 
                    className="flex items-start gap-2 p-3 rounded-[8px] border text-xs font-normal leading-relaxed"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "var(--surface)",
                      color: "var(--text)"
                    }}
                  >
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--muted)" }} strokeWidth={2} />
                    <span>{validationError}</span>
                  </div>
                )}

                {/* Footer Action buttons */}
                <div className="flex gap-2 justify-end border-t pt-4 mt-6" style={{ borderColor: "var(--border)" }}>
                  <button
                    type="button"
                    onClick={() => setActiveActivity(null)}
                    className="px-4 py-2 border text-sm font-semibold rounded-[8px] bg-transparent cursor-pointer transition-colors"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--text)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--surface)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    Ακύρωση
                  </button>
                  <button
                    type="submit"
                    disabled={!!validationError}
                    className="px-4 py-2 text-sm font-semibold rounded-[8px] transition-colors cursor-pointer"
                    style={{
                      backgroundColor: validationError ? "var(--border)" : "var(--text)",
                      color: validationError ? "var(--muted)" : "var(--bg)",
                    }}
                  >
                    Αποθήκευση
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
