import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Plus, Trash2, Move, Settings, Download, Upload, Save, Edit, Menu } from 'lucide-react';
import html2canvas from 'html2canvas';
import Triangle from './Common/Shapes/Triangle';
import Rectangle from './Common/Shapes/Rectangle';
import Square from './Common/Shapes/Square';
import Star from './Common/Shapes/Star';
import Diamond from './Common/Shapes/Diamond';
import Circle from './Common/Shapes/Circle';
import { Rnd } from "react-rnd";



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

interface CanvasConfig {
  panels: Panel[];
  canvasWidth: number;
  canvasHeight: number;
  canvasBgColor: string;
  canvasFgColor: string;
  roundedCorners: boolean;
  showGrid: boolean;
}

export default function DrawingCanvas() {
  const { theme, toggleTheme } = useTheme();
  const [panels, setPanels] = useState<Panel[]>([]);
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [moveMode, setMoveMode] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState(1280);
  const [canvasHeight, setCanvasHeight] = useState(720);
  const [isEditingCanvas, setIsEditingCanvas] = useState(false);
  const [newCanvasWidth, setNewCanvasWidth] = useState('');
  const [newCanvasHeight, setNewCanvasHeight] = useState('');
  const [canvasBgColor, setCanvasBgColor] = useState('#ffffff');
  const [canvasFgColor, setCanvasFgColor] = useState('#000000');
  const [roundedCorners, setRoundedCorners] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [showShapeOptions, setShowShapeOptions] = useState(false);
  const [showEditAside, setShowEditAside] = useState(false);

  const toggleShapeOptions = () => {
    setShowShapeOptions((prev) => !prev);
  };

  const shapes: string[] = ['circle', 'square', 'triangle', 'rectangle', 'diamond', 'star'];

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

  const addPanel = (s: string) => {
    const canvas = document.querySelector('.canvas-container');
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = rect.width / 2 - 50; // Center horizontally
      const y = rect.height / 2 - 50; // Center vertically
      const maxZIndex = panels.length > 0
        ? Math.max(...panels.map(p => p.zIndex))
        : 0;
      setPanels(prev => [...prev, {
        id: crypto.randomUUID(),
        x,
        y,
        width: 400,
        height: 400,
        zIndex: maxZIndex + 1,
        title: '',
        editingEnabled: false,
        shape: s,
        style: {
          fillColor: "",
          strokeColor: "#1e3a8a",
          strokeWidth: 1,
          borderRadius: 0,
        }
      }]);
    }
  };

  const removePanel = (id: string) => {
    setPanels(prev => prev.filter(panel => panel.id !== id));
    setSelectedPanel(null);
  };

  const clearPanels = () => {
    setPanels([]);
    setSelectedPanel(null);
  };

  const handleDragStop = (id: string, _: any, data: { x: number; y: number }) => {
    setPanels(prev => prev.map(panel =>
      panel.id === id ? { ...panel, x: data.x, y: data.y } : panel
    ));
  };

  // const handleDimensionClick = (panel: Panel) => {
  //   setEditingPanel(panel.id);
  //   setNewWidth(panel.width.toString());
  //   setNewHeight(panel.height.toString());
  // };


  const handleResize = (currentPanel: any, ref: HTMLElement, direction: string) => {
    setPanels(prevPanels =>
      prevPanels.map(panel => {
        if (panel.id !== currentPanel.id) return panel;

        const deltaWidth = ref.offsetWidth - panel.width;
        const deltaHeight = ref.offsetHeight - panel.height;

        return {
          ...panel,
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          x: direction === 'left' ? panel.x - deltaWidth : panel.x,
          y: direction === 'top' ? panel.y - deltaHeight : panel.y,
        };
      })
    );
  };

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


  const toggleMoveMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMoveMode(!moveMode);
  };

  // const handleCanvasDimensionClick = () => {
  //   setIsEditingCanvas(true);
  //   setNewCanvasWidth(canvasWidth.toString());
  //   setNewCanvasHeight(canvasHeight.toString());
  // };

  const handleCanvasDimensionSubmit = () => {
    const width = parseInt(newCanvasWidth);
    const height = parseInt(newCanvasHeight);

    if (!isNaN(width) && !isNaN(height) && width >= 200 && height >= 200) {
      setCanvasWidth(width);
      setCanvasHeight(height);
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

  const exportToPNG = () => {
    const canvas = document.querySelector('.canvas-container');
    if (canvas) {
      html2canvas(canvas as HTMLElement, {
        backgroundColor: canvasBgColor,
        scale: 2, // Higher quality
        logging: false,
      }).then((canvas: HTMLCanvasElement) => {
        const link = document.createElement('a');
        link.download = 'panel-drawing.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
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

  const exportConfig = () => {
    const config: CanvasConfig = {
      panels,
      canvasWidth,
      canvasHeight,
      canvasBgColor,
      canvasFgColor,
      roundedCorners,
      showGrid
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'panel-layout.json';
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
          setPanels(config.panels);
          setCanvasWidth(config.canvasWidth);
          setCanvasHeight(config.canvasHeight);
          setCanvasBgColor(config.canvasBgColor);
          setCanvasFgColor(config.canvasFgColor);
          setRoundedCorners(config.roundedCorners);
          setShowGrid(config.showGrid);
        } catch (error) {
          console.error('Error importing configuration:', error);
          alert('Error importing configuration. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Layout Designer
          </h1>
          <div className="flex gap-4">
            <div className="relative inline-block">
              <button
                onClick={toggleShapeOptions}
                className={`p-2 rounded-lg ${theme === 'dark'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-green-500 hover:bg-green-600'
                  } text-white transition-colors`}
              >
                <Plus size={20} />
              </button>

              {showShapeOptions && (
                <div className="absolute top-full mt-2 right-0 z-30 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border dark:border-gray-700">
                  {shapes.map((s, index) => (
                    <div
                      key={index}
                      className="text-black dark:text-white px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                      onClick={() => {
                        addPanel(s);
                        setShowShapeOptions(false);
                      }}
                    >
                      {s[0].toUpperCase() + s.slice(1)}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={exportConfig}
              className={`p-2 rounded-lg ${theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors`}
            >
              <Save size={20} />
            </button>
            <label
              className={`p-2 rounded-lg ${theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors cursor-pointer`}
            >
              <Upload size={20} />
              <input
                type="file"
                accept=".json"
                onChange={importConfig}
                className="hidden"
              />
            </label>
            <button
              onClick={exportToPNG}
              className={`p-2 rounded-lg ${theme === 'dark'
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-purple-500 hover:bg-purple-600'
                } text-white transition-colors`}
            >
              <Download size={20} />
            </button>
            <button
              onClick={() => setIsEditingCanvas(!isEditingCanvas)}
              className={`p-2 rounded-lg ${theme === 'dark'
                ? 'bg-gray-600 hover:bg-gray-700'
                : 'bg-gray-500 hover:bg-gray-600'
                } text-white transition-colors`}
            >
              <Settings size={20} />
            </button>
            <button
              onClick={clearPanels}
              className={`p-2 rounded-lg ${theme === 'dark'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-red-500 hover:bg-red-600'
                } text-white transition-colors`}
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${theme === 'dark'
                ? 'bg-yellow-600 hover:bg-yellow-700'
                : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setShowEditAside(showEditAside ? false : true)}>
              <Menu />
            </button>
          </div>
        </div>

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
                        ? 'bg-gray-600 text-white '
                        : 'bg-white text-gray-900'
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
                        onChange={(e) => setCanvasBgColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>Foreground</label>
                      <input
                        type="color"
                        value={canvasFgColor}
                        onChange={(e) => setCanvasFgColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>Rounded Corners</label>
                    <button
                      onClick={() => setRoundedCorners(!roundedCorners)}
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
                      onClick={() => setShowGrid(!showGrid)}
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
                style={{ zIndex: selectedPanel === panel.id ? 10 : 0, position: 'absolute' }}
                onClick={(e: any) => {
                  e.stopPropagation();
                  setSelectedPanel(panel.id);
                }}
              >
                <div className={`relative group w-full h-full  transition-colors duration-200`}>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
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
                      className={`p-1.5 rounded-md ${moveMode ? (theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500') : (theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300')} text-white shadow-lg cursor-move transition-colors`}
                    >
                      <Move size={14} />
                    </button>
                  </div>
                  <div className="absolute top-2 right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                    <button onClick={(e) => {
                      e.stopPropagation();
                      setPanels(prev => prev.map(p => { return p.id != panel.id ? p : { ...p, editingEnabled: p.editingEnabled ? false : true } }))
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
                          onClick={() => {
                            addPanel(panel.shape);
                            setPanels(prev => prev.map(p => { return p.id != panel.id ? p : { ...p, editingEnabled: p.editingEnabled ? false : true } }))
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