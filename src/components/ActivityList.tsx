import type { Activity } from "@/types";
import ActivityCard from "./ActivityCard";
import FilterBar from "./FilterBar";
import { useActivityFilter } from "@/hooks/useActivityFilter";

interface ActivityListProps {
  activities: Activity[];
  onAddClick: (activityItem: Activity) => void;
  scheduledIds: string[];
}

export default function ActivityList({
  activities,
  onAddClick,
  scheduledIds,
}: ActivityListProps) {
  const {
    filterText,
    activeTag,
    sortBy,
    allTags,
    processedActivities,
    setFilterText,
    setActiveTag,
    setSortBy,
  } = useActivityFilter(activities);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (
      selectedValue === "title_asc" ||
      selectedValue === "title_desc" ||
      selectedValue === "price_asc" ||
      selectedValue === "price_desc"
    ) {
      setSortBy(selectedValue);
    } else {
      setSortBy(null);
    }
  };

  return (
    <div className="space-y-6">
      <FilterBar
        filterText={filterText}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      <div className="flex overflow-x-auto flex-nowrap gap-2 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
        {allTags.map((tagItem) => (
          <button
            key={tagItem}
            type="button"
            onClick={() => setActiveTag(tagItem)}
            className="px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer focus:outline-none"
            style={{
              backgroundColor:
                activeTag === tagItem ? "var(--text)" : "transparent",
              borderColor:
                activeTag === tagItem ? "var(--text)" : "var(--border)",
              color: activeTag === tagItem ? "var(--bg)" : "var(--text)",
            }}
          >
            {tagItem}
          </button>
        ))}
      </div>

      {processedActivities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {processedActivities.map((activityItem) => (
            <ActivityCard
              key={activityItem.id}
              activity={activityItem}
              onAdd={onAddClick}
              isAlreadySelected={scheduledIds.includes(activityItem.id)}
            />
          ))}
        </div>
      ) : (
        <div
          className="text-center py-16 border border-dashed rounded-xl"
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
