import React, { useEffect, useState, useRef } from "react";
import { Panel } from "../types/canvas";
import { X } from "lucide-react";
import ColorPicker from "./ColorPicker";

interface Props {
  panel: Panel;
  onDimensionChange: (id: string, updates: Partial<Panel>) => void;
  lightTheme?: boolean;
}

const predefinedGradients = [
  { label: "Sunset", value: "linear-gradient(270deg, #ff7e5f, #feb47b)" },
  { label: "Ocean", value: "linear-gradient(270deg, #00c6ff, #0072ff)" },
  { label: "Purple", value: "linear-gradient(270deg, #8e2de2, #4a00e0)" },
  { label: "Green", value: "linear-gradient(270deg, #56ab2f, #a8e063)" },
  { label: "Custom", value: "custom" },
];

const convertToHex = (color: string): string => {
  if (color.startsWith("#")) return color;
  const match = color.match(/(\d+\.?\d*)/g);
  if (match && match.length >= 3) {
    const r = Math.round(parseFloat(match[0]));
    const g = Math.round(parseFloat(match[1]));
    const b = Math.round(parseFloat(match[2]));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
  return color;
};

const BackgroundStyle: React.FC<Props> = ({
  panel,
  onDimensionChange,
  lightTheme = true,
}) => {
  const [backgroundMode, setBackgroundMode] = useState<"color" | "image">(
    panel.backgroundImage &&
      !panel.backgroundImage.startsWith("linear-gradient") &&
      !panel.backgroundImage.startsWith("radial-gradient")
      ? "image"
      : "color"
  );

  const [useGradient, setUseGradient] = useState<boolean>(
    !!(panel.backgroundImage && panel.backgroundImage.includes("gradient"))
  );

  const [gradientType, setGradientType] = useState("custom");
  const [angle, setAngle] = useState(270);
  const [colorStops, setColorStops] = useState<string[]>([
    "#ffffff",
    "#ffffff",
  ]);
  const [solidColor, setSolidColor] = useState(
    panel.backgroundColor || "#ffffff"
  );

  const [backgroundSettings, setBackgroundSettings] = useState({
    backgroundImage: panel.backgroundImage || "",
    backgroundSize: panel.backgroundSize || "contain",
    backgroundPosition: panel.backgroundPosition || "center",
    backgroundRepeat: panel.backgroundRepeat || "no-repeat",
  });

  const isCustom = gradientType === "custom";

  const updateBackgroundSetting = (
    key: keyof typeof backgroundSettings,
    value: string
  ) => {
    const updated = { ...backgroundSettings, [key]: value };
    setBackgroundSettings(updated);
    onDimensionChange(panel.id, { [key]: value });
  };

  const didInitGradient = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (
      !didInitGradient.current &&
      panel.backgroundImage?.startsWith("linear-gradient")
    ) {
      const image = panel.backgroundImage.trim();
      const isPredefined = predefinedGradients.some(
        (preset) => preset.value === image
      );

      if (isPredefined) {
        setGradientType(image);
        setUseGradient(true);
      } else {
        const match = image.match(/linear-gradient\((\d+)deg, (.+)\)/);
        if (match) {
          const [, parsedAngle, colorsStr] = match;
          const colors = colorsStr.split(",").map((c) => c.trim());
          setGradientType("custom");
          setAngle(parseInt(parsedAngle));
          setColorStops(colors);
          setUseGradient(true);
        }
      }

      didInitGradient.current = true;
      setIsInitialized(true);
    }
  }, [panel.backgroundImage]);

  useEffect(() => {
    if (!didInitGradient.current) setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    if (backgroundMode === "color") {
      if (useGradient) {
        const gradientStr =
          gradientType === "custom"
            ? `linear-gradient(${angle}deg, ${colorStops
                .map(convertToHex)
                .join(", ")})`
            : gradientType;

        onDimensionChange(panel.id, {
          backgroundImage: gradientStr,
          backgroundColor: gradientStr,
        });
      } else {
        onDimensionChange(panel.id, {
          backgroundImage: "",
          backgroundColor: solidColor,
        });
      }
    }
  }, [
    isInitialized,
    backgroundMode,
    useGradient,
    gradientType,
    colorStops,
    angle,
    solidColor,
  ]);
  const backgroundOptions: {
    key: keyof typeof backgroundSettings;
    options: string[];
  }[] = [
    { key: "backgroundSize", options: ["Contain", "Cover", "Auto"] },
    {
      key: "backgroundPosition",
      options: ["Center", "Top", "Bottom", "Left", "Right"],
    },
    {
      key: "backgroundRepeat",
      options: ["No-Repeat", "Repeat", "Repeat-X", "Repeat-Y"],
    },
  ];

  return (
    <div className="space-y-4 text-sm dark:text-white">
      {/* Mode Buttons */}
      <div className="flex justify-end gap-2">
        {["color", "image"].map((mode) => (
          <button
            key={mode}
            onClick={() => setBackgroundMode(mode as any)}
            className={`px-3 py-1 rounded text-xs transition ${
              backgroundMode === mode
                ? "bg-blue-500 text-white"
                : lightTheme
                ? "bg-gray-200 text-black"
                : "bg-gray-700 text-white"
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* Color / Gradient Mode */}
      {backgroundMode === "color" && (
        <div className="space-y-3">
          {/* Always show Use Gradient */}
          <label className="inline-flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={useGradient}
              onChange={(e) => setUseGradient(e.target.checked)}
            />
            Use Gradient
          </label>

          {/* Solid Color Picker when gradient is off */}
          {!useGradient && (
            <div>
              <ColorPicker
                value={solidColor}
                onChange={setSolidColor}
                title="Solid Color"
              />
            </div>
          )}

          {/* Gradient Options when gradient is on */}
          {useGradient && (
            <div className="space-y-3">
              {/* Preset gradients */}
              <div className="flex flex-wrap gap-2">
                {predefinedGradients.map((preset, idx) => (
                  <div
                    key={idx}
                    title={preset.label}
                    onClick={() => setGradientType(preset.value)}
                    className={`w-6 h-6 rounded cursor-pointer border-2 ${
                      gradientType === preset.value && !isCustom
                        ? "border-blue-600"
                        : lightTheme
                        ? "border-gray-300"
                        : "border-gray-600"
                    }`}
                    style={{
                      background:
                        preset.value === "custom"
                          ? `linear-gradient(${angle}deg, ${colorStops.join(
                              ", "
                            )})`
                          : preset.value,
                    }}
                  />
                ))}
              </div>

              {/* Custom gradient stops */}
              {isCustom && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-row flex-wrap gap-2">
                    {colorStops.map((color, index) => (
                      <div key={index} className="relative w-8 h-8 group">
                        <ColorPicker
                          value={color}
                          onChange={(c) => {
                            const updated = [...colorStops];
                            updated[index] = c;
                            setColorStops(updated);
                          }}
                          size="medium"
                        />
                        {colorStops.length > 2 && (
                          <button
                            onClick={() =>
                              setColorStops((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                            className="absolute -top-1 -right-1 p-0.5 rounded-full bg-white dark:bg-gray-800 border border-red-300 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-800 transition"
                            title="Remove Color"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                    {colorStops.length < 6 && (
                      <button
                        onClick={() =>
                          setColorStops([...colorStops, "#ffffff"])
                        }
                        className="flex items-center justify-center w-6 h-6 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-700 relative group transition"
                        title="Add Color"
                      >
                        <svg
                          className="w-4 h-4 text-gray-700 dark:text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 20"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs">Angle:</label>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={angle}
                      onChange={(e) => setAngle(parseInt(e.target.value))}
                      className="w-32"
                    />
                    <span className="text-xs">{angle}°</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Image Mode */}
      {backgroundMode === "image" && (
        <div className="space-y-3">
          {/* Upload */}
          <div>
            <label className="text-xs block mb-1">Upload Image</label>
            <label
              htmlFor="fileInput"
              className={`inline-block text-xs font-semibold py-2 px-4 rounded cursor-pointer ${
                lightTheme
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-700 text-white"
              }`}
            >
              Choose File
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    updateBackgroundSetting(
                      "backgroundImage",
                      reader.result as string
                    );
                    onDimensionChange(panel.id, {
                      backgroundColor: "#ffffff",
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
          </div>

          {/* Preview */}
          {backgroundSettings.backgroundImage && (
            <div className="relative">
              <img
                src={backgroundSettings.backgroundImage}
                alt="Preview"
                className="w-full h-20 object-contain rounded border dark:border-gray-600 border-gray-300"
              />
              <button
                type="button"
                onClick={() => {
                  updateBackgroundSetting("backgroundImage", "");
                  onDimensionChange(panel.id, {
                    backgroundImage: "",
                    backgroundColor: "#ffffff",
                  });
                }}
                className="absolute top-1 right-1 bg-white dark:bg-gray-800 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Settings */}
          <div className="grid grid-cols-3 gap-2">
            {backgroundOptions.map(({ key, options }) => (
              <select
                key={key}
                value={backgroundSettings[key]}
                onChange={(e) => updateBackgroundSetting(key, e.target.value)}
                className={`text-xs p-1 rounded border ${
                  lightTheme
                    ? "bg-white text-black border-gray-300"
                    : "bg-gray-700 text-white border-gray-600"
                }`}
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.replace("-", " ")}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundStyle;
