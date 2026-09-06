import { create } from "zustand";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  sidebarOpen: boolean;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("tradex_theme") as Theme | null;
  return stored || "dark";
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "dark",
  sidebarOpen: true,

  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tradex_theme", theme);
    }
    set({ theme });
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setSidebarOpen: (sidebarOpen) => {
    set({ sidebarOpen });
  },
}));

// Initialize theme from localStorage on first load
if (typeof window !== "undefined") {
  useThemeStore.setState({ theme: getInitialTheme() });
}
