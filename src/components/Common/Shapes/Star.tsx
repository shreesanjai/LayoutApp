import { ShapeProps } from "../../../tyeps";

const Star = ({
  width = 100,
  height = 100,
  fill = '',
  stroke = '#92400e',
  strokeWidth = 1,
  points = 5,
  className = '',
}: ShapeProps & { points?: number }) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = Math.min(width, height) / 2;
  const innerRadius = outerRadius * 0.4;
  
  const getStarPoints = () => {
    const angleStep = Math.PI / points;
    let pointsString = '';
    
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
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
      />
    </svg>
  );
};

export default Star;