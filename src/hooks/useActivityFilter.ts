import { useState } from "react";
import type { Activity } from "@/types";
import { normalizeText } from "@/utils/text";

export interface ActivityFilterState {
  filterText: string;
  activeTag: string | null;
  sortBy: "title_asc" | "title_desc" | "price_asc" | "price_desc" | null;
  allTags: string[];
  processedActivities: Activity[];
  setFilterText: (textVal: string) => void;
  setActiveTag: (tagVal: string | null) => void;
  setSortBy: (
    sortVal: "title_asc" | "title_desc" | "price_asc" | "price_desc" | null,
  ) => void;
}

export function useActivityFilter(activities: Activity[]): ActivityFilterState {
  const [filterText, setFilterText] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<
    "title_asc" | "title_desc" | "price_asc" | "price_desc" | null
  >(null);

  const allTags: string[] = [
    ...new Set(activities.flatMap((activityItem) => activityItem.tags)),
  ];

  const processedActivities: Activity[] = activities
    .filter((activityItem) => !activeTag || activityItem.tags.includes(activeTag))
    .filter((activityItem) => {
      const matchText = normalizeText(filterText);
      const isTitleMatch = normalizeText(activityItem.title).includes(matchText);
      const isDescriptionMatch = activityItem.description
        ? normalizeText(activityItem.description).includes(matchText)
        : false;
      const isTagMatch = activityItem.tags.some((tagItem) =>
        normalizeText(tagItem).includes(matchText),
      );

      return isTitleMatch || isDescriptionMatch || isTagMatch;
    })
    .sort((activityA, activityB) => {
      if (sortBy === "price_asc") {
        return activityA.price - activityB.price;
      }
      if (sortBy === "price_desc") {
        return activityB.price - activityA.price;
      }
      if (sortBy === "title_asc") {
        return activityA.title.localeCompare(activityB.title, "el");
      }
      if (sortBy === "title_desc") {
        return activityB.title.localeCompare(activityA.title, "el");
      }
      return 0;
    });

  return {
    filterText,
    activeTag,
    sortBy,
    allTags,
    processedActivities,
    setFilterText,
    setActiveTag,
    setSortBy,
  };
}
