import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Panel } from '../types/canvas';

interface TranslateControlProps {
  translateX: number;
  translateY: number;
  onChange: (x: number, y: number) => void;
  panel: Panel;
  canvasWidth: number;
  canvasHeight: number;
}

export default function TranslateControl({
  translateX,
  translateY,
  onChange,
  panel,
  canvasWidth,
  canvasHeight,
}: TranslateControlProps) {
  const [inputX, setInputX] = useState(translateX.toString());
  const [inputY, setInputY] = useState(translateY.toString());
  
  const initialPositionRef = useRef<{ x: number; y: number } | null>(null);

  const maxX = useMemo(() => Math.max(0, canvasWidth - panel.width), [canvasWidth, panel.width]);
  const maxY = useMemo(() => Math.max(0, canvasHeight - panel.height), [canvasHeight, panel.height]);

  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

  useEffect(() => {
    const key = `translate-${panel.id}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        initialPositionRef.current = parsed;
      } catch {
        initialPositionRef.current = { x: translateX, y: translateY };
        localStorage.setItem(key, JSON.stringify(initialPositionRef.current));
      }
    } else {
      initialPositionRef.current = { x: translateX, y: translateY };
      localStorage.setItem(key, JSON.stringify(initialPositionRef.current));
    }
  }, [panel.id]);

  useEffect(() => {
    setInputX(clamp(translateX, 0, maxX).toString());
    setInputY(clamp(translateY, 0, maxY).toString());
  }, [translateX, translateY, maxX, maxY]);

  const commitX = () => {
    const num = parseInt(inputX, 10);
    if (!isNaN(num)) onChange(clamp(num, 0, maxX), translateY);
  };

  const commitY = () => {
    const num = parseInt(inputY, 10);
    if (!isNaN(num)) onChange(translateX, clamp(num, 0, maxY));
  };

  const handleXRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = clamp(parseInt(e.target.value, 10), 0, maxX);
    setInputX(num.toString());
  };

  const handleYRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = clamp(parseInt(e.target.value, 10), 0, maxY);
    setInputY(num.toString());
  };

  const commitXRange = () => {
    const num = parseInt(inputX, 10);
    if (!isNaN(num)) onChange(clamp(num, 0, maxX), translateY);
  };

  const commitYRange = () => {
    const num = parseInt(inputY, 10);
    if (!isNaN(num)) onChange(translateX, clamp(num, 0, maxY));
  };

  const handleReset = () => {
    if (initialPositionRef.current) {
      const { x, y } = initialPositionRef.current;
      const clampedX = clamp(x, 0, maxX);
      const clampedY = clamp(y, 0, maxY);
      onChange(clampedX, clampedY);
      setInputX(clampedX.toString());
      setInputY(clampedY.toString());
      localStorage.setItem(`translate-${panel.id}`, JSON.stringify({ x: clampedX, y: clampedY }));
    }
  };

  const calcBackground = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    return `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
  };

  const isAtInitialPosition = !!(
    initialPositionRef.current &&
    translateX === clamp(initialPositionRef.current.x, 0, maxX) &&
    translateY === clamp(initialPositionRef.current.y, 0, maxY)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium dark:text-gray-200 text-gray-700">
          Transform Position
        </label>
        <button
          onClick={handleReset}
          disabled={isAtInitialPosition}
          className={`px-2 py-1 text-xs rounded transition-all duration-200 ${isAtInitialPosition
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
            : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer'
            }`}
          title={isAtInitialPosition ? 'Already at initial position' : 'Reset to initial position'}
        >
          Reset
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs mb-1 dark:text-gray-400 text-gray-600">
            Translate X (px)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputX}
              onChange={(e) => setInputX(e.target.value)}
              onBlur={commitX}
              className="w-16 h-8 text-xs rounded-md px-2 border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 bg-white text-gray-900 border-gray-300"
            />
            <input
              type="range"
              min="0"
              max={maxX}
              value={parseInt(inputX, 10) || 0}
              onChange={handleXRange}
              onMouseUp={commitXRange}
              onTouchEnd={commitXRange}
              className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700"
              style={{ background: calcBackground(parseInt(inputX, 10) || 0, maxX) }}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs mb-1 dark:text-gray-400 text-gray-600">
            Translate Y (px)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputY}
              onChange={(e) => setInputY(e.target.value)}
              onBlur={commitY}
              className="w-16 h-8 text-xs rounded-md px-2 border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 bg-white text-gray-900 border-gray-300"
            />
            <input
              type="range"
              min="0"
              max={maxY}
              value={parseInt(inputY, 10) || 0}
              onChange={handleYRange}
              onMouseUp={commitYRange}
              onTouchEnd={commitYRange}
              className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700"
              style={{ background: calcBackground(parseInt(inputY, 10) || 0, maxY) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
