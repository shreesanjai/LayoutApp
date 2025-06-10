import { useState } from 'react';
import html2canvas from 'html2canvas';
import Panel from './Panel';


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

interface CanvasProps {
  theme: string;
  panels: Panel[];
  canvasWidth: number;
  canvasHeight: number;
  canvasBgColor: string;
  canvasFgColor: string;
  roundedCorners: boolean;
  showGrid: boolean;
  selectedPanel: string | null;
  isCtrlPressed: boolean;
  moveMode: boolean;
  onSelectPanel: (id: string) => void;
  onRemovePanel: (id: string) => void;
  onDragStop: (id: string, data: { x: number; y: number }) => void;
  onResize: (panel: Panel, ref: HTMLElement, direction: string) => void;
  onToggleEdit: (id: string) => void;
  onDuplicatePanel: (panel: Panel) => void;
  onCanvasConfigChange: (config: {
    width?: number;
    height?: number;
    bgColor?: string;
    fgColor?: string;
    roundedCorners?: boolean;
    showGrid?: boolean;
  }) => void;
}

export default function Canvas({
  theme, panels, canvasWidth, canvasHeight, canvasBgColor, canvasFgColor,
  roundedCorners, showGrid, selectedPanel, isCtrlPressed, moveMode,
  onSelectPanel, onRemovePanel, onDragStop, onResize, onToggleEdit, onDuplicatePanel,
  onCanvasConfigChange
}: CanvasProps) {
  const [isEditingCanvas, setIsEditingCanvas] = useState(false);
  const [newCanvasWidth, setNewCanvasWidth] = useState(canvasWidth.toString());
  const [newCanvasHeight, setNewCanvasHeight] = useState(canvasHeight.toString());

  const handleCanvasDimensionSubmit = () => {
    const width = parseInt(newCanvasWidth);
    const height = parseInt(newCanvasHeight);

    if (!isNaN(width) && !isNaN(height)) {
      onCanvasConfigChange({ width, height });
    }
    setIsEditingCanvas(false);
  };

  const handleCanvasKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCanvasDimensionSubmit();
    } else if (e.key === 'Escape') {
      setIsEditingCanvas(false);
    }
  };

  return (
    <div
      className={`relative border-2 canvas-container transition-colors duration-200 overflow-hidden ${roundedCorners ? 'rounded-xl' : ''
        } ${showGrid ? 'grid-background' : ''}`}
      style={{
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: canvasBgColor,
        color: canvasFgColor,
        backgroundImage: showGrid ? `linear-gradient(${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px),
          linear-gradient(90deg, ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)` : 'none',
        backgroundSize: showGrid ? '20px 20px' : 'auto'
      }}
    >
      {isEditingCanvas && (
        <div className="absolute top-4 right-4 z-30 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border dark:border-gray-700">
          <div className="space-y-4">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={newCanvasWidth}
                onChange={(e) => setNewCanvasWidth(e.target.value)}
                onKeyDown={handleCanvasKeyDown}
                className={`w-16 h-8 text-sm font-mono rounded px-2 ${theme === 'dark'
                  ? 'bg-gray-600 text-white border-gray-500'
                  : 'bg-white text-gray-900 border-gray-300'
                  } border`}
                min="200"
                max="1200"
              />
              <span className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>×</span>
              <input
                type="number"
                value={newCanvasHeight}
                onChange={(e) => setNewCanvasHeight(e.target.value)}
                onKeyDown={handleCanvasKeyDown}
                className={`w-16 h-8 text-sm font-mono rounded px-2 ${theme === 'dark'
                  ? 'bg-gray-600 text-white border-gray-500'
                  : 'bg-white text-gray-900 border-gray-300'
                  } border`}
                min="200"
                max="1200"
              />
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex flex-col gap-1">
                <label className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>Background</label>
                <input
                  type="color"
                  value={canvasBgColor}
                  onChange={(e) => onCanvasConfigChange({ bgColor: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>Foreground</label>
                <input
                  type="color"
                  value={canvasFgColor}
                  onChange={(e) => onCanvasConfigChange({ fgColor: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>Rounded Corners</label>
              <button
                onClick={() => onCanvasConfigChange({ roundedCorners: !roundedCorners })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${roundedCorners
                  ? theme === 'dark'
                    ? 'bg-blue-600'
                    : 'bg-blue-500'
                  : theme === 'dark'
                    ? 'bg-gray-600'
                    : 'bg-gray-300'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${roundedCorners ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <label className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>Show Grid</label>
              <button
                onClick={() => onCanvasConfigChange({ showGrid: !showGrid })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showGrid
                  ? theme === 'dark'
                    ? 'bg-blue-600'
                    : 'bg-blue-500'
                  : theme === 'dark'
                    ? 'bg-gray-600'
                    : 'bg-gray-300'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showGrid ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
      {panels.map(panel => (
        <Panel
          key={panel.id}
          panel={panel}
          theme={theme}
          isCtrlPressed={isCtrlPressed}
          moveMode={moveMode}
          selectedPanel={selectedPanel}
          onSelect={onSelectPanel}
          onRemove={onRemovePanel}
          onDragStop={onDragStop}
          onResize={onResize}
          onToggleEdit={onToggleEdit}
          onDuplicate={onDuplicatePanel}
        />
      ))}
    </div>
  );
}