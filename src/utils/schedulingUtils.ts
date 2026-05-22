import type { Activity, ScheduledActivity } from "@/types";
import { parseTimeToMinutes, validateChange } from "./time";

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

  const baseError = validateChange(startTime, endTime);
  if (baseError) {
    return baseError;
  }

  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  const hasOverlap = scheduledList.some((scheduledItem) => {
    if (
      scheduledItem.day !== dayVal ||
      scheduledItem.activityId === activity.id
    ) {
      return false;
    }
    const otherStartMins = parseTimeToMinutes(scheduledItem.startTime);
    const otherEndMins = parseTimeToMinutes(scheduledItem.endTime);
    return startMinutes < otherEndMins && endMinutes > otherStartMins;
  });

  if (hasOverlap) {
    return "Υπάρχει επικάλυψη ωραρίου με άλλη δραστηριότητα";
  }

  return null;
}

export function hasConflict(
  item: ScheduledActivity,
  allItems: ScheduledActivity[],
): boolean {
  const itemStart = parseTimeToMinutes(item.startTime);
  const itemEnd = parseTimeToMinutes(item.endTime);
  return allItems.some((otherItem) => {
    if (otherItem.activityId === item.activityId) {
      return false;
    }
    const otherStartMins = parseTimeToMinutes(otherItem.startTime);
    const otherEndMins = parseTimeToMinutes(otherItem.endTime);
    return itemStart < otherEndMins && itemEnd > otherStartMins;
  });
}

