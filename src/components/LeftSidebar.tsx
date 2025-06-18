import { Moon, Sun, Square, Circle, Diamond, Triangle, Star, Type, LayoutGrid, Camera, PaintBucket, TextCursorInput } from 'lucide-react';
import { useState } from 'react';
import { usePanel } from '../context/PanelContext';
import { useCanvasSettings } from '../context/CanvasSettingsContext';
import { useTheme } from '../context/ThemeContext';

function LeftSideBar() {
    const [canvasTitle, setCanvasTitle] = useState('My Design');
    const [bgType, setBgType] = useState<'solid' | 'gradient'>('solid');
    const [gradientColors, setGradientColors] = useState({
        start: '#4f46e5',
        end: '#ec4899'
    });

    const { addPanel } = usePanel();
    const { theme, toggleTheme } = useTheme();
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
        <div className={`w-[300px] h-[90%] flex flex-col gap-6 p-4 fixed top-20 left-0 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}  border-r border-gray-200 shadow-sm z-10 overflow-scroll `} >
            {/* Canvas Title */}
            <div className='w-full'>
                <h2 className='text-lg font-semibold mb-2 px-2'>Canvas Title</h2>
                <div className={`relative`}>
                    <TextCursorInput className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                    <input
                        type='text'
                        value={canvasTitle}
                        onChange={(e) => setCanvasTitle(e.target.value)}
                        className='w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        placeholder='Enter canvas title'
                    />
                </div>
            </div>

            {/* Tools Section */}
            <div className='w-full'>
                <h2 className='text-lg font-semibol mb-3 px-2'>Design Tools</h2>
                <div className='grid grid-cols-3 gap-2'>
                    {tools.map((tool) => (
                        <button
                            key={tool.id}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${theme === 'dark' ? 'bg-[#374151] text-white' : 'bg-[#fff5] text-black'}`}
                            title={tool.name}
                            onClick={() => addPanel(tool.name.toLowerCase())}
                        >
                            <div>{tool.icon}</div>
                            <span className='text-xs mt-1'>{tool.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Canvas Settings Section */}
            <div className='w-full'>
                <h2 className='text-lg font-semibold mb-3 px-2'>Canvas Settings</h2>

                <div className="space-y-4">
                    <div className='block text-sm font-medium mb-1'>
                        <h2>Positions & Size</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {/* X Position */}
                            <div className="flex flex-col">
                                <label htmlFor="x-position" className="text-xs">X Position</label>
                                <input
                                    id="x-position"
                                    type="number"
                                    className="border rounded px-2 py-1 text-sm"
                                    placeholder="X"
                                />
                            </div>

                            {/* Y Position */}
                            <div className="flex flex-col">
                                <label htmlFor="y-position" className="text-xs">Y Position</label>
                                <input
                                    id="y-position"
                                    type="number"
                                    className="border rounded px-2 py-1 text-sm"
                                    placeholder="Y"
                                   
                                />
                            </div>

                            {/* Width */}
                            <div className="flex flex-col">
                                <label htmlFor="width" className="text-xs">Width</label>
                                <input
                                maxLength={1280}
                                    id="width"
                                    type="number"
                                    className="border rounded px-2 py-1 text-sm"
                                    placeholder="W"
                                    value={canvasWidth}
                                    onChange={(e)=>setCanvasWidth(Number(e.currentTarget.value))}
                                />
                            </div>

                            {/* Height */}
                            <div className="flex flex-col">
                                <label htmlFor="height" className="text-xs">Height</label>
                                <input
                                    id="height"
                                    type="number"
                                    className="border rounded px-2 py-1 text-sm"
                                    placeholder="H"
                                     value={canvasHeight}
                                    onChange={(e)=> setCanvasHeight(Number(e.currentTarget.value))}
                                />
                            </div>
                        </div>
                    </div>


                    {/* Background Type Toggle */}
                    <div className="flex items-center gap-2 p-2 rounded-lg">
                        <button
                            onClick={() => setBgType('solid')}
                            className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 text-sm ${bgType === 'solid' ? 'bg-blue-500 text-white' : `${theme == 'dark' ? 'bg-[#374151] text-white' : 'bg-[#fff5] text-black'}`}`}
                        >
                            <PaintBucket size={16} />
                            Solid
                        </button>
                        <button
                            onClick={() => setBgType('gradient')}
                            className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 text-sm ${bgType === 'gradient' ? 'bg-blue-500 text-white' : `${theme == 'dark' ? 'bg-[#374151] text-white' : 'bg-[#fff5] text-black'}`}`}
                        >
                            <Camera size={16} />
                            Gradient
                        </button>
                    </div>


                    {/* Color Pickers based on background type */}
                    {bgType === 'solid' ? (
                        <div>
                            <label className="block text-sm font-medium mb-1">Background Color</label>
                            <div className={`flex items-center gap-2 ${theme == 'dark' ? 'bg-[#374151] text-white' : 'bg-[#fff5] text-black'} p-2 rounded-md`}>
                                <input
                                    type="color"
                                    value={canvasBgColor}
                                    onChange={(e) => setCanvasBgColor(e.target.value)}
                                    className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={canvasBgColor}
                                    onChange={(e) => setCanvasBgColor(e.target.value)}
                                    className="flex-1 text-xs font-mono p-1 bg-gray-50 border border-gray-200 rounded"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div>
                                <label className="block text-sm font-medium  mb-1">Gradient Start</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={gradientColors.start}
                                        onChange={(e) => handleGradientColorChange('start', e.target.value)}
                                        className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={gradientColors.start}
                                        onChange={(e) => handleGradientColorChange('start', e.target.value)}
                                        className="flex-1 text-xs font-mono p-1 border border-gray-2000 rounded"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium  mb-1">Gradient End</label>
                                <div className={`flex items-center gap-2 ${theme == 'dark' ? 'bg-[#374151] text-white' : 'bg-[#fff5] text-black'} p-2 rounded-md`}>
                                    <input
                                        type="color"
                                        value={gradientColors.end}
                                        onChange={(e) => handleGradientColorChange('end', e.target.value)}
                                        className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={gradientColors.end}
                                        onChange={(e) => handleGradientColorChange('end', e.target.value)}
                                        className="flex-1 text-xs font-mono p-1\0  rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Foreground Color */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Foreground Color</label>
                        <div className={`flex items-center gap-2 ${theme == 'dark' ? 'bg-[#374151] text-white' : 'bg-[#fff5] text-black'} p-2 rounded-md`}>
                            <input
                                type="color"
                                value={canvasFgColor}
                                onChange={(e) => setCanvasFgColor(e.target.value)}
                                className={`w-8 h-8 rounded border border-gray-300 cursor-pointer  `}
                            />
                            <input
                                type="text"
                                value={canvasFgColor}
                                onChange={(e) => setCanvasFgColor(e.target.value)}
                                className="flex-1 text-xs font-mono p-1 border  rounded"
                            />
                        </div>
                    </div>

                    {/* Toggle Settings */}
                    <div className="space-y-2">
                        <div className={`flex items-center justify-between p-3 rounded-lg ${theme == 'dark' ? 'bg-[#374151] text-white' : 'bg-[#FFFAFA] text-black'}`}>
                            <div className="flex items-center gap-3">
                                <LayoutGrid size={16}  />
                                <span className="text-sm\">Show Grid</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showGrid}
                                    onChange={() => setShowGrid(!showGrid)}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5  peer-focus:outline-none rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className={`flex items-center justify-between p-3 rounded-lg ${theme == 'dark' ? 'bg-[#374151] text-white' : 'bg-[#fbfcfc] text-black'}`}>
                            <div className={`flex items-center gap-3 `}>
                                <Square size={16}  />
                                <span className="text-sm ">Rounded Corners</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={roundedCorners}
                                    onChange={() => setRoundedCorners(!roundedCorners)}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className={`flex items-center justify-between p-3 rounded-lg ${theme == 'dark' ? 'bg-[#374151] text-white' : 'bg-[#fff5] text-black'}`}>
                            <div className="flex items-center gap-3">
                                {theme === 'light' ? <Sun size={16}  /> : <Moon size={16} />}
                                <span className="text-sm">Dark Mode</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={theme == "dark"}
                                    onChange={() => toggleTheme()}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 peer-focus:outline-none rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all  peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftSideBar;