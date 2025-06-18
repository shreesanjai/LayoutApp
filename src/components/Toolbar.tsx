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
  ChevronLeft,
  Star
} from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { usePanel } from '../context/PanelContext';

interface ToolbarProps {
  selectedPanelId: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ selectedPanelId }) => {
  const { panels, updatePanel, removePanel, addDuplicatePanel, setPanels } = usePanel();
  const panel = panels.find(p => p.id === selectedPanelId);

  const [isVisible, setIsVisible] = useState(true);
  const [openSections, setOpenSections] = useState<string[]>(['colors', 'text', 'size', 'actions']);
  const [colorType, setColorType] = useState<'font' | 'background' | 'border' | null>(null);
  const [colorInput, setColorInput] = useState('');

  if (!panel) return null;

  const updateStyle = (updates: Partial<typeof panel.style>) => {
    updatePanel(panel.id, { style: { ...panel.style, ...updates } });
  };

  const { style,  shape } = panel;
  const {
    fontColor = '#000000',
    fillColor = '#ffffff',
    strokeColor = '#000000',
    fontSize = 16,
    fontWeight = 'normal',
    fontStyle = 'normal',
    textDecoration = 'none',
    textAlign = 'center',
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
      case 'star' : return <Star size={18}/>
      default: return <SquareIcon size={18} />;
    }
  };

  return (
    <div className="fixed top-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg border-l border-gray-200 dark:border-gray-700 w-80 h-screen flex flex-col">
      <div
        className="px-4 py-3 bg-blue-600 text-white flex justify-between items-center cursor-pointer"
        onClick={() => setIsVisible(!isVisible)}
      >
        <div className="flex items-center gap-2">
          {getShapeIcon()}
          <span className="font-medium">Panel Properties</span>
        </div>
        <span>{isVisible ? <ChevronDownIcon size={20} /> : <ChevronUpIcon size={20} />}</span>
      </div>

      <div className='absolute top-1/2 left-[-30px] pl-2 bg-white'>
        <ChevronLeft size={24}/>
      </div>

      {isVisible && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm text-gray-800 dark:text-gray-200">
          {/* Panel Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium capitalize">{shape} Panel</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updatePanel(panel.id, { isLocked: !panel.isLocked })}
                  className={`p-2 rounded-md ${panel.isLocked ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'bg-gray-100 dark:bg-gray-600'}`}
                  title={panel.isLocked ? 'Unlock' : 'Lock'}
                >
                  {panel.isLocked ? <LockIcon size={16} /> : <UnlockIcon size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* 🎨 Colors Section - Always show font color option */}
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
                  <div>
                    <button
                      onClick={() => setColorType('font')}
                      className="w-full py-2 px-3 rounded-md border border-gray-300 dark:border-gray-600 hover:ring-2 ring-blue-400 transition flex flex-col items-center"
                      style={{ backgroundColor: fontColor }}
                    >
                      <span className="text-xs mb-1" style={{ color: getContrastColor(fontColor) }}>Text</span>
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => setColorType('background')}
                      className="w-full py-2 px-3 rounded-md border border-gray-300 dark:border-gray-600 hover:ring-2 ring-blue-400 transition flex flex-col items-center"
                      style={{ backgroundColor: fillColor }}
                    >
                      <span className="text-xs mb-1" style={{ color: getContrastColor(fillColor) }}>Fill</span>
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => setColorType('border')}
                      className="w-full py-2 px-3 rounded-md border border-gray-300 dark:border-gray-600 hover:ring-2 ring-blue-400 transition flex flex-col items-center"
                      style={{ backgroundColor: strokeColor }}
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

          {/* 📝 Text Section - Always visible and fully functional */}
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
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => updateStyle({ fontWeight: fontWeight === 'bold' ? 'normal' : 'bold' })}
                    className={`flex-1 py-2 px-3 rounded-md flex justify-center items-center gap-2 ${fontWeight === 'bold' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'bg-gray-100 dark:bg-gray-600'}`}
                  >
                    <BoldIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateStyle({ fontStyle: fontStyle === 'italic' ? 'normal' : 'italic' })}
                    className={`flex-1 py-2 px-3 rounded-md flex justify-center items-center gap-2 ${fontStyle === 'italic' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'bg-gray-100 dark:bg-gray-600'}`}
                  >
                    <ItalicIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateStyle({ textDecoration: textDecoration === 'underline' ? 'none' : 'underline' })}
                    className={`flex-1 py-2 px-3 rounded-md flex justify-center items-center gap-2 ${textDecoration === 'underline' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'bg-gray-100 dark:bg-gray-600'}`}
                  >
                    <UnderlineIcon size={16} />
                  </button>
                </div>

                <div className="mb-4">
                  <label className="text-sm mb-2 block">Alignment</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStyle({ textAlign: 'left' })}
                      className={`flex-1 py-2 px-3 rounded-md flex justify-center items-center ${textAlign === 'left' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'bg-gray-100 dark:bg-gray-600'}`}
                    >
                      <AlignLeftIcon size={16} />
                    </button>
                    <button
                      onClick={() => updateStyle({ textAlign: 'center' })}
                      className={`flex-1 py-2 px-3 rounded-md flex justify-center items-center ${textAlign === 'center' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'bg-gray-100 dark:bg-gray-600'}`}
                    >
                      <AlignCenterIcon size={16} />
                    </button>
                    <button
                      onClick={() => updateStyle({ textAlign: 'right' })}
                      className={`flex-1 py-2 px-3 rounded-md flex justify-center items-center ${textAlign === 'right' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'bg-gray-100 dark:bg-gray-600'}`}
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
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                    />
                    <input
                      type="number"
                      value={fontSize}
                      onChange={(e) => updateStyle({ fontSize: Math.max(8, Math.min(72, +e.target.value)) })}
                      className="w-16 p-1 border rounded-md dark:bg-gray-600 dark:border-gray-500 text-center"
                      min={8}
                      max={72}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
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
                  className="py-2 px-3 rounded-md bg-gray-100 dark:bg-gray-600 flex flex-col items-center justify-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-500 transition"
                  title="Send to Back"
                >
                  <ArrowDownToLine size={16} />
                  <span className="text-xs">Back</span>
                </button>
                <button
                  onClick={() => sendBackward(panel.id)}
                  className="py-2 px-3 rounded-md bg-gray-100 dark:bg-gray-600 flex flex-col items-center justify-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-500 transition"
                  title="Send Backward"
                >
                  <ArrowDownIcon size={16} />
                  <span className="text-xs">Backward</span>
                </button>
                <button
                  onClick={() => bringForward(panel.id)}
                  className="py-2 px-3 rounded-md bg-gray-100 dark:bg-gray-600 flex flex-col items-center justify-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-500 transition"
                  title="Bring Forward"
                >
                  <ArrowUpIcon size={16} />
                  <span className="text-xs">Forward</span>
                </button>
                <button
                  onClick={() => bringToFront(panel.id)}
                  className="py-2 px-3 rounded-md bg-gray-100 dark:bg-gray-600 flex flex-col items-center justify-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-500 transition"
                  title="Bring to Front"
                >
                  <ArrowUpToLine size={16} />
                  <span className="text-xs">Front</span>
                </button>
              </div>
            )}
          </div>

          {/* Actions Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
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
                  className="py-2 px-3 rounded-md bg-gray-100 dark:bg-gray-600 flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-500 transition"
                >
                  <CopyIcon size={16} />
                  <span>Duplicate</span>
                </button>
                <button
                  onClick={() => removePanel(panel.id)}
                  className="py-2 px-3 rounded-md bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 flex items-center justify-center gap-2 hover:bg-red-200 dark:hover:bg-red-800 transition"
                >
                  <Trash2Icon size={16} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
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