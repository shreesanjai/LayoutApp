import { ShapeProps } from "../../../tyeps";
import { getStrokeStyle } from "../../../utils/strokeStyleUtil";



const Diamond = ({
    width = 100,
    height = 100,
    fill = '',
    stroke = '#064e3b',
    strokeWidth = 1,
    className = '',
    strokeStyle = ''
}: ShapeProps) => {

 
    // Calculate points for diamond shape
    const points = [
        [width / 2, 0],                   // Top center
        [width, height / 2],              // Right middle
        [width / 2, height],              // Bottom center
        [0, height / 2],                 // Left middle
    ];

    // Convert to SVG points string
    const pointsString = points.map(point => point.join(',')).join(' ');

    return (
        <div className="relative w-full h-full">
            <svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                className={`${className} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
                strokeDasharray={getStrokeStyle(strokeStyle, strokeWidth)}
                strokeLinecap={strokeStyle == "dotted" ? 'round' : 'square'}
            >
                <polygon
                    points={pointsString}
                    fill={fill}
                    stroke={strokeStyle != 'none' ? stroke : ''}
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round" 
                />
            </svg>
        </div>
    );
};

export default Diamond