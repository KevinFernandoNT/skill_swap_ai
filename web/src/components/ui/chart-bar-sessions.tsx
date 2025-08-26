import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"

const chartData = [
  { skill: "React", sessions: 18, fill: "var(--primary)" },
  { skill: "JavaScript", sessions: 15, fill: "var(--primary)" },
  { skill: "Python", sessions: 12, fill: "var(--primary)" },
  { skill: "UI/UX Design", sessions: 9, fill: "var(--primary)" },
  { skill: "Node.js", sessions: 7, fill: "var(--primary)" },
  { skill: "Data Science", sessions: 5, fill: "var(--primary)" },
  { skill: "Machine Learning", sessions: 3, fill: "var(--primary)" },
]

export function ChartBarSessions() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Completed Sessions</h3>
      </div>
      
      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="horizontal"
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <XAxis 
              dataKey="sessions" 
              type="number" 
              hide 
            />
            <YAxis
              dataKey="skill"
              type="category"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            />
            <Bar 
              dataKey="sessions" 
              radius={[0, 4, 4, 0]}
              fill="var(--primary)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium text-foreground">
          Trending up by 8.2% this month <TrendingUp className="h-4 w-4 text-primary" />
        </div>
        <div className="text-muted-foreground leading-none">
          Strong completion rate across all skills
        </div>
      </div>
    </div>
  )
}
