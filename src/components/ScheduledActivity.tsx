import { useState } from "react";
import type { ScheduledActivity as ScheduledType, Activity } from "@/types";

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hours = String(Math.floor(i / 2)).padStart(2, "0");
  const minutes = i % 2 === 0 ? "00" : "30";
  return `${hours}:${minutes}`;
});

interface ScheduledActivityProps {
  scheduledItem: ScheduledType;
  activity: Activity;
  onUpdate: (updated: ScheduledType) => void;
  onRemove: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const formatTimeRange = (start: string, end: string) => {
  if (!start || !end) return "";
  return `${start} - ${end}`;
};

export default function ScheduledActivity({
  scheduledItem,
  activity,
  onUpdate,
  onRemove,
  isExpanded,
  onToggleExpand,
}: ScheduledActivityProps) {
  const [inlineError, setInlineError] = useState<string | null>(null);

  const currentStart = scheduledItem.startTime || "09:00";
  const currentEnd = scheduledItem.endTime || "12:00";

  const [localStart, setLocalStart] = useState(currentStart);
  const [localEnd, setLocalEnd] = useState(currentEnd);

  const [prevStart, setPrevStart] = useState(currentStart);
  const [prevEnd, setPrevEnd] = useState(currentEnd);

  if (currentStart !== prevStart || currentEnd !== prevEnd) {
    setPrevStart(currentStart);
    setPrevEnd(currentEnd);
    setLocalStart(currentStart);
    setLocalEnd(currentEnd);
    setInlineError(null);
  }

  const timeRangeStr = formatTimeRange(scheduledItem.startTime, scheduledItem.endTime);

  const validateChange = (start: string, end: string): string | null => {
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
    return null;
  };

  return (
    <div 
      className="relative flex flex-col transition-all duration-200"
      style={{
        borderBottom: "1px solid var(--border)",
        backgroundColor: "transparent",
      }}
    >
      {/* Top row */}
      <div 
        onClick={onToggleExpand}
        className="flex items-center justify-between py-3 cursor-pointer select-none gap-2 text-left"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-grow">
          {/* Title */}
          <h4 
            className="text-[13px] font-semibold leading-tight line-clamp-1" 
            style={{ color: "var(--text)" }}
          >
            {activity.title}
          </h4>

          {/* Time range */}
          <span 
            className="text-[12px] font-normal leading-none" 
            style={{ color: "var(--muted)" }}
          >
            {timeRangeStr}
          </span>

          {/* Price */}
          <span 
            className="leading-none" 
            style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}
          >
            {activity.price === 0 ? "Δωρεάν" : `${activity.price.toFixed(2)}€`}
          </span>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-lg font-normal border-none bg-transparent cursor-pointer transition-colors p-1 flex-shrink-0"
          style={{ color: "var(--muted)" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--text)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
          title="Αφαίρεση"
        >
          ×
        </button>
      </div>

      {/* Expandable selectors section */}
      <div 
        style={{
          maxHeight: isExpanded ? "150px" : "0px",
          overflow: "hidden",
          transition: "max-height 200ms ease",
        }}
        className="w-full"
      >
        <div className="grid grid-cols-2 gap-4 pb-3 pt-1">
          {/* Από Selector */}
          <div className="space-y-1 text-left">
            <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--muted)" }}>Από</span>
            <select
              value={localStart}
              onChange={(e) => {
                setLocalStart(e.target.value);
                const nextStart = e.target.value;
                const nextEnd = localEnd;
                
                const err = validateChange(nextStart, nextEnd);
                if (err) {
                  setInlineError(err);
                  return;
                }
                
                setInlineError(null);
                onUpdate({ ...scheduledItem, startTime: nextStart });
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded focus:outline-none cursor-pointer"
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
          <div className="space-y-1 text-left">
            <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--muted)" }}>Έως</span>
            <select
              value={localEnd}
              onChange={(e) => {
                setLocalEnd(e.target.value);
                const nextStart = localStart;
                const nextEnd = e.target.value;
                
                const err = validateChange(nextStart, nextEnd);
                if (err) {
                  setInlineError(err);
                  return;
                }
                
                setInlineError(null);
                onUpdate({ ...scheduledItem, endTime: nextEnd });
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded focus:outline-none cursor-pointer"
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
        {inlineError && (
          <div 
            className="pb-3 text-left"
            style={{ color: "var(--accent)", fontSize: "11px" }}
          >
            {inlineError}
          </div>
        )}
      </div>
    </div>
  );
}
