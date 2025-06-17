import React, { createContext, useContext, useState, useCallback } from 'react';

export interface PanelStyle {
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    borderRadius?: number;
    fontColor?: string;
    fontSize?: number;
    fontWeight?: "normal" | "bold";
    fontStyle?: "normal" | "italic";
    textDecoration?: "none" | "underline";
    boxShadow?: string;
    strokeStyle? : string;
}

export interface Panel {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    shape: string;
    editingEnabled: boolean;
    rotation: number;
    style: PanelStyle;
    title: string;
    isLocked: boolean;
    lockAspectRatio:boolean;
}

interface PanelContextType {
    panels: Panel[];
    addPanel: (s: string) => void;
    clearPanels: () => void;
    removePanel: (id: string) => void;
    addDuplicatePanel: (panelId: string, copiedPanel: boolean) => void;
    updatePanel: (
        id: string,
        updates: Partial<Omit<Panel, "id">> & {
            style?: Partial<Panel["style"]>;
        }
    ) => void;
    updatePanelSilently: (panelId: string, updates: Partial<Omit<Panel, "id">> & {
        style?: Partial<Panel["style"]>;
    }) => void;
    setPanels: (panels: Panel[]) => void;
    canUndo: boolean;
    canRedo: boolean;
    undo: () => void;
    redo: () => void;
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export function PanelProvider({ children }: { children: React.ReactNode }) {
    const [panels, setPanels] = useState<Panel[]>([]);
    const [history, setHistory] = useState<{
        past: Panel[][];
        present: Panel[];
        future: Panel[][];
    }>({
        past: [],
        present: [],
        future: [],
    });


    const updateHistory = useCallback((newPanels: Panel[]) => {
        setHistory(prev => {
            return {
                past: [prev.present, ...prev.past].slice(0, 100), // Limit to 100 undo steps
                present: newPanels,
                future: [], // Clear redo stack when making new changes
            };
        });
    }, []);

    // Wrap setPanels to automatically update history
    const setPanelsWithHistory = useCallback((newPanels: Panel[]) => {
        setPanels(newPanels);
        updateHistory(newPanels);
    }, [updateHistory]);

    // All panel operations should use setPanelsWithHistory instead of setPanels directly
    const addPanel = useCallback((shape: string) => {
        const canvas = document.querySelector('.canvas-container');
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = rect.width / 2 - 200;
        const y = rect.height / 2 - 200;
        const maxZIndex = panels.reduce((max, p) => Math.max(max, p.zIndex), 0);

        const newPanel: Panel = {
            id: crypto.randomUUID(),
            x,
            y,
            width: shape === 'text' ? 250 : 400,
            height: (shape === 'text' || shape === 'rectangle') ? 100 : 400,
            zIndex: maxZIndex + 1,
            rotation: 0,
            editingEnabled: true,
            shape,
            isLocked: false,
            title: '',
            style: {
                strokeColor: '#1e3a8a',
                strokeWidth: 1,
                borderRadius: 0,
                fillColor: 'transparent',
                fontColor: '#000000',
                fontSize: 16,
                fontWeight: 'normal',
                fontStyle: 'normal',
                textDecoration: 'none',
                boxShadow: '',
                strokeStyle : ''
            },
            lockAspectRatio:false,

        };

        setPanelsWithHistory([...panels, newPanel]);
    }, [panels, setPanelsWithHistory]);

    const clearPanels = useCallback(() => {
        setPanelsWithHistory([]);
    }, [setPanelsWithHistory]);

    const removePanel = useCallback((id: string) => {
        setPanelsWithHistory(panels.filter(panel => panel.id !== id));
    }, [panels, setPanelsWithHistory]);

    const updatePanel = useCallback((
        id: string,
        updates: Partial<Omit<Panel, "id">> & {
            style?: Partial<Panel["style"]>;
        }
    ) => {
        setPanelsWithHistory(
            panels.map(panel =>
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
        )
    }, [panels, setPanelsWithHistory]);

    const addDuplicatePanel = useCallback((panelId: string, copiedPanel: boolean) => {
        const panel = panels.find((p) => panelId === p.id);
        if (!panel) throw new Error("Panel not found");

        const baseTitle = panel.title;
        const similarPanelsCount = panels.filter(p => p.title.startsWith(baseTitle)).length;
        const offset = copiedPanel ? 10 : 20 * similarPanelsCount;

        const newPanel: Panel = {
            id: crypto.randomUUID(),
            x: panel.x + offset,
            y: panel.y + offset,
            width: panel.width,
            height: panel.height,
            zIndex: panel.zIndex + 1,
            rotation: panel.rotation,
            editingEnabled: true,
            shape: panel.shape,
            isLocked: panel.isLocked,
            title: `${panel.title} Copy ${similarPanelsCount}`,
            style: {
                strokeColor: panel.style.strokeColor,
                strokeWidth: panel.style.strokeWidth,
                borderRadius: panel.style.borderRadius,
                fillColor: panel.style.fillColor,
                fontColor: panel.style.fontColor,
                fontSize: panel.style.fontSize,
                fontWeight: panel.style.fontWeight,
                fontStyle: panel.style.fontStyle,
                textDecoration: panel.style.textDecoration,
                boxShadow: panel.style.boxShadow,
            },
            lockAspectRatio:panel.lockAspectRatio,
        };

        setPanelsWithHistory([...panels, newPanel]);
    }, [panels, setPanelsWithHistory]);

    const undo = useCallback(() => {
        setHistory(prev => {
            if (prev.past.length === 0) return prev;

            const [newPresent, ...newPast] = prev.past;
            return {
                past: newPast,
                present: newPresent,
                future: [prev.present, ...prev.future],
            };
        });

        if (history.past.length > 0) {
            setPanels(history.past[0]);
        }
    }, [history.past]);

    const updatePanelSilently = (
        id: string,
        updates: Partial<Omit<Panel, "id">> & {
            style?: Partial<Panel["style"]>;
        }
    ) => {
        setPanels(prevPanels =>
            prevPanels.map(panel =>
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

    const redo = useCallback(() => {
        setHistory(prev => {
            if (prev.future.length === 0) return prev;

            const [newPresent, ...newFuture] = prev.future;
            return {
                past: [prev.present, ...prev.past],
                present: newPresent,
                future: newFuture,
            };
        });

        if (history.future.length > 0) {
            setPanels(history.future[0]);
        }
    }, [history.future]);

    return (
        <PanelContext.Provider value={{
            panels,
            addPanel,
            clearPanels,
            removePanel,
            updatePanel,
            addDuplicatePanel,
            setPanels: setPanelsWithHistory,
            canUndo: history.past.length > 0,
            canRedo: history.future.length > 0,
            undo,
            redo,
            updatePanelSilently
        }}>
            {children}
        </PanelContext.Provider>
    );
}

export function usePanel() {
    const context = useContext(PanelContext);
    if (context === undefined) {
        throw new Error('usePanel must be used within a PanelProvider');
    }
    return context;
}