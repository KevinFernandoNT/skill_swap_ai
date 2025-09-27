import React from 'react';

interface CompletedSessionsChartProps {
  data?: number[];
}

const CompletedSessionsChart: React.FC<CompletedSessionsChartProps> = ({ 
  data = [2, 4, 3, 6, 5, 8, 7, 9, 6, 8, 10, 12, 11, 13, 15] // Mock daily data for last 15 days
}) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue;

  // Generate SVG path for the line chart
  const generatePath = () => {
    const width = 200;
    const height = 60;
    const padding = 10;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="w-full h-16 bg-muted/20 rounded-lg p-2">
      <svg width="100%" height="100%" viewBox="0 0 200 60" className="overflow-visible">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Line chart */}
        <path
          d={generatePath()}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * (180) + 10;
          const y = 50 - ((value - minValue) / range) * 30;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill="hsl(var(--primary))"
              className="hover:r-3 transition-all"
            />
          );
        })}
      </svg>
      
      {/* Chart info */}
      <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
        <span>Last 15 days</span>
        <span>Peak: {maxValue}</span>
      </div>
    </div>
  );
};

export default CompletedSessionsChart;
