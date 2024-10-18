// providers/SettingsProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchSettings } from "@/services/fetchSettings";

// Create the settings context
const SettingsContext = createContext<Record<string, { method: string; value: string }> | null>(null);

// Provide settings context
export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Record<string, { method: string; value: string }>>({});

  useEffect(() => {
    const loadSettings = async () => {
      const fetchedSettings = await fetchSettings();
      setSettings(fetchedSettings);
    };

    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use settings
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
