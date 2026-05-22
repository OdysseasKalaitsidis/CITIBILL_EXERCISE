import { useState } from "react";
import type { ScheduledActivity as ScheduledType, Activity } from "@/types";
import { formatTimeRange, validateChange } from "@/utils/time";
import TimeSlotSelectors from "./TimeSlotSelectors";

interface ScheduledActivityProps {
  scheduledItem: ScheduledType;
  activity: Activity;
  onUpdate: (updated: ScheduledType) => void;
  onRemove: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  conflict: boolean;
}

export default function ScheduledActivity({
  scheduledItem,
  activity,
  onUpdate,
  onRemove,
  isExpanded,
  onToggleExpand,
  conflict,
}: ScheduledActivityProps) {
  const [inlineError, setInlineError] = useState<string | null>(null);

  const currentStart = scheduledItem.startTime || "09:00";
  const currentEnd = scheduledItem.endTime || "12:00";

  const [localStart, setLocalStart] = useState(currentStart);
  const [localEnd, setLocalEnd] = useState(currentEnd);

  const [prevStart, setPrevStart] = useState(currentStart);
  const [prevEnd, setPrevEnd] = useState(currentEnd);

  // Sync state during rendering if props change
  if (currentStart !== prevStart || currentEnd !== prevEnd) {
    setPrevStart(currentStart);
    setPrevEnd(currentEnd);
    setLocalStart(currentStart);
    setLocalEnd(currentEnd);
    setInlineError(null);
  }

  const handleStartChange = (nextStart: string) => {
    setLocalStart(nextStart);
    const validationError = validateChange(nextStart, localEnd);
    if (validationError) {
      setInlineError(validationError);
      return;
    }
    setInlineError(null);
    onUpdate({ ...scheduledItem, startTime: nextStart });
  };

  const handleEndChange = (nextEnd: string) => {
    setLocalEnd(nextEnd);
    const validationError = validateChange(localStart, nextEnd);
    if (validationError) {
      setInlineError(validationError);
      return;
    }
    setInlineError(null);
    onUpdate({ ...scheduledItem, endTime: nextEnd });
  };

  const timeRangeStr = formatTimeRange(
    scheduledItem.startTime,
    scheduledItem.endTime,
  );

  return (
    <div
      className="relative flex flex-col transition-all duration-200"
      style={{
        borderBottom: "1px solid var(--border)",
        backgroundColor: "transparent",
      }}
    >
      <div
        onClick={onToggleExpand}
        className="flex items-center justify-between py-3 cursor-pointer select-none gap-2 text-left"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 grow">
          <h4
            className="text-[13px] font-semibold leading-tight line-clamp-1"
            style={{ color: "var(--text)" }}
          >
            {activity.title}
          </h4>

          <span
            className="text-xs font-normal leading-none"
            style={{ color: "var(--muted)" }}
          >
            {timeRangeStr}
          </span>

          <span
            className="leading-none"
            style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}
          >
            {activity.price === 0 ? "Δωρεάν" : `${activity.price.toFixed(2)}€`}
          </span>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          className="text-lg font-normal border-none bg-transparent cursor-pointer transition-colors p-1 shrink-0"
          style={{ color: "var(--muted)" }}
          onMouseEnter={(event) =>
            (event.currentTarget.style.color = "var(--text)")
          }
          onMouseLeave={(event) =>
            (event.currentTarget.style.color = "var(--muted)")
          }
          title="Αφαίρεση"
        >
          ×
        </button>
      </div>

      {conflict && (
        <div
          className="pb-2 text-left"
          style={{ fontSize: "11px", color: "#FF385C", fontWeight: 500 }}
        >
          Επικάλυψη ωραρίου
        </div>
      )}

      <div
        style={{
          maxHeight: isExpanded ? "150px" : "0px",
          overflow: "hidden",
          transition: "max-height 200ms ease",
        }}
        className="w-full"
      >
        <TimeSlotSelectors
          localStart={localStart}
          localEnd={localEnd}
          onStartChange={handleStartChange}
          onEndChange={handleEndChange}
          inlineError={inlineError}
        />
      </div>
    </div>
  );
}
