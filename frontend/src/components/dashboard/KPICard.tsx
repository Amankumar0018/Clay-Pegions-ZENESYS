import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardProps {
  id: string;
  title: string;
  value: string;
  changePct: string;
  isPositive: boolean;
  comparisonText: string;
  sparklineData: { v: number }[];
  accentColor?: string;
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  id,
  title,
  value,
  changePct,
  isPositive,
  comparisonText,
  sparklineData,
  accentColor = '#C86D51',
  onClick,
}) => {
  const minVal = Math.min(...sparklineData.map((d) => d.v));
  const maxVal = Math.max(...sparklineData.map((d) => d.v));
  const range = maxVal - minVal || 1;

  // Generate SVG path for sparkline
  const width = 80;
  const height = 28;
  const points = sparklineData.map((d, index) => {
    const x = (index / (sparklineData.length - 1)) * width;
    const y = height - ((d.v - minVal) / range) * (height - 6) - 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;

  return (
    <div
      id={id}
      onClick={onClick}
      className={`group relative p-4 rounded-xl bg-white border border-[#EBE6DC] shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:border-[#DDD6CA] transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-medium text-[#7A756D] uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
            isPositive
              ? 'text-[#2D6649] bg-[#EDF5F0]'
              : 'text-[#9E3529] bg-[#FDF2F0]'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
          ) : (
            <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
          )}
          <span>{changePct}</span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-2xl font-bold tracking-tight text-[#232220] font-tabular-nums">
            {value}
          </div>
          <div className="text-[11px] text-[#8A8479] mt-0.5 font-normal">
            {comparisonText}
          </div>
        </div>

        {/* Sparkline Graphic */}
        <div className="w-20 h-7 flex-shrink-0">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
            aria-hidden="true"
          >
            <path
              d={pathD}
              fill="none"
              stroke={accentColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Last dot */}
            {points.length > 0 && (
              <circle
                cx={points[points.length - 1].split(',')[0]}
                cy={points[points.length - 1].split(',')[1]}
                r="3"
                fill={accentColor}
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};
