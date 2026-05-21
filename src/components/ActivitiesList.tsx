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
