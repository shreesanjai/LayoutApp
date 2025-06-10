import { ShapeProps } from "../../../tyeps";

const Square = ({
  width = 100,
  height = 100,
  fill = '',
  stroke = '#5b21b6',
  strokeWidth = 1,
  borderRadius = 0,
  className = '',
  text = '', // New prop for text content
  textColor = 'white', // New prop for text color
  textSize = 16, // New prop for font size
}: ShapeProps & { 
  text?: string; 
  textColor?: string; 
  textSize?: number 
}) => {
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
      />
      
      {/* Text centered inside the SVG */}
      {text && (
        <text
          x="50%" // Center horizontally
          y="50%" // Center vertically
          dominantBaseline="middle" // Vertical alignment
          textAnchor="middle" // Horizontal alignment
          fill={textColor}
          fontSize={textSize}
          fontFamily="Arial, sans-serif" // Customize as needed
        >
          {text}
        </text>
      )}
    </svg>
  );
};

export default Square;