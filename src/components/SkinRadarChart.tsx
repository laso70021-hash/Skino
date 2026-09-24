import React from 'react';
import { RadarMetrics } from '../types';

interface SkinRadarChartProps {
  metrics?: RadarMetrics;
  size?: number;
}

export const SkinRadarChart: React.FC<SkinRadarChartProps> = ({
  metrics = {
    hydration: 78,
    sebum: 70,
    pores: 74,
    spots: 68,
    wrinkles: 86,
    texture: 75
  },
  size = 280
}) => {
  const axes = [
    { key: 'hydration' as keyof RadarMetrics, label: 'Hydration', value: metrics.hydration || 75 },
    { key: 'sebum' as keyof RadarMetrics, label: 'Sebum', value: metrics.sebum || 70 },
    { key: 'pores' as keyof RadarMetrics, label: 'Pores', value: metrics.pores || 72 },
    { key: 'spots' as keyof RadarMetrics, label: 'Spots', value: metrics.spots || 68 },
    { key: 'wrinkles' as keyof RadarMetrics, label: 'Wrinkles', value: metrics.wrinkles || 85 },
    { key: 'texture' as keyof RadarMetrics, label: 'Texture', value: metrics.texture || 76 }
  ];

  const center = size / 2;
  const radius = size * 0.38;
  const totalAxes = axes.length;
  const angleStep = (2 * Math.PI) / totalAxes;

  // Compute point coordinates for polygon
  const points = axes.map((axis, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (axis.value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  // Compute label coordinates
  const labelPositions = axes.map((axis, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = radius + 24;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { ...axis, x, y };
  });

  const getStatusLabel = (val: number) => {
    if (val >= 85) return { label: 'Excellent', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val >= 70) return { label: 'Good', color: 'text-teal-700 bg-teal-50 border-teal-200' };
    if (val >= 55) return { label: 'Moderate', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Needs Attention', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="overflow-visible">
          {/* Concentric rings */}
          {[0.25, 0.5, 0.75, 1.0].map((level, idx) => (
            <polygon
              key={idx}
              points={Array.from({ length: totalAxes }).map((_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const r = radius * level;
                const x = center + r * Math.cos(angle);
                const y = center + r * Math.sin(angle);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              }).join(' ')}
              fill="none"
              stroke="#e7e5e4"
              strokeWidth="1"
              strokeDasharray={level === 1.0 ? 'none' : '3 3'}
            />
          ))}

          {/* Spokes */}
          {Array.from({ length: totalAxes }).map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#e7e5e4"
                strokeWidth="1"
              />
            );
          })}

          {/* Shaded Area Polygon */}
          <polygon
            points={points}
            fill="#0d9488"
            fillOpacity="0.25"
            stroke="#0d9488"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Dots on vertex */}
          {axes.map((axis, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const r = (axis.value / 100) * radius;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4.5"
                fill="#0f766e"
                stroke="#ffffff"
                strokeWidth="2"
              />
            );
          })}

          {/* Axis Labels */}
          {labelPositions.map((item, i) => (
            <text
              key={i}
              x={item.x}
              y={item.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[11px] font-bold fill-stone-700"
            >
              {item.label}
            </text>
          ))}
        </svg>
      </div>

      {/* Numerical and qualitative breakdown grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full pt-2">
        {axes.map((item) => {
          const status = getStatusLabel(item.value);
          return (
            <div
              key={item.key}
              className="p-2.5 rounded-xl bg-[#faf8f5] border border-stone-200/80 flex items-center justify-between text-xs"
            >
              <div>
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">
                  {item.label}
                </span>
                <span className="font-bold text-stone-900 font-mono text-sm">{item.value}</span>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${status.color}`}>
                {status.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
