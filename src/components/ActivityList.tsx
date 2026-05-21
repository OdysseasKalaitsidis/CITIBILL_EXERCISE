import type { Activity } from "@/types";
import { Search } from "lucide-react";
import ActivityCard from "./ActivityCard";
import { getCategoryName, normalizeText } from "@/utils/activityHelpers";

interface ActivityListProps {
  activities: Activity[];
  filterText: string;
  onFilterTextChange: (text: string) => void;
  sortBy: "title_asc" | "title_desc" | "cost_asc" | "cost_desc" | null;
  onSortByChange: (sort: "title_asc" | "title_desc" | "cost_asc" | "cost_desc" | null) => void;
  onAddClick: (activity: Activity) => void;
  scheduledIds: string[];
}

export default function ActivityList({
  activities,
  filterText,
  onFilterTextChange,
  sortBy,
  onSortByChange,
  onAddClick,
  scheduledIds,
}: ActivityListProps) {
  // Filter & Sort
  const processedActivities = activities
    .filter((act) => {
      const matchText = normalizeText(filterText);
      const categoryName = getCategoryName(act);
      return (
        normalizeText(act.title).includes(matchText) ||
        (act.description && normalizeText(act.description).includes(matchText)) ||
        normalizeText(categoryName).includes(matchText)
      );
    })
    .sort((a, b) => {
      if (sortBy === "cost_asc") {
        return a.cost - b.cost;
      }
      if (sortBy === "cost_desc") {
        return b.cost - a.cost;
      }
      if (sortBy === "title_asc") {
        return a.title.localeCompare(b.title, "el");
      }
      if (sortBy === "title_desc") {
        return b.title.localeCompare(a.title, "el");
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Top Bar: Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-grow flex items-center">
          <Search 
            className="absolute left-4 w-4 h-4 pointer-events-none" 
            style={{ color: "var(--muted)" }}
            strokeWidth={2} 
          />
          <input
            type="text"
            placeholder="Αναζήτηση δραστηριότητας..."
            value={filterText}
            onChange={(e) => onFilterTextChange(e.target.value)}
            className="w-full pl-10 pr-4 py-[10px] text-sm font-normal focus:outline-none transition-all"
            style={{
              borderRadius: "24px",
              border: "1px solid var(--border)",
              boxShadow: "none",
              backgroundColor: "var(--bg)",
              color: "var(--text)",
            }}
          />
        </div>

        {/* Sort Select */}
        <div className="flex items-center min-w-[200px]">
          <select
            value={sortBy || ""}
            onChange={(e) => {
              const val = e.target.value;
              onSortByChange(
                val === "title_asc" ||
                val === "title_desc" ||
                val === "cost_asc" ||
                val === "cost_desc"
                  ? val
                  : null
              );
            }}
            className="w-full py-[10px] px-4 text-sm transition-all cursor-pointer font-normal focus:outline-none appearance-none"
            style={{
              borderRadius: "24px",
              border: "1px solid var(--border)",
              boxShadow: "none",
              backgroundColor: "var(--bg)",
              color: "var(--text)",
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23717171' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 16px center",
              backgroundSize: "16px",
              paddingRight: "40px"
            }}
          >
            <option value="" className="bg-[var(--bg)] text-[var(--muted)]">
              Ταξινόμηση ανά...
            </option>
            <option value="cost_asc" className="bg-[var(--bg)] text-[var(--text)]">
              Κόστος (Χαμηλό σε Υψηλό)
            </option>
            <option value="cost_desc" className="bg-[var(--bg)] text-[var(--text)]">
              Κόστος (Υψηλό σε Χαμηλό)
            </option>
            <option value="title_asc" className="bg-[var(--bg)] text-[var(--text)]">
              Τίτλος (Α - Ω)
            </option>
            <option value="title_desc" className="bg-[var(--bg)] text-[var(--text)]">
              Τίτλος (Ω - Α)
            </option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      {processedActivities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {processedActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onAdd={onAddClick}
              isAlreadySelected={scheduledIds.includes(activity.id)}
            />
          ))}
        </div>
      ) : (
        <div 
          className="text-center py-16 border border-dashed rounded-[12px]"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
          }}
        >
          <p className="text-sm font-normal" style={{ color: "var(--muted)" }}>
            Δεν βρέθηκαν δραστηριότητες που να ταιριάζουν στην αναζήτησή σας.
          </p>
        </div>
      )}
    </div>
  );
}
