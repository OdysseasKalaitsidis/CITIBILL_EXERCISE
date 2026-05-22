import ThemeToggle from "@/components/ThemeToggle";

interface HeaderProps {
  theme: "light" | "dark";
  onThemeToggle: () => void;
}

export default function Header({ theme, onThemeToggle }: HeaderProps) {
  return (
    <header className="flex justify-between items-center pb-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <img
          src="/favicon.svg"
          alt="Travel Planner Logo"
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 select-none"
        />
        <h1 className="text-[1.6rem] sm:text-[2.2rem] md:text-[2.6rem] font-bold leading-tight tracking-tight">
          Travel Planner
        </h1>
      </div>
      <ThemeToggle theme={theme} onToggle={onThemeToggle} />
    </header>
  );
}
