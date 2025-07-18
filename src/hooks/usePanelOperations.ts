import { useState } from "react";
import { Panel, PanelShape } from "../types/canvas";

interface UsePanelOperationsProps {
    panels: Panel[];
    actions: {
        addPanel: (panel: Panel) => void;
        removePanel: (id: string) => void;
        setEditingStates: (id: string) => void;
        setSelectedPanels: (ids: string[]) => void;
    };
}

export const usePanelOperations = ({
  panels,
  actions,
}: UsePanelOperationsProps) => {
  const [, setNewWidth] = useState("");
  const [, setNewHeight] = useState("");

  const addPanel = (shape: PanelShape = "rectangle") => {
    const canvas = document.querySelector(".canvas-container");
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = rect.width / 2 - 150;
      const y = rect.height / 2 - 150;
      const maxZIndex =
        panels.length > 0 ? Math.max(...panels.map((p) => p.zIndex)) : 0;
      const allowedPanelShapes = [
        "square",
        "rectangle",
        "circle",
        "ellipse",
        "triangle",
        "hexagon",
        "pentagon",
        "star",
        "diamond",
      ] as const;
      type AllowedPanelShape = (typeof allowedPanelShapes)[number];
      const panelShape: AllowedPanelShape = allowedPanelShapes.includes(
        shape as AllowedPanelShape
      )
        ? (shape as AllowedPanelShape)
        : "rectangle";
      const newPanel: Panel = {
        id: crypto.randomUUID(),
        title: `Panel ${panels.length + 1}`,
        x,
        y,
        width: shape === "ellipse" ? 300 : shape === "rectangle" ? 300 : 200,
        height: 200,
        zIndex: maxZIndex + 1,
        shape: panelShape,
        backgroundColor: "#ffffff",
        fontColor: "#000000",
        isLocked: false,
        rotation: 0,
        textAlign: "center",
        letterSpacing: "normal",
        lineHeight: "normal",
        textFormatting: [],
        transformations: undefined,
        borderColor: "#000000",
        borderWidth: 2,
        shadowDirection: "none",
      };
      actions.addPanel(newPanel);
            actions.setSelectedPanels?.([newPanel.id]);
    }
  };

  const addTextBoxPanel = (shape: PanelShape = "textbox") => {
    const canvas = document.querySelector(".canvas-container");
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = rect.width / 2 - 100;
      const y = rect.height / 2 - 50;

      const maxZIndex =
        panels.length > 0 ? Math.max(...panels.map((p) => p.zIndex)) : 0;

      const newPanel: Panel = {
        id: crypto.randomUUID(),
        x,
        y,
        title: `Text Box ${panels.length + 1}`,
        width: 200,
        height: 100,
        shape: shape,
        zIndex: maxZIndex + 1,
        rotation: 0,
        isLocked: false,
        placeholder: "Enter text here...",
        backgroundColor: "#ffffff",
        fontColor: "#000000",
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        textAlign: "left",
        letterSpacing: "normal",
        lineHeight: "normal",
        translateX: 0,
        translateY: 0,
        scaleX: 1,
        scaleY: 1,
        textFormatting: [],
        transformations: undefined,
      };

            actions.addPanel(newPanel);
            actions.setSelectedPanels([newPanel.id]);
        }
    };

  const removePanel = (id: string) => {
    actions.removePanel(id);
  };

  const handleDimensionClick = (panel: Panel) => {
    actions.setEditingStates(panel.id);
    setNewWidth(panel.width.toString());
    setNewHeight(panel.height.toString());
  };

  return {
    addPanel,
    addTextBoxPanel,
    removePanel,
    handleDimensionClick,
  };
};
