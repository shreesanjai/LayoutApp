import { useState, useCallback } from 'react';

// Guideline Interface
export interface Guideline {
    type: "horizontal" | "vertical";
    position: number;
}

export interface UseGridlinesProps {
    canvasWidth: number;
    canvasHeight: number;
    panels: Array<{
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
    }>;
    alignmentThreshold?: number;
}

export const useGridlines = ({
    canvasWidth,
    canvasHeight,
    panels,
    alignmentThreshold = 5,
}: UseGridlinesProps) => {
    const [guidelines, setGuidelines] = useState<Guideline[]>([]);

    const calculateGuidelines = useCallback(
        (
            draggedPanelId: string,
            draggedPanelX: number,
            draggedPanelY: number,
            draggedPanelWidth: number,
            draggedPanelHeight: number
        ) => {
            const newGuidelines: Guideline[] = [];

            const panelLeft = draggedPanelX;
            const panelRight = draggedPanelX + draggedPanelWidth;
            const panelTop = draggedPanelY;
            const panelBottom = draggedPanelY + draggedPanelHeight;
            const panelCenterX = draggedPanelX + draggedPanelWidth / 2;
            const panelCenterY = draggedPanelY + draggedPanelHeight / 2;

            const canvasCenterX = canvasWidth / 2;
            const canvasCenterY = canvasHeight / 2;

            // Canvas center guidelines
            if (Math.abs(panelCenterX - canvasCenterX) < alignmentThreshold) {
                newGuidelines.push({ type: "vertical", position: canvasCenterX });
            }
            if (Math.abs(panelCenterY - canvasCenterY) < alignmentThreshold) {
                newGuidelines.push({ type: "horizontal", position: canvasCenterY });
            }

            // Panel-to-panel guidelines
            panels.forEach((otherPanel) => {
                if (otherPanel.id === draggedPanelId) return;

                const otherLeft = otherPanel.x;
                const otherRight = otherPanel.x + otherPanel.width;
                const otherTop = otherPanel.y;
                const otherBottom = otherPanel.y + otherPanel.height;
                const otherCenterX = otherPanel.x + otherPanel.width / 2;
                const otherCenterY = otherPanel.y + otherPanel.height / 2;

                // Vertical alignments
                if (Math.abs(panelLeft - otherLeft) < alignmentThreshold) {
                    newGuidelines.push({ type: "vertical", position: otherLeft });
                }
                if (Math.abs(panelLeft - otherRight) < alignmentThreshold) {
                    newGuidelines.push({ type: "vertical", position: otherRight });
                }
                if (Math.abs(panelRight - otherLeft) < alignmentThreshold) {
                    newGuidelines.push({ type: "vertical", position: otherLeft });
                }
                if (Math.abs(panelRight - otherRight) < alignmentThreshold) {
                    newGuidelines.push({ type: "vertical", position: otherRight });
                }
                if (Math.abs(panelCenterX - otherCenterX) < alignmentThreshold) {
                    newGuidelines.push({ type: "vertical", position: otherCenterX });
                }

                // Horizontal alignments
                if (Math.abs(panelTop - otherTop) < alignmentThreshold) {
                    newGuidelines.push({ type: "horizontal", position: otherTop });
                }
                if (Math.abs(panelTop - otherBottom) < alignmentThreshold) {
                    newGuidelines.push({ type: "horizontal", position: otherBottom });
                }
                if (Math.abs(panelBottom - otherTop) < alignmentThreshold) {
                    newGuidelines.push({ type: "horizontal", position: otherTop });
                }
                if (Math.abs(panelBottom - otherBottom) < alignmentThreshold) {
                    newGuidelines.push({ type: "horizontal", position: otherBottom });
                }
                if (Math.abs(panelCenterY - otherCenterY) < alignmentThreshold) {
                    newGuidelines.push({ type: "horizontal", position: otherCenterY });
                }
            });

            setGuidelines(newGuidelines);
        },
        [canvasWidth, canvasHeight, panels, alignmentThreshold]
    );

    const showGuidelines = useCallback(
        (
            draggedPanelId: string,
            draggedPanelX: number,
            draggedPanelY: number,
            draggedPanelWidth: number,
            draggedPanelHeight: number
        ) => {
            calculateGuidelines(
                draggedPanelId,
                draggedPanelX,
                draggedPanelY,
                draggedPanelWidth,
                draggedPanelHeight
            );
        },
        [calculateGuidelines]
    );

    const hideGuidelines = useCallback(() => {
        setGuidelines([]);
    }, []);

    return {
        guidelines,
        showGuidelines,
        hideGuidelines,
    };
};