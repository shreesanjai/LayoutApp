import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Trash2, Move, Edit } from 'lucide-react';
import Triangle from './Common/Shapes/Triangle';
import Rectangle from './Common/Shapes/Rectangle';
import Square from './Common/Shapes/Square';
import Star from './Common/Shapes/Star';
import Diamond from './Common/Shapes/Diamond';
import Circle from './Common/Shapes/Circle';
import { Rnd } from "react-rnd";
import Header from './Header';
import { usePanel } from '../context/PanelContext';
import { useCanvasSettings } from '../context/CanvasSettingsContext';



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



export default function DrawingCanvas() {

  const { theme } = useTheme();
  const { panels, addPanel, removePanel, updatePanel } = usePanel();
  const { canvasWidth, canvasHeight, canvasFgColor, canvasBgColor, roundedCorners, showGrid } = useCanvasSettings();

  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [moveMode, setMoveMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);



  const toggleMoveMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMoveMode(!moveMode);
  };

  // const handleDimensionClick = (panel: Panel) => {
  //   setEditingPanel(panel.id);
  //   setNewWidth(panel.width.toString());
  //   setNewHeight(panel.height.toString());
  // };


  const handleResize = (
    currentPanel: Panel,
    ref: HTMLElement,
    direction: string
  ) => {
    const newWidth = ref.offsetWidth;
    const newHeight = ref.offsetHeight;

    const deltaWidth = newWidth - currentPanel.width;
    const deltaHeight = newHeight - currentPanel.height;

    const newX = direction === 'left' ? currentPanel.x - deltaWidth : currentPanel.x;
    const newY = direction === 'top' ? currentPanel.y - deltaHeight : currentPanel.y;

    updatePanel(currentPanel.id, {
      width: newWidth,
      height: newHeight,
      x: newX,
      y: newY,
    });
  };



  // const handleCanvasDimensionSubmit = () => {
  //   const width = parseInt(newCanvasWidth);
  //   const height = parseInt(newCanvasHeight);

  //   if (!isNaN(width) && !isNaN(height) && width >= 200 && height >= 200) {
  //     setCanvasWidth(width);
  //     setCanvasHeight(height);
  //   }
  //   setIsEditingCanvas(false);
  // };

  // const handleCanvasKeyDown = (e: React.KeyboardEvent) => {
  //   if (e.key === 'Enter') {
  //     handleCanvasDimensionSubmit();
  //   } else if (e.key === 'Escape') {
  //     setIsEditingCanvas(false);
  //   }
  // };

  // const handleDimensionSubmit = (id: string) => {
  //   const width = parseInt(newWidth);
  //   const height = parseInt(newHeight);

  //   if (!isNaN(width) && !isNaN(height) && width >= 50 && height >= 50) {
  //     setPanels(prev => prev.map(panel =>
  //       panel.id === id ? { ...panel, width, height } : panel
  //     ));
  //   }
  //   setEditingPanel(null);
  // };

  // const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
  //   if (e.key === 'Enter') {
  //     handleDimensionSubmit(id);
  //   } else if (e.key === 'Escape') {
  //     setEditingPanel(null);
  //   }
  // };

  // const handleEdit = (currentPanelId: string) => {
  //   setPanels(prevPanel => prevPanel.map((panel) => {
  //     if (panel.id !== currentPanelId) {
  //       return panel
  //     } else {
  //       return { ...panel, editingEnabled: true }
  //     }
  //   }))
  //   setTimeout(() => inputRef.current?.focus(), 0);
  // };

  // const handleSave = (currentPanelId: string) => {
  //   setPanels(prevPanel => prevPanel.map((panel) => {
  //     if (panel.id !== currentPanelId) {
  //       return panel
  //     } else {
  //       return { ...panel, editingEnabled: false }
  //     }
  //   }))
  // };



  // const handleCanvasDimensionClick = () => {
  //   setIsEditingCanvas(true);
  //   setNewCanvasWidth(canvasWidth.toString());
  //   setNewCanvasHeight(canvasHeight.toString());
  // };

  const handleDragStop = (id: string, _: any, data: { x: number; y: number }) => {
    updatePanel(id, { x: data.x, y: data.y });
    setSelectedPanel(null)
  };



  function getShapeProps(panel: Panel) {
    return {
      width: panel.width,
      height: panel.height,
      fill: panel.style.fillColor || "",
      stroke: panel.style.strokeColor || "#1e3a8a",
      strokeWidth: panel.style.strokeWidth || 1,
      borderRadius: panel.style.borderRadius || 0,
      className: "transition-transform duration-300"
    };
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <Header
        />
        <div className="flex justify-center items-center">
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
            {panels.map(panel => (
              <Rnd
                key={panel.id}
                default={{
                  x: panel.x,
                  y: panel.y,
                  width: panel.width,
                  height: panel.height,
                }}
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
                disableDragging={!isCtrlPressed && !moveMode}
                style={{
                  zIndex: selectedPanel === panel.id ? 10 : 0,
                  position: 'absolute',
                  border: selectedPanel === panel.id ? '1px solid #000' : 'none'
                }}

                onClick={(e: any) => {
                  e.stopPropagation();
                  setSelectedPanel(panel.id);
                }}
              >
                <div className={`relative group w-full h-full  transition-colors duration-200`}>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 border border-[2px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removePanel(panel.id);
                      }}
                      className={`p-1.5 rounded-md ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white shadow-lg`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                    <button
                      onClick={toggleMoveMode}
                      className={`p-1.5 rounded-md ${(moveMode || isCtrlPressed) ? (theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500') : (theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300')} text-white shadow-lg cursor-move transition-colors`}
                    >
                      <Move size={14} />
                    </button>
                  </div>
                  <div className="absolute top-2 right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePanel(panel.id, { editingEnabled: !panel.editingEnabled });
                      }}
                    >
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
                          onClick={() => {
                            addPanel(panel.shape);
                          }}>
                          Duplicate Panel
                        </button>
                      </div>
                    )}
                  </div>
                  {panel.shape && (
                    <div className="w-full h-full flex items-center justify-center">
                      {panel.shape === 'triangle' && (
                        <Triangle
                          width={panel.width}
                          height={panel.height}
                          fill={panel.style.fillColor || ""}
                          stroke={panel.style.strokeColor || "#1e3a8a"}
                          strokeWidth={panel.style.strokeWidth || 1}
                          className="transition-transform duration-300"
                        />
                      )}
                      {panel.shape === 'rectangle' && (
                        <Rectangle {...getShapeProps(panel)} />
                      )}
                      {panel.shape === 'circle' && (
                        <Circle {...getShapeProps(panel)} />
                      )}
                      {panel.shape === 'diamond' && (
                        <Diamond {...getShapeProps(panel)} width={panel.width - 100} height={panel.height - 100} />
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
          </div>
        </div>
      </div>
    </div >
  );
}