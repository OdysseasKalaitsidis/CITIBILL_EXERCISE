import ThemeToggle from "@/components/ThemeToggle";

interface HeaderProps {
  theme: "light" | "dark";
  onThemeToggle: () => void;
}

export default function Header({ theme, onThemeToggle }: HeaderProps) {
  return (
    <header className="flex justify-between items-start pb-6">
      <div className="space-y-1">
        <h1 className="text-[2.2rem] md:text-[2.6rem] font-bold leading-tight tracking-tight">
          Travel Planner
        </h1>
      </div>
      <ThemeToggle theme={theme} onToggle={onThemeToggle} />
    </header>
  );
}
