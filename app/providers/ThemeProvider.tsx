"use client";

import { createContext, useState, useEffect, useMemo, useContext } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline, PaletteMode } from "@mui/material";

interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PaletteMode | null>(null);

  useEffect(() => {
    const storedMode = (localStorage.getItem("theme") as PaletteMode) || "dark";
    setMode(storedMode);
  }, []);

  const toggleTheme = () => {
    setMode((prevMode) => {
      if (!prevMode) return "dark";
      const newMode = prevMode === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newMode);
      return newMode;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode ?? "dark",
          primary: { main: "#90FFCC" },
          secondary: { main: "#f48fb1" },
          background: { default: mode === "dark" ? "#121212" : "#ffffff" },
          text: { primary: mode === "dark" ? "#ffffff" : "#000000" },
        },
      }),
    [mode]
  );

  // 🔥 Avoid rendering anything until mode is initialized to prevent hydration errors
  if (mode === null) return null;

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
