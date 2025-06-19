import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { usePanel } from '../context/PanelContext';
import { Menu, File, Download, Upload, Trash2, Layers, Grid, ZoomIn, ZoomOut, Undo, Redo, Info, Sliders } from 'lucide-react';

export default function Header() {
  const { theme } = useTheme();
  const { clearPanels } = usePanel();
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);

  const toggleFileMenu = () => setIsFileMenuOpen(!isFileMenuOpen);

  const handleClearPanels = () => {
    if (window.confirm('Are you sure you want to clear all panels?')) {
      clearPanels();
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-3 ${
        theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'
      } shadow-sm border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}
      role="banner"
      aria-label="Application header"
    >
      {/* Left Side: Menu Items */}
      <div className="flex items-center space-x-4">
        {/* Brand/App Icon - Non-interactive as requested */}
        <div className="p-1.5">
          <Menu size={20} className="text-gray-500" />
        </div>

        {/* File Menu */}
        <div className="relative">
          <button
            onClick={toggleFileMenu}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium ${
              theme === 'dark' 
                ? 'hover:bg-gray-700 text-gray-100' 
                : 'hover:bg-gray-100 text-gray-700'
            } transition-colors`}
            aria-haspopup="true"
            aria-expanded={isFileMenuOpen}
          >
            <File size={16} />
            <span>File</span>
          </button>

          {isFileMenuOpen && (
            <div
              className={`absolute top-10 left-0 w-48 mt-1 rounded-md shadow-lg ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } border py-1 z-50`}
              onMouseLeave={() => setIsFileMenuOpen(false)}
            >
              <button
                className={`flex items-center w-full px-4 py-2 text-sm ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                } transition-colors`}
              >
                <Upload size={16} className="mr-2" />
                Import Project
              </button>
              <button
                className={`flex items-center w-full px-4 py-2 text-sm ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                } transition-colors`}
              >
                <Download size={16} className="mr-2" />
                Export Project
              </button>
              <div className="border-t my-1 border-gray-200 dark:border-gray-700"></div>
              <button
                onClick={handleClearPanels}
                className={`flex items-center w-full px-4 py-2 text-sm ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700 text-red-400' 
                    : 'hover:bg-gray-50 text-red-600'
                } transition-colors`}
              >
                <Trash2 size={16} className="mr-2" />
                Clear Workspace
              </button>
            </div>
          )}
        </div>

        {/* Edit Actions */}
        <div className="flex items-center space-x-1">
          <button
            className={`p-1.5 rounded-md ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } transition-colors`}
            title="Undo"
            aria-label="Undo last action"
          >
            <Undo size={18} />
          </button>
          <button
            className={`p-1.5 rounded-md ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } transition-colors`}
            title="Redo"
            aria-label="Redo last action"
          >
            <Redo size={18} />
          </button>
        </div>
      </div>

      {/* Right Side: Utility Buttons */}
      <div className="flex items-center space-x-2">
        <button
          className={`p-1.5 rounded-md ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          } transition-colors`}
          title="Toggle Grid"
          aria-label="Toggle grid visibility"
        >
          <Grid size={18} />
        </button>
        <button
          className={`p-1.5 rounded-md ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          } transition-colors`}
          title="Zoom In"
          aria-label="Zoom in"
        >
          <ZoomIn size={18} />
        </button>
        <button
          className={`p-1.5 rounded-md ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          } transition-colors`}
          title="Zoom Out"
          aria-label="Zoom out"
        >
          <ZoomOut size={18} />
        </button>
        <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <button
          className={`p-1.5 rounded-md ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          } transition-colors`}
          title="Panel Properties"
          aria-label="Show panel properties"
        >
          <Sliders size={18} />
        </button>
        <button
          className={`p-1.5 rounded-md ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          } transition-colors`}
          title="Layer Management"
          aria-label="Manage layers"
        >
          <Layers size={18} />
        </button>
        <button
          className={`p-1.5 rounded-md ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          } transition-colors`}
          title="Information"
          aria-label="Show information"
        >
          <Info size={18} />
        </button>
      </div>
    </header>
  );
}