import { useState } from "react";
import type { ScheduledActivity as ScheduledType, Activity } from "@/types";
import ScheduledActivity from "./ScheduledActivity";
import { hasConflict } from "@/utils/schedulingUtils";

interface DayColumnProps {
  day: 1 | 2 | 3;
  dayItems: ScheduledType[];
  activities: Activity[];
  onUpdateItem: (activityId: string, updated: ScheduledType) => void;
  onRemoveItem: (activityId: string) => void;
  onDropActivity: (activityId: string) => void;
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
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragOver(true);
      }}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragOver(false);
        const activityId =
          event.dataTransfer.getData("activityId") ||
          event.dataTransfer.getData("text/plain");
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
      <div className="flex flex-col grow overflow-y-auto mb-4 pr-1">
        {dayItems.length > 0 ? (
          dayItems.map((scheduledItem) => {
            const activity = activities.find(
              (activityItem) => activityItem.id === scheduledItem.activityId,
            );
            if (!activity) {
              return null;
            }

            return (
              <ScheduledActivity
                key={scheduledItem.activityId}
                scheduledItem={scheduledItem}
                activity={activity}
                onUpdate={(updated) =>
                  onUpdateItem(scheduledItem.activityId, updated)
                }
                onRemove={() => onRemoveItem(scheduledItem.activityId)}
                isExpanded={expandedId === scheduledItem.activityId}
                onToggleExpand={() => {
                  setExpandedId(
                    expandedId === scheduledItem.activityId
                      ? null
                      : scheduledItem.activityId,
                  );
                }}
                conflict={hasConflict(scheduledItem, dayItems)}
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
