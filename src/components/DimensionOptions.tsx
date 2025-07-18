import { Panel } from "../types/canvas";

type DimensionChange = {
  width?: number;
  height?: number;
};

interface DimensionOptionsProps {
  panel: Panel;
  onDimensionChange: (id: string, changes: DimensionChange) => void;
}

const DimensionOptions: React.FC<DimensionOptionsProps> = ({
  panel,
  onDimensionChange,
}) => {
  const handleCircleSizeChange = (value: number) => {
    onDimensionChange(panel.id, {
      width: value,
      height: value,
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 dark:text-gray-200 text-gray-700">
        {panel.shape === "circle" ? "Size (px)" : "Dimensions"}
      </label>

      {panel.shape === "circle" ? (
        <div>
          <input
            type="number"
            value={panel.width || 50}
            onChange={(e) => handleCircleSizeChange(parseInt(e.target.value) || 50)}
            className="w-full h-9 text-sm rounded-md px-3 border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 bg-white text-gray-900 border-gray-300"
            min="10"
            max="800"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs mb-1 dark:text-gray-400 text-gray-600">
              Width (px)
            </label>
            <input
              type="number"
              value={panel.width}
              onChange={(e) =>
                onDimensionChange(panel.id, {
                  width: parseInt(e.target.value) || 50,
                })
              }
              className="w-full h-9 text-sm rounded-md px-3 border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 bg-white text-gray-900 border-gray-300"
              min="10"
              max="800"
            />
          </div>
          <div>
            <label className="block text-xs mb-1 dark:text-gray-400 text-gray-600">
              Height (px)
            </label>
            <input
              type="number"
              value={panel.height}
              onChange={(e) =>
                onDimensionChange(panel.id, {
                  height: parseInt(e.target.value) || 50,
                })
              }
              className="w-full h-9 text-sm rounded-md px-3 border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 bg-white text-gray-900 border-gray-300"
              min="10"
              max="800"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DimensionOptions;
