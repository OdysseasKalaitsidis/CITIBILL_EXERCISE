import { Activity } from "@/types";
import { useState, useMemo } from "react";
import ActivityCard from "@/components/ActivityCard";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";

interface ActivityListProps {
  activities: Activity[];
  selectedIds: number[];
  onAddClick: (activity: Activity) => void;
}

export default function ActivityList({
  activities,
  selectedIds,
  onAddClick,
}: ActivityListProps) {
  //filters
  const [search, setSearch] = useState("");

  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<
    "price-asc" | "price-desc" | "title-asc" | "title-desc" | "none"
  >("none");

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    activities.forEach((act) => {
      act.tags.forEach((t) => tags.add(t));
    });
    return Array.from(tags);
  }, [activities]);

  const processedActivities = useMemo(() => {
    return activities
      .filter((act) => {
        const matchesSearch = act.title
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesTag = selectedTag ? act.tags.includes(selectedTag) : true;
        return matchesSearch && matchesTag;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;

        if (sortBy === "title-asc") return a.title.localeCompare(b.title);
        if (sortBy === "title-desc") return b.title.localeCompare(a.title);
        return 0;
      });
  }, [activities, search, selectedTag, sortBy]);
}
return (
        <div className="space-y-6">

          <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl
  border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-
  900/50">

            {/* Search */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4
  h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Αναζήτηση δραστηριότητας..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border
  border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950
  focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-
  indigo-500 transition-all dark:text-slate-100"
              />
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 min-w-[200px]">
              <ArrowUpDown className="w-4 h-4 text-slate-400 flex-shrink-0"
  />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full text-sm rounded-lg border border-slate-200
  dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 focus:outline-none
  focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-
  slate-100 dark:bg-slate-900"
              >
                <option value="none">Ταξινόμηση ανά...</option>
                <option value="price-asc">Κόστος: Χαμηλό σε Υψηλό</option>
                <option value="price-desc">Κόστος: Υψηλό σε Χαμηλό</option>
                <option value="title-asc">Τίτλος: Α - Ω</option>
                <option value="title-desc">Τίτλος: Ω - Α</option>
              </select>
            </div>
        </div>
    
    {/* 🏷️ Filter Badges */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-slate-400 dark:text-
  slate-500 flex items-center gap-1.5 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Φίλτρα:
            </span>

            {/* Toggle option "All" */}
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              className={`text-xs px-3.5 py-1.5 rounded-full transition-all
  border ${
                selectedTag === null
                  ? "bg-indigo-600 border-indigo-600 text-white font-semibold
  shadow-sm shadow-indigo-500/20"
                  : "bg-white border-slate-200 dark:bg-slate-900 dark:border-
  slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100
  dark:hover:bg-slate-800"
              }`}
            >
              Όλα
            </button>

            {/* Dynamic Tag pills */}
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag === selectedTag ? null :
  tag)}
                className={`text-xs px-3.5 py-1.5 rounded-full transition-all
  border capitalize ${
                  tag === selectedTag
                    ? "bg-indigo-600 border-indigo-600 text-white font-
  semibold shadow-sm shadow-indigo-500/20"
                    : "bg-white border-slate-200 dark:bg-slate-900
  dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100
  dark:hover:bg-slate-800"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>        {/* 🗂️ Grid Layout */}
          {processedActivities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
  gap-6">
              {processedActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onAdd={onAddClick}
                  isAlreadySelected={selectedIds.includes(activity.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-
  slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/10">
              <p className="text-slate-400 dark:text-slate-500 text-sm">
                Δεν βρέθηκαν δραστηριότητες που να ταιριάζουν στα φίλτρα σας.
              </p>
            </div>
          )}
        </div>
      );
    }