import React, { useState, useEffect } from 'react';
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
import { Rnd } from 'react-rnd';

export default function DrawingCanvas() {
  const { theme } = useTheme();
  const {
    panels,
    removePanel,
    updatePanel,
    addDuplicatePanel,
    undo,
    redo
  } = usePanel();
  const { canvasWidth, canvasHeight, canvasFgColor, canvasBgColor, roundedCorners, showGrid } = useCanvasSettings();

  const [singleSelectedPanel, setSingleSelectedPanel] = useState<string>('');
  const [copiedPanel, setCopiedPanel] = useState<Panel | null>(null);
  const [shiftKeyPressed, setShiftKeyPressed] = useState<boolean>(false);
  const { updatePanelSilently } = usePanel();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrlOrCmd = e.ctrlKey || e.metaKey;
      if (e.key === 'Shift') setShiftKeyPressed(true);

      if (e.key === 'Delete') {
        const panelId = panels.find(p => singleSelectedPanel === p.id)?.id;
        if (panelId) removePanel(panelId);
      }

      if (ctrlOrCmd) {
        switch (e.key.toLowerCase()) {
          case 'z':
            if (e.shiftKey) redo();
            else undo();
            e.preventDefault();
            break;
          case 'y':
            redo();
            e.preventDefault();
            break;
          case 'c':
            const copied = panels.find(p => singleSelectedPanel === p.id);
            if (copied) setCopiedPanel({ ...copied });
            break;
          case 'v':
            if (copiedPanel) addDuplicatePanel(copiedPanel.id, true);
            break;
          case 'd':
            const duplicatePanelId = panels.find(p => singleSelectedPanel === p.id)?.id;
            if (duplicatePanelId) addDuplicatePanel(duplicatePanelId, false);
            break;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setShiftKeyPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [singleSelectedPanel, panels, copiedPanel, removePanel, addDuplicatePanel, undo, redo]);

  const handlePanelClick = (e: React.MouseEvent, panelId: string) => {
    e.stopPropagation();
    setSingleSelectedPanel(panelId);
    // const panel = panels.find(p => p.id === panelId);
    // if (!panel) return;
    // const maxZ = Math.max(...panels.map(p => p.zIndex));
    // updatePanel(panelId, { zIndex: maxZ + 1 });
  };

  const handleCanvasClick = () => {
    setSingleSelectedPanel('');
  };

  const handleDoubleClick = (currentPanel: Panel) => {
    updatePanel(currentPanel.id, { editingEnabled: true });
  }

  const getShapeProps = (panel: Panel) => ({
    width: panel.width,
    height: panel.height,
    textColor: panel.style.fontColor,
    textSize: panel.style.fontSize,
    fill: panel.style.fillColor || '#ffffff',
    stroke: panel.style.strokeColor || '#000000',
    strokeWidth: panel.style.strokeWidth || 1,
    borderRadius: panel.style.borderRadius || 0,
    text: panel.title || '',
    transform: `rotate(${panel.rotation}deg)`,
    strokeStyle : panel.str
  });

  return (
    <>
      <Toolbar selectedPanelId={singleSelectedPanel} />
      <div
        className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} relative`}
        onClick={handleCanvasClick}
      >
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
                const isUnlockedAndSelected = !panel.isLocked && singleSelectedPanel === panel.id;
                return (
                  
                  <Rnd
                    key={panel.id}
                    default={{
                      x: panel.x,
                      y: panel.y,
                      width: panel.width,
                      height: panel.height
                    }}
                    position={{ x: panel.x, y: panel.y }}
                    size={{ width: panel.width, height: panel.height }}
                    bounds="parent"
                    lockAspectRatio={shiftKeyPressed || panel.lockAspectRatio}
                    onDragStop={(_e, d) => {
                      updatePanel(panel.id, {
                        x: d.x,
                        y: d.y
                      });
                    }}
                    onResize={(_e, _direction, ref, _delta, position) => {
                      updatePanelSilently(panel.id, {
                        width: parseInt(ref.style.width),
                        height: parseInt(ref.style.height),
                        x: position.x,
                        y: position.y,
                      });
                    }}
                    onResizeStop={(_e, _direction, ref, _delta, position) => {
                      updatePanel(panel.id, {
                        width: parseInt(ref.style.width),
                        height: parseInt(ref.style.height),
                        x: position.x,
                        y: position.y,
                      });
                    }}
                    onClick={(e: React.MouseEvent<Element, MouseEvent>) => handlePanelClick(e, panel.id)}
                    style={{
                      zIndex: isSelected ? 1000 : panel.zIndex, 
                      transform: `rotate(${panel.rotation || 0}deg)`,
                      border: singleSelectedPanel == panel.id ? '2px dashed #3b82f6' : 'none',
                      backgroundColor: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}

                    disableDragging={!isUnlockedAndSelected}
                    enableResizing={isUnlockedAndSelected}
                  >
                    <div
                      style={{ width: '100%', height: '100%' }}
                      onDoubleClick={() => handleDoubleClick(panel)}
                    >
                      {panel.shape === 'triangle' && <Triangle {...getShapeProps(panel)} />}
                      {panel.shape === 'rectangle' && <Rectangle {...getShapeProps(panel)} />}
                      {panel.shape === 'circle' && <Circle {...getShapeProps(panel)} />}
                      {panel.shape === 'diamond' && (
                        <Diamond
                          {...getShapeProps(panel)}
                          width={panel.width - 20}
                          height={panel.height - 20}
                        />
                      )}
                      {panel.shape === 'star' && <Star {...getShapeProps(panel)} />}
                      {panel.shape === 'square' && <Square {...getShapeProps(panel)} />}
                      {panel.shape === 'text' && <Text panel={panel} {...getShapeProps(panel)} />}
                      {panel.editingEnabled && (
                        <div className="w-[40%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" >
                          {panel.shape}
                        </div>
                      )}
                    </div>
                  </Rnd>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
