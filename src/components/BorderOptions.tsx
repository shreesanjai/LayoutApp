import React, { useState } from "react";
import { Panel } from "../types/canvas";
import ColorPicker from "./ColorPicker";

interface BorderOptionsProps {
  panel: Panel;
  onDimensionChange: (id: string, updates: Partial<Panel>) => void;
}

const BorderOptions: React.FC<BorderOptionsProps> = ({
  panel,
  onDimensionChange,
}) => {
  const [activeTab, setActiveTab] = useState<"border" | "shadow">("border");

  return (
    <>
      {/* Tab Navigation */}
      <div className="flex mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("border")}
          className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === "border"
              ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          Border
        </button>
        <button
          onClick={() => setActiveTab("shadow")}
          className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === "shadow"
              ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          Shadow
        </button>
      </div>

      {/* Border Tab Content */}
      {activeTab === "border" && (
        <div className="space-y-4">
          {/* Border Width & Corner Radius */}
          <div className="flex gap-4">
            {/* Border Width */}
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Border Width
                </label>
              </div>
              <input
                type="number"
                value={panel.borderWidth ?? 0}
                onChange={(e) =>
                  onDimensionChange(panel.id, {
                    borderWidth: Number(e.target.value),
                  })
                }
                min={0}
                max={30}
                className="w-full px-2 py-1 rounded border text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>

            {/* Corner Radius - Only for rectangle/square */}
            {(panel.shape === "rectangle" || panel.shape === "square") && (
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Border Radius
                  </label>
                </div>
                <input
                  type="number"
                  value={panel.borderRadius ?? 0}
                  onChange={(e) =>
                    onDimensionChange(panel.id, {
                      borderRadius: Number(e.target.value),
                    })
                  }
                  min={0}
                  max={20}
                  className="w-full px-2 py-1 rounded border text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
            )}
          </div>

          {/* Border Color */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Border Color
            </label>
            <div className="flex items-center space-x-2">
              <ColorPicker
                value={panel.borderColor as string}
                onChange={(color: string) => {
                  onDimensionChange(panel.id, { borderColor: color });
                }}
                title="Border Color"
              />
              <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                {panel.borderColor || "#000000"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shadow Tab Content */}
      {activeTab === "shadow" && (
        <div className="space-y-4">
          {/* Apply Same Shadow Toggle */}
          <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Apply same shadow to shape
            </label>
            <input
              type="checkbox"
              checked={panel.applySameShadow ?? false}
              onChange={(e) => {
                const checked = e.target.checked;
                onDimensionChange(panel.id, {
                  applySameShadow: checked,
                  ...(checked && {
                    shapeShadowDirection: panel.shadowDirection,
                  }),
                });
              }}
              className="rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Panel Shadow & Shape Shadow Side by Side */}
          <div className="flex gap-4">
            {/* Panel Shadow */}
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Panel Shadow
              </label>
              <select
                value={panel.shadowDirection || "none"}
                onChange={(e) => {
                  const updates: any = { shadowDirection: e.target.value };
                  if (panel.applySameShadow) {
                    updates.shapeShadowDirection = e.target.value;
                  }
                  onDimensionChange(panel.id, updates);
                }}
                className="w-full px-2 py-1 rounded border text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              >
                <option value="right">Right</option>
                <option value="left">Left</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="common">Common</option>
                <option value="none">None</option>
              </select>
            </div>

            {/* Shape Shadow */}
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Shape Shadow
              </label>
              <select
                value={panel.shapeShadowDirection || "none"}
                onChange={(e) => {
                  onDimensionChange(panel.id, {
                    shapeShadowDirection: e.target.value as any,
                  });
                }}
                disabled={panel.applySameShadow}
                className="w-full px-2 py-1 rounded border text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 disabled:opacity-50"
              >
                <option value="right">Right</option>
                <option value="left">Left</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="common">Common</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BorderOptions;
