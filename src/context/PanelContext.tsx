import React, { createContext, useContext, useState } from 'react';

export interface PanelStyle {
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    fontSize?: number;
    fontWeight?: "normal" | "bold";
    fontStyle?: "normal" | "italic";
    textDecoration?: "none" | "underline";
    boxShadow?: string;
    strokeStyle?: string;
    borderRadius?: number;
    fontColor?: string;
    textAlign? : 'center' | 'left' | 'right';
}

export interface Panel {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    shape: string;
    moveEnabled: boolean;
    editingEnabled: boolean;
    rotation: number;
    style: PanelStyle;
    title: string;
    isLocked: boolean;
    lockAspectRatio: boolean;
}

interface PanelContextType {
    panels: Panel[];
    addPanel: (shape: string) => void;
    clearPanels: () => void;
    removePanel: (id: string) => void;
    addDuplicatePanel: (id: string, copied: boolean) => void;
    updatePanel: (
        id: string,
        updates: Partial<Omit<Panel, "id">> & { style?: Partial<PanelStyle> }
    ) => void;
    updatePanelSilently: (
        id: string,
        updates: Partial<Omit<Panel, "id">> & { style?: Partial<PanelStyle> }
    ) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    setPanels: (newPanels: Panel[]) => void;
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export const PanelProvider = ({ children }: { children: React.ReactNode }) => {
    const [panels, setPanels] = useState<Panel[]>([]);
    const [history, setHistory] = useState<Panel[][]>([]);
    const [future, setFuture] = useState<Panel[][]>([]);

    const pushToHistory = () => {
        setHistory(prev => [...prev, panels.map(p => ({ ...p, style: { ...p.style } }))]);
        setFuture([]);
    };

    const addPanel = (shape: string) => {
        const canvas = document.querySelector('.canvas-container');
        console.log(panels);
        console.log(canvas)
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = rect.width / 2 - 200;
        const y = rect.height / 2 - 200;
        const maxZIndex = panels.reduce((max, p) => Math.max(max, p.zIndex), 0);

        const newPanel: Panel = {
            id: Date.now().toString(),
            x,
            y,
            width: 400,
            height: (shape === 'text' || shape === 'rectangle') ? 100 : 400,
            zIndex: maxZIndex + 1,
            rotation: 0,
            moveEnabled: true,
            editingEnabled: true,
            shape,
            title: `${shape}`,
            isLocked: false,
            lockAspectRatio: false,
            style: {
                fillColor: '#ffffff',
                strokeColor: '#000000',
                strokeWidth: 2,
                fontSize: 16,
                fontWeight: 'normal',
                fontStyle: 'normal',
                textDecoration: 'none',
                boxShadow: '',
                strokeStyle: '',
                borderRadius: 0,
                fontColor: 'black'
            }
        };

        pushToHistory();
        setPanels(prev => [...prev, newPanel]);
    };

    const updatePanel = (
        id: string,
        updates: Partial<Omit<Panel, "id">> & { style?: Partial<PanelStyle> }
    ) => {
        pushToHistory();
        setPanels(prev =>
            prev.map(panel =>
                panel.id === id
                    ? {
                        ...panel,
                        ...updates,
                        style: {
                            ...panel.style,
                            ...updates.style,
                        }
                    }
                    : panel
            )
        );
    };

    const updatePanelSilently = (
        id: string,
        updates: Partial<Omit<Panel, "id">> & { style?: Partial<PanelStyle> }
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
                        }
                    }
                    : panel
            )
        );
    };

    const removePanel = (id: string) => {
        pushToHistory();
        setPanels(prev => prev.filter(panel => panel.id !== id));
    };

    const clearPanels = () => {
        pushToHistory();
        setPanels([]);
    };

    const addDuplicatePanel = (panelId: string, copied: boolean) => {
        const panel = panels.find(p => p.id === panelId);
        if (!panel) return;

        const similarCount = panels.filter(p => p.title.startsWith(panel.title)).length;
        const offset = copied ? 10 : 20 * similarCount;

        const newPanel: Panel = {
            ...panel,
            id: Date.now().toString(),
            x: panel.x + offset,
            y: panel.y + offset,
            zIndex: panel.zIndex + 1,
            title: `${panel.title} Copy`
        };

        pushToHistory();
        setPanels(prev => [...prev, newPanel]);
    };

    const undo = () => {
        if (history.length === 0) return;
        const previous = history[history.length - 1];
        setHistory(prev => prev.slice(0, prev.length - 1));
        setFuture(prev => [panels, ...prev]);
        setPanels(previous);
    };

    const redo = () => {
        if (future.length === 0) return;
        const next = future[0];
        setFuture(prev => prev.slice(1));
        setHistory(prev => [...prev, panels]);
        setPanels(next);
    };

    const setPanelsDirect = (newPanels: Panel[]) => {
        setPanels(newPanels);
    };

    return (
        <PanelContext.Provider
            value={{
                panels,
                addPanel,
                clearPanels,
                removePanel,
                updatePanel,
                updatePanelSilently,
                addDuplicatePanel,
                undo,
                redo,
                canUndo: history.length > 0,
                canRedo: future.length > 0,
                setPanels: setPanelsDirect
            }}
        >
            {children}
        </PanelContext.Provider>
    );
};

export const usePanel = () => {
    const context = useContext(PanelContext);
    if (!context) throw new Error('usePanel must be used within a PanelProvider');
    return context;
};
