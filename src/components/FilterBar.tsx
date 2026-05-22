import { Search } from "lucide-react";

interface FilterBarProps {
  filterText: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sortBy: "title_asc" | "title_desc" | "price_asc" | "price_desc" | null;
  onSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function FilterBar({
  filterText,
  onSearchChange,
  sortBy,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative grow flex items-center">
        <Search
          className="absolute left-4 w-4 h-4 pointer-events-none"
          style={{ color: "var(--muted)" }}
          strokeWidth={2}
        />
        <input
          type="text"
          placeholder="Αναζήτηση δραστηριότητας..."
          value={filterText}
          onChange={onSearchChange}
          className="w-full pl-10 pr-4 py-2.5 text-sm font-normal focus:outline-none transition-all"
          style={{
            borderRadius: "24px",
            border: "1px solid var(--border)",
            boxShadow: "none",
            backgroundColor: "var(--bg)",
            color: "var(--text)",
          }}
        />
      </div>

      {/* Sort Select */}
      <div className="flex items-center min-w-50">
        <select
          value={sortBy || ""}
          onChange={onSortChange}
          className="w-full py-2.5 px-4 text-sm transition-all cursor-pointer font-normal focus:outline-none appearance-none"
          style={{
            borderRadius: "24px",
            border: "1px solid var(--border)",
            boxShadow: "none",
            backgroundColor: "var(--bg)",
            color: "var(--text)",
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23717171' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 16px center",
            backgroundSize: "16px",
            paddingRight: "40px",
          }}
        >
          <option value="" className="bg-bg text-muted">
            Ταξινόμηση ανά...
          </option>
          <option value="price_asc" className="bg-bg text-text">
            Τιμή (Χαμηλή σε Υψηλή)
          </option>
          <option value="price_desc" className="bg-bg text-text">
            Τιμή (Υψηλή σε Χαμηλή)
          </option>
          <option value="title_asc" className="bg-bg text-text">
            Τίτλος (Α - Ω)
          </option>
          <option value="title_desc" className="bg-bg text-text">
            Τίτλος (Ω - Α)
          </option>
        </select>
      </div>
    </div>
  );
}
