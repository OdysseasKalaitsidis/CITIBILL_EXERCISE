import type { Activity } from "@/types";

interface ActivityCardProps {
  activity: Activity;
  onAdd: (activity: Activity) => void;
  isAlreadySelected: boolean;
}

export default function ActivityCard({ activity, onAdd, isAlreadySelected }: ActivityCardProps) {
  return (
    <div 
      draggable={!isAlreadySelected}
      onDragStart={(e) => {
        e.dataTransfer.setData("activityId", activity.id);
      }}
      className="rounded-[12px] flex flex-col justify-between transition-colors duration-200 h-full text-left bg-[var(--bg)] border border-[var(--border)] p-4"
      style={{ cursor: isAlreadySelected ? "default" : "grab" }}
    >
      <div className="space-y-2 flex-grow">
        {/* Line 1: Category Tag */}
        <span 
          className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--accent)]"
        >
          {activity.tags.join(" · ")}
        </span>

        {/* Line 2: Title */}
        <h3 
          className="text-[15px] font-semibold text-[var(--text)] line-clamp-2 leading-tight"
        >
          {activity.title}
        </h3>

        {/* Line 3: Description */}
        {activity.description && (
          <p 
            className="text-[13px] text-[var(--muted)] line-clamp-2 leading-normal"
          >
            {activity.description}
          </p>
        )}
      </div>

      {/* Bottom Row */}
      <div className="flex justify-between items-center mt-4">
        <span 
          className="text-[13px] font-bold text-[var(--text)]"
        >
          {activity.price > 0 ? `${activity.price.toFixed(2)}€` : "Δωρεάν"}
        </span>

        {isAlreadySelected ? (
          <span 
            className="text-[11px] font-medium text-[var(--muted)]"
          >
            Προστέθηκε
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onAdd(activity)}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--accent)] text-white text-lg font-normal border-none transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
