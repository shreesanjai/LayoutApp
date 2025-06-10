import { ShapeProps } from "../../../tyeps";

const Rectangle = ({
  width = 100,
  height = 60,
  fill = 'transparet',
  stroke = '#1e3a8a',
  strokeWidth = 1,
  borderRadius = 0,
  className = '',
}: ShapeProps) => {
  const rx = Math.min(borderRadius, width / 2, height / 2);
  
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width={width}
        height={height}
        rx={rx}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default Rectangle