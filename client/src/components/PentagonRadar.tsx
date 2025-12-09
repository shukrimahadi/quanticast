interface RadarDataPoint {
  label: string;
  value: number;
}

interface PentagonRadarProps {
  data: RadarDataPoint[];
  maxValue?: number;
  size?: number;
}

export default function PentagonRadar({ data, maxValue = 10, size = 300 }: PentagonRadarProps) {
  const center = size / 2;
  const radius = size * 0.35;
  const labelOffset = radius + 24;
  const numAxes = 5;
  const angleStep = (2 * Math.PI) / numAxes;
  const startAngle = -Math.PI / 2;

  const polarToCartesian = (value: number, axisIndex: number): { x: number; y: number } => {
    const angle = startAngle + axisIndex * angleStep;
    const normalizedValue = Math.min(value, maxValue) / maxValue;
    return {
      x: center + radius * normalizedValue * Math.cos(angle),
      y: center + radius * normalizedValue * Math.sin(angle),
    };
  };

  const getLabelPosition = (axisIndex: number): { x: number; y: number } => {
    const angle = startAngle + axisIndex * angleStep;
    return {
      x: center + labelOffset * Math.cos(angle),
      y: center + labelOffset * Math.sin(angle),
    };
  };

  const getTextAnchor = (axisIndex: number): "start" | "middle" | "end" => {
    const angle = startAngle + axisIndex * angleStep;
    const normalizedAngle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    
    if (normalizedAngle > Math.PI * 0.6 && normalizedAngle < Math.PI * 1.4) {
      return "end";
    }
    if (normalizedAngle < Math.PI * 0.4 || normalizedAngle > Math.PI * 1.6) {
      return "start";
    }
    return "middle";
  };

  const getAlignmentBaseline = (axisIndex: number): "hanging" | "middle" | "baseline" => {
    const angle = startAngle + axisIndex * angleStep;
    const normalizedAngle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    
    if (normalizedAngle > Math.PI * 1.3 && normalizedAngle < Math.PI * 1.7) {
      return "hanging";
    }
    if (normalizedAngle > Math.PI * 0.3 && normalizedAngle < Math.PI * 0.7) {
      return "baseline";
    }
    return "middle";
  };

  const generatePentagonPath = (scale: number): string => {
    const points: string[] = [];
    for (let i = 0; i < numAxes; i++) {
      const { x, y } = polarToCartesian(maxValue * scale, i);
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  };

  const generateDataPath = (): string => {
    if (data.length < numAxes) return "";
    const points: string[] = [];
    for (let i = 0; i < numAxes; i++) {
      const { x, y } = polarToCartesian(data[i]?.value || 0, i);
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  };

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full h-full"
      style={{ maxWidth: size, maxHeight: size }}
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--fin-accent))" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(var(--fin-bull))" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {gridLevels.map((level, i) => (
        <polygon
          key={`grid-${i}`}
          points={generatePentagonPath(level)}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={level === 1 ? 1.5 : 0.5}
          strokeOpacity={0.4 + level * 0.3}
          className="transition-opacity"
        />
      ))}

      {Array.from({ length: numAxes }).map((_, i) => {
        const { x, y } = polarToCartesian(maxValue, i);
        return (
          <line
            key={`axis-${i}`}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="hsl(var(--border))"
            strokeWidth={0.75}
            strokeOpacity={0.5}
          />
        );
      })}

      <polygon
        points={generateDataPath()}
        fill="url(#dataGradient)"
        fillOpacity={0.25}
        stroke="hsl(var(--fin-accent))"
        strokeWidth={2}
        strokeLinejoin="round"
        filter="url(#glow)"
        className="transition-all duration-300"
      />

      {data.slice(0, numAxes).map((point, i) => {
        const { x, y } = polarToCartesian(point.value, i);
        return (
          <circle
            key={`point-${i}`}
            cx={x}
            cy={y}
            r={4}
            fill="hsl(var(--fin-accent))"
            stroke="hsl(var(--background))"
            strokeWidth={2}
            className="transition-all duration-300"
          />
        );
      })}

      {data.slice(0, numAxes).map((point, i) => {
        const { x, y } = getLabelPosition(i);
        return (
          <text
            key={`label-${i}`}
            x={x}
            y={y}
            textAnchor={getTextAnchor(i)}
            dominantBaseline={getAlignmentBaseline(i)}
            className="fill-muted-foreground text-[10px] font-medium"
            style={{ fontFamily: 'var(--font-mono, monospace)' }}
          >
            {point.label}
          </text>
        );
      })}

      {data.slice(0, numAxes).map((point, i) => {
        const { x, y } = getLabelPosition(i);
        const valueY = getAlignmentBaseline(i) === "hanging" ? y + 12 : 
                       getAlignmentBaseline(i) === "baseline" ? y - 10 : y + 12;
        return (
          <text
            key={`value-${i}`}
            x={x}
            y={valueY}
            textAnchor={getTextAnchor(i)}
            dominantBaseline="middle"
            className="fill-foreground text-[11px] font-bold"
            style={{ fontFamily: 'var(--font-mono, monospace)' }}
          >
            {point.value.toFixed(1)}
          </text>
        );
      })}
    </svg>
  );
}
