export interface Activity {
  id: string;
  title: string;
  price: number;
  description?: string;
  tags: string[];
}

export interface ScheduledActivity {
  activityId: string;
  day: 1 | 2 | 3;
  startTime: string;  // slot string e.g. "09:00"
  endTime: string;    // slot string e.g. "12:00"
}

export interface RawActivity {
  id: number;
  title: string;
  price: number;
  description?: string;
  tags: string[];
}

