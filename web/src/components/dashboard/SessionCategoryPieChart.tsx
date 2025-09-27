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
  showDetails?: boolean;
}

const sessionData = [
  { name: "programming", value: 25, fill: "#10B981" },
  { name: "business", value: 25, fill: "#374151" },
  { name: "design", value: 25, fill: "#6B7280" },
  { name: "marketing", value: 25, fill: "#059669" },
]

const chartConfig = {
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
  data = sessionData,
  showDetails = false
}) => {
  const id = "session-categories-pie"
  const [activeCategory, setActiveCategory] = React.useState(data[0].name)
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const activeIndex = React.useMemo(
    () => data.findIndex((item) => item.name === activeCategory),
    [activeCategory, data]
  )
  const categories = React.useMemo(() => data.map((item) => item.name), [data])

  return (
    <Card data-chart={id} className="flex flex-col bg-card max-h-[850px] rounded-lg border border-border">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle className="text-lg font-bold text-white">Session Categories</CardTitle>
          <CardDescription className="text-sm text-gray-400">January - June 2024</CardDescription>
        </div>
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
                        backgroundColor: `var(--color-${key})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
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
              data={data}
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
                          {total}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-white text-sm"
                        >
                          Completed
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      
      {/* Bottom information - matching the image */}
      <div className="px-6 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-bold text-white">Trending up by 5.2% this month</span>
          <IconTrendingUp className="h-4 w-4 text-white" />
        </div>
        <p className="text-xs text-gray-400">Showing total sessions for the last 6 months</p>
      </div>
      
      {/* Detailed category breakdown */}
      {showDetails && (
        <div className="px-6 pb-6 border-t border-border/50">
          <h4 className="text-sm font-semibold text-white mb-4">Category Breakdown</h4>
          <div className="space-y-3">
            {data.map((category, index) => {
              const config = chartConfig[category.name as keyof typeof chartConfig];
              const sessionCount = Math.round((category.value / 100) * 48); // Assuming 48 total sessions
              
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.fill }}
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{config?.label}</p>
                      <p className="text-xs text-gray-400">{sessionCount} sessions completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{category.value}%</p>
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
              <span className="text-sm font-bold text-white">48</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-white">Completion Rate</span>
              <span className="text-sm font-bold text-green-400">92%</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default SessionCategoryPieChart;
