import { Sun, Moon } from "lucide-react";
import useTheme from "../../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
    //   className="rounded-full border border-white/10 bg-white/10 p-3 backdrop-blur transition hover:scale-105 dark:bg-white/10 light:bg-slate-200"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-300" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700" />
      )}
    </button>
  );
}