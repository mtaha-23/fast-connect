import { Bot, GraduationCap, FileText, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

const activities = [
  {
    icon: GraduationCap,
    title: "Completed Math Practice Test",
    description: "Scored 85% on Calculus Test #4",
    time: "2 hours ago",
    color: "bg-emerald-500",
  },
  {
    icon: Bot,
    title: "AI Chatbot Session",
    description: "Asked about CS program requirements",
    time: "4 hours ago",
    color: "bg-blue-500",
  },
  {
    icon: BarChart3,
    title: "Analytics Updated",
    description: "Admission probability increased to 78%",
    time: "Yesterday",
    color: "bg-pink-500",
  },
  {
    icon: FileText,
    title: "Downloaded Resource",
    description: "Past Papers - English 2023",
    time: "2 days ago",
    color: "bg-indigo-500",
  },
]

export function RecentActivity() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-semibold text-lg mb-6 text-foreground">Recent Activity</h3>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors">
            <div className={cn("p-2 rounded-lg shrink-0", activity.color)}>
              <activity.icon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground">{activity.title}</p>
              <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
