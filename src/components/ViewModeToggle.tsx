import React, { useState } from "react";
import { Monitor, Smartphone, ChevronDown, ChevronUp } from "lucide-react";
import { useViewMode } from "../context/ViewModeContext";
import { DEVICE_PRESETS } from "../types/viewMode";

interface ViewModeToggleProps {
  isDark?: boolean;
}

export default function ViewModeToggle({ isDark = false }: ViewModeToggleProps) {
  const { viewMode, currentDevice, setDevice, toggleViewMode } = useViewMode();
  const [showPresets, setShowPresets] = useState(false);

  const desktopPresets = DEVICE_PRESETS.filter(d => d.type === "desktop");
  const mobilePresets = DEVICE_PRESETS.filter(d => d.type === "mobile");

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 mb-2">
        {/* Main Toggle Button */}
        <button
          onClick={toggleViewMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-sm hover:scale-105 ${
            isDark
              ? "text-blue-300 hover:bg-blue-900/50 border border-gray-600"
              : "text-blue-600 hover:bg-blue-100 border border-gray-300"
          }`}
          title={`Switch to ${viewMode === "desktop" ? "Mobile" : "Desktop"} View`}
        >
          {viewMode === "desktop" ? <Monitor size={20} /> : <Smartphone size={20} />}
          <span className="text-sm font-medium">
            {viewMode === "desktop" ? "Desktop" : "Mobile"}
          </span>
        </button>

        {/* Device Presets Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 hover:shadow-sm hover:scale-105 ${
              isDark
                ? "text-blue-300 hover:bg-blue-900/50 border border-gray-600"
                : "text-blue-600 hover:bg-blue-100 border border-gray-300"
            }`}
            title="Select Device Preset"
          >
            <span className="text-sm font-medium">
              {currentDevice.name}
            </span>
            {showPresets ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showPresets && (
            <div
              className={`absolute top-full mt-1 right-0 z-50 min-w-[200px] p-2 rounded-lg shadow-xl border ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              {/* Desktop Presets */}
              <div className="mb-3">
                <h4 className={`text-xs font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Desktop
                </h4>
                <div className="space-y-1">
                  {desktopPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setDevice(preset);
                        setShowPresets(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                        currentDevice.id === preset.id
                          ? isDark
                            ? "bg-blue-700 text-white"
                            : "bg-blue-200 text-blue-700"
                          : isDark
                            ? "hover:bg-gray-700 text-gray-300"
                            : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{preset.icon}</span>
                        <span>{preset.name}</span>
                      </span>
                      <span className="text-xs opacity-70">
                        {preset.width}×{preset.height}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Presets */}
              <div>
                <h4 className={`text-xs font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Mobile
                </h4>
                <div className="space-y-1">
                  {mobilePresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setDevice(preset);
                        setShowPresets(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                        currentDevice.id === preset.id
                          ? isDark
                            ? "bg-blue-700 text-white"
                            : "bg-blue-200 text-blue-700"
                          : isDark
                            ? "hover:bg-gray-700 text-gray-300"
                            : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{preset.icon}</span>
                        <span>{preset.name}</span>
                      </span>
                      <span className="text-xs opacity-70">
                        {preset.width}×{preset.height}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-700"} text-center`}>
        View Mode
      </div>

      {/* Click outside to close dropdown */}
      {showPresets && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowPresets(false)}
        />
      )}
    </div>
  );
}