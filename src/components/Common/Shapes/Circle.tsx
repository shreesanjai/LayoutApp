import { ShapeProps } from "../../../tyeps";

const Circle = ({
  width = 100,
  height = 100,
  fill = '',
  stroke = '#7f1d1d',
  strokeWidth = 1,
  className = '',
}: ShapeProps) => {
  const radius = Math.min(width, height) / 2;
  
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx={width / 2}
        cy={height / 2}
        r={radius - strokeWidth / 2}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default Circle;