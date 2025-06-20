import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import Triangle from './Common/Shapes/Triangle';
import Rectangle from './Common/Shapes/Rectangle';
import Square from './Common/Shapes/Square';
import Star from './Common/Shapes/Star';
import Diamond from './Common/Shapes/Diamond';
import Circle from './Common/Shapes/Circle';
import { Panel, usePanel } from '../context/PanelContext';
import { useCanvasSettings } from '../context/CanvasSettingsContext';
import Toolbar from './Toolbar';
import Text from './Common/Shapes/Text';
import { Rnd } from 'react-rnd';
import { LockIcon } from 'lucide-react';
import LeftSideBar from './LeftSidebar';


export default function DrawingCanvas() {
  const { theme } = useTheme();
  const {
    panels,
    removePanel,
    updatePanel,
    addDuplicatePanel,
    addPanel
  } = usePanel();
  const { canvasWidth, canvasHeight, roundedCorners, showGrid, canvasPositionX, canvasPositionY, canvasGradient, draggedPanel } = useCanvasSettings();
  const {setShowPanelProperties} = usePanel();

  const [singleSelectedPanel, setSingleSelectedPanel] = useState<string>('');
  const [copiedPanel, setCopiedPanel] = useState<Panel | null>(null);
  const [shiftKeyPressed, setShiftKeyPressed] = useState<boolean>(false);
  const { updatePanelSilently, undo, redo } = usePanel();
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrlOrCmd = e.ctrlKey || e.metaKey;
      if (e.key === 'Shift') setShiftKeyPressed(true);

      if (e.key === 'Delete') {
        const isPanelLocked = panels.find((p) => singleSelectedPanel === p.id)!.isLocked;
        if (!isPanelLocked) {
          removePanel(singleSelectedPanel);
          setSingleSelectedPanel('');
        }
      }

      if (ctrlOrCmd) {
        switch (e.key.toLowerCase()) {
          case 'z':
            undo();
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
  }, [singleSelectedPanel, panels, copiedPanel, removePanel, addDuplicatePanel,]);

  const handlePanelClick = (e: React.MouseEvent, panelId: string) => {
    const panel = panels.find((p) => p.id === panelId);
    if (panel) {
      if (panel.isLocked) {
        setShowPanelProperties(false)
        console.log('Selected panel : ', panel)
      }
    }
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

  // const panel = panels.find((p) => singleSelectedPanel === p.id)

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
    strokeStyle: panel.style.strokeStyle
  });

  return (
    <>
      <div className={`container fixed top-[50px] h-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}  >
        <LeftSideBar />
        <div className="flex justify-center items-center h-full canvas-container" onClick={handleCanvasClick}>
          <div
            className={`relative border-2  transition-colors duration-200 overflow-hidden ${roundedCorners ? 'rounded-xl' : ''} 
               `}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => addPanel(draggedPanel.toLocaleLowerCase())}
            style={{
              width: `${canvasWidth ? `${canvasWidth}px` : '100%'}`,
              height: `${canvasHeight ? `${canvasHeight}px` : '100%'}`,
              background: canvasGradient,
              color: canvasGradient,
              borderRadius: roundedCorners ? '8px' : '0',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              top: `${canvasPositionY}px`,
              left: `${canvasPositionX}px`,
              zIndex: 1,
              // zoom : 1.5
            }}
          >
            {showGrid && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
            `,
                  backgroundSize: '20px 20px',
                  pointerEvents: 'none'
                }}
              />
            )}

            {panels.map(panel => {
              const isSelected = (singleSelectedPanel === panel.id && !panel.isLocked);
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
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full bg-transparent">
                        <textarea
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!panel.isLocked)
                              setIsReadOnly(false);
                          }}
                          onBlur={() => setIsReadOnly(true)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              (e.target as HTMLTextAreaElement).blur();
                            }
                          }}
                          readOnly={isReadOnly}
                          value={panel.title}
                          onChange={(e) => updatePanel(panel.id, { title: e.target.value })}
                          className={`w-full min-w-[40px] min-h-[40px] p-1 text-center resize-none bg-transparent border border-transparent focus:border-none focus:outline-none ${isReadOnly ? 'cursor-pointer' : 'cursor-text'}`}
                          style={{
                            fontSize: `${panel.style.fontSize}px`,
                            fontFamily: 'inherit',
                            fontWeight: panel.style.fontWeight,
                            fontStyle: panel.style.fontStyle,
                            textDecoration: panel.style.textDecoration,
                            color: panel.style.fontColor,
                            lineHeight: '1.2',
                            overflow: 'hidden',
                            textAlign: panel.style.textAlign || 'center',
                          }}
                          spellCheck={true}
                        />
                      </div>

                    )}
                    {
                      panel.isLocked && (
                        <div className='absolute top-1 right-1 cursor-pointer bg-[#fff5] p-1 rounded-sm' onClick={() => updatePanel(panel.id, { isLocked: false })} title='Unlock' >
                          <LockIcon size={16} />
                        </div>
                      )
                    }
                  </div>
                </Rnd>
              );
            })}
          </div>
        </div>
        <Toolbar selectedPanelId={singleSelectedPanel} />
      </div>
    </>
  );
}
