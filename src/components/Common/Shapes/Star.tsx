import { ShapeProps } from "../../../tyeps";
import { getStrokeStyle } from "../../../utils/strokeStyleUtil";

const Star = ({
  width = 100,
  height = 100,
  fill = '',
  stroke = '#92400e',
  strokeWidth = 1,
  points = 5,
  className = '',
  strokeStyle = ''
}: ShapeProps & { points?: number }) => {
  const centerX = width / 2;
  const centerY = height / 2;

  const outerRadiusX = width / 2;
  const outerRadiusY = height / 2;
  const innerRadiusX = outerRadiusX * 0.4;
  const innerRadiusY = outerRadiusY * 0.4;

  const getStarPoints = () => {
    const angleStep = Math.PI / points;
    let pointsString = '';

    for (let i = 0; i < points * 2; i++) {
      const isOuter = i % 2 === 0;
      const radiusX = isOuter ? outerRadiusX : innerRadiusX;
      const radiusY = isOuter ? outerRadiusY : innerRadiusY;

      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radiusX * Math.cos(angle);
      const y = centerY + radiusY * Math.sin(angle);
      pointsString += `${x},${y} `;
    }

    return pointsString.trim();
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points={getStarPoints()}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeDasharray={getStrokeStyle(strokeStyle, strokeWidth)}
        strokeLinecap={strokeStyle == "dotted" ? 'round' : 'square'}
      />
    </svg>
  );
};

export default Star;
