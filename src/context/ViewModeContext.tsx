import React, { createContext, useContext, useState, useEffect } from "react";
import { ViewMode, DevicePreset, DEVICE_PRESETS, ViewModeContextType } from "../types/viewMode";

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [currentDevice, setCurrentDevice] = useState<DevicePreset>(DEVICE_PRESETS[0]);

  // Update current device when view mode changes
  useEffect(() => {
    if (viewMode === "desktop" && currentDevice.type !== "desktop") {
      setCurrentDevice(DEVICE_PRESETS.find(d => d.type === "desktop") || DEVICE_PRESETS[0]);
    } else if (viewMode === "mobile" && currentDevice.type !== "mobile") {
      setCurrentDevice(DEVICE_PRESETS.find(d => d.type === "mobile") || DEVICE_PRESETS[3]);
    }
  }, [viewMode, currentDevice.type]);

  const setDevice = (device: DevicePreset) => {
    setCurrentDevice(device);
    setViewMode(device.type);
  };

  const toggleViewMode = () => {
    const newMode = viewMode === "desktop" ? "mobile" : "desktop";
    setViewMode(newMode);
  };

  return (
    <ViewModeContext.Provider value={{
      viewMode,
      currentDevice,
      setViewMode,
      setDevice,
      toggleViewMode
    }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error("useViewMode must be used within a ViewModeProvider");
  }
  return context;
}