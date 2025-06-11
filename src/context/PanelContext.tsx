import React, { createContext, useContext, useState } from 'react';

interface Panel {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    title: string;
    shape: string;
    moveEnabled: boolean;
    editingEnabled: boolean
    style: {
        fillColor: string
        strokeColor: string,
        strokeWidth: number,
        borderRadius: number,
    }
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

    const addPanel = (s: string) => {
        console.log(s);
        const canvas = document.querySelector('.canvas-container');
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = rect.width / 2 - 50; // Center horizontally
            const y = rect.height / 2 - 50; // Center vertically
            const maxZIndex = panels.length > 0
                ? Math.max(...panels.map(p => p.zIndex))
                : 0;
            setPanels(prev => [...prev, {
                id: crypto.randomUUID(),
                x,
                y,
                width: 400,
                height: 400,
                zIndex: maxZIndex + 1,
                title: '',
                moveEnabled: false,
                editingEnabled: false,
                shape: s,
                style: {
                    fillColor: "",
                    strokeColor: "#1e3a8a",
                    strokeWidth: 1,
                    borderRadius: 0,
                }
            }]);
        }
        console.log(panels)
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