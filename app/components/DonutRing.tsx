type Segment = {
  value: number;
  color: string;
};

interface DonutRingProps {
  segments: Segment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
  trackColor?: string;
}

// A simple multi-segment ring built from stacked stroke-dasharray circles.
export default function DonutRing({
  segments,
  size = 200,
  strokeWidth = 22,
  centerLabel,
  centerValue,
  trackColor = "#EFEDFA",
}: DonutRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  let offsetAccumulator = 0;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {segments.map((segment, i) => {
          const fraction = segment.value / total;
          const dash = fraction * circumference;
          const gap = circumference - dash;
          const rotation = -90 + (offsetAccumulator / total) * 360;
          offsetAccumulator += segment.value;

          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              strokeLinecap="round"
              transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
              style={{ transition: "stroke-dasharray 0.6s ease" }}
            />
          );
        })}
      </svg>
      {(centerLabel || centerValue) && (
        <div className="absolute flex flex-col items-center justify-center text-center">
          {centerLabel && (
            <span className="text-xs text-ink-400">{centerLabel}</span>
          )}
          {centerValue && (
            <span className="text-2xl font-bold text-ink-900">
              {centerValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
