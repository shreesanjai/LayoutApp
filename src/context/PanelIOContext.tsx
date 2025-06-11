import React, { createContext, useContext } from "react";
import { useCanvasSettings } from "./CanvasSettingsContext";
import { usePanel } from "./PanelContext";
import html2canvas from "html2canvas";

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

interface CanvasConfig {
    panels: Panel[];
    canvasWidth: number;
    canvasHeight: number;
    canvasBgColor: string;
    canvasFgColor: string;
    roundedCorners: boolean;
    showGrid: boolean;
}

interface PanelIOContextType {
    exportToPNG: () => void;
    exportConfig: () => void;
    importConfig: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PanelIOContext = createContext<PanelIOContextType | undefined>(undefined);

export const PanelIOProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const {
        canvasBgColor,
        canvasWidth,
        canvasHeight,
        canvasFgColor,
        roundedCorners,
        showGrid,
        setCanvasBgColor,
        setCanvasWidth,
        setCanvasHeight,
        setCanvasFgColor,
        setRoundedCorners,
        setShowGrid,
    } = useCanvasSettings();

    const { panels, addPanel } = usePanel();
    
    const exportConfig = () => {
        const config: CanvasConfig = {
            panels,
            canvasWidth,
            canvasHeight,
            canvasBgColor,
            canvasFgColor,
            roundedCorners,
            showGrid,
        };

        const blob = new Blob([JSON.stringify(config, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "panel-layout.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const config: CanvasConfig = JSON.parse(e.target?.result as string);
                    for (let panel of panels) {
                        addPanel(panel.shape);
                    }
                    setCanvasWidth(config.canvasWidth);
                    setCanvasHeight(config.canvasHeight);
                    setCanvasBgColor(config.canvasBgColor);
                    setCanvasFgColor(config.canvasFgColor);
                    setRoundedCorners(config.roundedCorners);
                    setShowGrid(config.showGrid);
                } catch (error) {
                    console.error("Error importing configuration:", error);
                    alert("Error importing configuration. Please check the file format.");
                }
            };
            reader.readAsText(file);
        }

    };

    const exportToPNG = () => {
        const canvas = document.querySelector('.canvas-container');
        if (canvas) {
            html2canvas(canvas as HTMLElement, {
                backgroundColor: canvasBgColor,
                scale: 2, // Higher quality
                logging: false,
            }).then((canvas: HTMLCanvasElement) => {
                const link = document.createElement('a');
                link.download = 'panel-drawing.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }
    };

    return (
        <PanelIOContext.Provider value={{ exportToPNG, exportConfig, importConfig }}>
            {children}
        </PanelIOContext.Provider>
    );



}
function usePanelIO() {
    const context = useContext(PanelIOContext);
    if (!context) {
        throw new Error("usePanelIOContext must be used within a PanelIOProvider");
    }
    return context;
};

export default usePanelIO;