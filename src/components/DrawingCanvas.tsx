import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import html2canvas from "html2canvas";
import { CanvasConfig, Panel } from "../types/canvas";
import Toolbar from "./ToolBar";
import { useCanvasState } from "../hooks/useCanvasState";
import PanelComponent from "./Panel";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useGridlines } from "../hooks/useGridlines";
import Guidelines from "./Guidelines";
import { useResizing } from "../hooks/useResizing";
import { usePanelOperations } from "../hooks/usePanelOperations";
import { usePanelDrag } from "../hooks/usePanelDrag";

export default function DrawingCanvas() {
  const { theme } = useTheme();
  const { state, actions } = useCanvasState();
  const {
    panels,
    selectedPanels,
    canvasWidth,
    canvasHeight,
    canvasBgColor,
    canvasBgImage,
    canvasFgColor,
    roundedCorners,
    showGrid,
    past,
    future,
  } = state;

  const [copiedPanels, setCopiedPanels] = useState<Panel[]>([]);
  const [useGradient, setUseGradient] = useState(false);
  const [customGradientColors, setCustomGradientColors] = useState(["#ffffff", "#ffffff"]);
  const [angle, setAngle] = useState(90);
  const [gradientType, setGradientType] = useState("custom");
  const [includeTextInExport, setIncludeTextInExport] = useState(true);

  const { guidelines, showGuidelines, hideGuidelines } = useGridlines({
    canvasWidth,
    canvasHeight,
    panels,
    alignmentThreshold: 2,
  });

  const { resizingPanel, startResizing, startResizingCanvas } = useResizing({
    panels,
    canvasWidth,
    canvasHeight,
    actions,
    hideGuidelines,
  });

  const { addPanel, addTextBoxPanel, removePanel, handleDimensionClick } = usePanelOperations({
    panels,
    actions,
  });

  const { handleDragStart, handleDrag, handleDragStop } = usePanelDrag(
    panels,
    selectedPanels,
    actions,
    showGuidelines,
    hideGuidelines
  );

  const getBackgroundStyle = () => {
    if (useGradient) {
      return canvasBgImage !== null 
        ? `url(${canvasBgImage})` : 
        gradientType === "custom" 
          ? `linear-gradient(${angle}deg,  ${customGradientColors.join(", ")})`
          : gradientType;
    }
    return `linear-gradient(${canvasBgColor}, ${canvasBgColor})`;
  };

  const handleCanvasDimensionSubmit = (width: string, height: string) => {
    const newWidth = parseInt(width);
    const newHeight = parseInt(height);
    if (
      !isNaN(newWidth) &&
      !isNaN(newHeight) &&
      newWidth >= 200 &&
      newHeight >= 200
    ) {
      actions.setCanvasDimensions(newWidth, newHeight);
    }
  };

  const exportToPNG = () => {
    const canvas = document.querySelector(".canvas-container");
    if (canvas) {
      const textElements = canvas.querySelectorAll("*");
      const hiddenElements: {
        element: HTMLElement;
        originalDisplay: string;
      }[] = [];

      // Only hide text elements if includeTextInExport is false
      if (!includeTextInExport) {
        textElements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          if (
            htmlEl.textContent &&
            htmlEl.textContent.trim().length > 0 &&
            !htmlEl.querySelector("*")
          ) {
            hiddenElements.push({
              element: htmlEl,
              originalDisplay: htmlEl.style.display,
            });
            htmlEl.style.display = "none";
          }
        });
      }

      html2canvas(canvas as HTMLElement, {
        backgroundColor: canvasBgColor,
        scale: 2,
        logging: false,
        useCORS:true
      }).then((canvas: HTMLCanvasElement) => {
        // Restore hidden elements
        hiddenElements.forEach(({ element, originalDisplay }) => {
          element.style.display = originalDisplay;
        });

        const link = document.createElement("a");
        link.download = `panel-drawing-${new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/:/g, "-")}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }).catch((err) => {
        console.error("html2canvas Error : "+err);
        
        hiddenElements.forEach(({ element, originalDisplay }) => {
          element.style.display = originalDisplay;
        });
        
      });
    }
  };

  const exportConfig = () => {
    const config: CanvasConfig = {
      panels,
      canvasWidth,
      canvasHeight,
      canvasBgColor,
      canvasFgColor,
      canvasBgImage,
      roundedCorners,
      showGrid,
      useGradient,
      gradientType,
      angle,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "panel-layout.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config: CanvasConfig = JSON.parse(e.target?.result as string);
          actions.loadConfig(config);
          setUseGradient(config.useGradient ?? false);
          setAngle(config.angle ?? 90);
          setGradientType(
            config.gradientType ?? "linear-gradient(90deg, #ff7e5f, #feb47b)"
          );
        } catch (error) {
          console.error("Error importing configuration:", error);
          alert("Error importing JSON. Please check the file format.");
        }
      };
      reader.readAsText(file);
    }
  };

  const clearPanels = () => {
    actions.clearPanels();
  };

  const handleBgColorChange = (color: string) => {
    actions.setCanvasColors(color);
  };

  const handleBgImageChange = (bgImage: string|null) => {
    actions.setCanvasImage(bgImage);
  }

  const handleFgColorChange = (color: string) => {
    actions.setCanvasColors(undefined, color);
  };

  const handleRoundedCornersToggle = () => {
    actions.setCanvasOptions(!roundedCorners);
  };

  const handleShowGridToggle = () => {
    actions.setCanvasOptions(undefined, !showGrid);
  };

  const { isCtrlPressed, handleCopy, handlePaste, handleCut } = useKeyboardShortcuts({
    selectedPanels,
    panels,
    onUndo: actions.undo,
    onRedo: actions.redo,
    onAddPanel: actions.addPanel,
    onRemovePanel: actions.removePanel,
    copiedPanels,
    setCopiedPanels,
    onUpdatePanel: actions.updatePanel, 
    canvasHeight,
    canvasWidth
  });

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Fixed Toolbar */}
      <div className="sticky top-0 z-30 bg-gray-50 dark:bg-gray-900 ">
        <Toolbar
          onAddPanel={addPanel}
          textBoxPanel={addTextBoxPanel}
          onExportConfig={exportConfig}
          onImportConfig={importConfig}
          onExportToPNG={exportToPNG}
          onClearPanels={clearPanels}
          onCopy={handleCopy}
          onPaste={handlePaste}
          onUndo={actions.undo}
          onRedo={actions.redo}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          canvasBgColor={canvasBgColor}
          canvasBgImage={canvasBgImage}
          canvasFgColor={canvasFgColor}
          roundedCorners={roundedCorners}
          showGrid={showGrid}
          onCanvasDimensionSubmit={handleCanvasDimensionSubmit}
          onBgColorChange={handleBgColorChange}
          onBgImageChange={handleBgImageChange}
          onFgColorChange={handleFgColorChange}
          onRoundedCornersToggle={handleRoundedCornersToggle}
          onShowGridToggle={handleShowGridToggle}
          canUndo={past.length > 0}
          canRedo={future.length > 0}
          canCopy={selectedPanels.length > 0}
          canPaste={copiedPanels.length > 0}
          onCut={handleCut}
          canCut={selectedPanels.length > 0}
          useGradient={useGradient}
          setUseGradient={setUseGradient}
          angle={angle}
          setAngle={setAngle}
          gradientType={gradientType}
          setGradientType={setGradientType}
          solidColor={canvasBgColor}
          setSolidColor={handleBgColorChange}
          hasShapes={panels.length > 0}
          includeTextInExport={includeTextInExport}
          setincludeTextInExport={setIncludeTextInExport}
          customGradientColors={customGradientColors}
  setCustomGradientColors={setCustomGradientColors}
        />
      </div>
      <div
        className="flex-grow flex justify-center  overflow-auto hide-scrollbar px-4 pt-5 pb-11
    dark:bg-gray-900 bg-gray-50"
      >
        <div className="relative">
          <div
            className={`relative border-2 canvas-container transition-colors duration-200 overflow-hidden ${
              roundedCorners ? "rounded-xl" : ""
            } ${showGrid ? "grid-background" : ""}`}
            style={{
              width: canvasWidth,
              height: canvasHeight,
              backgroundColor: canvasBgColor,
              color: canvasFgColor,
              backgroundImage: showGrid
                ? `
                    repeating-linear-gradient(to right, #e5e7eb 0 1px, transparent 1px 20px),
                    repeating-linear-gradient(to bottom, #e5e7eb 0 1px, transparent 1px 20px),
                    ${getBackgroundStyle()}
                  `
                : getBackgroundStyle(),
              backgroundSize: showGrid ? "20px 20px" : getBackgroundStyle().startsWith("url") ? "cover" :"auto",
              backgroundRepeat: showGrid ? "repeat":"no-repeat",
              backgroundPosition:"center"
            }}
          >
            {/* Render guidelines using the separate component */}
            <Guidelines guidelines={guidelines} />

            <div onClick={() => actions.setSelectedPanels([])} className="absolute inset-0 flex items-center justify-center border-2 border-transparent hover:border-blue-500 transition-colors duration-200 border-dashed">
              <div
                className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full cursor-nwse-resize opacity-0 hover:opacity-100 z-30"
                onMouseDown={(e) => startResizingCanvas(e, "top-left")}
              />
              <div
                className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-nesw-resize opacity-0 hover:opacity-100 z-30"
                onMouseDown={(e) => startResizingCanvas(e, "top-right")}
              />
              <div
                className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full cursor-nesw-resize opacity-0 hover:opacity-100 z-30"
                onMouseDown={(e) => startResizingCanvas(e, "bottom-left")}
              />
              <div
                className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-nwse-resize opacity-0 hover:opacity-100 z-30"
                onMouseDown={(e) => startResizingCanvas(e, "bottom-right")}
              />
            </div>

            {panels.length > 0 ? (
              panels.map((panel) => (
                <PanelComponent
                  key={panel.id}
                  panel={panel}
                  theme={theme}
                  isCtrlPressed={isCtrlPressed}
                  resizingPanel={resizingPanel}
                  selectedPanels={selectedPanels}
                  roundedCorners={roundedCorners}
                  canvasWidth={canvasWidth}
                  canvasHeight={canvasHeight}
                  actions={{
                    setSelectedPanels: actions.setSelectedPanels,
                    updatePanel: actions.updatePanel,
                    removePanel: actions.removePanel,
                    setEditingStates: actions.setEditingStates,
                    bringForward: actions.bringForward,
                    bringBackward: actions.bringBackward,
                  }}
                  onDragStart={handleDragStart}
                  onDrag={handleDrag}
                  onDragStop={handleDragStop}
                  onStartResizing={startResizing}
                  onRemovePanel={removePanel}
                  onDimensionClick={handleDimensionClick}
                  editingPanel={state.editingPanel}
                  panels={panels}
                />
              ))
            ) : (
              <div
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center`}
                style={{ color: canvasFgColor }}
              >
                Click the insert tab to add a panel.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
