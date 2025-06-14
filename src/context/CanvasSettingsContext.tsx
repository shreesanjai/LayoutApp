import React, { createContext, useContext, useState } from "react";

interface CanvasSettingsContextType {
    canvasBgColor: string;
    setCanvasBgColor: (color: string) => void;
    canvasFgColor: string;
    setCanvasFgColor: (color: string) => void;
    canvasWidth: number;
    setCanvasWidth: (width: number) => void;
    canvasHeight: number;
    setCanvasHeight: (height: number) => void;
    roundedCorners: boolean;
    setRoundedCorners: (rounded: boolean) => void;
    showGrid: boolean;
    setShowGrid: (show: boolean) => void;
    isEditingCanvas: boolean;
    toggleEdit: () => void;
}

const CanvasSettingsContext = createContext<CanvasSettingsContextType | undefined>(undefined);

export const CanvasSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [canvasBgColor, setCanvasBgColor] = useState<string>("#ffffff");
    const [canvasFgColor, setCanvasFgColor] = useState<string>("#000000");
    const [canvasWidth, setCanvasWidth] = useState<number>(1280);
    const [canvasHeight, setCanvasHeight] = useState<number>(720);
    const [roundedCorners, setRoundedCorners] = useState<boolean>(true);
    const [showGrid, setShowGrid] = useState<boolean>(false);
    const [isEditingCanvas, setIsEditingCanvas] = useState<boolean>(false);

    function toggleEdit() {
        setIsEditingCanvas(!isEditingCanvas);
    }

    return (
        <CanvasSettingsContext.Provider
            value={{
                canvasBgColor,
                setCanvasBgColor,
                canvasFgColor,
                setCanvasFgColor,
                canvasWidth,
                setCanvasWidth,
                canvasHeight,
                setCanvasHeight,
                roundedCorners,
                setRoundedCorners,
                showGrid,
                setShowGrid,
                isEditingCanvas,
                toggleEdit
            }}
        >
            {children}
        </CanvasSettingsContext.Provider>
    );
};

export const useCanvasSettings = () => {
    const context = useContext(CanvasSettingsContext);
    if (!context) {
        throw new Error("useCanvasSettingsContext must be used within a CanvasSettingsProvider");
    }
    return context;
};
