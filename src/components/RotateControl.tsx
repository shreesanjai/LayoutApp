import { useEffect, useState } from "react";

interface RotateControlProps {
  value: number;
  onChange: (value: number) => void;
}

export default function RotateControl({ value, onChange }: RotateControlProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const commitChange = () => {
    onChange(localValue);
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-24 shrink-0">
        Rotation
      </label>
      <div className="flex items-center gap-4">
        <input
          type="number"
          min="0"
          max="360"
          value={localValue}
          onChange={(e) => setLocalValue(parseInt(e.target.value))}
          onBlur={commitChange}
          className="w-16 border px-2 py-1 rounded text-sm bg-white text-gray-900 border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />

        <input
          type="range"
          min="0"
          max="360"
          value={localValue}
          onChange={(e) => setLocalValue(parseInt(e.target.value))}
          onMouseUp={commitChange}
          onTouchEnd={commitChange}
          className="flex-1"
        />
      </div>
    </div>
  );
}  