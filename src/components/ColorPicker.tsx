import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChromePicker, ColorResult } from "react-color";
import { createPortal } from "react-dom";

interface Props {
  value: string;
  onChange: (color: string) => void;
  size?: "small" | "medium" | "default"| "smallmedium";
  title?: string;
}

const ColorPicker: React.FC<Props> = ({
  value,
  onChange,
  size = "default",
  title,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const swatchRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        swatchRef.current &&
        !swatchRef.current.contains(event.target as Node) &&
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSwatchClick = () => {
    if (swatchRef.current) {
      const rect = swatchRef.current.getBoundingClientRect();
      const pickerHeight = 280;
      const pickerWidth = 225;
      const margin = 8;

      const spaceAbove = rect.top;

      const fitsAbove = spaceAbove > pickerHeight + margin;


      const top = fitsAbove
        ? rect.top - pickerHeight - margin
        : rect.bottom + margin;

      const left = Math.min(
        Math.max(rect.left + rect.width / 2 - pickerWidth / 2, 8),
        window.innerWidth - pickerWidth - 8
      );

      setPosition({ top, left });
    }
    setShowPicker((prev) => !prev);
  };

  const handleColorChange = useCallback(
    (color: ColorResult) => {
      const rgba = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
      onChange(rgba);
    },
    [onChange]
  );

  let swatchSizeClass = "";
  let outerBorderClass = "";

  switch (size) {
    case "small":
      swatchSizeClass = "w-4 h-4";
      outerBorderClass = "border";
      break;
    case "medium":
      swatchSizeClass = "w-6 h-6";
      outerBorderClass = "border-2";
      break;
    case "smallmedium":
      swatchSizeClass = "w-9 h-9";
      outerBorderClass = "border-2";
      break;
    default:
      swatchSizeClass = "w-10 h-10";
      outerBorderClass = "border-2";
      break;
  }

  return (
    <>
      {/* Swatch */}
      <div
        ref={swatchRef}
        className={`inline-flex items-center justify-center cursor-pointer rounded ${outerBorderClass} border-gray-400 ${swatchSizeClass}`}
        onClick={handleSwatchClick}
        title={title}
        tabIndex={0}
        role="button"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleSwatchClick();
          }
        }}
      >
        <div
          className="w-full h-full rounded"
          style={{
            backgroundColor: value,
          }}
        />
      </div>

      {/* ChromePicker */}
      {showPicker &&
        createPortal(
          <div
            ref={pickerRef}
            className="fixed z-[9999] p-2"
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            <ChromePicker
              color={value}
              onChange={handleColorChange}
              disableAlpha={false}
            />
          </div>,
          document.body
        )}
    </>
  );
};

export default ColorPicker;
