import React from "react";
import { Bold, Italic, Strikethrough, Underline } from "lucide-react";
import { textFormatting } from "./Panel";
import ColorPicker from "./ColorPicker";

interface FontOptionsProps {
  fontFamily: string;
  handleFontFamilyChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  fontSize: number;
  handleFontSizeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fontColor: string;
  handleFontColorChange: (color: string) => void;
  fontStyles: textFormatting[];
  handleFontStyleToggle: (style: textFormatting) => void;
  fontOptions: string[];
}

const FontOptions: React.FC<FontOptionsProps> = ({
  fontFamily,
  handleFontFamilyChange,
  fontSize,
  handleFontSizeChange,
  fontColor,
  handleFontColorChange,
  fontStyles,
  handleFontStyleToggle,
  fontOptions,
}) => {
  return (
    <div>
      <div>
        <label className="block text-sm font-medium mb-3 dark:text-gray-200 text-gray-700">
          Font Settings
        </label>

        {/* Font Family */}
        <div className="mb-3">
          <label className="block text-xs mb-1 dark:text-gray-400 text-gray-600">
            Font Family
          </label>
          <select
            value={fontFamily}
            onChange={handleFontFamilyChange}
            className="w-full h-9 rounded-md border px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 bg-white text-gray-900 border-gray-300"
            style={{ fontFamily }}
          >
            {fontOptions.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size and Color */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs mb-1 dark:text-gray-400 text-gray-600">
              Font Size (px)
            </label>
            <input
              type="number"
              value={fontSize}
              onChange={handleFontSizeChange}
              className="w-full h-9 text-sm rounded-md px-3 border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 bg-white text-gray-900 border-gray-300"
              min={8}
              max={72}
            />
          </div>
          <div>
            <label className="block text-xs mb-1 dark:text-gray-400 text-gray-600">
              Font Color
            </label>
            <ColorPicker
        value={fontColor}
        onChange={handleFontColorChange}
        size="smallmedium" // small | medium | default
        title="Choose font color"
      />
          </div>
        </div>
      </div>

      <label className="block text-xs mb-2 dark:text-gray-400 text-gray-600">
        Font Style
      </label>
      <div className="flex gap-2">
        <StyleButton
          active={fontStyles.includes("bold")}
          onClick={() => handleFontStyleToggle("bold")}
        >
          <Bold size={14} />
        </StyleButton>
        <StyleButton
          active={fontStyles.includes("italic")}
          onClick={() => handleFontStyleToggle("italic")}
        >
          <Italic size={14} />
        </StyleButton>
        <StyleButton
          active={fontStyles.includes("underline")}
          onClick={() => handleFontStyleToggle("underline")}
        >
          <Underline size={14} />
        </StyleButton>
        <StyleButton
          active={fontStyles.includes("line-through")}
          onClick={() => handleFontStyleToggle("line-through")}
        >
          <Strikethrough size={14} />
        </StyleButton>
      </div>
    </div>
  );
};

// Extracted button component for cleaner code
interface StyleButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const StyleButton: React.FC<StyleButtonProps> = ({
  active,
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      active
        ? "dark:bg-blue-600 dark:text-white dark:border-blue-600 bg-blue-500 text-white border-blue-500"
        : "dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
    }`}
  >
    {children}
  </button>
);

export default FontOptions;
