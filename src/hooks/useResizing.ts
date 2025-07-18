import { useEffect, useRef, useState } from "react";
import { ResizingPanel, ResizeStartPos, Panel } from "../types/canvas";

interface UseResizingProps {
  panels: Panel[];
  canvasWidth: number;
  canvasHeight: number;
  actions: {
    updatePanel: (id: string, updates: Partial<Panel>, addToHistory?: boolean) => void;
    setCanvasDimensions: (width: number, height: number, addToHistory?: boolean) => void;
    setSelectedPanels: (ids: string[]) => void;
  };
  hideGuidelines: () => void;
}

export const useResizing = ({
  panels,
  canvasWidth,
  canvasHeight,
  actions,
  hideGuidelines,
}: UseResizingProps) => {
  const [resizingPanel, setResizingPanel] = useState<ResizingPanel | null>(null);
  const [resizingCanvas, setResizingCanvas] = useState<string | null>(null);
  const resizeStartPos = useRef<ResizeStartPos | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizingPanel && resizeStartPos.current) {
        const { id, corner } = resizingPanel;
        const {
          x: startX,
          y: startY,
          width: startWidth,
          height: startHeight,
          panelX,
          panelY,
        } = resizeStartPos.current;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const panel = panels.find((p) => p.id === id);
        const isCircle = panel?.shape === "circle";
        let newWidth = startWidth;
        let newHeight = startHeight;
        let newX = panelX;
        let newY = panelY;

        if (corner === "bottom-right") {
          const maxWidth = canvasWidth - panelX;
          const maxHeight = canvasHeight - panelY;
          newWidth = Math.max(50, Math.min(startWidth + deltaX, maxWidth));
          newHeight = Math.max(50, Math.min(startHeight + deltaY, maxHeight));
          if (isCircle) {
            const maxSize = Math.min(maxWidth, maxHeight);
            const newSize = Math.max(
              50,
              Math.min(Math.max(newWidth, newHeight), maxSize)
            );
            newWidth = newSize;
            newHeight = newSize;
          }
        } else if (corner === "top-left") {
          const potentialWidth = Math.max(50, startWidth - deltaX);
          const potentialHeight = Math.max(50, startHeight - deltaY);
          const potentialX = panelX + (startWidth - potentialWidth);
          const potentialY = panelY + (startHeight - potentialHeight);
          newX = Math.max(0, potentialX);
          newY = Math.max(0, potentialY);
          newWidth = Math.min(potentialWidth, panelX + startWidth);
          newHeight = Math.min(potentialHeight, panelY + startHeight);
          if (isCircle) {
            const maxSize = Math.min(panelX + startWidth, panelY + startHeight);
            const newSize = Math.max(
              50,
              Math.min(Math.max(newWidth, newHeight), maxSize)
            );
            newWidth = newSize;
            newHeight = newSize;
            newX = Math.max(0, panelX + (startWidth - newWidth));
            newY = Math.max(0, panelY + (startHeight - newHeight));
          }
        } else if (corner === "top-right") {
          const maxWidth = canvasWidth - panelX;
          const constrainedWidth = Math.max(
            50,
            Math.min(startWidth + deltaX, maxWidth)
          );
          newWidth = constrainedWidth;
          const potentialHeight = Math.max(50, startHeight - deltaY);
          const potentialY = panelY + (startHeight - potentialHeight);
          newY = Math.max(0, potentialY);
          const maxHeight = panelY + startHeight - newY;
          newHeight = Math.min(potentialHeight, maxHeight);
          if (isCircle) {
            const maxWidthForCircle = canvasWidth - panelX;
            const maxHeightForCircle = panelY + startHeight;
            const maxSize = Math.min(maxWidthForCircle, maxHeightForCircle);
            const newSize = Math.max(
              50,
              Math.min(Math.max(constrainedWidth, newHeight), maxSize)
            );
            newWidth = newSize;
            newHeight = newSize;
            newY = Math.max(0, panelY + (startHeight - newHeight));
          }
        } else if (corner === "bottom-left") {
          const potentialWidth = Math.max(50, startWidth - deltaX);
          const potentialX = panelX + (startWidth - potentialWidth);
          newX = Math.max(0, potentialX);
          newWidth = Math.min(potentialWidth, panelX + startWidth);
          newHeight = Math.max(
            50,
            Math.min(startHeight + deltaY, canvasHeight - panelY)
          );
          if (isCircle) {
            const maxWidth = panelX + startWidth;
            const maxHeight = canvasHeight - panelY;
            const maxSize = Math.min(maxWidth, maxHeight);
            const newSize = Math.max(
              50,
              Math.min(Math.max(newWidth, newHeight), maxSize)
            );
            newWidth = newSize;
            newHeight = newSize;
            newX = Math.max(0, panelX + (startWidth - newWidth));
          }
        }

        actions.updatePanel(
          id,
          {
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
          },
          false
        );
      } else if (resizingCanvas && resizeStartPos.current) {
        const {
          x: startX,
          y: startY,
          width: startWidth,
          height: startHeight,
        } = resizeStartPos.current;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        let newCanvasWidth = startWidth;
        let newCanvasHeight = startHeight;

        if (resizingCanvas === "bottom-right") {
          newCanvasWidth = Math.max(200, Math.min(startWidth + deltaX, 1200));
          newCanvasHeight = Math.max(200, Math.min(startHeight + deltaY, 1200));
        } else if (resizingCanvas === "top-left") {
          newCanvasWidth = Math.max(200, Math.min(startWidth - deltaX, 1200));
          newCanvasHeight = Math.max(200, Math.min(startHeight - deltaY, 1200));
        } else if (resizingCanvas === "top-right") {
          newCanvasWidth = Math.max(200, Math.min(startWidth + deltaX, 1200));
          newCanvasHeight = Math.max(200, Math.min(startHeight - deltaY, 1200));
        } else if (resizingCanvas === "bottom-left") {
          newCanvasWidth = Math.max(200, Math.min(startWidth - deltaX, 1200));
          newCanvasHeight = Math.max(200, Math.min(startHeight + deltaY, 1200));
        }

        actions.setCanvasDimensions(newCanvasWidth, newCanvasHeight, false);
      }
    };

    const handleMouseUp = () => {
      if (resizingPanel) {
        const panel = panels.find((p) => p.id === resizingPanel.id);
        if (panel) {
          actions.updatePanel(
            panel.id,
            {
              x: panel.x,
              y: panel.y,
              width: panel.width,
              height: panel.height,
            },
            true
          );
        }
      }

      if (resizingCanvas) {
        actions.setCanvasDimensions(canvasWidth, canvasHeight, true);
      }

      setResizingPanel(null);
      setResizingCanvas(null);
      resizeStartPos.current = null;
      hideGuidelines();
    };

    if (resizingPanel || resizingCanvas) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    resizingPanel,
    resizingCanvas,
    canvasWidth,
    canvasHeight,
    panels,
    actions,
    hideGuidelines,
  ]);

  const startResizing = (e: React.MouseEvent, id: string, corner: string) => {
    e.stopPropagation();
    const panel = panels.find((p) => p.id === id);
    if (panel) {
      resizeStartPos.current = {
        x: e.clientX,
        y: e.clientY,
        width: panel.width,
        height: panel.height,
        panelX: panel.x,
        panelY: panel.y,
      };
      setResizingPanel({ id, corner });
      actions.setSelectedPanels([id]);
    }
  };

  const startResizingCanvas = (e: React.MouseEvent, corner: string) => {
    e.stopPropagation();
    resizeStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: canvasWidth,
      height: canvasHeight,
      panelX: 0,
      panelY: 0,
    };
    setResizingCanvas(corner);
  };

  return {
    resizingPanel,
    resizingCanvas,
    startResizing,
    startResizingCanvas,
  };
};