import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import Triangle from './Common/Shapes/Triangle';
import Rectangle from './Common/Shapes/Rectangle';
import Square from './Common/Shapes/Square';
import Star from './Common/Shapes/Star';
import Diamond from './Common/Shapes/Diamond';
import Circle from './Common/Shapes/Circle';
import Header from './Header';
import { Panel, usePanel } from '../context/PanelContext';
import { useCanvasSettings } from '../context/CanvasSettingsContext';
import Toolbar from './Toolbar';
import Text from './Common/Shapes/Text';
import Moveable from 'react-moveable';

export default function DrawingCanvas() {
  const { theme } = useTheme();
  const { panels, removePanel, updatePanel } = usePanel();
  const { canvasWidth, canvasHeight, canvasFgColor, canvasBgColor, roundedCorners, showGrid } = useCanvasSettings();

  const [selectedPanels, setSelectedPanels] = useState<string[]>([]);
  const [singleSelectedPanel, setSingleSelectedPanel] = useState<string>('');
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [originalZIndex, setOriginalZIndex] = useState<Record<string, number>>({});

  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const moveableRef = useRef<Moveable>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsShiftPressed(true);
      if (e.key === 'Delete' && selectedPanels.length > 0) {
        selectedPanels.forEach(id => removePanel(id));
        setSelectedPanels([]);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsShiftPressed(false);
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
        prev.includes(panelId) ? prev.filter(id => id !== panelId) : [...prev, panelId]
      );
    } else {
      setSingleSelectedPanel(panelId);
      const panel = panels.find(p => p.id === panelId);
      if (!panel) return;
      const maxZ = Math.max(...panels.map(p => p.zIndex));
      setOriginalZIndex(prev => ({ ...prev, [panelId]: prev[panelId] ?? panel.zIndex }));
      updatePanel(panelId, { zIndex: maxZ + 1 });
    }
  };

  const handleCanvasClick = () => {
    if (!isShiftPressed) setSelectedPanels([]);
    if (singleSelectedPanel) {
      const original = originalZIndex[singleSelectedPanel];
      if (original !== undefined) updatePanel(singleSelectedPanel, { zIndex: original });
    }
    setSelectedPanels([]);
    setOriginalZIndex({});
  };

  const getShapeProps = (panel: Panel) => ({
    width: panel.width,
    height: panel.height,
    textColor: panel.style.fontColor,
    textSize: panel.style.fontSize,
    fill: panel.style.fillColor || "#ffffff",
    stroke: panel.style.strokeColor || "#000000",
    strokeWidth: panel.style.strokeWidth || 1,
    borderRadius: panel.style.borderRadius || 0
  });

  return (
    <>
      <Toolbar selectedPanelId={singleSelectedPanel} />
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} relative`} onClick={handleCanvasClick}>
        <div className="container mx-auto px-4 py-8">
          <Header />
          <div className="flex justify-center items-center">
            <div
              className={`relative border-2 canvas-container transition-colors duration-200 overflow-hidden ${roundedCorners ? 'rounded-xl' : ''} ${showGrid ? 'grid-background' : ''}`}
              style={{
                width: canvasWidth,
                height: canvasHeight,
                backgroundColor: canvasBgColor,
                color: canvasFgColor,
                backgroundImage: showGrid
                  ? `linear-gradient(${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)`
                  : 'none',
                backgroundSize: showGrid ? '20px 20px' : 'auto',
                position: 'relative'
              }}
            >
              {panels.map(panel => {
                const isSelected = singleSelectedPanel === panel.id;
                return (
                  <div
                    key={panel.id}
                    ref={el => (refs.current[panel.id] = el)}
                    style={{
                      position: 'absolute',
                      left: panel.x,
                      top: panel.y,
                      width: panel.width,
                      height: panel.height,
                      zIndex: panel.zIndex,
                      transform: `rotate(${panel.rotation || 0}deg)`,
                      border: isSelected ? '2px dashed #3b82f6' : 'none',
                      transformOrigin: 'center center'
                    }}
                    onClick={(e) => handlePanelClick(e, panel.id)}
                  >
                    {panel.shape === 'triangle' && <Triangle {...getShapeProps(panel)} />}
                    {panel.shape === 'rectangle' && <Rectangle {...getShapeProps(panel)} />}
                    {panel.shape === 'circle' && <Circle {...getShapeProps(panel)} />}
                    {panel.shape === 'diamond' && <Diamond {...getShapeProps(panel)} width={panel.width - 20} height={panel.height - 20} />}
                    {panel.shape === 'star' && <Star {...getShapeProps(panel)} />}
                    {panel.shape === 'square' && <Square {...getShapeProps(panel)} />}
                    {panel.shape === 'text' && <Text panel={panel} {...getShapeProps(panel)} />}

                    {isSelected && (
                      <Moveable
                        target={refs.current[panel.id]}
                        draggable={!panel.isLocked}
                        resizable={!panel.isLocked}
                        rotatable={!panel.isLocked}
                        throttleRotate={0.2}
                        throttleResize={1}
                        renderDirections={["nw", "ne", "sw", "se"]} // Essential for resize handles
                        edge={false}
                        origin={false}

                        onDrag={({ beforeDelta }) => {
                          const currentPanel = panels.find(p => p.id === panel.id);
                          if (!currentPanel) return;

                          updatePanel(panel.id, {
                            x: currentPanel.x + beforeDelta[0],
                            y: currentPanel.y + beforeDelta[1]
                          });
                        }}

                        onRotate={({ beforeRotate, target }) => {
                          target.style.transform = `rotate(${beforeRotate}deg)`;
                          updatePanel(panel.id, { rotation: beforeRotate });
                        }}

                        onResize={({ width, height, drag, target }) => {
                          const currentPanel = panels.find(p => p.id === panel.id);
                          if (!currentPanel) return;

                          target.style.width = `${width}px`;
                          target.style.height = `${height}px`;

                          updatePanel(panel.id, {
                            width: Math.round(width),
                            height: Math.round(height),
                            x: currentPanel.x + drag.beforeTranslate[0],
                            y: currentPanel.y + drag.beforeTranslate[1]
                          });
                        }}
                      />
                    )}
                  </div>
                );
              })}

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
    </>
  );
}