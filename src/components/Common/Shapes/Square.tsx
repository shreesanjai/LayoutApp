import { ShapeProps } from "../../../tyeps";
import { getStrokeStyle } from "../../../utils/strokeStyleUtil";

const Square = ({
  width = 100,
  height = 100,
  fill = '',
  stroke = '#5b21b6',
  strokeWidth = 1,
  borderRadius = 0,
  className = '',
  strokeStyle = 'solid',  // Add strokeStyle here
}: ShapeProps) => {

  const rx = Math.min(borderRadius, Math.min(width, height) / 2);


  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background rectangle */}
      <rect
        width={width}
        height={height}
        rx={rx}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={getStrokeStyle(strokeStyle, strokeWidth)}
        strokeLinecap={strokeStyle == "dotted" ? 'round' : 'square'}  // Apply stroke style

      />
    </svg>
  );
};

export default Square;
