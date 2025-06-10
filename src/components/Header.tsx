import { Moon, Sun, Plus, Trash2, Move, Settings, Download, Upload, Save } from 'lucide-react';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
  toggleShapeOptions: () => void;
  showShapeOptions: boolean;
  exportConfig: () => void;
  importConfig: (e: React.ChangeEvent<HTMLInputElement>) => void;
  exportToPNG: () => void;
  setIsEditingCanvas: (value: boolean) => void;
  clearPanels: () => void;
  shapes: string[];
  addPanel: (s: string) => void;
}

export default function Header({
  theme, toggleTheme, toggleShapeOptions, showShapeOptions,
  exportConfig, importConfig, exportToPNG, setIsEditingCanvas,
  clearPanels, shapes, addPanel
}: HeaderProps) {
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
          onClick={() => setIsEditingCanvas(true)}
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
    </div>
  );
}