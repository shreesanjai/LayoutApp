import React, { useState } from 'react';
import {
  BoldIcon, ItalicIcon, UnderlineIcon, LayersIcon, PaletteIcon,
  TypeIcon, LockIcon, UnlockIcon, SquareIcon, ChevronDownIcon, ChevronUpIcon,
  CopyIcon, Trash2Icon, ArrowUpIcon, ArrowDownIcon,
  ArrowDownToLine,
  ArrowUpToLine,
  TextIcon,
  RectangleVertical,
  CircleIcon,
  DiamondIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  Star,
} from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { usePanel } from '../context/PanelContext';
import { useTheme } from '../context/ThemeContext';

interface ToolbarProps {
  selectedPanelId: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ selectedPanelId }) => {
  const { panels, updatePanel, removePanel, addDuplicatePanel, setPanels } = usePanel();
  const { theme } = useTheme();
  const panel = panels.find(p => p.id === selectedPanelId);

  const [openSections, setOpenSections] = useState<string[]>(['colors', 'text', 'size', 'actions']);
  const [colorType, setColorType] = useState<'font' | 'background' | 'border' | null>(null);
  const [colorInput, setColorInput] = useState('');

  if (!panel) {
    return
  }

  const updateStyle = (updates: Partial<typeof panel.style>) => {
    updatePanel(panel.id, { style: { ...panel.style, ...updates } });
  };

  const { style, shape } = panel;
  const {
    fontColor = '#000000',
    fillColor = '#ffffff',
    strokeColor = '#000000',
    fontSize = 16,
    fontWeight = 'normal',
    fontStyle = 'normal',
    textDecoration = 'none',
    textAlign = 'center',
    strokeStyle = 'none'
  } = style;

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isOpen = (section: string) => openSections.includes(section);

  const bringToFront = (panelId: string) => {
    const panelToBring = panels.find(p => p.id === panelId);
    if (!panelToBring) return;

    const maxZIndex = Math.max(...panels.map(p => p.zIndex));
    const currentZIndex = panelToBring.zIndex;

    if (currentZIndex === maxZIndex) return;

    const updatedPanels = panels.map(panel => {
      if (panel.id === panelId) {
        return { ...panel, zIndex: maxZIndex };
      } else {
        return { ...panel, zIndex: panel.zIndex - 1 };
      }
    });
    setPanels(updatedPanels);
  };

  const sendToBack = (panelId: string) => {
    const sortedPanels = [...panels].sort((a, b) => a.zIndex - b.zIndex);
    const panelToSendBack = sortedPanels.find(p => p.id === panelId);
    const lowestZIndex = sortedPanels[0]?.zIndex ?? 0;

    if (!panelToSendBack || panelToSendBack.zIndex === lowestZIndex) return;

    const updatedPanels = panels.map(panel => {
      if (panel.id === panelId) {
        return { ...panel, zIndex: lowestZIndex };
      } else {
        return { ...panel, zIndex: panel.zIndex + 1 };
      }
    });
    setPanels(updatedPanels);
  };

  const bringForward = (panelId: string) => {
    const sorted = [...panels].sort((a, b) => a.zIndex - b.zIndex);
    const currentIndex = sorted.findIndex(p => p.id === panelId);
    if (currentIndex === -1 || currentIndex === sorted.length - 1) return;

    const panel = sorted[currentIndex];
    const nextPanel = sorted[currentIndex + 1];

    const updatedPanels = panels.map(p => {
      if (p.id === panel.id) {
        return { ...p, zIndex: nextPanel.zIndex };
      } else if (p.id === nextPanel.id) {
        return { ...p, zIndex: panel.zIndex };
      } else {
        return p;
      }
    });
    setPanels(updatedPanels);
  };

  const sendBackward = (panelId: string) => {
    const sorted = [...panels].sort((a, b) => a.zIndex - b.zIndex);
    const currentIndex = sorted.findIndex(p => p.id === panelId);
    if (currentIndex <= 0) return;

    const panel = sorted[currentIndex];
    const prevPanel = sorted[currentIndex - 1];

    const updatedPanels = panels.map(p => {
      if (p.id === panel.id) {
        return { ...p, zIndex: prevPanel.zIndex };
      } else if (p.id === prevPanel.id) {
        return { ...p, zIndex: panel.zIndex };
      } else {
        return p;
      }
    });
    setPanels(updatedPanels);
  };

  const getShapeIcon = () => {
    switch (shape) {
      case 'text': return <TextIcon size={18} />;
      case 'rectangle': return <RectangleVertical size={18} />;
      case 'circle': return <CircleIcon size={18} />;
      case 'square': return <SquareIcon size={18} />;
      case 'diamond': return <DiamondIcon size={18} />;
      case 'star': return <Star size={18} />;
      default: return <SquareIcon size={18} />;
    }
  };

  return (
    <div
      className="fixed top-20 right-0 z-50 shadow-lg border-l w-80 h-screen flex flex-col transition-colors duration-200"
      style={{
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
      }}
    >
      <div
        className="px-4 py-3 flex justify-between items-center cursor-pointer transition-colors duration-200"
        style={{
          backgroundColor: theme === 'dark' ? '#111827' : '#2563eb',
          color: '#ffffff'
        }}

      >
        <div className="flex items-center gap-2">
          {getShapeIcon()}
          <span className="font-medium">Panel Properties</span>
        </div>
      </div>

      <div
        className="absolute top-1/2 left-[-30px] pl-2 rounded-l-md cursor-pointer transition-colors duration-200"
        style={{
          backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff'
        }}
      >

      </div>


      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 text-sm transition-colors duration-200"
        style={{
          color: theme === 'dark' ? '#e5e7eb' : '#111827'
        }}
      >
        {/* Panel Info */}
        <div
          className="rounded-lg p-3 mb-4 transition-colors duration-200"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium capitalize">{shape} Panel</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => updatePanel(panel.id, { isLocked: !panel.isLocked })}
                className={`p-2 rounded-md transition-colors duration-200 ${panel.isLocked
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  : 'bg-gray-100 dark:bg-gray-600'
                  }`}
                title={panel.isLocked ? 'Unlock' : 'Lock'}
              >
                {panel.isLocked ? <LockIcon size={16} /> : <UnlockIcon size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Colors Section */}
        <div
          className="rounded-lg overflow-hidden transition-colors duration-200"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6'
          }}
        >
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
                <div>
                  <button
                    onClick={() => setColorType('font')}
                    className="w-full py-2 px-3 rounded-md border hover:ring-2 ring-blue-400 transition flex flex-col items-center transition-colors duration-200"
                    style={{
                      backgroundColor: fontColor,
                      borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db'
                    }}
                  >
                    <span className="text-xs mb-1" style={{ color: getContrastColor(fontColor) }}>Text</span>
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => setColorType('background')}
                    className="w-full py-2 px-3 rounded-md border hover:ring-2 ring-blue-400 transition flex flex-col items-center transition-colors duration-200"
                    style={{
                      backgroundColor: fillColor,
                      borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db'
                    }}
                  >
                    <span className="text-xs mb-1" style={{ color: getContrastColor(fillColor) }}>Fill</span>
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => setColorType('border')}
                    className="w-full py-2 px-3 rounded-md border hover:ring-2 ring-blue-400 transition flex flex-col items-center transition-colors duration-200"
                    style={{
                      backgroundColor: strokeColor,
                      borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db'
                    }}
                  >
                    <span className="text-xs mb-1" style={{ color: getContrastColor(strokeColor) }}>Border</span>
                  </button>
                </div>
              </div>

              {colorType && (
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
                      className={`flex-1 p-2 border rounded-md transition-colors duration-200 ${theme === 'dark'
                        ? 'bg-gray-600 border-gray-500 text-white'
                        : 'bg-white border-gray-300 text-black'
                        }`}
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

        {/* Text Section */}
        <div
          className="rounded-lg overflow-hidden transition-colors duration-200"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6'
          }}
        >
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
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => updateStyle({ fontWeight: fontWeight === 'bold' ? 'normal' : 'bold' })}
                  className={`flex-1 py-2 px-3 rounded-md flex justify-center items-center gap-2 transition-colors duration-200 ${fontWeight === 'bold'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    : 'bg-gray-100 dark:bg-gray-600'
                    }`}
                >
                  <BoldIcon size={16} />
                </button>
                <button
                  onClick={() => updateStyle({ fontStyle: fontStyle === 'italic' ? 'normal' : 'italic' })}
                  className={`flex-1 py-2 px-3 rounded-md flex justify-center items-center gap-2 transition-colors duration-200 ${fontStyle === 'italic'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    : 'bg-gray-100 dark:bg-gray-600'
                    }`}
                >
                  <ItalicIcon size={16} />
                </button>
                <button
                  onClick={() => updateStyle({ textDecoration: textDecoration === 'underline' ? 'none' : 'underline' })}
                  className={`flex-1 py-2 px-3 rounded-md flex justify-center items-center gap-2 transition-colors duration-200 ${textDecoration === 'underline'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    : 'bg-gray-100 dark:bg-gray-600'
                    }`}
                >
                  <UnderlineIcon size={16} />
                </button>
              </div>

              <div className="mb-4">
                <label className="text-sm mb-2 block">Alignment</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStyle({ textAlign: 'left' })}
                    className={`flex-1 py-2 px-3 rounded-md flex justify-center items-center transition-colors duration-200 ${textAlign === 'left'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-600'
                      }`}
                  >
                    <AlignLeftIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateStyle({ textAlign: 'center' })}
                    className={`flex-1 py-2 px-3 rounded-md flex justify-center items-center transition-colors duration-200 ${textAlign === 'center'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-600'
                      }`}
                  >
                    <AlignCenterIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateStyle({ textAlign: 'right' })}
                    className={`flex-1 py-2 px-3 rounded-md flex justify-center items-center transition-colors duration-200 ${textAlign === 'right'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-600'
                      }`}
                  >
                    <AlignRightIcon size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm mb-1 block">Font Size</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={8}
                    max={72}
                    value={fontSize}
                    onChange={(e) => updateStyle({ fontSize: +e.target.value })}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                      }`}
                  />
                  <input
                    type="number"
                    value={fontSize}
                    onChange={(e) => updateStyle({ fontSize: Math.max(8, Math.min(72, +e.target.value)) })}
                    className={`w-16 p-1 border rounded-md text-center transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                      }`}
                    min={8}
                    max={72}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="w-full space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {/* Stroke Style Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Border Style
            </label>
            <select
              onChange={(e) => updatePanel(panel.id, {style :{ strokeStyle: e.target.value }})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="solid">Solid</option>
              <option value="dotted">Dotted</option>
              <option value="dashed">Dashed</option>
              <option value="none">None</option>
            </select>
          </div>

          {/* Dimensions Input */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Width
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={panel.width}
                  onChange={(e) => updatePanel(panel.id, { width: Number(e.target.value) })}
                  className="w-full p-2 pl-12 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
                <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400 text-sm">px</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Height
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={panel.height}
                  onChange={(e) => updatePanel(panel.id, { height: Number(e.target.value) })}
                  className="w-full p-2 pl-12 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
                <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400 text-sm">px</span>
              </div>
            </div>
          </div>

          {/* Position Input */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                X Position
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={panel.x}
                  onChange={(e) => updatePanel(panel.id, { x: Number(e.target.value) })}
                  className="w-full p-2 pl-12 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400 text-sm">px</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Y Position
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={panel.y}
                  onChange={(e) => updatePanel(panel.id, { y: Number(e.target.value) })}
                  className="w-full p-2 pl-12 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400 text-sm">px</span>
              </div>
            </div>
          </div>

          {/* Border Width Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Border Width
            </label>
            <div className="relative">
              <input
                type="number"
                value={panel.style.strokeWidth}
                onChange={(e) => updateStyle({ strokeWidth: Number(e.target.value) })}
                className="w-full p-2 pl-12 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
              <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400 text-sm">px</span>
            </div>
          </div>
        </div>

        {/* Layers Section */}
        <div
          className="rounded-lg overflow-hidden transition-colors duration-200"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6'
          }}
        >
          <div
            className="px-4 py-3 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('layers')}
          >
            <div className="flex items-center gap-2">
              <LayersIcon size={18} />
              <span className="font-medium">Layer</span>
            </div>
            {isOpen('layers') ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
          </div>

          {isOpen('layers') && (
            <div className="px-4 pb-4 grid grid-cols-4 gap-2">
              <button
                onClick={() => sendToBack(panel.id)}
                className={`py-2 px-3 rounded-md flex flex-col items-center justify-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-500 transition transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
                  }`}
                title="Send to Back"
              >
                <ArrowDownToLine size={16} />
                <span className="text-xs">Back</span>
              </button>
              <button
                onClick={() => sendBackward(panel.id)}
                className={`py-2 px-3 rounded-md flex flex-col items-center justify-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-500 transition transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
                  }`}
                title="Send Backward"
              >
                <ArrowDownIcon size={16} />
                <span className="text-xs">Backward</span>
              </button>
              <button
                onClick={() => bringForward(panel.id)}
                className={`py-2 px-3 rounded-md flex flex-col items-center justify-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-500 transition transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
                  }`}
                title="Bring Forward"
              >
                <ArrowUpIcon size={16} />
                <span className="text-xs">Forward</span>
              </button>
              <button
                onClick={() => bringToFront(panel.id)}
                className={`py-2 px-3 rounded-md flex flex-col items-center justify-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-500 transition transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
                  }`}
                title="Bring to Front"
              >
                <ArrowUpToLine size={16} />
                <span className="text-xs">Front</span>
              </button>
            </div>
          )}
        </div>


        {/* Actions Section */}
        <div
          className="rounded-lg overflow-hidden transition-colors duration-200"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6'
          }}
        >
          <div
            className="px-4 py-3 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('actions')}
          >
            <div className="flex items-center gap-2">
              <SquareIcon size={18} />
              <span className="font-medium">Actions</span>
            </div>
            {isOpen('actions') ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
          </div>

          {isOpen('actions') && (
            <div className="px-4 pb-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => addDuplicatePanel(selectedPanelId, false)}
                className={`py-2 px-3 rounded-md flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-500 transition transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
                  }`}
              >
                <CopyIcon size={16} />
                <span>Duplicate</span>
              </button>
              <button
                onClick={() => removePanel(panel.id)}
                className={`py-2 px-3 rounded-md flex items-center justify-center gap-2 hover:bg-red-200 dark:hover:bg-red-800 transition transition-colors duration-200 ${theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                  }`}
              >
                <Trash2Icon size={16} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

// Helper function to determine text color based on background
function getContrastColor(hexColor: string) {
  // Convert hex to RGB
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return dark or light color based on luminance
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export default Toolbar;