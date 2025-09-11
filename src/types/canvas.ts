import { textFormatting } from "../components/Panel";

export type PanelShape =
  | "square"
  | "rectangle"
  | "circle"
  | "ellipse"
  | "triangle"
  | "hexagon"
  | "pentagon"
  | "star"
  | "diamond"
  | "textbox";

export interface Panel {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title?: string;
  shape: PanelShape;
  zIndex: number;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  shadowDirection?: "top" | "bottom" | "left" | "right" | "common" | "none";
  shapeShadowDirection?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "common"
    | "none";
  applySameShadow?: boolean;
  fontSize?: number;
  fontColor?: string;
  textFormatting?: textFormatting[];
  fontFamily?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: "cover" | "contain" | "auto";
  backgroundPosition?: "center" | "top" | "bottom" | "left" | "right";
  backgroundRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  rotation: number; 
  isLocked: boolean;
  textAlign?: "left" | "center" | "right" | "justify";
  letterSpacing?: "tight" | "normal" | "loose" | "veryLoose" | "veryTight"; 
  lineHeight?: "tight" | "normal" | "loose" | "veryLoose" | "veryTight"; 
  translateX?: number;
  translateY?: number;
  scaleX?: number;
  scaleY?: number;
  placeholder?: string;
  transformations?: "uppercase" | "lowercase" | "capitalize" | undefined; 
}

export interface CanvasConfig {
  panels: Panel[];
  canvasWidth: number;
  canvasHeight: number;
  canvasBgColor: string;
  canvasFgColor: string;
  canvasBgImage:string | null;
  roundedCorners: boolean;
  showGrid: boolean;
  useGradient?: boolean;
  gradientType?: string;
  startColor?: string;
  endColor?: string;
  angle?: number;
}

export interface ResizeState {
  id: string;
  corner: string;
}

export interface ResizeStartPos {
  x: number;
  y: number;
  width: number;
  height: number;
  panelX: number;
  panelY: number;
}

export interface ResizingPanel {
  id: string;
  corner: string;
}

export interface CanvasState {
  panels: Panel[];
  selectedPanels: string[];
  editingPanel: string | null;
  canvasWidth: number;
  canvasHeight: number;
  canvasBgColor: string;
  canvasBgImage:string | null;
  canvasFgColor: string;
  roundedCorners: boolean;
  showGrid: boolean;
  isEditingCanvas: boolean;
  past: CanvasState[];
  future: CanvasState[];
}
