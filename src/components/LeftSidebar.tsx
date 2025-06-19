import { Moon, Sun, Square, Circle, Diamond, Triangle, Star, Type, LayoutGrid, TextCursorInput, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Panel, usePanel } from '../context/PanelContext';
import { useCanvasSettings } from '../context/CanvasSettingsContext';
import { useTheme } from '../context/ThemeContext';
import ColorPicker from 'react-best-gradient-color-picker';


function LeftSideBar() {
    const [gradient, setGradient] = useState('linear-gradient(90deg, #4f46e5 0%, #ec4899 100%)');
    const [showBackgroundSettings, setShowBackgroundSettings] = useState<boolean>(false);

    const { addPanel } = usePanel();
    const { theme, toggleTheme } = useTheme();

    const {
        canvasWidth,
        canvasHeight,
        canvasFgColor,
        roundedCorners,
        showGrid,
        setCanvasWidth,
        setCanvasHeight,
        setCanvasFgColor,
        setRoundedCorners,
        setShowGrid,
        canvasPositionX,
        canvasPositionY,
        setCanvasPositionX,
        setCanvasPositionY,
        setCanvasGradient,
        canvasTitle,
        setCanvasTitle,
        draggedPanel,
        setDraggedPanel
    } = useCanvasSettings();

    const tools = [
        { icon: <Square size={18} />, name: 'Square', id: 'square' },
        { icon: <Circle size={18} />, name: 'Circle', id: 'circle' },
        { icon: <Diamond size={18} />, name: 'Diamond', id: 'diamond' },
        { icon: <Triangle size={18} />, name: 'Triangle', id: 'triangle' },
        { icon: <Star size={18} />, name: 'Star', id: 'star' },
        { icon: <Type size={18} />, name: 'Text', id: 'text' },
    ];

    const handleGradientChange = (newGradient: string) => {
        setGradient(newGradient);
        setCanvasGradient(newGradient);
    };

    const [isOpen, setIsOpen] = useState<boolean>(true);



    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed top-20 left-0 z-[1000] p-2 m-2 rounded-full transition-colors duration-300
                    ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
                title="Open sidebar"
            >
                <ChevronRight size={24} />
            </button>
        );
    }

    return (
        <div className={`w-[300px] h-[90%] flex flex-col gap-6 p-4 fixed top-20 left-0 z-[1000] 
            overflow-y-auto border-r shadow-sm transition-all duration-300
            ${theme === 'dark' ? 'bg-gray-900 text-white border-gray-700' : 'bg-gray-50 text-black border-gray-200'}`}>

            {/* Sidebar toggle button */}
            <button
                onClick={() => setIsOpen(false)}
                className={`absolute top-2 right-2 p-1 rounded-full transition-colors duration-300
                    ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                title="Close sidebar"
            >
                <ChevronLeft size={20} />
            </button>

            {/* Canvas Title */}
            <div className='w-full'>
                <h2 className='text-lg font-semibold mb-2 px-2'>Canvas Title</h2>
                <div className={`relative`}>
                    <TextCursorInput className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4' />
                    <input
                        type='text'
                        value={canvasTitle}
                        onChange={(e) => setCanvasTitle(e.target.value)}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
                        placeholder='Enter canvas title'
                    />
                </div>
            </div>

            {/* Tools Section */}
            <div className='w-full'>
                <h2 className='text-lg font-semibold mb-3 px-2'>Design Tools</h2>
                <div className='grid grid-cols-3 gap-2' >
                    {tools.map((tool) => (
                        <button
                            draggable
                            onDragStart={(e)=>{setDraggedPanel(e.currentTarget.title); console.log(e.currentTarget.title)}}
                            key={tool.id}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all 
                                ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-gray-100 text-black'}`}
                            title={tool.name}
                            onClick={() => addPanel(tool.name.toLowerCase())}
                        >
                            <div>{tool.icon}</div>
                            <span className='text-xs mt-1'>{tool.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Background Type Section */}




            {/* Canvas Settings Section */}
            <div className='w-full'>
                <h2 className='text-lg font-semibold mb-3 px-2'>Canvas Settings</h2>
                <div className='w-full'>
                    <div className='felx justify-between p-2 w-full' >
                        <h2 className='text-lg font-semibold mb-3 px-2 inline'>Background</h2>
                        <div onClick={() => setShowBackgroundSettings(!showBackgroundSettings)} className='inline'>close</div>
                    </div>
                    {
                        showBackgroundSettings && (
                            <div className="space-y-2 w-[100%]">
                                <div className={`${theme == 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-3 rounded-md w-[100%]`}>
                                    <ColorPicker
                                        value={gradient}
                                        onChange={handleGradientChange}
                                        width={230}
                                        height={150}
                                        hidePresets={true}
                                        hideInputType={true}
                                    />
                                </div>
                            </div>
                        )
                    }


                </div>
                <div className="space-y-4">
                    <div className='block text-sm font-medium mb-1'>
                        <h1 className='text-lg font-semibold mb-3 px-2'>Positions & Size</h1>
                        <div className="grid grid-cols-2 gap-4">
                            {/* X Position */}
                            <div className="flex flex-col">
                                <label htmlFor="x-position" className="text-xs">X Position</label>
                                <input
                                    id="x-position"
                                    type="number"
                                    value={canvasPositionX}
                                    className={`border rounded px-2 py-1 text-sm
                                        ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
                                    placeholder="X"
                                    onChange={(e) => setCanvasPositionX(Number(e.target.value))}
                                />
                            </div>

                            {/* Y Position */}
                            <div className="flex flex-col">
                                <label htmlFor="y-position" className="text-xs">Y Position</label>
                                <input
                                    id="y-position"
                                    type="number"
                                    value={canvasPositionY}
                                    className={`border rounded px-2 py-1 text-sm
                                        ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
                                    placeholder="Y"
                                    onChange={(e) => setCanvasPositionY(Number(e.currentTarget.value))}
                                />
                            </div>

                            {/* Width */}
                            <div className="flex flex-col">
                                <label htmlFor="width" className="text-xs">Width</label>
                                <input
                                    maxLength={1280}
                                    id="width"
                                    type="number"
                                    className={`border rounded px-2 py-1 text-sm
                                        ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
                                    placeholder="W"
                                    value={canvasWidth}
                                    onChange={(e) => setCanvasWidth(Number(e.currentTarget.value))}
                                />
                            </div>

                            {/* Height */}
                            <div className="flex flex-col">
                                <label htmlFor="height" className="text-xs">Height</label>
                                <input
                                    id="height"
                                    type="number"
                                    className={`border rounded px-2 py-1 text-sm
                                        ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
                                    placeholder="H"
                                    value={canvasHeight}
                                    onChange={(e) => setCanvasHeight(Number(e.currentTarget.value))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Foreground Color */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Foreground Color</label>
                        <div className={`flex items-center gap-2 ${theme == 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-2 rounded-md`}>
                            <input
                                type="color"
                                value={canvasFgColor}
                                onChange={(e) => setCanvasFgColor(e.target.value)}
                                className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={canvasFgColor}
                                onChange={(e) => setCanvasFgColor(e.target.value)}
                                className={`flex-1 text-xs font-mono p-1 border rounded
                                    ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
                            />
                        </div>
                    </div>

                    {/* Toggle Settings */}
                    <div className="space-y-2">
                        <div className={`flex items-center justify-between p-3 rounded-lg ${theme == 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <div className="flex items-center gap-3">
                                <LayoutGrid size={16} />
                                <span className="text-sm">Show Grid</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showGrid}
                                    onChange={() => setShowGrid(!showGrid)}
                                    className="sr-only peer"
                                />
                                <div className={`w-9 h-5 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600
                                    ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                            </label>
                        </div>

                        <div className={`flex items-center justify-between p-3 rounded-lg ${theme == 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <div className={`flex items-center gap-3`}>
                                <Square size={16} />
                                <span className="text-sm">Rounded Corners</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={roundedCorners}
                                    onChange={() => setRoundedCorners(!roundedCorners)}
                                    className="sr-only peer"
                                />
                                <div className={`w-9 h-5 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600
                                    ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                            </label>
                        </div>

                        <div className={`flex items-center justify-between p-3 rounded-lg ${theme == 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <div className="flex items-center gap-3">
                                {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
                                <span className="text-sm">Dark Mode</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={theme == "dark"}
                                    onChange={() => toggleTheme()}
                                    className="sr-only peer"
                                />
                                <div className={`w-9 h-5 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600
                                    ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftSideBar;