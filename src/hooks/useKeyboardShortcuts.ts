import { useEffect, useState } from 'react';
import { Panel } from '../types/canvas';

interface KeyboardShortcutsProps {
  selectedPanels: string[];
  panels: Panel[];
  onUndo: () => void;
  onRedo: () => void;
  onAddPanel: (panel: Panel) => void;
  onRemovePanel: (id: string) => void;
  copiedPanels: Panel[];
  setCopiedPanels: (panels: Panel[]) => void;
  onUpdatePanel: (id: string, updates: Partial<Panel>) => void;
  canvasWidth: number;
  canvasHeight: number;
}

export const useKeyboardShortcuts = ({
  selectedPanels,
  panels,
  onUndo,
  onRedo,
  onRemovePanel,
  onAddPanel,
  copiedPanels,
  setCopiedPanels,
  onUpdatePanel,
  canvasWidth,
  canvasHeight,
}: KeyboardShortcutsProps) => {
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [pasteCount, setPasteCount] = useState(0);

  const handleCut = () => {
    const selected = panels.filter(p => selectedPanels.includes(p.id));
    if (selected.length > 0) {
      setCopiedPanels(selected.map(p => ({ ...p })));
      selected.forEach(p => onRemovePanel(p.id));
      setPasteCount(0);
    }
  };

  const handleCopy = () => {
    const selected = panels.filter(p => selectedPanels.includes(p.id));
    if (selected.length > 0) {
      setCopiedPanels(selected.map(p => ({ ...p })));
      setPasteCount(0);
    }
  };

  const handlePaste = () => {
    if (copiedPanels.length > 0) {
      const maxZIndex = panels.length > 0 ? Math.max(...panels.map(p => p.zIndex)) : 0;
      const baseX = copiedPanels[0].x;
      const baseY = copiedPanels[0].y;

      copiedPanels.forEach((panel, index) => {
        const deltaX = panel.x - baseX;
        const deltaY = panel.y - baseY;

        const newPanel: Panel = {
          ...panel,
          id: crypto.randomUUID(),
          x: baseX + deltaX + 10 * (pasteCount + 1),
          y: baseY + deltaY + 10 * (pasteCount + 1),
          zIndex: maxZIndex + index + 1,
        };
        onAddPanel(newPanel);
      });
      setPasteCount(prev => prev + 1);
    }
  };

  const moveSelectedPanels = (dx: number, dy: number) => {
    selectedPanels.forEach(id => {
      const panel = panels.find(p => p.id === id);
      if (panel && !panel.isLocked) {
        const newX = Math.max(0, Math.min(panel.x + dx, canvasWidth - panel.width));
        const newY = Math.max(0, Math.min(panel.y + dy, canvasHeight - panel.height));
        onUpdatePanel(id, { x: newX, y: newY });
      }
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(true);
      } else if (e.ctrlKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopy();
      } else if (e.ctrlKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        handlePaste();
      } else if (e.ctrlKey && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        handleCut();
      } else if (e.ctrlKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        onRedo();
      } else if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        onUndo();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        moveSelectedPanels(0, -1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveSelectedPanels(0, 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveSelectedPanels(-1, 0);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveSelectedPanels(1, 0);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedPanels, panels, copiedPanels, pasteCount]);

  return { isCtrlPressed, handleCopy, handlePaste, handleCut };
};
