// providers/SettingsProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchSettings } from "@/services/fetchSettings";

interface SettingsContextType {
  settings: Record<string, { method: string; value: string }>;
  formatAmount: (amount: string) => string;
  reloadSettings: () => Promise<void>;
}
// Create the settings context
//const SettingsContext = createContext<Record<string, { method: string; value: string }> | null>(null);
const SettingsContext = createContext<SettingsContextType | null>(null);

// Provide settings context
export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Record<string, { method: string; value: string }>>({});

  const loadSettings = async () => {
    const fetchedSettings = await fetchSettings();
    setSettings(fetchedSettings);
  };
  useEffect(() => {
    loadSettings();
  }, []);

  const reloadSettings = async () => {
    await loadSettings();
  };

  const formatAmount = (amount: string) => {
    const currency = 'INR'; // Default to USD if not set
    const locale = 'en-IN'; // Default to en-US if not set

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(amount));
  };

  return (
    <SettingsContext.Provider value={{settings,formatAmount,reloadSettings}}>
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
