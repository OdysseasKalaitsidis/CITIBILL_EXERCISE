export interface Activity {
  id: string
  title: string
  cost: number
  description?: string
}

export interface ScheduledActivity {
  activityId: string
  day: 1 | 2 | 3
  startDateTime: string  // ISO string
  endDateTime: string
}
