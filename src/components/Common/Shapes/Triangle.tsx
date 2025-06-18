import { getStrokeStyle } from "../../../utils/strokeStyleUtil";

const Triangle = ({
  width = 100,
  height = 100,
  fill = '',
  stroke = '#1e3a8a',
  strokeWidth = 1,
  className = '',
  strokeStyle = ''
}) => {

  const pathD = `M ${width / 2} 0 L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d={pathD}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={getStrokeStyle(strokeStyle, strokeWidth)}
        strokeLinecap={strokeStyle == "dotted" ? 'round' : 'square'}
      />
    </svg>
  );
};

export default Triangle