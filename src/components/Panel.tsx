import React, { useRef } from "react";
import { Trash2, Pencil, Lock } from "lucide-react";
import Draggable from "react-draggable";
import { Panel, ResizingPanel } from "../types/canvas";
import SVGShape from "./SVGShape";
import EditPanelPopup from "./EditPanelPopup";

export type textFormatting =
  | "normal"
  | "italic"
  | "bold"
  | "underline"
  | "line-through";

interface PanelComponentProps {
  panel: Panel;
  theme: string;
  isCtrlPressed: boolean;
  resizingPanel: ResizingPanel | null;
  selectedPanels: string[];
  editingPanel: string | null;
  roundedCorners: boolean;
  canvasWidth: number;
  canvasHeight: number;
  panels: Panel[];
  actions: {
    setSelectedPanels?: (ids: string[]) => void;
    updatePanel: (id: string, updates: Partial<Panel>) => void;
    removePanel: (id: string) => void;
    setEditingStates: (
      panelId?: string | null,
      isEditingCanvas?: boolean
    ) => void | null;
    bringForward: (id: string) => void;
    bringBackward: (id: string) => void;
  };
  onDragStart: (id: string, e: any, data: { x: number; y: number }) => void;
  onDrag: (id: string, e: any, data: { x: number; y: number }) => void;
  onDragStop: (id: string, e: any, data: { x: number; y: number }) => void;
  onStartResizing: (e: React.MouseEvent, id: string, corner: string) => void;
  onRemovePanel: (id: string) => void;
  onDimensionClick: (panel: Panel) => void;
}

export default function PanelComponent({
  panel,
  theme,
  resizingPanel,
  selectedPanels,
  editingPanel,
  actions,
  onDragStart,
  onDrag,
  onDragStop,
  onStartResizing,
  onRemovePanel,
  onDimensionClick,
  canvasWidth,
  canvasHeight,
  panels,

}: PanelComponentProps) {
  const toggleMoveMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.updatePanel(panel.id, { isLocked: !panel.isLocked });
  };

  const getFontStyles = () => {
    const styles = panel.textFormatting || [];

    let textDecorations = [];
    if (styles.includes("underline")) textDecorations.push("underline");
    if (styles.includes("line-through")) textDecorations.push("line-through");

    return {
      fontStyle: styles.includes("italic") ? "italic" : "normal",
      fontWeight: styles.includes("bold") ? "bold" : "normal",
      textDecoration: textDecorations.join(" ") || "none",
    };
  };

  const getScaleStyle = () => {
    const scaleX = panel.scaleX || 1;
    const scaleY = panel.scaleY || 1;

    return {
      transform: `scale(${scaleX}, ${scaleY})`,
      transformOrigin: "center center",
    };
  };

  const getRotationStyle = () => {
    const rotation = panel.rotation || 0;

    return {
      transform: `rotate(${rotation}deg)`,
      transformOrigin: "center center",
    };
  };

  const nodeRef = useRef<HTMLDivElement>(null);
  const isSelected = selectedPanels.includes(panel.id);
  const isEditing = editingPanel === panel.id;

  const getShadowStyle = () => {
    switch (panel.shadowDirection) {
      case "top":
        return "0 -2px 4px rgba(0, 0, 0, 0.5)";
      case "bottom":
        return "0 2px 4px rgba(0, 0, 0, 0.5)";
      case "left":
        return "-2px 0 4px rgba(0, 0, 0, 0.5)";
      case "right":
        return "2px 0 4px rgba(0, 0, 0, 0.5)";
      case "common":
        return "0 2px 8px rgba(0, 0, 0, 0.6)";
      default:
        return "";
    }
  };

  const selectedPanelObjects = panels.filter(p => selectedPanels.includes(p.id));

  const allSameShape = selectedPanelObjects.length > 0 && selectedPanelObjects.every((p) => p.shape === panel.shape);

  const updateAllSelectedPanels = (updates: Partial<Panel>) => {
    if (allSameShape) {
      selectedPanelObjects.forEach((p) => {
        actions.updatePanel(p.id, updates);
      });
    } else {
      actions.updatePanel(panel.id, updates);
    }
  };

  return (
    <React.Fragment>
      <Draggable
        key={panel.id}
        nodeRef={nodeRef}
        position={{ x: panel.x, y: panel.y }}
        onStart={(e, data) => onDragStart(panel.id, e, data)}
        onDrag={(e, data) => onDrag(panel.id, e, data)}
        onStop={(e, data) => onDragStop(panel.id, e, data)}
        disabled={!!resizingPanel || panel.isLocked}
      >
        <div
          ref={nodeRef}
          className={`absolute ${isSelected ? "z-10" : "z-0"}`}
          style={{
            zIndex: panel.zIndex,
            boxShadow: getShadowStyle(),
            ...getRotationStyle(),
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (actions.setSelectedPanels) {
              if (e.ctrlKey) {
                if (selectedPanels.includes(panel.id)) {
                  actions.setSelectedPanels(selectedPanels.filter(id => id !== panel.id));
                } else {
                  actions.setSelectedPanels([...selectedPanels, panel.id]);
                }
              } else {
                actions.setSelectedPanels([panel.id]);
              }
            }
          }}
        >
          <div className="relative group select-none">
            <div
              className="relative flex items-center justify-center"
              style={{
                width: panel.width,
                height: panel.height,
                ...getScaleStyle(),
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (actions.setSelectedPanels) {
                  if (e.ctrlKey) {
                    if (selectedPanels.includes(panel.id)) {
                      actions.setSelectedPanels(selectedPanels.filter(id => id !== panel.id));
                    } else {
                      actions.setSelectedPanels([...selectedPanels, panel.id]);
                    }
                  } else {
                    actions.setSelectedPanels([panel.id]);
                  }
                }
                if (editingPanel !== null && editingPanel !== panel.id) {
                  actions.setEditingStates(panel.id);
                }
              }}

            >
              <SVGShape
                shape={panel.shape}
                width={panel.width}
                height={panel.height}
                backgroundColor={panel.backgroundColor || (theme === "dark" ? "#374151" : "#ffffff")}
                strokeColor={panel.borderColor || (theme === "dark" ? "#6b7280" : "#d1d5db")}
                strokeWidth={panel.borderWidth ?? 2}
                rotation={panel.rotation || 0}
                backgroundImage={panel.backgroundImage}
                backgroundSize={panel.backgroundSize}
                backgroundRepeat={panel.backgroundRepeat}
                backgroundPosition={panel.backgroundPosition}
                borderRadius={panel.borderRadius || 0}
                ShadowDirection={panel.shapeShadowDirection || "none"}
              />
              {/* Control Buttons - Top Right */}
              <div
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1"
                style={{ zIndex: 50 }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.setEditingStates(panel.id);
                  }}
                  className={`p-1.5 rounded-md text-white shadow-lg 
                    dark:bg-blue-600 dark:hover:bg-blue-700
                      bg-blue-500 hover:bg-blue-600
                  `}
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemovePanel(panel.id);
                  }}
                  className={`p-1.5 rounded-md text-white shadow-lg 
                    dark:bg-red-600 dark:hover:bg-red-700
                      bg-red-500 hover:bg-red-600
                  `}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Lock/Unlock Button - Top Left */}
              <div
                className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1"
                style={{ zIndex: 50 }}
              >
                <button
                  onClick={toggleMoveMode}
                  className={`p-1.5 rounded-md text-white shadow-lg ${!panel.isLocked
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                    } cursor-pointer`}
                >
                  <Lock size={14} />
                </button>
              </div>

              {/* Text Content */}
              <div
                className="absolute inset-0 flex items-center justify-center p-4"
                style={{ zIndex: 10, boxShadow: getShadowStyle() }}
              >
                {panel.shape === "textbox" ? (
                  <textarea
                    autoComplete="off"
                    spellCheck="false"
                    autoCorrect="off"
                    autoCapitalize="off"
                    className="w-full h-full resize-none border-none outline-none bg-red-500 p-2 text-wrap"
                    style={{
                      color: panel.fontColor,
                      backgroundColor: panel.backgroundColor || "transparent",
                      fontFamily: panel.fontFamily,
                      fontSize: `${panel.fontSize}px`,
                      textAlign: panel.textAlign || "center",
                      textTransform: panel.transformations || undefined,
                      letterSpacing:
                        panel.letterSpacing === "tight"
                          ? "-0.05em"
                          : panel.letterSpacing === "normal"
                            ? "0em"
                            : panel.letterSpacing === "loose"
                              ? "0.05em"
                              : panel.letterSpacing === "veryLoose"
                                ? "0.1em"
                                : panel.letterSpacing === "veryTight"
                                  ? "-0.1em"
                                  : "0em",
                      ...getFontStyles(),
                      lineHeight:
                        panel.lineHeight === "tight"
                          ? "1.0em"
                          : panel.lineHeight === "normal"
                            ? "1.2em"
                            : panel.lineHeight === "loose"
                              ? "1.6em"
                              : panel.lineHeight === "veryLoose"
                                ? "2.5em"
                                : panel.lineHeight === "veryTight"
                                  ? "0.8em"
                                  : "1em",
                    }}
                    value={panel.title || ""}
                    placeholder={panel.placeholder || "Enter text here..."}
                    onChange={(e) =>
                      updateAllSelectedPanels({ title: e.target.value })
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span
                    className="w-full overflow-hidden truncate break-words p-2 text-wrap"
                    style={{
                      color: panel.fontColor,
                      fontFamily: panel.fontFamily,
                      fontSize: `${panel.fontSize}px`,
                      textAlign: panel.textAlign || "center",
                      textTransform: panel.transformations || undefined,
                      letterSpacing:
                        panel.letterSpacing === "tight"
                          ? "-0.05em"
                          : panel.letterSpacing === "normal"
                            ? "0em"
                            : panel.letterSpacing === "loose"
                              ? "0.05em"
                              : panel.letterSpacing === "veryLoose"
                                ? "0.1em"
                                : panel.letterSpacing === "veryTight"
                                  ? "-0.1em"
                                  : "0em",
                      textShadow:
                        theme === "dark"
                          ? "1px 1px 2px rgba(0,0,0,0.8)"
                          : "1px 1px 2px rgba(255,255,255,0.8)",
                      ...getFontStyles(),
                      lineHeight:
                        panel.lineHeight === "tight"
                          ? "1.0em"
                          : panel.lineHeight === "normal"
                            ? "1.2em"
                            : panel.lineHeight === "loose"
                              ? "1.6em"
                              : panel.lineHeight === "veryLoose"
                                ? "2.5em"
                                : panel.lineHeight === "veryTight"
                                  ? "0.8em"
                                  : "1em",
                    }}
                  >
                    {panel.title || ""}
                  </span>
                )}
              </div>

              {/* Selection Border & Resize Handles */}
              <div
                className={`absolute inset-0 border-2 transition-colors duration-200 pointer-events-none ${isSelected
                  ? "border-blue-500 border-dashed"
                  : "border-transparent group-hover:border-blue-500 group-hover:border-dashed"
                  }`}
                style={{ zIndex: 40 }}
              >
                {/* Resize Handles */}
                {(isSelected || !panel.isLocked) && (
                  <>
                    {[
                      ["top-left", "-top-1 -left-1", "nwse-resize"],
                      ["top-right", "-top-1 -right-1", "nesw-resize"],
                      ["bottom-left", "-bottom-1 -left-1", "nesw-resize"],
                      ["bottom-right", "-bottom-1 -right-1", "nwse-resize"],
                    ].map(([corner, pos, cursor]) => (
                      <div
                        key={corner}
                        className={`absolute ${pos} w-2 h-2 bg-blue-500 rounded-full cursor-${cursor} pointer-events-auto ${isSelected
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                          } ${panel.isLocked ? "pointer-events-none opacity-25" : ""
                          }`}
                        style={{ zIndex: 50 }}
                        onMouseDown={(e) =>
                          !panel.isLocked &&
                          onStartResizing(e, panel.id, corner as string)
                        }
                      />
                    ))}
                  </>
                )}
              </div>

              {/* Dimensions Label */}
              <div
                className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                style={{ zIndex: 50 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDimensionClick(panel);
                }}
              >
                <span
                  className={`text-xs font-mono px-1 py-0.5 rounded ${theme === "dark"
                    ? "text-gray-300 bg-gray-800/80"
                    : "text-gray-600 bg-white/80"
                    }`}
                >
                  {panel.width} × {panel.height}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Draggable>

      {/* Edit Panel Popup */}
      {isEditing && (
        <>
          <div className="relative z-[9999]">
            <EditPanelPopup
              panel={panel}
              theme={theme}
              onDimensionChange={(_, updates) =>
                allSameShape
                  ? selectedPanelObjects.forEach((p) =>
                    actions.updatePanel(p.id, updates)
                  )
                  : actions.updatePanel(panel.id, updates)
              }
              onClose={() => actions.setEditingStates(null)}
              onBringForward={(id) => actions.bringForward(id)}
              onBringBackward={(id) => actions.bringBackward(id)}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              isBulkEdit={allSameShape && selectedPanels.length > 1}
              selectedPanelIds={selectedPanels}
            />
          </div>
        </>
      )}
    </React.Fragment>
  );
}
