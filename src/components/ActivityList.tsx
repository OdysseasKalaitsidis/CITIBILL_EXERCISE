import { useState } from "react";
import type { Activity } from "@/types";
import { Search } from "lucide-react";
import ActivityCard from "./ActivityCard";

const normalizeText = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

interface ActivityListProps {
  activities: Activity[];
  onAddClick: (activity: Activity) => void;
  scheduledIds: string[];
}

export default function ActivityList({
  activities,
  onAddClick,
  scheduledIds,
}: ActivityListProps) {
  const [filterText, setFilterText] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"title_asc" | "title_desc" | "price_asc" | "price_desc" | null>(null);

  const allTags = [...new Set(activities.flatMap((a) => a.tags))];

  // Filter & Sort
  const processedActivities = activities
    .filter((act) => !activeTag || act.tags.includes(activeTag))
    .filter((act) => {
      const matchText = normalizeText(filterText);
      return (
        normalizeText(act.title).includes(matchText) ||
        (act.description && normalizeText(act.description).includes(matchText)) ||
        act.tags.some((t) => normalizeText(t).includes(matchText))
      );
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") {
        return a.price - b.price;
      }
      if (sortBy === "price_desc") {
        return b.price - a.price;
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
            onChange={(e) => setFilterText(e.target.value)}
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
              setSortBy(
                val === "title_asc" ||
                val === "title_desc" ||
                val === "price_asc" ||
                val === "price_desc"
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
            <option value="price_asc" className="bg-[var(--bg)] text-[var(--text)]">
              Τιμή (Χαμηλή σε Υψηλή)
            </option>
            <option value="price_desc" className="bg-[var(--bg)] text-[var(--text)]">
              Τιμή (Υψηλή σε Χαμηλή)
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

      {/* Tag Buttons Filter */}
      <div className="flex flex-wrap gap-2 pb-2">
        <button
          type="button"
          onClick={() => setActiveTag(null)}
          className="px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer focus:outline-none"
          style={{
            backgroundColor: activeTag === null ? "var(--text)" : "transparent",
            borderColor: activeTag === null ? "var(--text)" : "var(--border)",
            color: activeTag === null ? "var(--bg)" : "var(--text)",
          }}
        >
          Όλα
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag)}
            className="px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer focus:outline-none"
            style={{
              backgroundColor: activeTag === tag ? "var(--text)" : "transparent",
              borderColor: activeTag === tag ? "var(--text)" : "var(--border)",
              color: activeTag === tag ? "var(--bg)" : "var(--text)",
            }}
          >
            {tag}
          </button>
        ))}
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
