import React from 'react';

interface GrowthRateChartProps {
  period: 'daily' | 'weekly' | 'monthly';
  chartData?: Array<{ name: string; value: number }>;
}

const GrowthRateChart: React.FC<GrowthRateChartProps> = ({ period, chartData = [] }) => {
  // Use real API data or empty array
  const data = chartData.length > 0 ? chartData : [];
  
  if (data.length === 0) {
    return (
      <div className="mt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Last 7 days</span>
          <span className="text-xs text-muted-foreground">No data</span>
        </div>
        <div className="w-full h-16 bg-muted/20 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">No growth data</div>
            <div className="text-xs text-muted-foreground">Complete sessions to see trends</div>
          </div>
        </div>
      </div>
    );
  }
  
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  // Generate SVG path for line chart
  const generatePath = () => {
    const width = 200;
    const height = 60;
    const padding = 10;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);

    const points = data.map((point, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = padding + ((maxValue - point.value) / range) * chartHeight;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">
          {period === 'daily' ? 'Last 7 days' : period === 'weekly' ? 'Last 4 weeks' : 'Last 6 months'}
        </span>
        <span className="text-xs font-medium text-green-600 dark:text-green-400">
          +{data[data.length - 1]?.value || 0}%
        </span>
      </div>
      
      <div className="relative">
        <svg width="200" height="60" viewBox="0 0 200 60" className="overflow-visible">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="15" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 15" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
            </pattern>
          </defs>
          <rect width="200" height="60" fill="url(#grid)" />
          
          {/* Line chart */}
          <path
            d={generatePath()}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-600 dark:text-green-400"
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = 10 + (index / (data.length - 1)) * 180;
            const y = 10 + ((maxValue - point.value) / range) * 40;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="currentColor"
                className="text-green-600 dark:text-green-400"
              />
            );
          })}
        </svg>
        
        {/* Trend indicator */}
        <div className="absolute top-1 right-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthRateChart;
