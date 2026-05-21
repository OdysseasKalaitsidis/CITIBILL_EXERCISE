import { useState } from "react";
import type { ScheduledActivity as ScheduledType, Activity } from "@/types";
import ScheduledActivity from "./ScheduledActivity";

interface DayColumnProps {
  day: 1 | 2 | 3;
  dayItems: ScheduledType[];
  activities: Activity[];
  onUpdateItem: (activityId: string, updated: ScheduledType) => void;
  onRemoveItem: (activityId: string) => void;
}

export default function DayColumn({
  dayItems,
  activities,
  onUpdateItem,
  onRemoveItem,
}: DayColumnProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="flex flex-col flex-grow min-h-[300px] h-full bg-transparent">
      {/* Items list */}
      <div className="flex flex-col flex-grow overflow-y-auto mb-4 pr-1">
        {dayItems.length > 0 ? (
          dayItems.map((item) => {
            const activity = activities.find((a) => a.id === item.activityId);
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
                  setExpandedId(expandedId === item.activityId ? null : item.activityId);
                }}
              />
            );
          })
        ) : (
          <div 
            className="text-center py-[64px] text-[13px] font-normal border border-dashed rounded-[8px]"
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
