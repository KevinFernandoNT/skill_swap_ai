"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
import { IconTrendingUp } from '@tabler/icons-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SessionCategoryPieChartProps {
  data?: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
  skillCategories?: Array<{
    _id: string;
    count: number;
  }>;
  showDetails?: boolean;
}

// Default empty data when no API data is available
const defaultData = []

// Default chart config for predefined categories
const defaultChartConfig = {
  programming: {
    label: "Programming",
    color: "#10B981",
  },
  business: {
    label: "Business", 
    color: "#374151",
  },
  design: {
    label: "Design",
    color: "#6B7280",
  },
  marketing: {
    label: "Marketing",
    color: "#059669",
  },
} satisfies ChartConfig

const SessionCategoryPieChart: React.FC<SessionCategoryPieChartProps> = ({ 
  data = defaultData,
  skillCategories,
  showDetails = false
}) => {
  const id = "session-categories-pie"
  
  // Transform API data to chart format if available
  const chartData = React.useMemo(() => {
    if (skillCategories && skillCategories.length > 0) {
      const colors = ["#10B981", "#374151", "#6B7280", "#059669", "#F59E0B", "#EF4444"];
      
      return skillCategories.map((category, index) => ({
        name: category._id.toLowerCase(),
        value: category.count, // Use actual count instead of percentage
        fill: colors[index % colors.length]
      }));
    }
    return data;
  }, [skillCategories, data]);

  // Create dynamic chart config based on actual API data
  const chartConfig = React.useMemo(() => {
    if (skillCategories && skillCategories.length > 0) {
      const colors = ["#10B981", "#374151", "#6B7280", "#059669", "#F59E0B", "#EF4444"];
      
      const dynamicConfig: ChartConfig = {};
      skillCategories.forEach((category, index) => {
        const key = category._id.toLowerCase();
        dynamicConfig[key] = {
          label: category._id.charAt(0).toUpperCase() + category._id.slice(1), // Capitalize first letter
          color: colors[index % colors.length]
        };
      });
      
      return dynamicConfig;
    }
    return defaultChartConfig;
  }, [skillCategories]);
  
  const [activeCategory, setActiveCategory] = React.useState(
    chartData.length > 0 ? chartData[0]?.name : 'programming'
  )
  
  // Update active category when chart data changes
  React.useEffect(() => {
    if (chartData.length > 0 && !chartData.find(item => item.name === activeCategory)) {
      setActiveCategory(chartData[0].name);
    }
  }, [chartData, activeCategory]);
  
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const activeIndex = React.useMemo(
    () => chartData.findIndex((item) => item.name === activeCategory),
    [activeCategory, chartData]
  )
  const categories = React.useMemo(() => chartData.map((item) => item.name), [chartData])

  return (
    <Card data-chart={id} className="flex flex-col bg-card max-h-[850px] rounded-lg border border-border">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle className="text-lg font-bold text-white">Session Categories</CardTitle>
          <CardDescription className="text-sm text-gray-400">January - June 2024</CardDescription>
        </div>
        {categories.length > 0 ? (
          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger
              className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
              aria-label="Select a category"
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl">
              {categories.map((key) => {
                const config = chartConfig[key as keyof typeof chartConfig]

                if (!config) {
                  return null
                }

                return (
                  <SelectItem
                    key={key}
                    value={key}
                    className="rounded-lg [&_span]:flex"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className="flex h-3 w-3 shrink-0 rounded-xs"
                        style={{
                          backgroundColor: config.color,
                        }}
                      />
                      {config?.label}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        ) : (
          <div className="ml-auto text-xs text-muted-foreground">
            No categories
          </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        {chartData.length > 0 ? (
          <ChartContainer
            id={id}
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
                activeIndex={activeIndex}
                activeShape={({
                  outerRadius = 0,
                  ...props
                }: PieSectorDataItem) => (
                  <g>
                    <Sector {...props} outerRadius={outerRadius + 10} />
                    <Sector
                      {...props}
                      outerRadius={outerRadius + 25}
                      innerRadius={outerRadius + 12}
                    />
                  </g>
                )}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-white text-2xl font-bold"
                          >
                            {total > 0 ? '100%' : '0%'}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-white text-sm"
                          >
                            {total > 0 ? 'Completed' : 'No Data'}
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">No session data</p>
            <p className="text-xs text-muted-foreground">Complete some sessions to see analytics</p>
          </div>
        )}
      </CardContent>
      
      {/* Bottom information - matching the image */}
      <div className="px-6 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-bold text-white">
            {total > 0 ? `Total: ${total} sessions` : 'No sessions found'}
          </span>
          {total > 0 && <IconTrendingUp className="h-4 w-4 text-white" />}
        </div>
        <p className="text-xs text-gray-400">
          {total > 0 ? 'Showing skill categories from your sessions' : 'Start creating sessions to see analytics'}
        </p>
      </div>
      
      {/* Detailed category breakdown */}
      {showDetails && (
        <div className="px-6 pb-6 border-t border-border/50">
          <h4 className="text-sm font-semibold text-white mb-4">Category Breakdown</h4>
          <div className="space-y-3">
            {chartData.map((category, index) => {
              const config = chartConfig[category.name as keyof typeof chartConfig];
              const percentage = total > 0 ? Math.round((category.value / total) * 100) : 0;
              
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: config?.color || category.fill }}
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{config?.label || category.name}</p>
                      <p className="text-xs text-gray-400">{category.value} sessions completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{percentage}%</p>
                    <p className="text-xs text-gray-400">of total</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Summary stats */}
          <div className="mt-4 p-3 bg-muted/10 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-white">Total Sessions</span>
              <span className="text-sm font-bold text-white">{total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-white">Categories</span>
              <span className="text-sm font-bold text-green-400">{chartData.length}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default SessionCategoryPieChart;
