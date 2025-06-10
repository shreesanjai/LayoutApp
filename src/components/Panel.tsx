import { Rnd } from "react-rnd";
import { Trash2, Move, Edit } from 'lucide-react';
import Circle  from './Common/Shapes/Circle'
import Square from "./Common/Shapes/Square";
import Rectangle from "./Common/Shapes/Rectangle";
import Star from "./Common/Shapes/Star";
import Diamond from "./Common/Shapes/Diamond";
import Triangle from "./Common/Shapes/Triangle";
interface Panel {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  title: string;
  shape: string;
  editingEnabled: boolean
  style: {
    fillColor: string
    strokeColor: string,
    strokeWidth: number,
    borderRadius: number,
  }
}

interface PanelProps {
  panel: Panel;
  theme: string;
  isCtrlPressed: boolean;
  moveMode: boolean;
  selectedPanel: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onDragStop: (id: string, data: { x: number; y: number }) => void;
  onResize: (panel: Panel, ref: HTMLElement, direction: string) => void;
  onToggleEdit: (id: string) => void;
  onDuplicate: (panel: Panel) => void;
}

export default function Panel({
  panel, theme, isCtrlPressed, moveMode, selectedPanel,
  onSelect, onRemove, onDragStop, onResize, onToggleEdit, onDuplicate
}: PanelProps) {
  const getShapeProps = () => ({
    width: panel.width,
    height: panel.height,
    fill: panel.style.fillColor || "",
    stroke: panel.style.strokeColor || "#1e3a8a",
    strokeWidth: panel.style.strokeWidth || 1,
    borderRadius: panel.style.borderRadius || 0,
    className: "transition-transform duration-300"
  });

  return (
    <Rnd
      default={{
        x: panel.x,
        y: panel.y,
        width: panel.width,
        height: panel.height,
      }}
      bounds="parent"
      onDragStop={(_, d) => onDragStop(panel.id, d)}
      onResize={(_, direction, ref) => onResize(panel, ref, direction)}
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      disableDragging={!isCtrlPressed && !moveMode}
      style={{ zIndex: selectedPanel === panel.id ? 10 : 0, position: 'absolute' }}
      onClick={(e : any) => {
        e.stopPropagation();
        onSelect(panel.id);
      }}
    >
      <div className={`relative group w-full h-full border-2 ${theme === 'dark' ? 'border-gray-500' : 'border-gray-300'} transition-colors duration-200`}>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(panel.id);
            }}
            className={`p-1.5 rounded-md ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white shadow-lg`}
          >
            <Trash2 size={14} />
          </button>
        </div>
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleEdit(panel.id);
            }}
            className={`p-1.5 rounded-md ${moveMode ? (theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500') : (theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300')} text-white shadow-lg cursor-move transition-colors`}
          >
            <Move size={14} />
          </button>
        </div>
        <div className="absolute top-2 right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          <button onClick={(e) => {
            e.stopPropagation();
            onToggleEdit(panel.id);
          }}>
            <Edit />
          </button>
          {panel.editingEnabled && (
            <div className="absolute top-10 right-0 bg-white dark:bg-gray-800 border rounded-lg shadow-md p-2 z-30 space-y-2 w-48">
              <button className="w-full text-left px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-white">
                Add Text
              </button>
              <button className="w-full text-left px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-white">
                Change Background Color
              </button>
              <button className="w-full text-left px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-white">
                Adjust Border Radius
              </button>
              <button className="w-full text-left px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-white"
                onClick={() => onDuplicate(panel)}>
                Duplicate Panel
              </button>
            </div>
          )}
        </div>
        <div className="w-full h-full flex items-center justify-center">
          {panel.shape === 'triangle' && <Triangle {...getShapeProps()} />}
          {panel.shape === 'rectangle' && <Rectangle {...getShapeProps()} />}
          {panel.shape === 'circle' && <Circle {...getShapeProps()} />}
          {panel.shape === 'diamond' && <Diamond {...getShapeProps()} width={panel.width - 100} height={panel.height - 100} />}
          {panel.shape === 'star' && <Star {...getShapeProps()} />}
          {panel.shape === 'square' && <Square {...getShapeProps()} />}
        </div>
      </div>
    </Rnd>
  );
}