import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, ResponsiveContainer } from "recharts"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

export function ChartLineDots() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4">
        <h3 className="font-bold text-foreground mb-1 text-lg">Learning Progress</h3>
        <p className="text-muted-foreground text-sm">January - June 2024</p>
      </div>
      
      <div className="flex-1 w-full h-full">
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
      </div>
      
      <div className="mt-4 flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium text-foreground">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4 text-primary" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total learning hours for the last 6 months
        </div>
      </div>
    </div>
  )
}
