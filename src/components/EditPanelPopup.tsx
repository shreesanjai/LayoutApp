import React, { useState } from "react";
import { Panel } from "../types/canvas";
import { ChevronDown, Type, Palette, Layers, X, Settings, TextIcon, Square, Pencil, Box } from "lucide-react";
import FontOptions from "./FontOptions";
import { textFormatting } from "./Panel";
import DimensionOptions from "./DimensionOptions";
import TranslateControl from "./TranslateControl";
import LetterSpacing from "./LetterSpacing";
import BackgroundStyle from "./BackgroundStyleSelector";
import RotateControl from "./RotateControl";
import ScaleControl from "./ScaleControl";
import ZIndexControl from "./ZIndexControl";
import BorderOptions from "./BorderOptions";

interface EditPanelPopupProps {
  panel: Panel;
  theme: string;
  onDimensionChange: (id: string, updates: Partial<Panel>) => void;
  onClose: () => void;
  onBringForward: (id: string) => void;
  onBringBackward: (id: string) => void;
  canvasHeight: number;
  canvasWidth: number;
  isBulkEdit?: boolean;
  selectedPanelIds?: string[];
}

const EditPanelPopup = ({
  panel,
  theme,
  onDimensionChange,
  onClose,
  onBringForward,
  onBringBackward,
  canvasWidth,
  canvasHeight,
  isBulkEdit,
  selectedPanelIds,
}: EditPanelPopupProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [fontFamily, setFontFamily] = useState(panel.fontFamily);
  const [fontSize, setFontSize] = useState(panel.fontSize || 16);
  const [fontColor, setFontColor] = useState(panel.fontColor || "#000000");
  const [fontStyles, setFontStyles] = useState<textFormatting[]>(
    panel.textFormatting || []
  );
  const [textAlign, setTextAlign] = useState(panel.textAlign || "center");
  const [letterSpacing, setLetterSpacing] = useState(
    panel.letterSpacing || "normal"
  );
  const [lineHeight, setLineHeight] = useState(panel.lineHeight || "normal");

  const [textTransformation, setTextTransformation] = useState<
    "uppercase" | "lowercase" | "capitalize" | undefined
  >(panel.transformations);

  const fontOptions = [
    "Arial",
    "Calibri",
    "Courier New",
    "Helvetica",
    "Tahoma",
    "Times New Roman",
    "Verdana",
  ];

  const handleTextAlignChange = (
    align: "left" | "center" | "right" | "justify"
  ) => {
    setTextAlign(align);
    updateDimension({ textAlign: align });
  };

  const handleLetterSpacingChange = (
    spacing: "tight" | "normal" | "loose" | "veryLoose" | "veryTight"
  ) => {
    setLetterSpacing(spacing);
    updateDimension({ letterSpacing: spacing });
  };

  const handleLineHeightChange = (
    spacing: "tight" | "normal" | "loose" | "veryLoose" | "veryTight"
  ) => {
    setLineHeight(spacing);
    updateDimension({ lineHeight: spacing });
  };

  const handleFontFamilyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newFontFamily = event.target.value;
    setFontFamily(newFontFamily);
    updateDimension({ fontFamily: newFontFamily });
  };

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value) || 16;
    setFontSize(newSize);
    updateDimension({ fontSize: newSize });
  };

  const handleFontColorChange = (color: string) => {
  setFontColor(color);
  updateDimension({ fontColor: color });
};

  const handleFontStyleToggle = (style: textFormatting) => {
    const newStyles = fontStyles.includes(style)
      ? fontStyles.filter((s) => s !== style)
      : [...fontStyles, style];
    setFontStyles(newStyles);
    updateDimension({ textFormatting: newStyles });
  };

  const handleTextTransformation = (
    value: "uppercase" | "lowercase" | "capitalize"
  ) => {
    setTextTransformation(value);
    updateDimension({ transformations: value });
  };

  const updateDimension = (updates: Partial<Panel>) => {
    if (isBulkEdit && selectedPanelIds?.length) {
      selectedPanelIds.forEach((id) => onDimensionChange(id, updates));
    } else {
      onDimensionChange(panel.id, updates);
    }
  };
  
  const accordionSections = [
    {
      title: "Panel Title",
      icon: <Pencil className="w-4 h-4" />,
      content: (
        <div className="flex flex-col space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wider">
              Title
            </label>
            <input
              type="text"
              value={panel.title}
              onChange={(e) =>
                onDimensionChange(panel.id, { title: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Enter panel title"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Dimensions",
      icon: <Box className="w-4 h-4" />,
      content: (
        <div className="flex flex-col gap-5">
          <DimensionOptions
            panel={panel}
            onDimensionChange={onDimensionChange}
          />
          <TranslateControl
            translateX={panel.x}
            translateY={panel.y}
            onChange={(newX, newY) => {
              updateDimension({ x: newX, y: newY });
            }}
            panel={panel}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
          />
        </div>
      ),
    },
    {
      title: "Font Settings",
      icon: <Type className="w-4 h-4" />,
      content: (
        <FontOptions
          fontFamily={fontFamily as string}
          handleFontColorChange={handleFontColorChange}
          fontStyles={fontStyles}
          handleFontFamilyChange={handleFontFamilyChange}
          fontSize={fontSize}
          handleFontSizeChange={handleFontSizeChange}
          handleFontStyleToggle={handleFontStyleToggle}
          fontColor={fontColor}
          fontOptions={fontOptions}
        />
      ),
    },
    {
      title: "Text Formatting",
      icon: <TextIcon className="w-4 h-4" />,
      content: (
        <LetterSpacing
          theme={theme}
          handleLetterSpacingChange={handleLetterSpacingChange}
          letterSpacing={letterSpacing}
          handleTextAlignChange={handleTextAlignChange}
          textAlign={textAlign}
          handleLineHeightChange={handleLineHeightChange}
          lineHeight={lineHeight}
          handleTextTransformation={handleTextTransformation}
          transformation={textTransformation}
        />
      ),
    },
    {
      title: "Background",
      icon: <Palette className="w-4 h-4" />,
      content:
        panel.shape === "textbox" ? (
          <input
            type="color"
            id="background-color-input"
            name="background-color"
            defaultValue="#ffffff"
            onChange={(e) => updateDimension({ backgroundColor: e.target.value })}
            className="w-full h-6 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all duration"
          />
        ) : (
          <BackgroundStyle
            panel={panel}
            onDimensionChange={onDimensionChange}
          />
        ),
    },
    {
      title: "Layer Order",
      icon: <Layers className="w-4 h-4" />,
      content: (
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
              Layer Order
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onBringForward(panel.id)}
                className="p-3 rounded-lg text-sm font-medium transition-all duration-200 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white hover:shadow-lg transform hover:scale-105 active:scale-95"
              >
                Send Forward
              </button>
              <button
                onClick={() => onBringBackward(panel.id)}
                className="p-3 rounded-lg text-sm font-medium transition-all duration-200 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white hover:shadow-lg transform hover:scale-105 active:scale-95"
              >
                Send Backward
              </button>
            </div>
          </div>
          {panel.shape !== "textbox" && (
            <RotateControl
              value={panel.rotation || 0}
              onChange={(rotation) => updateDimension({ rotation })}
            />
          )}
          <ScaleControl
            scaleX={panel.scaleX || 1}
            scaleY={panel.scaleY || 1}
            onChange={(scaleX, scaleY) => updateDimension({ scaleX, scaleY })}
            theme={theme}
          />
          <ZIndexControl
            value={panel.zIndex || 0}
            onChange={(zIndex) => onDimensionChange(panel.id, { zIndex })}
          />
        </div>
      ),
    },
    {
      title: "Border & Shadow",
      icon: <Square className="w-4 h-4" />,
      content: (
        <div>
          <BorderOptions panel={panel} onDimensionChange={onDimensionChange} />
        </div>
      ),
    },
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="fixed top-0 right-0 h-full w-[360px] z-30 overflow-hidden">
      <div className="bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-700 h-full flex flex-col backdrop-blur-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xl text-black/80 dark:text-gray-400">
                {"Format"}
              </p>
            </div>
          </div>
          <button
            onClick={() => onClose()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 group"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
          </button>
        </div>

        {/* Accordion Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <div className="space-y-2 p-4">
            {accordionSections.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-lg transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
              >
                <button
                  onClick={() => toggle(index)}
                  className={`w-full flex justify-between items-center py-4 px-5 font-medium text-left text-sm transition-all duration-200 group ${openIndex === index
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 border-b border-blue-100 dark:border-blue-800/50"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-650"
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg transition-all duration-200 ${openIndex === index
                        ? "bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-400 scale-110"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/50 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                        }`}
                    >
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <div
                    className={`p-1 rounded-full transition-all duration-300 ${openIndex === index
                      ? "bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-400"
                      : "text-gray-400 dark:text-gray-500 group-hover:bg-gray-100 dark:group-hover:bg-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400"
                      }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${openIndex === index ? "rotate-180" : "rotate-0"
                        }`}
                    />
                  </div>
                </button>

                {/* Accordion Content with smooth animation */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="px-5 pb-5 pt-2 text-sm text-gray-700 dark:text-gray-300 bg-gradient-to-b from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-750/50 border-t border-gray-100 dark:border-gray-700/50">
                    {item.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPanelPopup;