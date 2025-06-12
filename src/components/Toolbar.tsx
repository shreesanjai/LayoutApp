import React, { useState } from 'react';
import {
  BoldIcon, ItalicIcon, UnderlineIcon, LayersIcon, MoveIcon, PaletteIcon,
  TypeIcon, LockIcon, UnlockIcon, SquareIcon, ChevronDownIcon, ChevronUpIcon,
  CopyIcon, Trash2Icon, ArrowUpIcon, ArrowDownIcon,
} from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { usePanel } from '../context/PanelContext';

interface ToolbarProps {
  shapeType?: string;
  selectedPanelId: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ shapeType = 'rectangle', selectedPanelId }) => {
  const { panels, updatePanel, removePanel, addDuplicatePanel } = usePanel();
  const panel = panels.find(p => p.id === selectedPanelId);

  const [isVisible, setIsVisible] = useState(true);
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [colorType, setColorType] = useState<'font' | 'background' | 'border' | null>(null);
  const [colorInput, setColorInput] = useState('');

  if (!panel) return null;

  const updateStyle = (updates: Partial<typeof panel.style>) =>
    updatePanel(panel.id, { style: updates });

  const {
    style,
    width, height, moveEnabled, shape,
  } = panel;

  const {
    fontColor = '#000000',
    fillColor = '#ffffff',
    strokeColor = '#000000',
    fontSize = 16,
    fontWeight = 'normal',
    fontStyle = 'normal',
    textDecoration = 'none',
    borderRadius = 0,
    strokeWidth = 1,
    boxShadow = '',
  } = style;

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isOpen = (section: string) => openSections.includes(section);

  return (
    <div className="fixed top-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 w-80 max-h-screen overflow-y-auto">
      <div
        className="px-4 py-3 bg-blue-600 text-white flex justify-between items-center cursor-pointer"
        onClick={() => setIsVisible(!isVisible)}
      >
        <span className="font-medium">Design Toolbar</span>
        <span>{isVisible ? <ChevronDownIcon size={20} /> : <ChevronUpIcon size={20} />}</span>
      </div>

      {isVisible && (
        <div className="p-4 space-y-4 text-sm text-gray-800 dark:text-gray-200">
          {/* 🎨 Colors Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
            <div
              className="px-4 py-3 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('colors')}
            >
              <div className="flex items-center gap-2">
                <PaletteIcon size={18} />
                <span className="font-medium">Colors</span>
              </div>
              {isOpen('colors') ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
            </div>

            {isOpen('colors') && (
              <div className="px-4 pb-4 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {shape === 'text' && (
                    <div>
                      <button
                        onClick={() => setColorType('font')}
                        className="w-full py-2 px-3 rounded-md border border-gray-300 dark:border-gray-600 hover:ring-2 ring-blue-400 transition flex flex-col items-center"
                        style={{ backgroundColor: fontColor }}
                      >
                        <span className="text-xs mb-1 text-current">Text</span>
                      </button>
                    </div>
                  )}
                  <div>
                    <button
                      onClick={() => setColorType('background')}
                      className="w-full py-2 px-3 rounded-md border border-gray-300 dark:border-gray-600 hover:ring-2 ring-blue-400 transition flex flex-col items-center"
                      style={{ backgroundColor: fillColor }}
                    >
                      <span className="text-xs mb-1 text-current">Background</span>
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => setColorType('border')}
                      className="w-full py-2 px-3 rounded-md border border-gray-300 dark:border-gray-600 hover:ring-2 ring-blue-400 transition flex flex-col items-center"
                      style={{ backgroundColor: strokeColor }}
                    >
                      <span className="text-xs mb-1 text-current">Border</span>
                    </button>
                  </div>
                </div>

                {colorType && !(colorType === 'font' && shape !== 'text') && (
                  <div className="space-y-3">
                    <HexColorPicker
                      color={
                        colorType === 'font'
                          ? fontColor
                          : colorType === 'background'
                            ? fillColor
                            : strokeColor
                      }
                      onChange={(color) => {
                        const key =
                          colorType === 'font'
                            ? 'fontColor'
                            : colorType === 'background'
                              ? 'fillColor'
                              : 'strokeColor';
                        updateStyle({ [key]: color });
                      }}
                      className="w-full"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={colorInput}
                        onChange={(e) => setColorInput(e.target.value)}
                        placeholder="#hex or rgb()"
                        className="flex-1 p-2 border rounded-md text-black dark:text-white dark:bg-gray-600 dark:border-gray-500"
                      />
                      <button
                        onClick={() => {
                          if (!colorType || !colorInput) return;
                          const key =
                            colorType === 'font'
                              ? 'fontColor'
                              : colorType === 'background'
                                ? 'fillColor'
                                : 'strokeColor';
                          updateStyle({ [key]: colorInput });
                          setColorInput('');
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 📏 Border Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
            <div
              className="px-4 py-3 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('border')}
            >
              <div className="flex items-center gap-2">
                <SquareIcon size={18} />
                <span className="font-medium">Border</span>
              </div>
              {isOpen('border') ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
            </div>

            {isOpen('border') && (
              <div className="px-4 pb-4 space-y-3">
                {shapeType === 'rectangle' && (
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm">Radius</label>
                      <span className="text-sm font-mono">{borderRadius}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={50}
                      value={borderRadius}
                      onChange={(e) => updateStyle({ borderRadius: +e.target.value })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                    />
                  </div>
                )}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm">Width</label>
                    <span className="text-sm font-mono">{strokeWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    value={strokeWidth}
                    onChange={(e) => updateStyle({ strokeWidth: +e.target.value })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 📐 Size Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
            <div
              className="px-4 py-3 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('size')}
            >
              <div className="flex items-center gap-2">
                <MoveIcon size={18} />
                <span className="font-medium">Size</span>
              </div>
              {isOpen('size') ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
            </div>

            {isOpen('size') && (
              <div className="px-4 pb-4 space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm">Width</label>
                    <span className="text-sm font-mono">{width}px</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={800}
                    value={width}
                    onChange={(e) => updatePanel(panel.id, { width: +e.target.value })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm">Height</label>
                    <span className="text-sm font-mono">{height}px</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={800}
                    value={height}
                    onChange={(e) => updatePanel(panel.id, { height: +e.target.value })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 📝 Text Section */}
          {shape === 'text' && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
              <div
                className="px-4 py-3 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('text')}
              >
                <div className="flex items-center gap-2">
                  <TypeIcon size={18} />
                  <span className="font-medium">Text</span>
                </div>
                {isOpen('text') ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
              </div>

              {isOpen('text') && (
                <div className="px-4 pb-4 space-y-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStyle({ fontWeight: fontWeight === 'bold' ? 'normal' : 'bold' })}
                      className={`flex-1 py-2 px-3 rounded-md flex justify-center items-center gap-2 ${fontWeight === 'bold' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'bg-gray-100 dark:bg-gray-600'}`}
                    >
                      <BoldIcon size={16} />
                      <span className="text-xs">Bold</span>
                    </button>
                    <button
                      onClick={() => updateStyle({ fontStyle: fontStyle === 'italic' ? 'normal' : 'italic' })}
                      className={`flex-1 py-2 px-3 rounded-md flex justify-center items-center gap-2 ${fontStyle === 'italic' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'bg-gray-100 dark:bg-gray-600'}`}
                    >
                      <ItalicIcon size={16} />
                      <span className="text-xs">Italic</span>
                    </button>
                    <button
                      onClick={() => updateStyle({ textDecoration: textDecoration === 'underline' ? 'none' : 'underline' })}
                      className={`flex-1 py-2 px-3 rounded-md flex justify-center items-center gap-2 ${textDecoration === 'underline' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'bg-gray-100 dark:bg-gray-600'}`}
                    >
                      <UnderlineIcon size={16} />
                      <span className="text-xs">Underline</span>
                    </button>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm">Font Size</label>
                      <span className="text-sm font-mono">{fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={72}
                      value={fontSize}
                      onChange={(e) => updateStyle({ fontSize: +e.target.value })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ⚙️ Actions Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
            <div
              className="px-4 py-3 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('actions')}
            >
              <div className="flex items-center gap-2">
                <LayersIcon size={18} />
                <span className="font-medium">Actions</span>
              </div>
              {isOpen('actions') ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
            </div>

            {isOpen('actions') && (
              <div className="px-4 pb-4 grid grid-cols-3 gap-2">
                <button onClick={() => updatePanel(panel.id, { zIndex: 999 })} className="py-2 px-3 rounded-md bg-gray-100 dark:bg-gray-600 flex flex-col items-center justify-center gap-1">
                  <ArrowUpIcon size={16} />
                  <span className="text-xs">Front</span>
                </button>
                <button onClick={() => updatePanel(panel.id, { zIndex: 1 })} className="py-2 px-3 rounded-md bg-gray-100 dark:bg-gray-600 flex flex-col items-center justify-center gap-1">
                  <ArrowDownIcon size={16} />
                  <span className="text-xs">Back</span>
                </button>
                <button onClick={() => updateStyle({ boxShadow: boxShadow ? '' : '0 4px 8px rgba(0,0,0,0.2)' })} className={`py-2 px-3 rounded-md flex flex-col items-center justify-center gap-1 ${boxShadow ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'bg-gray-100 dark:bg-gray-600'}`}>
                  <LayersIcon size={16} />
                  <span className="text-xs">Shadow</span>
                </button>
                <button onClick={() => updatePanel(panel.id, { moveEnabled: !moveEnabled })} className="py-2 px-3 rounded-md bg-gray-100 dark:bg-gray-600 flex flex-col items-center justify-center gap-1">
                  {moveEnabled ? <UnlockIcon size={16} /> : <LockIcon size={16} />}
                  <span className="text-xs">{moveEnabled ? 'Unlocked' : 'Locked'}</span>
                </button>
                <button onClick={() => addDuplicatePanel(selectedPanelId) } className="py-2 px-3 rounded-md bg-gray-100 dark:bg-gray-600 flex flex-col items-center justify-center gap-1">
                  <CopyIcon size={16} />
                  <span className="text-xs">Duplicate</span>
                </button>
                <button onClick={() => removePanel(panel.id)} className="py-2 px-3 rounded-md bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 flex flex-col items-center justify-center gap-1">
                  <Trash2Icon size={16} />
                  <span className="text-xs">Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
