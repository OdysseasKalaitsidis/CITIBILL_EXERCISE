import type { Activity } from "@/types";
import { getCategoryName } from "@/utils/activityHelpers";

interface ActivityCardProps {
  activity: Activity;
  onAdd: (activity: Activity) => void;
  isAlreadySelected: boolean;
}

export default function ActivityCard({ activity, onAdd, isAlreadySelected }: ActivityCardProps) {
  const categoryName = getCategoryName(activity);

  return (
    <div 
      className="rounded-[12px] flex flex-col justify-between transition-colors duration-200 h-full text-left"
      style={{
        backgroundColor: "var(--bg)",
        border: "1px solid var(--border)",
        padding: "16px",
      }}
    >
      <div className="space-y-2 flex-grow">
        {/* Line 1: Category Tag */}
        <span 
          style={{
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--accent)",
            display: "block",
          }}
        >
          {categoryName}
        </span>

        {/* Line 2: Title */}
        <h3 
          className="line-clamp-2 leading-tight"
          style={{
            fontSize: "15px",
            fontWeight: 600,
            color: "var(--text)",
          }}
        >
          {activity.title}
        </h3>

        {/* Line 3: Description */}
        <p 
          className="line-clamp-2 leading-relaxed"
          style={{
            fontSize: "13px",
            color: "var(--muted)",
          }}
        >
          {activity.description}
        </p>
      </div>

      {/* Bottom row: Price left + Add button right */}
      <div className="flex items-center justify-between mt-4">
        <span 
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "var(--text)",
          }}
        >
          {activity.cost === 0 ? "Δωρεάν" : `${activity.cost.toFixed(2)}€`}
        </span>

        {isAlreadySelected ? (
          <span 
            className="select-none flex-shrink-0"
            style={{
              fontSize: "11px",
              fontWeight: 500,
              color: "var(--muted)",
            }}
          >
            Προστέθηκε
          </span>
        ) : (
          <button
            onClick={() => onAdd(activity)}
            className="w-[32px] h-[32px] rounded-full flex items-center justify-center border-none text-white transition-all cursor-pointer flex-shrink-0"
            style={{ 
              fontSize: "18px", 
              fontWeight: "normal",
              backgroundColor: "var(--accent)",
              color: "var(--btn-text)",
            }}
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
