import { TIME_SLOTS } from "@/utils/time";

interface TimeSlotSelectorsProps {
  localStart: string;
  localEnd: string;
  onStartChange: (startVal: string) => void;
  onEndChange: (endVal: string) => void;
  inlineError: string | null;
}

export default function TimeSlotSelectors({
  localStart,
  localEnd,
  onStartChange,
  onEndChange,
  inlineError,
}: TimeSlotSelectorsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 pb-3 pt-1">
      <div className="space-y-1 text-left">
        <span
          className="text-[10px] uppercase tracking-wider font-semibold"
          style={{ color: "var(--muted)" }}
        >
          Από
        </span>
        <select
          value={localStart}
          onChange={(event) => onStartChange(event.target.value)}
          className="w-full text-xs py-1.5 px-2.5 rounded focus:outline-none cursor-pointer"
          style={{
            border: "1px solid var(--border)",
            backgroundColor: "var(--bg)",
            color: "var(--text)",
          }}
        >
          {TIME_SLOTS.map((slotVal) => (
            <option key={slotVal} value={slotVal} className="bg-bg text-text">
              {slotVal}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1 text-left">
        <span
          className="text-[10px] uppercase tracking-wider font-semibold"
          style={{ color: "var(--muted)" }}
        >
          Έως
        </span>
        <select
          value={localEnd}
          onChange={(event) => onEndChange(event.target.value)}
          className="w-full text-xs py-1.5 px-2.5 rounded focus:outline-none cursor-pointer"
          style={{
            border: "1px solid var(--border)",
            backgroundColor: "var(--bg)",
            color: "var(--text)",
          }}
        >
          {TIME_SLOTS.map((slotVal) => (
            <option key={slotVal} value={slotVal} className="bg-bg text-text">
              {slotVal}
            </option>
          ))}
        </select>
      </div>

      {inlineError && (
        <div
          className="col-span-2 text-left"
          style={{ color: "var(--accent)", fontSize: "11px" }}
        >
          {inlineError}
        </div>
      )}
    </div>
  );
}
