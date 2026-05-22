import { useState } from "react";
import type { ScheduledActivity as ScheduledType, Activity } from "@/types";
import ScheduledActivity from "./ScheduledActivity";

interface DayColumnProps {
  day: 1 | 2 | 3;
  dayItems: ScheduledType[];
  activities: Activity[];
  onUpdateItem: (activityId: string, updated: ScheduledType) => void;
  onRemoveItem: (activityId: string) => void;
  onDropActivity: (activityId: string) => void;
}

function hasConflict(item: ScheduledType, allItems: ScheduledType[]): boolean {
  return allItems.some(
    (other) =>
      other.activityId !== item.activityId &&
      item.startTime < other.endTime &&
      item.endTime > other.startTime
  );
}

export default function DayColumn({
  dayItems,
  activities,
  onUpdateItem,
  onRemoveItem,
  onDropActivity,
}: DayColumnProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const activityId =
          e.dataTransfer.getData("activityId") ||
          e.dataTransfer.getData("text/plain");
        if (activityId) {
          onDropActivity(activityId);
        }
      }}
      className="flex flex-col grow min-h-75 h-full bg-transparent p-2 transition-all duration-200 rounded-xl"
      style={{
        border: isDragOver
          ? "1px solid var(--accent)"
          : "1px solid transparent",
      }}
    >
      {/* Items list */}
      <div className="flex flex-col grow overflow-y-auto mb-4 pr-1">
        {dayItems.length > 0 ? (
          dayItems.map((item) => {
            const activity = activities.find(
              (a) => String(a.id) === String(item.activityId),
            );
            if (!activity) return null;

            return (
              <ScheduledActivity
                key={item.activityId}
                scheduledItem={item}
                activity={activity}
                onUpdate={(updated) => onUpdateItem(item.activityId, updated)}
                onRemove={() => onRemoveItem(item.activityId)}
                isExpanded={expandedId === item.activityId}
                onToggleExpand={() => {
                  setExpandedId(
                    expandedId === item.activityId ? null : item.activityId,
                  );
                }}
                conflict={hasConflict(item, dayItems)}
              />
            );
          })
        ) : (
          <div
            className="text-center py-16 text-[13px] font-normal border border-dashed rounded-lg"
            style={{
              color: "var(--muted)",
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
            }}
          >
            Καμία δραστηριότητα προγραμματισμένη για αυτή την ημέρα.
          </div>
        )}
      </div>
    </div>
  );
}
