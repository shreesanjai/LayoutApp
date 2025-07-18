import React from 'react';
import { Guideline } from '../hooks/useGridlines';

interface GuidelinesProps {
    guidelines: Guideline[];
    color?: string;
    opacity?: number;
    strokeWidth?: number;
}

export const Guidelines: React.FC<GuidelinesProps> = ({
    guidelines,
    color = 'rgba(255,0,0,0.4)',
    opacity = 1,
    strokeWidth = 2,
}) => {
    return (
        <>
            {guidelines.map((guideline, index) => (
                <div
                    key={`guideline-${index}`}
                    className="absolute pointer-events-none"
                    style={
                        guideline.type === "vertical"
                            ? {
                                left: guideline.position,
                                top: 0,
                                width: "1px",
                                height: "100%",
                                background: "transparent",
                                borderLeft: `${strokeWidth}px dashed ${color}`,
                                opacity: opacity,
                                zIndex: 9999,
                            }
                            : {
                                top: guideline.position,
                                left: 0,
                                width: "100%",
                                height: "1px",
                                background: "transparent",
                                borderTop: `${strokeWidth}px dashed ${color}`,
                                opacity: opacity,
                                zIndex: 9999,
                            }
                    }
                />
            ))}
        </>
    );
};

export default Guidelines;