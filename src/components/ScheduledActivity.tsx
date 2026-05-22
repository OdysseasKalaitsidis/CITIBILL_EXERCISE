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
  dayItems: ScheduledType[];
}

export default function ScheduledActivity({
  scheduledItem,
  activity,
  onUpdate,
  onRemove,
  isExpanded,
  onToggleExpand,
  conflict,
  dayItems,
}: ScheduledActivityProps) {
  const [inlineError, setInlineError] = useState<string | null>(null);

  const currentStart = scheduledItem.startTime || "09:00";
  const currentEnd = scheduledItem.endTime || "12:00";

  const [localStart, setLocalStart] = useState(currentStart);
  const [localEnd, setLocalEnd] = useState(currentEnd);
  const [prevTimes, setPrevTimes] = useState([currentStart, currentEnd]);

  if (currentStart !== prevTimes[0] || currentEnd !== prevTimes[1]) {
    setPrevTimes([currentStart, currentEnd]);
    setLocalStart(currentStart);
    setLocalEnd(currentEnd);
    setInlineError(null);
  }

  const validateInlineChange = (start: string, end: string): string | null => {
    const baseError = validateChange(start, end);
    if (baseError) return baseError;

    const hasOverlap = dayItems.some(
      (otherItem) =>
        otherItem.activityId !== scheduledItem.activityId &&
        start < otherItem.endTime &&
        end > otherItem.startTime,
    );
    return hasOverlap ? "Υπάρχει επικάλυψη ωραρίου με άλλη δραστηριότητα" : null;
  };

  const handleStartChange = (nextStart: string) => {
    setLocalStart(nextStart);
    const err = validateInlineChange(nextStart, localEnd);
    setInlineError(err);
    if (!err) {
      onUpdate({ ...scheduledItem, startTime: nextStart });
    }
  };

  const handleEndChange = (nextEnd: string) => {
    setLocalEnd(nextEnd);
    const err = validateInlineChange(localStart, nextEnd);
    setInlineError(err);
    if (!err) {
      onUpdate({ ...scheduledItem, endTime: nextEnd });
    }
  };

  const timeRangeStr = formatTimeRange(scheduledItem.startTime, scheduledItem.endTime);

  return (
    <div className="relative flex flex-col border-b border-border bg-transparent transition-all duration-200">
      <div
        onClick={onToggleExpand}
        className="flex items-center justify-between py-3 cursor-pointer select-none gap-2 text-left"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 grow">
          <h4 className="text-[13px] font-semibold leading-tight line-clamp-1 text-text">
            {activity.title}
          </h4>
          <span className="text-xs font-normal leading-none text-muted">
            {timeRangeStr}
          </span>
          <span className="text-[13px] font-semibold leading-none text-text">
            {activity.price === 0 ? "Δωρεάν" : `${activity.price.toFixed(2)}€`}
          </span>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          className="text-lg font-normal border-none bg-transparent cursor-pointer transition-colors p-1 shrink-0 text-muted hover:text-text"
          title="Αφαίρεση"
        >
          ×
        </button>
      </div>

      {conflict && (
        <div className="pb-2 text-left text-[11px] font-medium text-accent">
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
