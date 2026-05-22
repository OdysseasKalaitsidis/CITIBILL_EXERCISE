import type { Activity, ScheduledActivity } from "@/types";
import { parseTimeToMinutes } from "./time";

export function validateAdd(
  activity: Activity,
  dayVal: number,
  startTime: string,
  endTime: string,
  scheduledList: ScheduledActivity[],
): string | null {
  const isAlreadySelected = scheduledList.some(
    (scheduledItem) => scheduledItem.activityId === activity.id,
  );
  if (isAlreadySelected) {
    return "Η δραστηριότητα έχει ήδη επιλεγεί";
  }

  if (endTime <= startTime) {
    return "Το τέλος πρέπει να είναι μετά την αρχή";
  }

  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);
  const durationMinutes = endMinutes - startMinutes;
  const maxDurationMinutes = 7 * 60;

  if (durationMinutes > maxDurationMinutes) {
    return "Μέγιστη διάρκεια 7 ώρες";
  }

  const hasOverlap = scheduledList.some(
    (scheduledItem) =>
      scheduledItem.day === dayVal &&
      scheduledItem.activityId !== activity.id &&
      startTime < scheduledItem.endTime &&
      endTime > scheduledItem.startTime,
  );

  if (hasOverlap) {
    return "Υπάρχει επικάλυψη ωραρίου με άλλη δραστηριότητα";
  }

  return null;
}

export function hasConflict(
  item: ScheduledActivity,
  allItems: ScheduledActivity[],
): boolean {
  return allItems.some(
    (otherItem) =>
      otherItem.activityId !== item.activityId &&
      item.startTime < otherItem.endTime &&
      item.endTime > otherItem.startTime,
  );
}
