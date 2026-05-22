export const TIME_SLOTS: string[] = Array.from({ length: 48 }, (_, timeSlotIndex) => {
  const hours = String(Math.floor(timeSlotIndex / 2)).padStart(2, "0");
  const minutes = timeSlotIndex % 2 === 0 ? "00" : "30";
  return `${hours}:${minutes}`;
});

export function parseTimeToMinutes(timeStr: string): number {
  const [hoursStr, minutesStr] = timeStr.split(":");
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  return hours * 60 + minutes;
}

export function formatTimeRange(startTime: string, endTime: string): string {
  if (!startTime || !endTime) {
    return "";
  }
  return `${startTime} - ${endTime}`;
}

export function validateChange(startTime: string, endTime: string): string | null {
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

  return null;
}
