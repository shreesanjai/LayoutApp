import React, { useState } from 'react';
import {
  BoldIcon, ItalicIcon, UnderlineIcon,
  AlignLeftIcon, AlignCenterIcon, AlignRightIcon,
  LayersIcon, MoveIcon, PaletteIcon,
  TypeIcon, LockIcon, UnlockIcon, SquareIcon,
} from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { usePanel } from '../context/PanelContext';

interface ToolbarProps {
  shapeType?: string;
  selectedPanelId: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ shapeType = 'rectangle', selectedPanelId }) => {
  const { panels, updatePanel, removePanel, addPanel } = usePanel();
  const panel = panels.find(p => p.id === selectedPanelId);

  const [isVisible, setIsVisible] = useState(true);
  const [colorType, setColorType] = useState<'font' | 'background' | 'border' | null>(null);
  const [colorInput, setColorInput] = useState('');

  if (!panel) return null;

  const { style, width, height, moveEnabled } = panel;
  const {
    fontColor = '#000000',
    fillColor = '#ffffff',
    strokeColor = '#000000',
    fontSize = 16,
    fontWeight = 'normal',
    fontStyle = 'normal',
    textDecoration = 'none',
    textAlign = 'left',
    borderRadius = 0,
    strokeWidth = 1,
    boxShadow = '',
  } = style;

  const updateStyle = (updates: Partial<typeof style>) => {
    updatePanel(selectedPanelId, { style: updates });
  };


  const applyColorInput = () => {
    if (!colorType) return;
    if (colorType === 'font') updateStyle({ fontColor: colorInput });
    else if (colorType === 'background') updateStyle({ fillColor: colorInput });
    else if (colorType === 'border') updateStyle({ strokeColor: colorInput });
    setColorInput('');
  };

  return (
    <div className="fixed top-4 right-4 z-50 w-[300px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div
        className="px-4 py-2 bg-blue-600 text-white flex justify-between items-center cursor-pointer"
        onClick={() => setIsVisible(!isVisible)}
      >
        <span>Toolbar</span>
        <span>{isVisible ? '−' : '+'}</span>
      </div>

      {isVisible && (
        <div className="p-4 space-y-4 text-sm text-gray-800 dark:text-gray-200">
          {/* Color Pickers */}
          <div>
            <h4 className="font-semibold mb-1 flex items-center gap-2"><PaletteIcon size={16} /> Colors</h4>
            <div className="grid grid-cols-3 gap-2">
              {['font', 'background', 'border'].map(type => (
                <button
                  key={type}
                  className="w-6 h-6 rounded border border-gray-400"
                  style={{
                    backgroundColor:
                      type === 'font' ? fontColor :
                        type === 'background' ? fillColor :
                          strokeColor,
                  }}
                  onClick={() => setColorType(type as any)}
                  title={`Pick ${type} color`}
                />
              ))}
            </div>

            {colorType && (
              <div className="mt-2">
                <HexColorPicker
                  color={
                    colorType === 'font' ? fontColor :
                      colorType === 'background' ? fillColor :
                        strokeColor
                  }
                  onChange={(color) => {
                    if (colorType === 'font') updateStyle({ fontColor: color });
                    else if (colorType === 'background') updateStyle({ fillColor: color });
                    else updateStyle({ strokeColor: color });
                  }}
                />
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    placeholder="#hex or rgb()"
                    className="flex-1 p-1 border rounded text-black"
                  />
                  <button onClick={applyColorInput} className="text-sm px-2 py-1 bg-blue-600 text-white rounded">Set</button>
                </div>
              </div>
            )}
          </div>

          {/* Border Styling */}
          <div>
            <h4 className="font-semibold mb-1 flex items-center gap-2"><SquareIcon size={16} /> Border</h4>
            {shapeType === 'rectangle' && (
              <>
                <label>Radius: {borderRadius}px</label>
                <input type="range" min="0" max="50" value={borderRadius} onChange={(e) => updateStyle({ borderRadius: +e.target.value })} className="w-full" />
              </>
            )}
            <label>Width: {strokeWidth}px</label>
            <input type="range" min="0" max="20" value={strokeWidth} onChange={(e) => updateStyle({ strokeWidth: +e.target.value })} className="w-full" />
          </div>

          {/* Resize */}
          <div>
            <h4 className="font-semibold mb-1 flex items-center gap-2"><MoveIcon />Size</h4>
            <label>Width: {width}px</label>
            <input type="range" min="50" max="800" value={width} onChange={(e) => updatePanel(selectedPanelId, { width: +e.target.value })} className="w-full" />
            <label>Height: {height}px</label>
            <input type="range" min="50" max="800" value={height} onChange={(e) => updatePanel(selectedPanelId, { height: +e.target.value })} className="w-full" />
          </div>

          {/* Text Styling */}
          <div>
            <h4 className="font-semibold mb-1 flex items-center gap-2"><TypeIcon size={16} /> Text</h4>
            <div className="flex gap-2 mb-2">
              <button onClick={() => updateStyle({ fontWeight: fontWeight === 'bold' ? 'normal' : 'bold' })} className={`p-2 rounded ${fontWeight === 'bold' ? 'bg-blue-300' : 'bg-gray-100'}`}><BoldIcon size={16} /></button>
              <button onClick={() => updateStyle({ fontStyle: fontStyle === 'italic' ? 'normal' : 'italic' })} className={`p-2 rounded ${fontStyle === 'italic' ? 'bg-blue-300' : 'bg-gray-100'}`}><ItalicIcon size={16} /></button>
              <button onClick={() => updateStyle({ textDecoration: textDecoration === 'underline' ? 'none' : 'underline' })} className={`p-2 rounded ${textDecoration === 'underline' ? 'bg-blue-300' : 'bg-gray-100'}`}><UnderlineIcon size={16} /></button>
            </div>
            <label>Font Size: {fontSize}px</label>
            <input type="range" min="8" max="72" value={fontSize} onChange={(e) => updateStyle({ fontSize: +e.target.value })} className="w-full" />
            <div className="flex gap-2 mt-2">
              {(['left', 'center', 'right'] as const).map(align => (
                <button
                  key={align}
                  onClick={() => updateStyle({ textAlign: align })}
                  className={`p-2 rounded ${textAlign === align ? 'bg-blue-300' : 'bg-gray-100'}`}
                >
                  {align === 'left' && <AlignLeftIcon size={16} />}
                  {align === 'center' && <AlignCenterIcon size={16} />}
                  {align === 'right' && <AlignRightIcon size={16} />}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div>
            <h4 className="font-semibold mb-1 flex items-center gap-2"><LayersIcon size={16} /> Actions</h4>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => updatePanel(selectedPanelId, { zIndex: 999 })} className="p-2 bg-gray-100 rounded text-xs">Front</button>
              <button onClick={() => updatePanel(selectedPanelId, { zIndex: 1 })} className="p-2 bg-gray-100 rounded text-xs">Back</button>
              <button onClick={() => updateStyle({ boxShadow: boxShadow ? '' : '0 4px 8px rgba(0,0,0,0.2)' })} className={`p-2 rounded text-xs ${boxShadow ? 'bg-blue-300' : 'bg-gray-100'}`}>Shadow</button>
              <button onClick={() => updatePanel(selectedPanelId, { moveEnabled: !moveEnabled })} className="p-2 bg-gray-100 rounded text-xs">
                {moveEnabled ? <UnlockIcon size={16} /> : <LockIcon size={16} />}
              </button>
              <button onClick={() => addPanel(panel.shape)} className="p-2 bg-gray-100 rounded text-xs">Copy</button>
              <button onClick={() => removePanel(selectedPanelId)} className="p-2 bg-red-200 rounded text-xs">Delete</button>
            </div>
          </div>

          {/* Add Elements */}
          <div className="flex gap-2 mt-2 justify-center">
            <button className="p-1 px-3 bg-blue-600 text-white rounded">+ Text</button>
            <button className="p-1 px-3 bg-blue-600 text-white rounded">+ Image</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
