import { useReducer } from "react";
import { CanvasConfig, Panel, CanvasState } from "../types/canvas";

// Canvas Action Types
type CanvasAction =
  | { type: "SET_PANELS"; payload: Panel[] }
  | { type: "ADD_PANEL"; payload: Panel }
  | { type: "REMOVE_PANEL"; payload: string }
  | {
      type: "UPDATE_PANEL";
      payload: { id: string; updates: Partial<Panel> };
      saveHistory?: boolean;
    }
  | {
      type: "UPDATE_PANEL_POSITION";
      payload: { id: string; x: number; y: number };
      saveHistory?: boolean;
    }
  | {
      type: "UPDATE_PANEL_DIMENSIONS";
      payload: { id: string; width: number; height: number };
    }
  | { type: "CLEAR_PANELS" }
  | { type: "SET_SELECTED_PANELS"; payload: string[] }
  | {
      type: "SET_CANVAS_DIMENSIONS";
      payload: { width: number; height: number };
      saveHistory?: boolean;
    }
  | {
      type: "SET_CANVAS_COLORS";
      payload: { bgColor?: string; fgColor?: string };
    }
  | {
      type: "SET_CANVAS_BG_IMAGE";
      payload: { bgImage:string | null; }
    }
  | {
      type: "SET_CANVAS_OPTIONS";
      payload: { roundedCorners?: boolean; showGrid?: boolean };
    }
  | {
      type: "SET_EDITING_STATES";
      payload: { editingPanel?: string | null; isEditingCanvas?: boolean };
    }
  | { type: "LOAD_CONFIG"; payload: CanvasConfig }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "BRING_FORWARD"; payload: string }
  | { type: "BRING_BACKWARD"; payload: string };

// Extended Canvas State with History
interface ExtendedCanvasState extends CanvasState {
  past: CanvasState[];
  future: CanvasState[];
}

// Initial State
const initialState: ExtendedCanvasState = {
  panels: [],
  selectedPanels: [],
  editingPanel: null,
  canvasWidth: 1100,
  canvasHeight: 450,
  canvasBgColor: "#ffffff",
  canvasBgImage:null,
  canvasFgColor: "#000000",
  roundedCorners: true,
  showGrid: false,
  isEditingCanvas: false,
  past: [],
  future: [],
};

// Panel Validation
const validateAndAdjustPanels = (
  panels: Panel[],
  canvasWidth: number,
  canvasHeight: number
): Panel[] => {
  return panels
    .filter(
      (panel) =>
        panel.id &&
        typeof panel.x === "number" &&
        !isNaN(panel.x) &&
        typeof panel.y === "number" &&
        !isNaN(panel.y) &&
        typeof panel.width === "number" &&
        !isNaN(panel.width) &&
        panel.width >= 50 &&
        typeof panel.height === "number" &&
        !isNaN(panel.height) &&
        panel.height >= 50 &&
        typeof panel.zIndex === "number" &&
        !isNaN(panel.zIndex) &&
        [
          "rectangle",
          "circle",
          "ellipse",
          "triangle",
          "hexagon",
          "pentagon",
          "star",
          "diamond",
          "textbox",
          "square",
        ].includes(panel.shape)
    )
    .map((panel) => ({
      ...panel,
      x: Math.max(0, Math.min(panel.x, canvasWidth - panel.width)),
      y: Math.max(0, Math.min(panel.y, canvasHeight - panel.height)),
      zIndex: Math.max(1, panel.zIndex),
      fillColor: panel.backgroundColor || "#ffffff",
      borderColor: panel.borderColor || "#d1d5db",
    }));
};

// Save current state to history
const saveStateToHistory = (
  state: ExtendedCanvasState,
  newState: ExtendedCanvasState
): ExtendedCanvasState => ({
  ...newState,
  past: [
    {
      ...state,
      past: [],
      future: [],
    },
    ...state.past.slice(0, 50),
  ],
  future: [],
});

// Reducer Function
const canvasReducer = (
  state: ExtendedCanvasState,
  action: CanvasAction
): ExtendedCanvasState => {
  switch (action.type) {
    case "SET_PANELS":
      return saveStateToHistory(state, {
        ...state,
        panels: validateAndAdjustPanels(
          action.payload,
          state.canvasWidth,
          state.canvasHeight
        ),
      });
    case "ADD_PANEL":
      return saveStateToHistory(state, {
        ...state,
        panels: [
          ...state.panels,
          {
            ...action.payload,
            zIndex: Math.max(1, action.payload.zIndex || 1),
            backgroundColor: action.payload.backgroundColor || "#ffffff",
            borderColor: action.payload.borderColor || "#d1d5db",
          },
        ],
      });
    case "REMOVE_PANEL":
      return saveStateToHistory(state, {
        ...state,
        panels: state.panels.filter((panel) => panel.id !== action.payload),
        selectedPanels: state.selectedPanels.filter(
          (id) => id !== action.payload
        ),
      });
    case "UPDATE_PANEL": {
      const { id, updates } = action.payload;

      if (
        !updates.hasOwnProperty("zIndex") ||
        updates.zIndex === undefined ||
        updates.zIndex === null
      ) {
        const updatedState = {
          ...state,
          panels: state.panels.map((panel) =>
            panel.id === id ? { ...panel, ...updates } : panel
          ),
        };
        return action.saveHistory
          ? saveStateToHistory(state, updatedState)
          : updatedState;
      }

      const requestedZIndex = Number(updates.zIndex);
      const currentPanel = state.panels.find((p) => p.id === id);

      if (!currentPanel || isNaN(requestedZIndex)) {
        return state;
      }

      const otherZIndices = state.panels
        .filter((panel) => panel.id !== id)
        .map((panel) => panel.zIndex)
        .sort((a, b) => a - b);

      let finalZIndex;

      if (requestedZIndex < 1) {
        finalZIndex = 1;
      } else if (requestedZIndex > otherZIndices.length + 1) {
        finalZIndex =
          otherZIndices.length > 0 ? Math.max(...otherZIndices) + 1 : 1;
      } else {
        if (otherZIndices.includes(requestedZIndex)) {
          finalZIndex = requestedZIndex;
          while (otherZIndices.includes(finalZIndex)) {
            finalZIndex++;
          }
        } else {
          finalZIndex = requestedZIndex;
        }
      }

      const updatedState = {
        ...state,
        panels: state.panels.map((panel) =>
          panel.id === id
            ? {
                ...panel,
                ...updates,
                zIndex: finalZIndex,
              }
            : panel
        ),
      };

      return action.saveHistory
        ? saveStateToHistory(state, updatedState)
        : updatedState;
    }
    case "UPDATE_PANEL_POSITION": {
      const updatedState = {
        ...state,
        panels: state.panels.map((panel) =>
          panel.id === action.payload.id
            ? {
                ...panel,
                x: Math.max(
                  0,
                  Math.min(action.payload.x, state.canvasWidth - panel.width)
                ),
                y: Math.max(
                  0,
                  Math.min(action.payload.y, state.canvasHeight - panel.height)
                ),
              }
            : panel
        ),
      };
      return action.saveHistory
        ? saveStateToHistory(state, updatedState)
        : updatedState;
    }
    case "UPDATE_PANEL_DIMENSIONS":
      return saveStateToHistory(state, {
        ...state,
        panels: state.panels.map((panel) =>
          panel.id === action.payload.id
            ? {
                ...panel,
                width: action.payload.width,
                height: action.payload.height,
              }
            : panel
        ),
      });
    case "CLEAR_PANELS":
      return saveStateToHistory(state, {
        ...state,
        panels: [],
        selectedPanels: [],
      });
    case "SET_SELECTED_PANELS":
      return { ...state, selectedPanels: action.payload };
    case "SET_CANVAS_DIMENSIONS": {
      const updatedState = {
        ...state,
        canvasWidth: action.payload.width,
        canvasHeight: action.payload.height,
        panels: validateAndAdjustPanels(
          state.panels,
          action.payload.width,
          action.payload.height
        ),
      };
      return action.saveHistory
        ? saveStateToHistory(state, updatedState)
        : updatedState;
    }
    case "SET_CANVAS_BG_IMAGE":
       return saveStateToHistory(state, {
        ...state,
          canvasBgImage: action.payload.bgImage,
      });
    case "SET_CANVAS_COLORS":
      return saveStateToHistory(state, {
        ...state,
        ...(action.payload.bgColor && {
          canvasBgColor: action.payload.bgColor,
        }),
        ...(action.payload.fgColor && {
          canvasFgColor: action.payload.fgColor,
        }),
      });
    case "SET_CANVAS_OPTIONS":
      return saveStateToHistory(state, {
        ...state,
        ...(action.payload.roundedCorners !== undefined && {
          roundedCorners: action.payload.roundedCorners,
        }),
        ...(action.payload.showGrid !== undefined && {
          showGrid: action.payload.showGrid,
        }),
      });
    case "SET_EDITING_STATES":
      return {
        ...state,
        ...(action.payload.editingPanel !== undefined && {
          editingPanel: action.payload.editingPanel,
        }),
        ...(action.payload.isEditingCanvas !== undefined && {
          isEditingCanvas: action.payload.isEditingCanvas,
        }),
      };
    case "LOAD_CONFIG":
      const validatedPanels = validateAndAdjustPanels(
        action.payload.panels || [],
        action.payload.canvasWidth || 1280,
        action.payload.canvasHeight || 720
      );
      return saveStateToHistory(state, {
        ...state,
        panels: validatedPanels,
        canvasWidth: action.payload.canvasWidth || 1280,
        canvasHeight: action.payload.canvasHeight || 720,
        canvasBgColor: action.payload.canvasBgColor || "#ffffff",
        canvasFgColor: action.payload.canvasFgColor || "#000000",
        canvasBgImage: action.payload.canvasBgImage || null,
        roundedCorners:
          action.payload.roundedCorners !== undefined
            ? action.payload.roundedCorners
            : true,
        showGrid: action.payload.showGrid || false,
      });
    case "UNDO":
      if (state.past.length === 0) return state;
      console.log(state.past);
      const previous = state.past[0];
      return {
        ...previous,
        past: state.past.slice(1),
        future: [
          {
            ...state,
            past: [],
            future: [],
          },
          ...state.future,
        ],
      };
    case "REDO":
      if (state.future.length === 0) return state;
      console.log(state.future);
      const next = state.future[0];
      return {
        ...next,
        past: [
          {
            ...state,
            past: [],
            future: [],
          },
          ...state.past,
        ],
        future: state.future.slice(1),
      };
    case "BRING_FORWARD":
      const panelToMoveForward = state.panels.find(
        (p) => p.id === action.payload
      );
      if (!panelToMoveForward) return state;
      const currentZIndexForward = panelToMoveForward.zIndex;
      const panelsAbove = state.panels.filter(
        (p) => p.zIndex > currentZIndexForward
      );
      const nextZIndexForward =
        panelsAbove.length > 0
          ? Math.min(...panelsAbove.map((p) => p.zIndex))
          : currentZIndexForward + 1;
      return saveStateToHistory(state, {
        ...state,
        panels: state.panels.map((panel) =>
          panel.id === action.payload
            ? { ...panel, zIndex: nextZIndexForward }
            : panel.zIndex === nextZIndexForward
            ? { ...panel, zIndex: currentZIndexForward }
            : panel
        ),
      });
    case "BRING_BACKWARD":
      const panelToMoveBackward = state.panels.find(
        (p) => p.id === action.payload
      );
      if (!panelToMoveBackward || panelToMoveBackward.zIndex <= 1)
        return state;
      const currentZIndexBackward = panelToMoveBackward.zIndex;
      const panelsBelow = state.panels.filter(
        (p) => p.zIndex < currentZIndexBackward
      );
      const nextZIndexBackward =
        panelsBelow.length > 0
          ? Math.max(...panelsBelow.map((p) => p.zIndex))
          : currentZIndexBackward - 1;
      return saveStateToHistory(state, {
        ...state,
        panels: state.panels.map((panel) =>
          panel.id === action.payload
            ? { ...panel, zIndex: Math.max(1, nextZIndexBackward) }
            : panel.zIndex === nextZIndexBackward
            ? { ...panel, zIndex: currentZIndexBackward }
            : panel
        ),
      });
    default:
      return state;
  }
};

// Custom Hook
export const useCanvasState = () => {
  const [state, dispatch] = useReducer(canvasReducer, initialState);

  const actions = {
    setPanels: (panels: Panel[]) =>
      dispatch({ type: "SET_PANELS", payload: panels }),
    addPanel: (panel: Panel) =>
      dispatch({ type: "ADD_PANEL", payload: panel }),
    removePanel: (id: string) =>
      dispatch({ type: "REMOVE_PANEL", payload: id }),
    updatePanel: (id: string, updates: Partial<Panel>, saveHistory = true) =>
      dispatch({ type: "UPDATE_PANEL", payload: { id, updates }, saveHistory }),
    updatePanelPosition: (
      id: string,
      x: number,
      y: number,
      saveHistory = true
    ) =>
      dispatch({
        type: "UPDATE_PANEL_POSITION",
        payload: { id, x, y },
        saveHistory,
      }),
    updatePanelDimensions: (id: string, width: number, height: number) =>
      dispatch({
        type: "UPDATE_PANEL_DIMENSIONS",
        payload: { id, width, height },
      }),
    clearPanels: () => dispatch({ type: "CLEAR_PANELS" }),
    setSelectedPanels: (ids: string[]) =>
      dispatch({ type: "SET_SELECTED_PANELS", payload: ids }),
    setCanvasDimensions: (width: number, height: number, saveHistory = true) =>
      dispatch({
        type: "SET_CANVAS_DIMENSIONS",
        payload: { width, height },
        saveHistory,
      }),
    setCanvasColors: (bgColor?: string, fgColor?: string) =>
      dispatch({ type: "SET_CANVAS_COLORS", payload: { bgColor, fgColor } }),
    setCanvasImage: (bgImage : string|null) =>
      dispatch({ type: "SET_CANVAS_BG_IMAGE", payload: { bgImage } }),
    setCanvasOptions: (roundedCorners?: boolean, showGrid?: boolean) =>
      dispatch({
        type: "SET_CANVAS_OPTIONS",
        payload: { roundedCorners, showGrid },
      }),
    setEditingStates: (
      editingPanel?: string | null,
      isEditingCanvas?: boolean
    ) =>
      dispatch({
        type: "SET_EDITING_STATES",
        payload: { editingPanel, isEditingCanvas },
      }),
    loadConfig: (config: CanvasConfig) =>
      dispatch({ type: "LOAD_CONFIG", payload: config }),
    undo: () => dispatch({ type: "UNDO" }),
    redo: () => dispatch({ type: "REDO" }),
    bringForward: (id: string) =>
      dispatch({ type: "BRING_FORWARD", payload: id }),
    bringBackward: (id: string) =>
      dispatch({ type: "BRING_BACKWARD", payload: id }),
  };

  return {
    state,
    actions,
    dispatch,
  };
};

export type { CanvasAction };
export default canvasReducer;
