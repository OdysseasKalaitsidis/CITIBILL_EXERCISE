export interface Activity {
  id: number;
  title: string;
  tags: string[];
  price: number;
  description: string;
}

export interface ScheduledActivity extends Activity {
  startTime: string;
  endTime: string;
}

export interface ActivityFilters {
  searchQuery: string;
  selectedTags: string[];
  sortBy: "title-asc" | "title-desc" | "price-asc" | "price-desc" | null;
}
