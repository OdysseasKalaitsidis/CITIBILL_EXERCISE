import type { Activity } from "@/types";

interface ActivityCardProps {
  activity: Activity;
  onAdd: (activity: Activity) => void;
  isAlreadySelected: boolean;
}

export default function ActivityCard({
  activity,
  onAdd,
  isAlreadySelected,
}: ActivityCardProps) {
  return (
    <div
      draggable={!isAlreadySelected}
      onDragStart={(e) => {
        const idStr = String(activity.id);
        e.dataTransfer.setData("activityId", idStr);
        e.dataTransfer.setData("text/plain", idStr);
      }}
      className="rounded-xl flex flex-col justify-between transition-colors duration-200 h-full text-left bg-bg border border-border p-4"
      style={{ cursor: isAlreadySelected ? "default" : "grab" }}
    >
      <div className="space-y-2 grow">
        {/* Line 1: Category Tag */}
        <span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-accent">
          {activity.tags.join(" · ")}
        </span>

        {/* Line 2: Title */}
        <h3 className="text-[15px] font-semibold text-text line-clamp-2 leading-tight">
          {activity.title}
        </h3>

        {/* Line 3: Description */}
        {activity.description && (
          <p className="text-[13px] text-muted line-clamp-2 leading-normal">
            {activity.description}
          </p>
        )}
      </div>

      {/* Bottom Row */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-[13px] font-bold text-text">
          {activity.price > 0 ? `${activity.price.toFixed(2)}€` : "Δωρεάν"}
        </span>

        {isAlreadySelected ? (
          <span className="text-[11px] font-medium text-muted">Προστέθηκε</span>
        ) : (
          <button
            type="button"
            onClick={() => onAdd(activity)}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-accent text-white text-lg font-normal border-none transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
