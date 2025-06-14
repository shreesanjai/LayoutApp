import { ShapeProps } from "../../../tyeps";

const Circle = ({
  width = 100,
  height = 100,
  fill = '',
  stroke = '#7f1d1d',
  strokeWidth = 1,
  className = '',
}: ShapeProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx={width / 2}
        cy={height / 2}
        rx={(width - strokeWidth) / 2}
        ry={(height - strokeWidth) / 2}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default Circle;
