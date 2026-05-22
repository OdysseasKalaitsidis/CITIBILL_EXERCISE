import { useState } from "react";
import type { Activity, ScheduledActivity } from "@/types";
import { Calendar, Clock, AlertTriangle } from "lucide-react";

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hours = String(Math.floor(i / 2)).padStart(2, "0");
  const minutes = i % 2 === 0 ? "00" : "30";
  return `${hours}:${minutes}`;
});

interface SchedulingModalProps {
  activity: Activity;
  activeDay: 1 | 2 | 3;
  scheduled: ScheduledActivity[];
  onClose: () => void;
  onSave: (item: ScheduledActivity) => void;
}

export default function SchedulingModal({
  activity,
  activeDay,
  scheduled,
  onClose,
  onSave,
}: SchedulingModalProps) {
  const [scheduleDay, setScheduleDay] = useState<1 | 2 | 3>(activeDay);
  const [scheduleStart, setScheduleStart] = useState("09:00");
  const [scheduleEnd, setScheduleEnd] = useState("12:00");

  const validateAdd = (
    act: Activity,
    _day: number,
    start: string,
    end: string,
    scheduledList: ScheduledActivity[],
  ): string | null => {
    if (scheduledList.some((s) => s.activityId === act.id)) {
      return "Η δραστηριότητα έχει ήδη επιλεγεί";
    }
    if (end <= start) {
      return "Το τέλος πρέπει να είναι μετά την αρχή";
    }
    const parseTimeToMinutes = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const durationMinutes = parseTimeToMinutes(end) - parseTimeToMinutes(start);
    if (durationMinutes > 7 * 60) {
      return "Μέγιστη διάρκεια 7 ώρες";
    }

    // Check overlap with already scheduled activities on the same day
    const hasOverlap = scheduledList.some(
      (s) =>
        s.day === _day &&
        s.activityId !== act.id &&
        start < s.endTime &&
        end > s.startTime
    );
    if (hasOverlap) {
      return "Υπάρχει επικάλυψη ωραρίου με άλλη δραστηριότητα";
    }

    return null;
  };

  const validationError = validateAdd(
    activity,
    scheduleDay,
    scheduleStart,
    scheduleEnd,
    scheduled,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validationError) return;

    onSave({
      activityId: activity.id,
      day: scheduleDay,
      startTime: scheduleStart,
      endTime: scheduleEnd,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="p-6 sm:max-w-105 rounded-xl w-full focus:outline-none"
        style={{
          backgroundColor: "var(--bg)",
          border: "1px solid var(--border)",
          color: "var(--text)",
          boxShadow:
            "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          <div className="space-y-2 text-left">
            <h3
              className="text-lg font-bold leading-tight"
              style={{ color: "var(--text)" }}
            >
              Προσθήκη Δραστηριότητας
            </h3>
            <p
              className="text-sm font-normal leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              Προγραμματίστε τη μέρα και τις ώρες διεξαγωγής για το:{" "}
              <span className="font-semibold" style={{ color: "var(--text)" }}>
                {activity.title}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Day selector */}
            <div className="space-y-2">
              <label
                className="text-[11px] uppercase tracking-wider font-bold flex items-center gap-2"
                style={{ color: "var(--muted)" }}
              >
                <Calendar
                  className="w-4 h-4"
                  style={{ color: "var(--muted)" }}
                  strokeWidth={2}
                />
                Επιλογή Ημέρας
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([1, 2, 3] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setScheduleDay(d)}
                    className="py-2 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer focus:outline-none"
                    style={{
                      backgroundColor:
                        scheduleDay === d ? "var(--text)" : "transparent",
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
                <label
                  className="text-[11px] uppercase tracking-wider font-bold flex items-center gap-2"
                  style={{ color: "var(--muted)" }}
                >
                  <Clock
                    className="w-4 h-4"
                    style={{ color: "var(--muted)" }}
                    strokeWidth={2}
                  />
                  Από
                </label>
                <select
                  value={scheduleStart}
                  onChange={(e) => setScheduleStart(e.target.value)}
                  className="w-full py-2 px-3 text-sm font-normal rounded-lg focus:outline-none cursor-pointer"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg)",
                    color: "var(--text)",
                  }}
                >
                  {TIME_SLOTS.map((slot) => (
                    <option
                      key={slot}
                      value={slot}
                      className="bg-bg text-text"
                    >
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              {/* Έως Selector */}
              <div className="space-y-1">
                <label
                  className="text-[11px] uppercase tracking-wider font-bold flex items-center gap-2"
                  style={{ color: "var(--muted)" }}
                >
                  <Clock
                    className="w-4 h-4"
                    style={{ color: "var(--muted)" }}
                    strokeWidth={2}
                  />
                  Έως
                </label>
                <select
                  value={scheduleEnd}
                  onChange={(e) => setScheduleEnd(e.target.value)}
                  className="w-full py-2 px-3 text-sm font-normal rounded-lg focus:outline-none cursor-pointer"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg)",
                    color: "var(--text)",
                  }}
                >
                  {TIME_SLOTS.map((slot) => (
                    <option
                      key={slot}
                      value={slot}
                      className="bg-bg text-text"
                    >
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error Banner */}
            {validationError && (
              <div
                className="flex items-start gap-2 p-3 rounded-lg border text-xs font-normal leading-relaxed"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--surface)",
                  color: "var(--text)",
                }}
              >
                <AlertTriangle
                  className="w-4 h-4 shrink-0 mt-0.5"
                  style={{ color: "var(--muted)" }}
                  strokeWidth={2}
                />
                <span>{validationError}</span>
              </div>
            )}

            {/* Footer Action buttons */}
            <div
              className="flex gap-2 justify-end border-t pt-4 mt-6"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border text-sm font-semibold rounded-lg bg-transparent cursor-pointer transition-colors"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text)",
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
                className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                style={{
                  backgroundColor: validationError
                    ? "var(--border)"
                    : "var(--text)",
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
  );
}
