"use client"

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { useTheme } from "next-themes"

const data = [
  { name: "Mon", score: 65, tests: 2 },
  { name: "Tue", score: 72, tests: 3 },
  { name: "Wed", score: 68, tests: 1 },
  { name: "Thu", score: 78, tests: 4 },
  { name: "Fri", score: 82, tests: 2 },
  { name: "Sat", score: 75, tests: 3 },
  { name: "Sun", score: 88, tests: 5 },
]

export function ActivityChart() {
  const { theme } = useTheme()
  // Use theme-aware colors - light blue for light mode, brighter blue for dark
  const primaryColor = theme === "dark" ? "#6366f1" : "#4A90E2"
  const borderColor = theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
  const textColor = theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"
  const popoverBg = theme === "dark" ? "#1a1a2e" : "#ffffff"
  const popoverBorder = theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
  const foregroundColor = theme === "dark" ? "#ffffff" : "#000000"

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg text-foreground">Performance Overview</h3>
          <p className="text-sm text-muted-foreground">Your test scores this week</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Score</span>
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={borderColor} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 12 }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: popoverBg,
                border: `1px solid ${popoverBorder}`,
                borderRadius: "12px",
              }}
              labelStyle={{ color: foregroundColor }}
              itemStyle={{ color: primaryColor }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke={primaryColor}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorScore)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
