import type { ScheduledActivity as ScheduledType, Activity } from "@/types";

interface ScheduledActivityProps {
  scheduledItem: ScheduledType;
  activity: Activity;
  onUpdate: (updated: ScheduledType) => void;
  onRemove: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

// 48 time slots in 30-minute intervals
const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hours = String(Math.floor(i / 2)).padStart(2, "0");
  const minutes = i % 2 === 0 ? "00" : "30";
  return `${hours}:${minutes}`;
});

const formatTimeRange = (start: string, end: string) => {
  if (!start || !end) return "";
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const pad = (num: number) => String(num).padStart(2, "0");
    
    const startHours = pad(startDate.getHours());
    const startMins = pad(startDate.getMinutes());
    const endHours = pad(endDate.getHours());
    const endMins = pad(endDate.getMinutes());

    return `${startHours}:${startMins} - ${endHours}:${endMins}`;
  } catch {
    return "";
  }
};

export default function ScheduledActivity({
  scheduledItem,
  activity,
  onUpdate,
  onRemove,
  isExpanded,
  onToggleExpand,
}: ScheduledActivityProps) {
  const timeRangeStr = formatTimeRange(scheduledItem.startDateTime, scheduledItem.endDateTime);

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
          {/* Title: 13px 600 */}
          <h4 
            className="text-[13px] font-semibold leading-tight line-clamp-1" 
            style={{ color: "var(--text)" }}
          >
            {activity.title}
          </h4>

          {/* Time range: 12px, color var(--muted) */}
          <span 
            className="text-[12px] font-normal leading-none" 
            style={{ color: "var(--muted)" }}
          >
            {timeRangeStr}
          </span>

          {/* Cost: 13px, font-weight 600, color var(--text) */}
          <span 
            className="leading-none" 
            style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}
          >
            {activity.cost === 0 ? "Δωρεάν" : `${activity.cost.toFixed(2)}€`}
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
          maxHeight: isExpanded ? "120px" : "0px",
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
              value={scheduledItem.startDateTime.split("T")[1]?.substring(0, 5) || "09:00"}
              onChange={(e) => {
                const datePart = scheduledItem.startDateTime.split("T")[0];
                onUpdate({ ...scheduledItem, startDateTime: `${datePart}T${e.target.value}` });
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
              value={scheduledItem.endDateTime.split("T")[1]?.substring(0, 5) || "12:00"}
              onChange={(e) => {
                const datePart = scheduledItem.endDateTime.split("T")[0];
                onUpdate({ ...scheduledItem, endDateTime: `${datePart}T${e.target.value}` });
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
      </div>
    </div>
  );
}
