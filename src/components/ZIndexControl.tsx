import { useState, useEffect } from "react";

interface ZIndexControlProps {
  value: number;
  onChange: (zIndex: number) => void;
}

export default function ZIndexControl({ value, onChange }: ZIndexControlProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 dark:text-gray-200 text-gray-700">
        Z-Index
      </label>
      <input
        type="number"
        value={localValue}
        onChange={handleChange}
        min={0}
        className="w-full h-9 text-sm rounded-md px-3 border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 bg-white text-gray-900 border-gray-300"
      />
    </div>
  );
}
