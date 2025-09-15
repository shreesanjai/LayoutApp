import {
  Plus, Save, Trash2, Sun, Moon, Copy, ClipboardPaste, Undo, Redo, Palette, Home, Scissors, FileJson, Image,
  Type, FolderOpenIcon, ChevronDown, ChevronUp, X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import ColorPicker from "./ColorPicker";
import BackgroundPopover from "./BackgroundPopOver";

type PanelShape =
  | "square"
  | "rectangle"
  | "ellipse"
  | "circle"
  | "triangle"
  | "hexagon"
  | "star"
  | "pentagon"
  | "diamond"
  | "textbox";

type RibbonTab = "home" | "insert" | "design";

interface ToolbarProps {
  onAddPanel: (shape: PanelShape) => void;
  textBoxPanel: (shape: PanelShape) => void;
  onExportConfig: () => void;
  onImportConfig: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExportToPNG: () => void;
  onClearPanels: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canvasWidth: number;
  canvasHeight: number;
  canvasBgColor: string;
  canvasBgImage: string | null;
  canvasFgColor: string;
  roundedCorners: boolean;
  showGrid: boolean;
  onCanvasDimensionSubmit: (width: string, height: string) => void;
  onBgColorChange: (color: string) => void;
  onFgColorChange: (color: string) => void;
  onBgImageChange: (bgImage: string|null) => void;
  onRoundedCornersToggle: () => void;
  onShowGridToggle: () => void;
  canUndo: boolean;
  canRedo: boolean;
  canCopy: boolean;
  canPaste: boolean;
  onCut: () => void;
  canCut: boolean;
  useGradient: boolean;
  setUseGradient: (value: boolean) => void;
  angle: number;
  setAngle: (angle: number) => void;
  gradientType: string;
  setGradientType: (value: string) => void;
  solidColor: string;
  setSolidColor: (value: string) => void;
  hasShapes: boolean;
  customGradientColors: string[];
  setCustomGradientColors: (colors: string[]) => void;
  includeTextInExport: boolean;
  setincludeTextInExport: (value: boolean) => void;
}

const ShapeIcon = ({
  shape,
  size = 20,
  className = "",
}: {
  shape: PanelShape;
  size?: number;
  className?: string;
}) => {
  const iconProps = { width: size, height: size, className };
  switch (shape) {
    case "square":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="6" width="12" height="12" rx="1" />
        </svg>
      );
    case "rectangle":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="6" width="18" height="12" rx="1" />
        </svg>
      );
    case "circle":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
    case "ellipse":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <ellipse cx="12" cy="12" rx="9" ry="6" />
        </svg>
      );
    case "triangle":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,4 20,18 4,18" />
        </svg>
      );
    case "diamond":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 22,12 12,22 2,12" />
        </svg>
      );
    case "hexagon":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 20,7 20,17 12,22 4,17 4,7" />
        </svg>
      );
    case "pentagon":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 22,9 18,20 6,20 2,9" />
        </svg>
      );
    case "star":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      );
    default:
      return null;
  }
};

export default function Toolbar({
  onAddPanel,
  textBoxPanel,
  onExportConfig,
  onImportConfig,
  onExportToPNG,
  onClearPanels,
  onCopy,
  onPaste,
  onUndo,
  onRedo,
  canvasWidth,
  canvasHeight,
  canvasBgImage,
  canvasFgColor,
  roundedCorners,
  showGrid,
  onCanvasDimensionSubmit,
  hasShapes,
  onFgColorChange,
  onBgImageChange,
  onRoundedCornersToggle,
  onShowGridToggle,
  canUndo,
  canRedo,
  canCopy,
  canPaste,
  onCut,
  canCut,
  useGradient,
  setUseGradient,
  angle,
  setAngle,
  gradientType,
  setGradientType,
  solidColor,
  setSolidColor,
  includeTextInExport,
  setincludeTextInExport,
  setCustomGradientColors,
  customGradientColors,
}: ToolbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<RibbonTab>("home");
  const [selectedShape, setSelectedShape] = useState<PanelShape>("rectangle");
  const [showShapeDropdown, setShowShapeDropdown] = useState(false);
  const [widthInput, setWidthInput] = useState(canvasWidth.toString());
  const [heightInput, setHeightInput] = useState(canvasHeight.toString());
  const isDark = theme === "dark";
  const isCustom = gradientType === "custom";
  const predefinedGradients = [
    { label: "Sunset", value: "linear-gradient(90deg, #ff7e5f, #feb47b)" },
    { label: "Ocean", value: "linear-gradient(90deg, #00c6ff, #0072ff)" },
    { label: "Purple", value: "linear-gradient(90deg, #8e2de2, #4a00e0)" },
    { label: "Green", value: "linear-gradient(90deg, #56ab2f, #a8e063)" },
    { label: "Custom", value: "custom" },
  ];
  const [showSaveOptions, setShowSaveOptions] = useState(false);
  const MAX_GRADIENT_COLORS = 6;
  const shapes: PanelShape[] = [
    "square",
    "rectangle",
    "ellipse",
    "circle",
    "triangle",
    "hexagon",
    "star",
    "pentagon",
    "diamond",
  ];

  const tabs = [
    { id: "home" as RibbonTab, label: "Home", icon: Home },
    { id: "insert" as RibbonTab, label: "Insert", icon: Plus },
    { id: "design" as RibbonTab, label: "Design", icon: Palette },
  ];

  const handleShapeSelect = (shape: PanelShape) => {
    setSelectedShape(shape);
    setShowShapeDropdown(false);
    onAddPanel(shape);
  };

  useEffect(() => {
    setWidthInput(widthInput.toString());
    setHeightInput(heightInput.toString());
    onCanvasDimensionSubmit(widthInput, heightInput);
  }, [widthInput, heightInput]);

  const RibbonButton = ({
    onClick,
    icon: Icon,
    label,
    disabled = false,
    className = "",
    size = "default",
  }: {
    onClick: () => void;
    icon: any;
    label: string;
    disabled?: boolean;
    className?: string;
    size?: "small" | "default" | "large";
  }) => {
    const sizeClasses = {
      small: "px-2 py-1.5",
      default: "px-3 py-2",
      large: "px-4 py-2.5",
    };

    const iconSizes = {
      small: 16,
      default: 20,
      large: 24,
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex flex-col items-center ${sizeClasses[size]
          } rounded-lg transition-all duration-200 hover:shadow-sm hover:scale-105 ${disabled
            ? "text-gray-400 cursor-not-allowed"
            : isDark
              ? "text-blue-300 hover:bg-blue-900/50"
              : "text-blue-600 hover:bg-blue-100"
          } ${className}`}
        title={label}
      >
        <Icon size={iconSizes[size]} />
        <span className="text-xs font-medium mt-1">{label}</span>
      </button>
    );
  };

  const renderHomeTab = () => (
    <div className="flex items-center gap-6 flex-wrap w-full h-[100px]">
      <div className="flex flex-col">
        <div className="flex gap-1 mb-2">
          {/* Save (Expandable) */}
          <div className="relative">
            <RibbonButton
              onClick={() => setShowSaveOptions(!showSaveOptions)}
              disabled={!hasShapes}
              icon={Save}
              label="Save"
            />

            {showSaveOptions && hasShapes && (
              <div
                className={`absolute top-full mt-1 left-0 z-10 flex flex-col gap-1 w-40 p-2 rounded-md shadow-lg border ${isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
                  }`}
              >
                {/* Save as JSON */}
                <button
                  onClick={() => {
                    onExportConfig();
                    setShowSaveOptions(false);
                  }}
                  className={`flex items-center gap-2 px-2 py-1 rounded-md text-sm transition-all w-full
              ${isDark
                      ? "text-blue-300 hover:bg-blue-900/40"
                      : "text-blue-600 hover:bg-blue-100"
                    }`}
                >
                  <FileJson size={16} /> Save as JSON
                </button>

                {/* Save as PNG */}
                <button
                  onClick={() => {
                    console.log("Exporting to PNG...");
                    onExportToPNG();
                    setShowSaveOptions(false);
                  }}
                  className={`flex items-center gap-2 px-2 py-1 rounded-md text-sm transition-all w-full
              ${isDark
                      ? "text-purple-300 hover:bg-purple-900/40"
                      : "text-purple-600 hover:bg-purple-100"
                    }`}
                >
                  <Image size={16} /> Save as PNG
                </button>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeTextInExport}
                    onChange={() =>
                      setincludeTextInExport(!includeTextInExport)
                    }
                    className="p-3 border-3 border-green-500"
                  />
                  <span
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Include Text (PNG)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Upload (.json) */}
          <div className="relative group">
            <label
              className={`flex flex-col items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm hover:scale-105 ${isDark
                ? "text-blue-300 hover:bg-blue-900/50"
                : "text-blue-600 hover:bg-blue-100"
                }`}
            >
              <FolderOpenIcon size={20} />
              <span className="text-xs font-medium mt-1">Open</span>
              <input
                type="file"
                accept=".json"
                onChange={onImportConfig}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div
          className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-700"
            } text-center`}
        >
          File
        </div>
      </div>
      <div className={`h-16 w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
      {/* Clipboard Group */}
      <div className="flex flex-col">
        <div className="flex gap-1 mb-2">
          <RibbonButton
            onClick={onCut}
            icon={Scissors}
            label="Cut"
            disabled={!canCut}
            size="small"
          />
          <RibbonButton
            onClick={onCopy}
            icon={Copy}
            label="Copy"
            disabled={!canCopy}
            size="small"
          />
          <RibbonButton
            onClick={onPaste}
            icon={ClipboardPaste}
            label="Paste"
            disabled={!canPaste}
            size="small"
          />
        </div>
        <div
          className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-700"
            } text-center`}
        >
          Clipboard
        </div>
      </div>

      {/* Separator */}
      <div className={`h-16 w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />

      {/* History Group */}
      <div className="flex flex-col">
        <div className="flex gap-1 mb-2">
          <RibbonButton
            onClick={onUndo}
            icon={Undo}
            label="Undo"
            disabled={!canUndo}
            className={
              isDark
                ? "text-yellow-300 hover:bg-yellow-900/50"
                : "text-yellow-600 hover:bg-yellow-100"
            }
          />
          <RibbonButton
            onClick={onRedo}
            icon={Redo}
            label="Redo"
            disabled={!canRedo}
            className={
              isDark
                ? "text-yellow-300 hover:bg-yellow-900/50"
                : "text-yellow-600 hover:bg-yellow-100"
            }
          />
        </div>
        <div
          className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-700"
            } text-center`}
        >
          History
        </div>
      </div>

      {/* Separator */}
      <div className={`h-16 w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />

      {/* Actions Group */}
      <div className="flex flex-col">
        <div className="flex gap-1 mb-2">
          <RibbonButton
            onClick={onClearPanels}
            icon={Trash2}
            label="Clear All"
            className={
              isDark
                ? "text-red-300 hover:bg-red-900/50"
                : "text-red-600 hover:bg-red-100"
            }
          />
        </div>
        <div
          className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-700"
            } text-center`}
        >
          Actions
        </div>
      </div>
    </div>
  );

  const renderInsertTab = () => (
    <div className="flex items-center gap-6 flex-wrap w-full h-[100px]">
      {/* Panels Group */}
      <div className="flex flex-col">
        <div className="relative mb-1">
          <button
            onClick={() => setShowShapeDropdown(!showShapeDropdown)}
            className={`relative flex flex-col items-center px-3 py-4 rounded-lg transition-all duration-200 hover:shadow-sm hover:scale-105 ${isDark
              ? "text-blue-300 hover:bg-blue-900/50 border-gray-600"
              : "text-blue-600 hover:bg-blue-100 border-gray-300"
              }`}
          >
            <div className="flex items-center gap-2">
              <div className="relative w-7 h-7">
                <div className="absolute w-7 h-7 bg-blue-400 border border-blue-800 top-0 left-0" />
                <div className="absolute w-7 h-7 bg-white border border-black rounded-full top-1 left-2" />
              </div>
              {showShapeDropdown ? <ChevronUp size={20} className="ml-1" /> : <ChevronDown size={20} className="ml-1" />}
            </div>
          </button>
          {showShapeDropdown && (
            <div
              className={`absolute top-full left-0 mt-2 p-4 rounded-lg shadow-xl border ${isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
                }`}
              style={{ zIndex: 9999, position: "absolute" }}
            >
              <div className="grid grid-cols-4 gap-3 w-80">
                {shapes.map((shape) => (
                  <button
                    key={shape}
                    onClick={() => handleShapeSelect(shape)}
                    className={`flex flex-col items-center px-3 py-3 rounded-md transition-all duration-200 ${selectedShape === shape
                      ? isDark
                        ? "bg-blue-700 text-white"
                        : "bg-blue-200 text-blue-700"
                      : isDark
                        ? "hover:bg-gray-700 text-gray-300"
                        : "hover:bg-gray-100 text-gray-600"
                      }`}
                  >
                    <ShapeIcon shape={shape} size={32} />
                    <span className="text-xs font-medium capitalize mt-2">
                      {shape}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div
          className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-700"
            } text-center`}
        >
          Panels
        </div>
      </div>

      {/* Separator */}
      <div className={`h-16 w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />

      {/* Quick Shapes Group */}
      <div className="flex flex-col">
        <div className="flex gap-1 mb-2">
          {["rectangle", "circle", "triangle", "star"].map((shape) => (
            <button
              key={shape}
              onClick={() => onAddPanel(shape as PanelShape)}
              className={`flex flex-col items-center px-2 py-2 rounded-lg transition-all duration-200 hover:shadow-sm hover:scale-105 ${isDark
                ? "text-blue-300 hover:bg-blue-900/50"
                : "text-blue-600 hover:bg-blue-100"
                }`}
              title={`Add ${shape}`}
            >
              <ShapeIcon shape={shape as PanelShape} size={20} />
              <span className="text-xs font-medium mt-1 capitalize">
                {shape}
              </span>
            </button>
          ))}
        </div>
        <div
          className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-700"
            } text-center`}
        >
          Quick Shapes
        </div>
      </div>

      <div className={`h-16 w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
      <div>
        <button
          onClick={() => textBoxPanel("textbox")}
          className={`flex flex-col items-center px-2 py-2 rounded-lg transition-all duration-200 hover:shadow-sm hover:scale-105 ${isDark
            ? "text-blue-300 hover:bg-blue-900/50"
            : "text-blue-600 hover:bg-blue-100"
            }`}
        >
          <Type size={20} />
          <span className="text-xs font-medium mt-1 capitalize">Text Box</span>
        </button>
      </div>
    </div>
  );

  const renderDesignTab = () => (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Colors Group */}
      <div className="flex flex-col">
        <div className="flex items-start gap-3 mb-2">
          {/* Foreground */}
          <div className="flex flex-col items-start min-w-[100px]">
            <span className="text-sm font-medium mb-4 dark:text-gray-400 text-gray-700">
              Foreground
            </span>
            <ColorPicker
              value={canvasFgColor}
              onChange={onFgColorChange}
              title="Foreground Color"
            />
          </div>

          {/* Background */}
          <div className="flex flex-col gap-2 min-w-[200px]">
            <div className="flex items-center gap-7">
              <span
                className={`text-sm font-medium ${isDark ? "dark:text-gray-400" : "text-gray-700"
                  }`}
              >
                Background
              </span>
              <label
                className={`flex items-center gap-1 text-xs ${isDark ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                <input
                  type="checkbox"
                  checked={useGradient}
                  onChange={(e) => setUseGradient(e.target.checked)}
                  className="cursor-pointer"
                />
                Use Gradient
              </label>
            </div>

            {useGradient ? (
              <div className="flex flex-row items-center">
              <div>
                <div
                  className={`flex gap-2 flex-wrap max-w-[220px] ${gradientType !== "custom" ? "mt-3" : ""
                    }`}
                >
                  {predefinedGradients.map((preset, idx) => (
                    <div
                      key={idx}
                      className={`w-5 h-5 rounded cursor-pointer border-2 transition-all mb-1 duration-150 ${gradientType === preset.value && !isCustom
                        ? "border-blue-600"
                        : isDark
                          ? "border-gray-600"
                          : "border-gray-200"
                        }`}
                      style={{
                        background:
                          preset.value === "custom"
                            ? `linear-gradient(${angle}deg, ${customGradientColors.join(
                              ", "
                            )})`
                            : preset.value,
                      }}
                      title={preset.label}
                      onClick={() => setGradientType(preset.value)}
                    />
                  ))}
                </div>

                {isCustom && (
                  <div className="flex flex-col gap-1 ">
                    {/* Colors */}
                    <div className="flex flex-wrap gap-2">
                      {customGradientColors.map((color, index) => (
                        <div
                          key={index}
                          className="relative group flex items-center"
                        >
                          {/* Color Picker */}
                          <ColorPicker
                            value={color}
                            onChange={(c) => {
                              const updated = [...customGradientColors];
                              updated[index] = c;
                              setCustomGradientColors(updated);
                            }}
                            size="small"
                            title={`Color ${index + 1}`}
                          />
                          {/* Delete button hidden by default */}
                          {customGradientColors.length > 2 && (
                            <button
                              onClick={() => {
                                const updated = customGradientColors.filter(
                                  (_, i) => i !== index
                                );
                                setCustomGradientColors(updated);
                              }}
                              className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 text-white text-xs items-center justify-center hidden group-hover:flex"
                              title="Remove color"
                            >
                              <X size={12} strokeWidth={3} />
                            </button>
                          )}
                        </div>
                      ))}
                      {/* Add Button */}
                      {customGradientColors.length < MAX_GRADIENT_COLORS && (
                        <button
                          onClick={() =>
                            setCustomGradientColors([
                              ...customGradientColors,
                              "#ffffff",
                            ])
                          }
                          title="Add Color"
                          className={`w-6 h-6 flex items-center justify-center rounded-full border
                              ${isDark
                              ? "text-gray-300 border-gray-500 hover:bg-gray-700"
                              : "text-gray-600 border-gray-300 hover:bg-gray-100"
                            }`}
                        >
                          <Plus size={14} />
                        </button>
                      )}
                    </div>

                    {/* Angle */}
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={360}
                        value={angle}
                        onChange={(e) => setAngle(parseInt(e.target.value))}
                        className="w-28"
                        title="Angle"
                      />
                      <span className="text-xs text-gray-500">{angle}°</span>
                    </div>
                  </div>
                )}
              </div>
                <div className="ml-2"><BackgroundPopover onBgImageChange={onBgImageChange} canvasBgImage={canvasBgImage}/></div>
              </div>
            ) : (
              <div className="mt-2">
                <ColorPicker
                  value={solidColor}
                  onChange={setSolidColor}
                  title="Background Color"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className={`h-16 w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />

      {/* Canvas Size Group */}
      <div className="flex flex-col">
        <div className="flex gap-2 mb-2 items-center">
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1 dark:text-gray-400 text-gray-700">
              Width
            </label>
            <input
              type="number"
              value={widthInput}
              onChange={(e) => setWidthInput(e.target.value)}
              className={`w-20 h-8 text-sm font-mono rounded-md border ${isDark
                ? "bg-gray-700 border-gray-600 text-gray-200"
                : "bg-white border-gray-300 text-gray-800"
                } px-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
              min="200"
              max="1200"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1 dark:text-gray-400 text-gray-700">
              Height
            </label>
            <input
              type="number"
              value={heightInput}
              onChange={(e) => setHeightInput(e.target.value)}
              className={`w-20 h-8 text-sm font-mono rounded-md border ${isDark
                ? "bg-gray-700 border-gray-600 text-gray-200"
                : "bg-white border-gray-300 text-gray-800"
                } px-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
              min="200"
              max="720"
            />
          </div>
        </div>
        <div
          className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-700"
            } text-center`}
        >
          Canvas Size
        </div>
      </div>

      {/* Separator */}
      <div className={`h-16 w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />

      {/* Style Group */}
      <div className="flex flex-col items-center">
        <div className="flex gap-6 mb-2 items-center">
          <div className="flex flex-col items-center">
            <div
              onClick={onRoundedCornersToggle}
              className={`w-11 h-5 flex items-center rounded-full px-0.5 cursor-pointer transition-colors duration-300 
              ${roundedCorners
                  ? isDark
                    ? "bg-blue-500"
                    : "bg-blue-400"
                  : isDark
                    ? "bg-gray-600"
                    : "bg-gray-300"
                } hover:ring-2 hover:ring-blue-300`}
              title="Toggle Rounded Corners"
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300
              ${roundedCorners ? "translate-x-6" : "translate-x-0"}`}
              />
            </div>
            <span className="text-xs font-medium mt-1 dark:text-gray-400 text-gray-700">
              Rounded
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div
              onClick={onShowGridToggle}
              className={`w-11 h-5 flex items-center rounded-full px-0.5 cursor-pointer transition-colors duration-300
              ${showGrid
                  ? isDark
                    ? "bg-blue-500"
                    : "bg-blue-400"
                  : isDark
                    ? "bg-gray-600"
                    : "bg-gray-300"
                }`}
              title="Toggle Grid"
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300
              ${showGrid ? "translate-x-6" : "translate-x-0"}`}
              />
            </div>
            <span className="text-xs font-medium mt-1 dark:text-gray-400 text-gray-700">
              Grid
            </span>
          </div>
        </div>
        <div
          className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-700"
            } text-center`}
        >
          Style
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return renderHomeTab();
      case "insert":
        return renderInsertTab();
      case "design":
        return renderDesignTab();
      default:
        return renderHomeTab();
    }
  };

  return (
    <div className="mb-4 font-sans">
      {/* Ribbon Container */}
      <div
        className={`${isDark ? "bg-gray-900" : "bg-white"
          } border-b border-gray-200 shadow-lg`}
      >
        {/* Tab Navigation */}
        <div
          className={`${isDark ? "bg-gray-800" : "bg-gray-50"
            } border-b border-gray-200`}
        >
          <div className="px-6 flex justify-between items-center">
            {/* Tabs on the left */}
            <div className="flex space-x-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${activeTab === tab.id
                    ? isDark
                      ? "border-blue-400 text-blue-300 bg-gray-900"
                      : "border-blue-500 text-blue-600 bg-white"
                    : isDark
                      ? "border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {tab.icon && <tab.icon size={16} />}
                    {tab.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Toggle on the right */}
            <div className="pr-2">
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-1 px-3 py-1.5 rounded transition-colors text-sm ${isDark
                  ? "bg-gray-700 text-blue-300 hover:bg-blue-800"
                  : "bg-gray-100 text-blue-600 hover:bg-blue-200"
                  }`}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                <span>{isDark ? "Light" : "Dark"} Mode</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 py-4 h-[120px]">{renderTabContent()}</div>
      </div>

      {/* Click Outside to close Dropdown */}
      {showShapeDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowShapeDropdown(false)}
        />
      )}
    </div>
  );
}
