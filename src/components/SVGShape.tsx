import React, { useMemo } from "react";
import { PanelShape } from "../types/canvas";

type shadowDirection = "right" | "left" | "top" | "bottom" | "common" | "none";

interface SVGShapeProps {
  shape: PanelShape;
  width: number;
  height: number;
  backgroundColor: string;
  strokeColor: string;
  strokeWidth?: number;
  rotation?: number;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  borderRadius?: number;
  ShadowDirection?: shadowDirection;
}

const SVGShape: React.FC<SVGShapeProps> = ({
  shape,
  width,
  height,
  backgroundColor,
  strokeColor,
  strokeWidth = 0,
  rotation = 0,
  backgroundImage,
  backgroundSize = "contain",
  backgroundPosition = "center",
  backgroundRepeat = "no-repeat",
  borderRadius = 0,
  ShadowDirection = "none",
}) => {
  const needsScaling = !["circle", "star"].includes(shape);

  const calculateScaleFactor = (
    angle: number,
    w: number,
    h: number
  ): number => {
    if (!needsScaling || angle === 0) return 1;
    const radians = (angle * Math.PI) / 180;
    const cos = Math.abs(Math.cos(radians));
    const sin = Math.abs(Math.sin(radians));
    const rotatedWidth = w * cos + h * sin;
    const rotatedHeight = w * sin + h * cos;
    return Math.min(w / rotatedWidth, h / rotatedHeight, 1);
  };

  const scaleFactor = calculateScaleFactor(rotation, width, height);
  const scaledWidth = width * scaleFactor;
  const scaledHeight = height * scaleFactor;

  const patternId = useMemo(
    () => `pattern-${Math.random().toString(36).substring(2, 8)}`,
    []
  );
  const clipId = `clip-${patternId}`;
  const gradientId = useMemo(
    () => `gradient-${Math.random().toString(36).substring(2, 8)}`,
    []
  );
  const filterId = useMemo(
    () => `shadow-${Math.random().toString(36).substring(2, 8)}`,
    []
  );

  const isGradient = backgroundColor.startsWith("linear-gradient");

  const getFill = () => {
    if (backgroundImage && !isGradient) return `url(#${patternId})`;
    if (isGradient) return `url(#${gradientId})`;
    return backgroundColor;
  };

  const renderShadowFilterFromDirection = () => {
    const blur = 3;
    const color = "rgba(0,0,0,0.3)";
    let dx = 0;
    let dy = 0;

    switch (ShadowDirection) {
      case "right":
        dx = 8;
        break;
      case "left":
        dx = -8;
        break;
      case "top":
        dy = -8;
        break;
      case "bottom":
        dy = 8;
        break;
      case "common":
        dx = 8;
        dy = 8;
        break;
      case "none":
      default:
        return null;
    }

    return (
      <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx={dx} dy={dy} stdDeviation={blur} floodColor={color} />
      </filter>
    );
  };

  const renderGradient = () => {
    if (!isGradient) return null;
    const match = backgroundColor.match(/linear-gradient\((.+)\)/);
    if (!match) return null;

    const parts = match[1].split(",");
    const angle = parts[0].trim().replace("deg", "");
    const colorStops = parts.slice(1).map((s) => s.trim());
    const angleDeg = parseFloat(angle);

    const x1 = 50 + 50 * Math.cos((angleDeg - 90) * (Math.PI / 180));
    const y1 = 50 + 50 * Math.sin((angleDeg - 90) * (Math.PI / 180));
    const x2 = 50 - 50 * Math.cos((angleDeg - 90) * (Math.PI / 180));
    const y2 = 50 - 50 * Math.sin((angleDeg - 90) * (Math.PI / 180));

    return (
      <linearGradient
        id={gradientId}
        x1={`${x1}%`}
        y1={`${y1}%`}
        x2={`${x2}%`}
        y2={`${y2}%`}
      >
        {colorStops.map((stop, idx) => (
          <stop
            key={idx}
            offset={`${(idx / (colorStops.length - 1)) * 100}%`}
            stopColor={stop}
          />
        ))}
      </linearGradient>
    );
  };

  const renderPattern = () => {
    if (!backgroundImage || isGradient) return null;

    const preserveAspectRatio =
      backgroundSize === "cover"
        ? "xMidYMid slice"
        : backgroundSize === "contain"
          ? "xMidYMid meet"
          : "none";

    const [baseWidth, baseHeight] =
      backgroundSize === "auto" ? [100, 100] : [scaledWidth, scaledHeight];

    const [patternX, patternY] = (() => {
      switch (backgroundPosition) {
        case "top":
          return [0, 0];
        case "bottom":
          return [0, scaledHeight - baseHeight];
        case "left":
          return [0, (scaledHeight - baseHeight) / 2];
        case "right":
          return [scaledWidth - baseWidth, (scaledHeight - baseHeight) / 2];
        case "center":
        default:
          return [
            (scaledWidth - baseWidth) / 2,
            (scaledHeight - baseHeight) / 2,
          ];
      }
    })();

    let patternWidth = scaledWidth;
    let patternHeight = scaledHeight;
    let imageX = patternX;
    let imageY = patternY;

    switch (backgroundRepeat) {
      case "Repeat":
        patternWidth = baseWidth;
        patternHeight = baseHeight;
        imageX = 0;
        imageY = 0;
        break;
      case "Repeat-X":
        patternWidth = baseWidth;
        patternHeight = scaledHeight;
        imageX = 0;
        imageY = patternY;
        break;
      case "Repeat-Y":
        patternWidth = scaledWidth;
        patternHeight = baseHeight;
        imageX = patternX;
        imageY = 0;
        break;
      case "No-Repeat":
      default:
        patternWidth = scaledWidth;
        patternHeight = scaledHeight;
        break;
    }

    return (
      <defs>
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width={patternWidth}
          height={patternHeight}
        >
          <image
            href={backgroundImage}
            x={imageX}
            y={imageY}
            width={baseWidth}
            height={baseHeight}
            preserveAspectRatio={preserveAspectRatio}
          />
        </pattern>
        <clipPath id={clipId}>{renderShape()}</clipPath>
      </defs>
    );
  };

  const renderShape = () => {
    // Calculate stroke offset to center the stroke on the shape boundary
    const strokeOffset = strokeWidth / 2;

    switch (shape) {
      case "rectangle":
      case "square":
        return (
          <rect
            x={strokeOffset}
            y={strokeOffset}
            width={scaledWidth - strokeWidth}
            height={scaledHeight - strokeWidth}
            fill={getFill()}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            rx={borderRadius}
            ry={borderRadius}
          />
        );
      case "circle":
        const r = width / 2 - strokeOffset;
        return (
          <circle
            cx={width / 2}
            cy={height / 2}
            r={r}
            fill={getFill()}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );
      case "ellipse":
        return (
          <ellipse
            cx={scaledWidth / 2}
            cy={scaledHeight / 2}
            rx={(scaledWidth - strokeWidth) / 2}
            ry={(scaledHeight - strokeWidth) / 2}
            fill={getFill()}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );
      case "diamond":
        return (
          <polygon
            points={`${scaledWidth / 2},${strokeOffset} ${scaledWidth - strokeOffset
              },${scaledHeight / 2} ${scaledWidth / 2},${scaledHeight - strokeOffset
              } ${strokeOffset},${scaledHeight / 2}`}
            fill={getFill()}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );
      case "triangle":
        return (
          <polygon
            points={`${scaledWidth / 2},${strokeOffset} ${strokeOffset},${scaledHeight - strokeOffset
              } ${scaledWidth - strokeOffset},${scaledHeight - strokeOffset}`}
            fill={getFill()}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );
      case "star":
        const cx = width / 2;
        const cy = height / 2;
        const outerRadius = Math.min(width, height) / 2 - strokeOffset;
        const innerRadius = outerRadius * 0.4;
        const points = [];
        for (let i = 0; i < 10; i++) {
          const angle = (i * Math.PI) / 5 - Math.PI / 2;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          points.push([
            cx + radius * Math.cos(angle),
            cy + radius * Math.sin(angle),
          ]);
        }
        return (
          <polygon
            points={points.map((p) => p.join(",")).join(" ")}
            fill={getFill()}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );
      default:
        return null;
    }
  };

  return (
    <svg
      width={width}
      height={height}
      className="absolute inset-0"
      style={{ overflow: "hidden" }}
    >
      <defs>
        {renderPattern()}
        {renderGradient()}
        {renderShadowFilterFromDirection()}
      </defs>
      <g
        style={{
          transform: needsScaling
            ? `translate(${(width - scaledWidth) / 2}px, ${(height - scaledHeight) / 2
            }px) rotate(${rotation}deg)`
            : `rotate(${rotation}deg)`,
          transformOrigin: needsScaling
            ? `${scaledWidth / 2}px ${scaledHeight / 2}px`
            : `${width / 2}px ${height / 2}px`,
        }}
        filter={ShadowDirection !== "none" ? `url(#${filterId})` : undefined}
      >
        {backgroundImage ? (
          <g clipPath={`url(#${clipId})`}>{renderShape()}</g>
        ) : (
          renderShape()
        )}
      </g>
    </svg>
  );
};

export default SVGShape;
