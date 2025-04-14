import React, { createContext, useContext, useState } from "react";

const themes = {
  blue: {
    primary: "#0077b6",
    gradient: "linear-gradient(to right, #0077b6, #90e0ef)",
    thumb: "#0077b6",
    plotBg: "#ffffff",
    plotFg: "#000000",
  },
  green: {
    primary: "#2e7d32",
    gradient: "linear-gradient(to right, #a8e6cf, #dcedc1)",
    thumb: "#2e7d32",
    plotBg: "#ffffff",
    plotFg: "#000000",
  },
  grey: {
    primary: "#616161",
    gradient: "linear-gradient(to right, #cfd8dc, #eceff1)",
    thumb: "#616161",
    plotBg: "#ffffff",
    plotFg: "#000000",
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState("blue");
  const [darkMode, setDarkMode] = useState(false);

  const theme = {
    ...themes[themeName],
    plotBg: darkMode ? "#1e1e1e" : themes[themeName].plotBg,
    plotFg: darkMode ? "#ffffff" : themes[themeName].plotFg,
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, setThemeName, darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
