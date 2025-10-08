import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, ResponsiveContainer } from "recharts"

// Default empty data when no API data is available
const defaultChartData = []

interface ChartLineDotsProps {
  learningProgress?: Array<{
    name: string;
    hours: number;
  }>;
}

export function ChartLineDots({ learningProgress }: ChartLineDotsProps) {
  // Transform API data to chart format if available
  const chartData = learningProgress && learningProgress.length > 0 
    ? learningProgress.map(item => ({
        month: item.name,
        desktop: item.hours,
        mobile: 0 // Not used in this chart
      }))
    : defaultChartData;
  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4">
        <h3 className="font-bold text-foreground mb-1 text-lg">Learning Progress</h3>
        <p className="text-muted-foreground text-sm">January - June 2024</p>
      </div>
      
      <div className="flex-1 w-full h-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />
              <Line
                dataKey="desktop"
                type="natural"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{
                  fill: "var(--primary)",
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  stroke: "var(--primary)",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">No learning data</p>
            <p className="text-xs text-muted-foreground">Complete sessions to see progress</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium text-foreground">
          {chartData.length > 0 ? (
            <>
              Learning progress over time <TrendingUp className="h-4 w-4 text-primary" />
            </>
          ) : (
            'No learning data available'
          )}
        </div>
        <div className="text-muted-foreground leading-none">
          {chartData.length > 0 
            ? 'Showing learning hours from your sessions' 
            : 'Complete sessions to see your learning progress'
          }
        </div>
      </div>
    </div>
  )
}
