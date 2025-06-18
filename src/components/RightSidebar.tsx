import { Moon, Sun, Square, Circle, Diamond, Triangle, Star, Type, LayoutGrid, Camera, PaintBucket, TextCursorInput } from 'lucide-react';
import { useState } from 'react';
import { usePanel } from '../context/PanelContext';
import { useCanvasSettings } from '../context/CanvasSettingsContext';

function RightSideBar() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [canvasTitle, setCanvasTitle] = useState('My Design');
    const [bgType, setBgType] = useState<'solid' | 'gradient'>('solid');
    const [gradientColors, setGradientColors] = useState({
        start: '#4f46e5',
        end: '#ec4899'
    });

    const { addPanel } = usePanel();
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
    } = useCanvasSettings();

    const tools = [
        { icon: <Square size={18} />, name: 'Square', id: 'square' },
        { icon: <Circle size={18} />, name: 'Circle', id: 'circle' },
        { icon: <Diamond size={18} />, name: 'Diamond', id: 'diamond' },
        { icon: <Triangle size={18} />, name: 'Triangle', id: 'triangle' },
        { icon: <Star size={18} />, name: 'Star', id: 'star' },
        { icon: <Type size={18} />, name: 'Text', id: 'text' },
    ];

    const handleGradientColorChange = (which: 'start' | 'end', value: string) => {
        setGradientColors(prev => ({
            ...prev,
            [which]: value
        }));
    };

    return (
        <div className='w-[300px] h-[90%] flex flex-col gap-6 p-4 fixed top-20 left-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm z-10 overflow-scroll ' >
            {/* Canvas Title */}
            <div className='w-full'>
                <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-2 px-2'>Canvas Title</h2>
                <div className='relative'>
                    <TextCursorInput className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                    <input
                        type='text'
                        value={canvasTitle}
                        onChange={(e) => setCanvasTitle(e.target.value)}
                        className='w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        placeholder='Enter canvas title'
                    />
                </div>
            </div>

            {/* Tools Section */}
            <div className='w-full'>
                <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-3 px-2'>Design Tools</h2>
                <div className='grid grid-cols-3 gap-2'>
                    {tools.map((tool) => (
                        <button
                            key={tool.id}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all
                                 bg-gray-50 dark:bg-gray-700 hover:bg-[#1f2935] dark:hover:bg-gray-600' hover:border border-white}`}
                            title={tool.name}
                            onClick={() => addPanel(tool.name.toLowerCase())}
                        >
                            <div className='text-gray-700 dark:text-gray-200'>{tool.icon}</div>
                            <span className='text-xs mt-1 text-gray-700 dark:text-gray-300'>{tool.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Canvas Settings Section */}
            <div className='w-full'>
                <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-3 px-2'>Canvas Settings</h2>

                <div className="space-y-4">
                    <div className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        <h2>Positions & Size</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {/* X Position */}
                            <div className="flex flex-col">
                                <label htmlFor="x-position" className="text-xs text-gray-600">X Position</label>
                                <input
                                    id="x-position"
                                    type="number"
                                    className="border rounded px-2 py-1 text-sm"
                                    placeholder="X"
                                />
                            </div>

                            {/* Y Position */}
                            <div className="flex flex-col">
                                <label htmlFor="y-position" className="text-xs text-gray-600">Y Position</label>
                                <input
                                    id="y-position"
                                    type="number"
                                    className="border rounded px-2 py-1 text-sm"
                                    placeholder="Y"
                                />
                            </div>

                            {/* Width */}
                            <div className="flex flex-col">
                                <label htmlFor="width" className="text-xs text-gray-600">Width</label>
                                <input
                                    id="width"
                                    type="number"
                                    className="border rounded px-2 py-1 text-sm"
                                    placeholder="W"
                                />
                            </div>

                            {/* Height */}
                            <div className="flex flex-col">
                                <label htmlFor="height" className="text-xs text-gray-600">Height</label>
                                <input
                                    id="height"
                                    type="number"
                                    className="border rounded px-2 py-1 text-sm"
                                    placeholder="H"
                                />
                            </div>
                        </div>
                    </div>


                    {/* Background Type Toggle */}
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <button
                            onClick={() => setBgType('solid')}
                            className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 text-sm ${bgType === 'solid' ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300'}`}
                        >
                            <PaintBucket size={16} />
                            Solid
                        </button>
                        <button
                            onClick={() => setBgType('gradient')}
                            className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 text-sm ${bgType === 'gradient' ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300'}`}
                        >
                            <Camera size={16} />
                            Gradient
                        </button>
                    </div>


                    {/* Color Pickers based on background type */}
                    {bgType === 'solid' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Background Color</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={canvasBgColor}
                                    onChange={(e) => setCanvasBgColor(e.target.value)}
                                    className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={canvasBgColor}
                                    onChange={(e) => setCanvasBgColor(e.target.value)}
                                    className="flex-1 text-xs font-mono p-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gradient Start</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={gradientColors.start}
                                        onChange={(e) => handleGradientColorChange('start', e.target.value)}
                                        className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={gradientColors.start}
                                        onChange={(e) => handleGradientColorChange('start', e.target.value)}
                                        className="flex-1 text-xs font-mono p-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gradient End</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={gradientColors.end}
                                        onChange={(e) => handleGradientColorChange('end', e.target.value)}
                                        className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={gradientColors.end}
                                        onChange={(e) => handleGradientColorChange('end', e.target.value)}
                                        className="flex-1 text-xs font-mono p-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Foreground Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Foreground Color</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={canvasFgColor}
                                onChange={(e) => setCanvasFgColor(e.target.value)}
                                className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={canvasFgColor}
                                onChange={(e) => setCanvasFgColor(e.target.value)}
                                className="flex-1 text-xs font-mono p-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded"
                            />
                        </div>
                    </div>

                    {/* Toggle Settings */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div className="flex items-center gap-3">
                                <LayoutGrid size={16} className="text-gray-600 dark:text-gray-300" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Show Grid</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showGrid}
                                    onChange={() => setShowGrid(!showGrid)}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div className="flex items-center gap-3">
                                <Square size={16} className="text-gray-600 dark:text-gray-300" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Rounded Corners</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={roundedCorners}
                                    onChange={() => setRoundedCorners(!roundedCorners)}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div className="flex items-center gap-3">
                                {theme === 'light' ? <Sun size={16} className="text-gray-600 dark:text-gray-300" /> : <Moon size={16} className="text-gray-600 dark:text-gray-300" />}
                                <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={theme === 'dark'}
                                    onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RightSideBar;