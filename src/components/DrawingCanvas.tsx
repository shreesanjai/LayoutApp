import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
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
import Toolbar from './Toolbar';
import Text from './Common/Shapes/Text'



export default function DrawingCanvas() {
  const { theme } = useTheme();
  const { panels, removePanel, updatePanel } = usePanel();
  const { canvasWidth, canvasHeight, canvasFgColor, canvasBgColor, roundedCorners, showGrid } = useCanvasSettings();

  const [selectedPanels, setSelectedPanels] = useState<string[]>([]);
  const [_isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  const [_colorPicker, setColorPicker] = useState({
    open: false,
    type: 'fill',
    panelId: null as string | null
  });

  const [_borderWidthPicker, setBorderWidthPicker] = useState({
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


  function getShapeProps(panel: Panel) {
    return {
      width: panel.width,
      height: panel.height,
      textColor: panel.style.fontColor,
      textSize: panel.style.fontSize,
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
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} relative`}>
      <div className="container mx-auto px-4 py-8">
        <Header />
        <Toolbar selectedPanelId={selectedPanels[0]} shapeType={'circle'} />
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
              position: 'relative'
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
                disableDragging={!selectedPanels.includes(panel.id)}
                style={{
                  zIndex: selectedPanels.includes(panel.id) ? 10 : panel.zIndex,
                  ...getPanelBorderStyle(panel.id),
                }}
                onClick={(e: any) => handlePanelClick(e, panel.id)}
              >
                <div className={`relative group w-full h-full transition-colors duration-200`}>
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
                      )}{
                        panel.shape === 'text' && (
                          <Text panel={panel} {...getShapeProps(panel)} />
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
      </div>
    </div>
  );
} 