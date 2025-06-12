import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Trash2, Move, Palette, Pen, Copy, Plus, Minus, Sliders } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import Triangle from './Common/Shapes/Triangle';
import Rectangle from './Common/Shapes/Rectangle';
import Square from './Common/Shapes/Square';
import Star from './Common/Shapes/Star';
import Diamond from './Common/Shapes/Diamond';
import Circle from './Common/Shapes/Circle';
import { Rnd } from "react-rnd";
import Header from './Header';
import { Panel, usePanel } from '../context/PanelContext';
import { useCanvasSettings } from '../context/CanvasSettingsContext';
import Toolbar from './ToolBar';



export default function DrawingCanvas() {
  const { theme } = useTheme();
  const { panels, addPanel, removePanel, updatePanel } = usePanel();
  const { canvasWidth, canvasHeight, canvasFgColor, canvasBgColor, roundedCorners, showGrid } = useCanvasSettings();

  const [selectedPanels, setSelectedPanels] = useState<string[]>([]);
  const [_isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [moveMode, setMoveMode] = useState(false);

  const [colorPicker, setColorPicker] = useState({
    open: false,
    type: 'fill',
    panelId: null as string | null
  });

  const [borderWidthPicker, setBorderWidthPicker] = useState({
    open: false,
    panelId: null as string | null
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(true);
      }
      if (e.key === 'Shift') {
        setIsShiftPressed(true);
      }
      if (e.key === 'Delete' && selectedPanels.length > 0) {
        selectedPanels.forEach(id => removePanel(id));
        setSelectedPanels([]);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(false);
      }
      if (e.key === 'Shift') {
        setIsShiftPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedPanels]);

  const toggleMoveMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMoveMode(!moveMode);
  };

  const handlePanelClick = (e: React.MouseEvent, panelId: string) => {
    e.stopPropagation();

    if (isShiftPressed) {
      setSelectedPanels(prev =>
        prev.includes(panelId)
          ? prev.filter(id => id !== panelId)
          : [...prev, panelId]
      );
    } else {
      setSelectedPanels(prev =>
        prev.includes(panelId) && prev.length === 1
          ? []
          : [panelId]
      );
    }
  };

  const handleCanvasClick = () => {
    if (!isShiftPressed) {
      setSelectedPanels([]);
    }
    setColorPicker({ open: false, panelId: null, type: 'fill' });
    setBorderWidthPicker({ open: false, panelId: null });
  };

  const handleDragStop = (id: string, _: any, data: { x: number; y: number }) => {
    updatePanel(id, { x: data.x, y: data.y });
  };

  const handleResize = (currentPanel: Panel, ref: HTMLElement, direction: string) => {
    const newWidth = ref.offsetWidth;
    const newHeight = ref.offsetHeight;

    const deltaWidth = newWidth - currentPanel.width;
    const deltaHeight = newHeight - currentPanel.height;

    const newX = direction.includes('left') ? currentPanel.x - deltaWidth : currentPanel.x;
    const newY = direction.includes('top') ? currentPanel.y - deltaHeight : currentPanel.y;

    updatePanel(currentPanel.id, {
      width: newWidth,
      height: newHeight,
      x: newX,
      y: newY,
    });
  };

  const duplicatePanel = (panel: Panel) => {
    const newPanel = {
      ...panel,
      id: `panel-${Date.now()}`,
      x: panel.x + 20,
      y: panel.y + 20
    };
    addPanel(newPanel.shape);
    setSelectedPanels([newPanel.id]);
  };

  const handleColorChange = (panelId: string, color: string, type: string) => {
    const panel = panels.find(p => p.id === panelId);
    if (!panel) return;

    updatePanel(panelId, {
      style: {
        ...panel.style,
        [type === 'fill' ? 'fillColor' : 'strokeColor']: color
      }
    });
  };

  const handleBorderWidthChange = (panelId: string, width: number) => {
    const panel = panels.find(p => p.id === panelId);
    if (!panel) return;

    updatePanel(panelId, {
      style: {
        ...panel.style,
        strokeWidth: Math.max(0, width)
      }
    });
  };

  function getShapeProps(panel: Panel) {
    return {
      width: panel.width,
      height: panel.height,
      fill: panel.style.fillColor || "#ffffff",
      stroke: panel.style.strokeColor || "#000000",
      strokeWidth: panel.style.strokeWidth || 1,
      borderRadius: panel.style.borderRadius || 0,
      className: "transition-transform duration-300"
    };
  }

  const getPanelBorderStyle = (panelId: string) => {
    if (selectedPanels.includes(panelId)) {
      return {
        border: '2px dashed #3b82f6',
        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)'
      };
    }
    return {};
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <Header />
        <Toolbar selectedPanelId={selectedPanels[0]}   shapeType={'circle'} />
        <div className="flex justify-center items-center">
          <div
            onClick={handleCanvasClick}
            className={`relative border-2 canvas-container transition-colors duration-200 overflow-hidden ${roundedCorners ? 'rounded-xl' : ''} ${showGrid ? 'grid-background' : ''
              }`}
            style={{
              width: canvasWidth,
              height: canvasHeight,
              backgroundColor: canvasBgColor,
              color: canvasFgColor,
              backgroundImage: showGrid
                ? `linear-gradient(${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px),
                linear-gradient(90deg, ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)`
                : 'none',
              backgroundSize: showGrid ? '20px 20px' : 'auto',
            }}
          >
            {panels.map(panel => (
              <Rnd
                key={panel.id}
                default={{
                  x: panel.x,
                  y: panel.y,
                  width: panel.width,
                  height: panel.height,
                }}
                position={{ x: panel.x, y: panel.y }}
                size={{ width: panel.width, height: panel.height }}
                bounds="parent"
                onDragStop={(e, d) => handleDragStop(panel.id, e, d)}
                onResize={(_, direction, ref) => handleResize(panel, ref, direction)}
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
                disableDragging={!moveMode && !selectedPanels.includes(panel.id)}
                style={{
                  zIndex: selectedPanels.includes(panel.id) ? 10 : panel.zIndex,
                  ...getPanelBorderStyle(panel.id),
                }}
                onClick={(e: any) => handlePanelClick(e, panel.id)}
              >
                <div className={`relative group w-full h-full transition-colors duration-200`}>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removePanel(panel.id);
                        setSelectedPanels(prev => prev.filter(id => id !== panel.id));
                      }}
                      className={`p-1.5 rounded-md ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
                        } text-white shadow-lg`}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicatePanel(panel);
                      }}
                      className={`p-1.5 rounded-md ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
                        } text-white shadow-lg`}
                      title="Duplicate"
                    >
                      <Copy size={14} />
                    </button>
                  </div>

                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                    <button
                      onClick={toggleMoveMode}
                      className={`p-1.5 rounded-md ${moveMode
                        ? theme === 'dark'
                          ? 'bg-blue-600'
                          : 'bg-blue-500'
                        : theme === 'dark'
                          ? 'bg-gray-600'
                          : 'bg-gray-300'
                        } text-white shadow-lg cursor-move transition-colors`}
                      title={moveMode ? "Disable move mode" : "Enable move mode"}
                    >
                      <Move size={14} />
                    </button>
                  </div>

                  <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setColorPicker({
                          open: !colorPicker.open || colorPicker.panelId !== panel.id,
                          type: 'fill',
                          panelId: panel.id
                        });
                        setBorderWidthPicker({ open: false, panelId: null });
                      }}
                      className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 shadow-lg"
                      title="Change fill color"
                    >
                      <Palette size={14} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setColorPicker({
                          open: !colorPicker.open || colorPicker.panelId !== panel.id,
                          type: 'stroke',
                          panelId: panel.id
                        });
                        setBorderWidthPicker({ open: false, panelId: null });
                      }}
                      className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 shadow-lg"
                      title="Change stroke color"
                    >
                      <Pen size={14} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBorderWidthPicker({
                          open: !borderWidthPicker.open || borderWidthPicker.panelId !== panel.id,
                          panelId: panel.id
                        });
                        setColorPicker({ open: false, panelId: null, type: 'fill' });
                      }}
                      className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 shadow-lg"
                      title="Adjust border width"
                    >
                      <Sliders size={14} />
                    </button>
                  </div>

                  {colorPicker.open && colorPicker.panelId === panel.id && (
                    <div className="absolute bottom-10 left-2 z-50 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border dark:border-gray-600">
                      <HexColorPicker
                        color={colorPicker.type === 'fill'
                          ? panel.style.fillColor || '#ffffff'
                          : panel.style.strokeColor || '#000000'}
                        onChange={(color) => handleColorChange(panel.id, color, colorPicker.type)}
                      />
                      <div className="mt-2 text-center text-sm dark:text-gray-200">
                        {colorPicker.type === 'fill' ? 'Fill Color' : 'Stroke Color'}
                      </div>
                    </div>
                  )}

                  {borderWidthPicker.open && borderWidthPicker.panelId === panel.id && (
                    <div className="absolute bottom-10 left-16 z-50 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border dark:border-gray-600">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBorderWidthChange(panel.id, (panel.style.strokeWidth || 1) - 1);
                          }}
                          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                          disabled={(panel.style.strokeWidth || 1) <= 0}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm w-8 text-center dark:text-gray-200">
                          {panel.style.strokeWidth || 1}px
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBorderWidthChange(panel.id, (panel.style.strokeWidth || 1) + 1);
                          }}
                          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="mt-1 text-center text-sm dark:text-gray-200">Border Width</div>
                    </div>
                  )}

                  {panel.shape && (
                    <div className="w-full h-full flex items-center justify-center">
                      {panel.shape === 'triangle' && (
                        <Triangle {...getShapeProps(panel)} />
                      )}
                      {panel.shape === 'rectangle' && (
                        <Rectangle {...getShapeProps(panel)} />
                      )}
                      {panel.shape === 'circle' && (
                        <Circle {...getShapeProps(panel)} />
                      )}
                      {panel.shape === 'diamond' && (
                        <Diamond {...getShapeProps(panel)} width={panel.width - 20} height={panel.height - 20} />
                      )}
                      {panel.shape === 'star' && (
                        <Star {...getShapeProps(panel)} />
                      )}
                      {panel.shape === 'square' && (
                        <Square {...getShapeProps(panel)} />
                      )}
                    </div>
                  )}
                </div>
              </Rnd>
            ))}

            {selectedPanels.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
                {selectedPanels.length} items selected
                <button
                  onClick={() => {
                    selectedPanels.forEach(id => removePanel(id));
                    setSelectedPanels([]);
                  }}
                  className="ml-4 px-2 py-1 bg-red-500 rounded hover:bg-red-600"
                >
                  Delete all
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          {moveMode ? (
            <span className="text-blue-500">Move mode activated - Click and drag to move panels</span>
          ) : isShiftPressed ? (
            <span className="text-green-500">Multi-select mode - Click to select multiple panels</span>
          ) : (
            <span>Hold Shift to select multiple panels | Hold Ctrl to move panels | Click outside to deselect</span>
          )}
        </div>
      </div>
    </div>
  );
} 