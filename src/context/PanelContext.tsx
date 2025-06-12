import React, { createContext, useContext, useState } from 'react';

export interface Panel {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  title: string;
  shape: string;
  moveEnabled: boolean;
  editingEnabled: boolean;
  style: Partial<{
    fillColor: string;
    strokeColor: string;
    strokeWidth: number;
    borderRadius: number;
    fontColor: string;
    fontSize: number;
    fontWeight: "normal" | "bold";
    fontStyle: "normal" | "italic";
    textDecoration: "none" | "underline";
    textAlign: "left" | "center" | "right";
    boxShadow : string
  }>;
}


interface PanelContextType {
    panels: Panel[];
    addPanel: (s: string) => void;
    clearPanels: () => void;
    removePanel: (id: string) => void;
    updatePanel: (
        id: string,
        updates: Partial<Omit<Panel, "id">> & {
            style?: Partial<Panel["style"]>;
        }
    ) => void;
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export function PanelProvider({ children }: { children: React.ReactNode }) {

    const [panels, setPanels] = useState<Panel[]>([]);

   const addPanel = (shape: string) => {
  const canvas = document.querySelector('.canvas-container');
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();

  const x = rect.width / 2 - 200; // Center horizontally (400 width / 2)
  const y = rect.height / 2 - 200; // Center vertically (400 height / 2)

  const maxZIndex = panels.length > 0 ? Math.max(...panels.map(p => p.zIndex)) : 0;

  const newPanel: Panel = {
    id: crypto.randomUUID(),
    x,
    y,
    width: 400,
    height: 400,
    zIndex: maxZIndex + 1,
    title: '',
    moveEnabled: true,
    editingEnabled: true,
    shape,
    style: {
      strokeColor: '#1e3a8a',
      strokeWidth: 1,
      borderRadius: 0,
      fillColor: '#ffffff',
      fontColor: '#000000',
      fontSize: 16,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'left',
      boxShadow: '',
    },
  };

  setPanels(prev => [...prev, newPanel]);
};



    const clearPanels = () => {
        setPanels([]);
    };

    const removePanel = (id: string) => {
        setPanels(prev => prev.filter(panel => panel.id !== id));
    };

    const updatePanel = (
        id: string,
        updates: Partial<Omit<Panel, "id">> & {
            style?: Partial<Panel["style"]>;
        }
    ) => {
        setPanels(prev =>
            prev.map(panel =>
                panel.id === id
                    ? {
                        ...panel,
                        ...updates,
                        style: {
                            ...panel.style,
                            ...updates.style,
                        },
                    }
                    : panel
            )
        );
    };


    return (
        <PanelContext.Provider value={{ panels, addPanel, clearPanels, removePanel, updatePanel }} >{children}</PanelContext.Provider>
    );

}

export function usePanel() {
    const context = useContext(PanelContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}