"use client";

import { createContext, useState, useEffect, useMemo, useContext } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline, PaletteMode } from "@mui/material";

interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>("dark");

  useEffect(() => {
    const storedMode = localStorage.getItem("theme") as PaletteMode;
    if (storedMode) {
      setMode(storedMode);
    }
  }, []);

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newMode);
      return newMode;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#90caf9" },
          secondary: { main: "#f48fb1" },
          background: { default: mode === "dark" ? "#121212" : "#ffffff" },
          text: { primary: mode === "dark" ? "#ffffff" : "#000000" },
        },
      }),
    [mode]
  );

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
