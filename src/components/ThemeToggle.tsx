interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent transition-all cursor-pointer select-none text-lg focus:outline-none"
      style={{
        border: "1px solid var(--border)",
        color: "var(--text)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--surface)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
      title="Αλλαγή Θέματος"
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
