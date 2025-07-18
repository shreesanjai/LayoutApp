export type ViewMode = "desktop" | "mobile";

export interface DevicePreset {
  id: string;
  name: string;
  width: number;
  height: number;
  type: ViewMode;
  icon: string;
}

export const DEVICE_PRESETS: DevicePreset[] = [
  // Desktop presets
  {
    id: "desktop-large",
    name: "Desktop Large",
    width: 1200,
    height: 800,
    type: "desktop",
    icon: "💻"
  },
  {
    id: "desktop-medium",
    name: "Desktop Medium",
    width: 1024,
    height: 768,
    type: "desktop",
    icon: "🖥️"
  },
  {
    id: "tablet-landscape",
    name: "Tablet Landscape",
    width: 1024,
    height: 768,
    type: "desktop",
    icon: "📱"
  },
  // Mobile presets
  {
    id: "mobile-iphone",
    name: "iPhone",
    width: 375,
    height: 667,
    type: "mobile",
    icon: "📱"
  },
  {
    id: "mobile-android",
    name: "Android",
    width: 360,
    height: 640,
    type: "mobile",
    icon: "📱"
  },
  {
    id: "mobile-small",
    name: "Small Mobile",
    width: 320,
    height: 568,
    type: "mobile",
    icon: "📱"
  },
  {
    id: "tablet-portrait",
    name: "Tablet Portrait",
    width: 768,
    height: 1024,
    type: "mobile",
    icon: "📱"
  }
];

export interface ViewModeContextType {
  viewMode: ViewMode;
  currentDevice: DevicePreset;
  setViewMode: (mode: ViewMode) => void;
  setDevice: (device: DevicePreset) => void;
  toggleViewMode: () => void;
}