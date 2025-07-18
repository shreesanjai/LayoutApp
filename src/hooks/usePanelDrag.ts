import { useState } from "react";
import { Panel } from "../types/canvas";

export function usePanelDrag(
  panels: Panel[],
  selectedPanels: string[],
  actions: any,
  showGuidelines: any,
  hideGuidelines: any
) {
  const [initialPositions, setInitialPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [dragStartPoint, setDragStartPoint] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleDragStart = (
    id: string,
    _e: any,
    data: { x: number; y: number }
  ) => {
    const baseX = data.x;
    const baseY = data.y;

    const selected = selectedPanels.includes(id) ? selectedPanels : [id];
    const initial: Record<string, { x: number; y: number }> = {};

    selected.forEach((panelId) => {
      const p = panels.find((p) => p.id === panelId);
      if (p && !p.isLocked) {
        initial[panelId] = { x: p.x, y: p.y };
      }
    });

    setInitialPositions(initial);
    setDragStartPoint({ x: baseX, y: baseY });
  };

  const handleDrag = (
    id: string,
    _e: React.MouseEvent,
    data: { x: number; y: number }
  ) => {
    if (!dragStartPoint || Object.keys(initialPositions).length === 0) return;

    const deltaX = data.x - dragStartPoint.x;
    const deltaY = data.y - dragStartPoint.y;

    const targets = selectedPanels.includes(id) ? selectedPanels : [id];

    targets.forEach((panelId) => {
      const initial = initialPositions[panelId];
      const p = panels.find((p) => p.id === panelId);
      if (!initial || !p || p.isLocked) return;

      const newX = initial.x + deltaX;
      const newY = initial.y + deltaY;
      actions.updatePanelPosition(panelId, newX, newY, false);
    });

    const mainPanel = panels.find((p) => p.id === id);
    if (mainPanel && !mainPanel.isLocked) {
      showGuidelines(id, data.x, data.y, mainPanel.width, mainPanel.height);
    }
  };

  const handleDragStop = (
    id: string,
    _e: React.MouseEvent,
    data: { x: number; y: number }
  ) => {
    if (!dragStartPoint || Object.keys(initialPositions).length === 0) return;

    const deltaX = data.x - dragStartPoint.x;
    const deltaY = data.y - dragStartPoint.y;

    const targets = selectedPanels.includes(id) ? selectedPanels : [id];

    targets.forEach((panelId) => {
      const initial = initialPositions[panelId];
      const p = panels.find((p) => p.id === panelId);
      if (!initial || !p || p.isLocked) return;

      const newX = initial.x + deltaX;
      const newY = initial.y + deltaY;
      actions.updatePanelPosition(panelId, newX, newY);
    });

    setInitialPositions({});
    setDragStartPoint(null);
    hideGuidelines();
  };

  return {
    handleDragStart,
    handleDrag,
    handleDragStop,
  };
}
