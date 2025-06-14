import { Moon, Sun, Plus, Trash2, Settings, Download, Upload, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { usePanel } from '../context/PanelContext';
import { useState } from 'react';
import usePanelIO from '../context/PanelIOContext';
import { useCanvasSettings } from '../context/CanvasSettingsContext';


export default function Header() {

    const [showShapeOptions, setShowShapeOptions] = useState<boolean>(false);
    const shapes: string[] = ['circle', 'square', 'triangle', 'rectangle', 'diamond', 'star', 'text'];

    const toggleShapeOptions = () => {
        setShowShapeOptions((prev) => !prev);
    };

    const { theme, toggleTheme } = useTheme();
    const { addPanel, clearPanels } = usePanel();
    const { exportConfig, importConfig, exportToPNG } = usePanelIO();
    const {
        canvasBgColor,
        canvasWidth,
        canvasHeight,
        canvasFgColor,
        roundedCorners,
        showGrid,
        setCanvasBgColor,
        setCanvasWidth,
        setCanvasHeight,
        setCanvasFgColor,
        setRoundedCorners,
        setShowGrid,
        isEditingCanvas,
        toggleEdit
    } = useCanvasSettings();
    return (
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
                                        toggleShapeOptions();
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
                    onClick={() => toggleEdit()}
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
            
            </div>
            {isEditingCanvas && (
                <div className="absolute top-[9%] right-[14.5%] z-30 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border dark:border-gray-700">
                    <div className="space-y-4">
                        <div className="flex gap-2 items-center">
                            <input
                                type="number"
                                value={canvasWidth}
                                onChange={(e) => setCanvasWidth(Number(e.target.value))}
                                // onKeyDown={handleCanvasKeyDown}
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
                                value={canvasHeight}
                                onChange={(e) => setCanvasHeight(Number(e.target.value))}
                                // onKeyDown={handleCanvasKeyDown}
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
        </div>
    );
}