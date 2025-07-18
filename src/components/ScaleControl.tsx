import { useState, useEffect } from 'react';
import { Link, Unlink } from 'lucide-react';

interface ScaleControlProps {
  scaleX: number;
  scaleY: number;
  onChange: (scaleX: number, scaleY: number) => void;
  theme?: string;
}

export default function ScaleControl({
  scaleX,
  scaleY,
  onChange,
  theme = 'light'
}: ScaleControlProps) {
  const [localScaleX, setLocalScaleX] = useState(scaleX);
  const [localScaleY, setLocalScaleY] = useState(scaleY);
  const [isLinked, setIsLinked] = useState(true);

  useEffect(() => {
    setLocalScaleX(scaleX);
    setLocalScaleY(scaleY);
  }, [scaleX, scaleY]);

  const clamp = (value: number) => Math.max(0.1, Math.min(3, value));

  const commitX = () => {
    const x = clamp(localScaleX);
    const y = isLinked ? x : clamp(localScaleY);
    onChange(x, y);
  };

  const commitY = () => {
    const y = clamp(localScaleY);
    const x = isLinked ? y : clamp(localScaleX);
    onChange(x, y);
  };

  const handleSliderX = (value: string) => {
    const num = parseFloat(value);
    setLocalScaleX(clamp(num));
    if (isLinked) setLocalScaleY(clamp(num));
  };

  const handleSliderY = (value: string) => {
    const num = parseFloat(value);
    setLocalScaleY(clamp(num));
    if (isLinked) setLocalScaleX(clamp(num));
  };

  const resetScale = () => {
    setLocalScaleX(1);
    setLocalScaleY(1);
    onChange(1, 1);
  };

  const progress = (val: number) => ((val - 0.1) / 2.9) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
          Scale
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsLinked(!isLinked)}
            className={`p-1 rounded-md transition-colors ${
              isLinked
                ? theme === 'dark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : theme === 'dark'
                ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            title={isLinked ? 'Unlink scales' : 'Link scales'}
          >
            {isLinked ? <Link size={12} /> : <Unlink size={12} />}
          </button>
          <button
            type="button"
            onClick={resetScale}
            className={`px-2 py-1 text-xs rounded-md transition-colors ${
              theme === 'dark'
                ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mb-3">
        <label className={`block text-xs mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Scale X: {localScaleX.toFixed(2)}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={localScaleX}
            onChange={(e) => handleSliderX(e.target.value)}
            onMouseUp={commitX}
            onTouchEnd={commitX}
            className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}
            style={{
              background:
                theme === 'dark'
                  ? `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress(localScaleX)}%, #374151 ${progress(localScaleX)}%, #374151 100%)`
                  : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress(localScaleX)}%, #e5e7eb ${progress(localScaleX)}%, #e5e7eb 100%)`
            }}
          />
          <input
            type="number"
            min="0.1"
            max="3"
            step="0.1"
            value={localScaleX.toFixed(2)}
            onChange={(e) => setLocalScaleX(clamp(parseFloat(e.target.value)))}
            onBlur={commitX}
            className={`w-16 h-8 text-xs text-center rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark'
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-white text-gray-900 border-gray-300'
            }`}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className={`block text-xs mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Scale Y: {localScaleY.toFixed(2)}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={localScaleY}
            onChange={(e) => handleSliderY(e.target.value)}
            onMouseUp={commitY}
            onTouchEnd={commitY}
            disabled={isLinked}
            className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer ${
              isLinked ? 'opacity-50 cursor-not-allowed' : ''
            } ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
            style={{
              background:
                theme === 'dark'
                  ? `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress(localScaleY)}%, #374151 ${progress(localScaleY)}%, #374151 100%)`
                  : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress(localScaleY)}%, #e5e7eb ${progress(localScaleY)}%, #e5e7eb 100%)`
            }}
          />
          <input
            type="number"
            min="0.1"
            max="3"
            step="0.1"
            value={localScaleY.toFixed(2)}
            onChange={(e) => setLocalScaleY(clamp(parseFloat(e.target.value)))}
            onBlur={commitY}
            disabled={isLinked}
            className={`w-16 h-8 text-xs text-center rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLinked ? 'opacity-50 cursor-not-allowed' : ''
            } ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
          />
        </div>
      </div>
    </div>
  );
}
