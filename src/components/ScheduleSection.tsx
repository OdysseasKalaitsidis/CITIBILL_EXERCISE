import type { ReactNode } from "react";

interface ScheduleSectionProps {
  activeDay: 1 | 2 | 3;
  onDaySelect: (dayVal: 1 | 2 | 3) => void;
  activeDayTotal: number;
  tripTotal: number;
  hasScheduledItems: boolean;
  onClearAll: () => void;
  children: ReactNode;
}

export default function ScheduleSection({
  activeDay,
  onDaySelect,
  activeDayTotal,
  tripTotal,
  hasScheduledItems,
  onClearAll,
  children,
}: ScheduleSectionProps) {
  const daysArray: (1 | 2 | 3)[] = [1, 2, 3];

  return (
    <section className="order-1 lg:order-2 lg:col-span-7 lg:sticky lg:top-8 flex flex-col space-y-3">
      <h2 className="text-xl font-bold leading-tight tracking-tight">
        Το Πρόγραμμά Μου
      </h2>
      <div
        className="rounded-xl p-4 sm:p-6 flex flex-col min-h-80 sm:min-h-120 transition-colors duration-200"
        style={{
          backgroundColor: "var(--bg)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div
          className="flex border-b mb-6"
          style={{ borderColor: "var(--border)" }}
        >
          {daysArray.map((dayVal) => (
            <button
              key={dayVal}
              type="button"
              onClick={() => onDaySelect(dayVal)}
              className="flex-1 py-3 text-center text-sm transition-all cursor-pointer border-b-2 focus:outline-none"
              style={{
                borderBottomColor:
                  activeDay === dayVal ? "var(--accent)" : "transparent",
                color: activeDay === dayVal ? "var(--text)" : "var(--muted)",
                fontWeight: activeDay === dayVal ? 600 : 400,
              }}
            >
              Ημέρα {dayVal}
            </button>
          ))}
        </div>

        <div className="grow flex flex-col">{children}</div>

        <div
          className="mt-6 pt-4 border-t flex justify-between items-center bg-transparent"
          style={{ borderColor: "var(--border)" }}
        >
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--muted)" }}
          >
            Σύνολο Ημέρας:
          </span>
          <span className="text-base" style={{ fontWeight: 700 }}>
            Σύνολο: {activeDayTotal.toFixed(2)}€
          </span>
        </div>
      </div>

      {hasScheduledItems && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 500,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Συνολικό Κόστος Ταξιδιού
          </span>
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--text)",
            }}
          >
            {tripTotal.toFixed(2)}€
          </span>
        </div>
      )}

      {hasScheduledItems && (
        <div className="flex justify-end px-2">
          <button
            onClick={onClearAll}
            className="text-xs transition-colors cursor-pointer border-none bg-transparent"
            style={{ color: "var(--muted)" }}
            onMouseEnter={(event) =>
              (event.currentTarget.style.color = "var(--text)")
            }
            onMouseLeave={(event) =>
              (event.currentTarget.style.color = "var(--muted)")
            }
          >
            Καθαρισμός Όλων
          </button>
        </div>
      )}
    </section>
  );
}
