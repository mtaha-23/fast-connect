"use client"

import { useEffect, useMemo, useState } from "react"
import { format, formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Loader2,
  RefreshCw,
  Users,
  FileText,
  Download,
  ClipboardList,
  Activity,
  Search,
  UserMinus,
  UserCheck,
  UserX,
  FilePlus,
  FilePenLine,
  FileX,
  ClipboardCheck,
  CircleDot,
  Shield,
  type LucideIcon,
} from "lucide-react"
import { collection, getCountFromServer, getDocs, limit, orderBy, query, type Timestamp } from "firebase/firestore"
import { getFirestoreDB } from "@/lib/firebase"
import { cn } from "@/lib/utils"

type UserRow = {
  uid: string
  name?: string
  email?: string
  role?: string
  photoURL?: string | null
  createdAt?: string
  disabled?: boolean
}

type AnalyticsEventRow = {
  id: string
  type: string
  actorEmail?: string
  actorUid?: string
  targetUid?: string
  targetId?: string
  meta?: Record<string, unknown>
  createdAt?: Timestamp
}

function humanizeEventType(type: string) {
  switch (type) {
    case "user.deactivated":
      return "User deactivated"
    case "user.reactivated":
      return "User reactivated"
    case "user.deleted":
      return "User deleted"
    case "user.role_changed":
      return "User role changed"
    case "resource.created":
      return "Resource created"
    case "resource.updated":
      return "Resource updated"
    case "resource.deleted":
      return "Resource deleted"
    case "resource.downloaded":
      return "Resource downloaded"
    case "test.submitted":
      return "Test submitted"
    default:
      return type.replace(/\./g, " · ")
  }
}

type EventVisual = {
  label: string
  badgeClass: string
  iconWrapClass: string
  iconClass: string
  rowTintClass: string
  Icon: LucideIcon
}

function getEventVisual(type: string): EventVisual {
  const baseIcon = "h-4 w-4 shrink-0"
  switch (type) {
    case "user.deactivated":
      return {
        label: "User deactivated",
        badgeClass:
          "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/35",
        iconWrapClass: "border-amber-500/30 bg-amber-500/10",
        iconClass: cn(baseIcon, "text-amber-600 dark:text-amber-400"),
        rowTintClass: "border-l-amber-500",
        Icon: UserMinus,
      }
    case "user.reactivated":
      return {
        label: "User reactivated",
        badgeClass:
          "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/35",
        iconWrapClass: "border-emerald-500/30 bg-emerald-500/10",
        iconClass: cn(baseIcon, "text-emerald-600 dark:text-emerald-400"),
        rowTintClass: "border-l-emerald-500",
        Icon: UserCheck,
      }
    case "user.deleted":
      return {
        label: "User deleted",
        badgeClass: "bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/35",
        iconWrapClass: "border-rose-500/30 bg-rose-500/10",
        iconClass: cn(baseIcon, "text-rose-600 dark:text-rose-400"),
        rowTintClass: "border-l-rose-500",
        Icon: UserX,
      }
    case "user.role_changed":
      return {
        label: "Role changed",
        badgeClass:
          "bg-teal-500/15 text-teal-800 dark:text-teal-300 border-teal-500/35",
        iconWrapClass: "border-teal-500/30 bg-teal-500/10",
        iconClass: cn(baseIcon, "text-teal-600 dark:text-teal-400"),
        rowTintClass: "border-l-teal-500",
        Icon: Shield,
      }
    case "resource.created":
      return {
        label: "Resource created",
        badgeClass: "bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/35",
        iconWrapClass: "border-sky-500/30 bg-sky-500/10",
        iconClass: cn(baseIcon, "text-sky-600 dark:text-sky-400"),
        rowTintClass: "border-l-sky-500",
        Icon: FilePlus,
      }
    case "resource.updated":
      return {
        label: "Resource updated",
        badgeClass:
          "bg-violet-500/15 text-violet-800 dark:text-violet-300 border-violet-500/35",
        iconWrapClass: "border-violet-500/30 bg-violet-500/10",
        iconClass: cn(baseIcon, "text-violet-600 dark:text-violet-400"),
        rowTintClass: "border-l-violet-500",
        Icon: FilePenLine,
      }
    case "resource.deleted":
      return {
        label: "Resource deleted",
        badgeClass: "bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/35",
        iconWrapClass: "border-rose-500/30 bg-rose-500/10",
        iconClass: cn(baseIcon, "text-rose-600 dark:text-rose-400"),
        rowTintClass: "border-l-rose-500",
        Icon: FileX,
      }
    case "resource.downloaded":
      return {
        label: "Resource downloaded",
        badgeClass:
          "bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-500/35",
        iconWrapClass: "border-cyan-500/30 bg-cyan-500/10",
        iconClass: cn(baseIcon, "text-cyan-600 dark:text-cyan-400"),
        rowTintClass: "border-l-cyan-500",
        Icon: Download,
      }
    case "test.submitted":
      return {
        label: "Test submitted",
        badgeClass:
          "bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 border-indigo-500/35",
        iconWrapClass: "border-indigo-500/30 bg-indigo-500/10",
        iconClass: cn(baseIcon, "text-indigo-600 dark:text-indigo-400"),
        rowTintClass: "border-l-indigo-500",
        Icon: ClipboardCheck,
      }
    default:
      return {
        label: humanizeEventType(type),
        badgeClass: "bg-muted text-muted-foreground border-border",
        iconWrapClass: "border-border bg-muted/50",
        iconClass: cn(baseIcon, "text-muted-foreground"),
        rowTintClass: "border-l-zinc-400 dark:border-l-zinc-500",
        Icon: CircleDot,
      }
  }
}

type LogCategoryKey = "users" | "resources" | "tests" | "other"

function getLogCategoryKey(type: string): LogCategoryKey {
  if (type.startsWith("user.")) return "users"
  if (type.startsWith("resource.")) return "resources"
  if (type.startsWith("test.")) return "tests"
  return "other"
}

function getLogCategoryStyle(key: LogCategoryKey) {
  switch (key) {
    case "users":
      return {
        label: "Users",
        pillClass:
          "border-amber-500/40 bg-amber-500/15 text-amber-900 dark:text-amber-100",
        rowBgClass: "bg-amber-500/[0.04] dark:bg-amber-950/25",
      }
    case "resources":
      return {
        label: "Resources",
        pillClass:
          "border-sky-500/40 bg-sky-500/15 text-sky-900 dark:text-sky-100",
        rowBgClass: "bg-sky-500/[0.05] dark:bg-sky-950/30",
      }
    case "tests":
      return {
        label: "Tests",
        pillClass:
          "border-indigo-500/40 bg-indigo-500/15 text-indigo-900 dark:text-indigo-100",
        rowBgClass: "bg-indigo-500/[0.05] dark:bg-indigo-950/30",
      }
    default:
      return {
        label: "Other",
        pillClass:
          "border-border bg-muted text-muted-foreground",
        rowBgClass: "bg-muted/25",
      }
  }
}

const LOG_CATEGORY_LEGEND: { key: LogCategoryKey; hint: string }[] = [
  { key: "users", hint: "Account changes" },
  { key: "resources", hint: "Library & files" },
  { key: "tests", hint: "Practice tests" },
  { key: "other", hint: "Misc" },
]

function getString(meta: Record<string, unknown> | undefined, key: string) {
  const v = meta?.[key]
  return typeof v === "string" ? v : null
}

function getNumber(meta: Record<string, unknown> | undefined, key: string) {
  const v = meta?.[key]
  return typeof v === "number" ? v : null
}

function describeTarget(ev: AnalyticsEventRow) {
  const email = getString(ev.meta, "email")
  const name = getString(ev.meta, "name")
  const title = getString(ev.meta, "title")

  if (title) return `Resource: ${title}`
  if (email && name) return `User: ${name} (${email})`
  if (email) return `User: ${email}`
  if (name) return `User: ${name}`

  // Fallbacks for older events without meta
  if (ev.targetUid) return `User: ${ev.targetUid}`
  if (ev.targetId) return `Target: ${ev.targetId}`
  return null
}

function describeDetails(ev: AnalyticsEventRow) {
  if (ev.type === "user.role_changed") {
    const prev = getString(ev.meta, "previousRole")
    const next = getString(ev.meta, "newRole")
    if (prev && next) return `Role: ${prev} → ${next}`
  }

  if (ev.type === "test.submitted") {
    const score = getNumber(ev.meta, "score")
    const correct = getNumber(ev.meta, "correct")
    const total = getNumber(ev.meta, "totalQuestions")
    if (score !== null && correct !== null && total !== null) return `Score: ${score}% (${correct} of ${total} correct)`
    if (score !== null) return `Score: ${score}%`
  }

  const fileName = getString(ev.meta, "fileName")
  if (ev.type === "resource.downloaded" && fileName) return `File: ${fileName}`

  return null
}

function formatActivityTime(ts: Timestamp | undefined) {
  if (!ts?.toDate) {
    return { relative: "Unknown time", full: "" }
  }
  const d = ts.toDate()
  return {
    relative: formatDistanceToNow(d, { addSuffix: true }),
    full: format(d, "PPpp"),
  }
}

function subjectUser(ev: AnalyticsEventRow): string {
  const name = getString(ev.meta, "name")
  const email = getString(ev.meta, "email")
  if (name && email) return `${name} (${email})`
  if (email) return email
  if (name) return name
  if (ev.targetUid) return `user ${ev.targetUid.slice(0, 10)}…`
  return "a user"
}

function subjectResource(ev: AnalyticsEventRow): string {
  const title = getString(ev.meta, "title")
  if (title) return `"${title}"`
  if (ev.targetId) return `resource ${ev.targetId.slice(0, 14)}…`
  return "a resource"
}

function buildHumanSummary(ev: AnalyticsEventRow): string {
  const actor = ev.actorEmail ?? "System"
  switch (ev.type) {
    case "user.deactivated":
      return `${actor} deactivated ${subjectUser(ev)}.`
    case "user.reactivated":
      return `${actor} reactivated ${subjectUser(ev)}.`
    case "user.deleted":
      return `${actor} deleted ${subjectUser(ev)}.`
    case "user.role_changed": {
      const prev = getString(ev.meta, "previousRole")
      const next = getString(ev.meta, "newRole")
      return `${actor} changed ${subjectUser(ev)} from ${prev ?? "unknown"} to ${next ?? "unknown"}.`
    }
    case "resource.created":
      return `${actor} created ${subjectResource(ev)}.`
    case "resource.updated":
      return `${actor} updated ${subjectResource(ev)}.`
    case "resource.deleted":
      return `${actor} deleted ${subjectResource(ev)}.`
    case "resource.downloaded":
      return `${actor} downloaded ${subjectResource(ev)}.`
    case "test.submitted": {
      const score = getNumber(ev.meta, "score")
      const correct = getNumber(ev.meta, "correct")
      const total = getNumber(ev.meta, "totalQuestions")
      const parts: string[] = []
      if (score !== null) parts.push(`${score}%`)
      if (correct !== null && total !== null) parts.push(`${correct} of ${total} correct`)
      const extra = parts.length ? ` — ${parts.join(", ")}` : ""
      return `${actor} submitted a practice test${extra}.`
    }
    default: {
      const extra = describeTarget(ev) || describeDetails(ev) || ""
      return extra
        ? `${humanizeEventType(ev.type)}: ${extra}`
        : humanizeEventType(ev.type)
    }
  }
}

function buildSearchBlob(ev: AnalyticsEventRow): string {
  const cat = getLogCategoryStyle(getLogCategoryKey(ev.type))
  return [
    ev.type,
    humanizeEventType(ev.type),
    cat.label,
    LOG_CATEGORY_LEGEND.find((x) => x.key === getLogCategoryKey(ev.type))?.hint,
    ev.actorEmail,
    ev.actorUid,
    ev.targetUid,
    ev.targetId,
    describeTarget(ev),
    describeDetails(ev),
    buildHumanSummary(ev),
    ev.meta ? JSON.stringify(ev.meta) : "",
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [totalUsers, setTotalUsers] = useState(0)
  const [totalResources, setTotalResources] = useState(0)
  const [totalDownloads, setTotalDownloads] = useState(0)
  const [totalTestsTaken, setTotalTestsTaken] = useState(0)

  const [recentUsers, setRecentUsers] = useState<UserRow[]>([])
  const [events, setEvents] = useState<AnalyticsEventRow[]>([])
  const [logSearch, setLogSearch] = useState("")

  const fetchAll = async () => {
    setLoading(true)
    setError(null)
    try {
      const db = getFirestoreDB()

      const [usersCountSnap, resourcesCountSnap, testsCountSnap] = await Promise.all([
        getCountFromServer(collection(db, "users")),
        getCountFromServer(collection(db, "resources")),
        getCountFromServer(collection(db, "testAttempts")),
      ])

      setTotalUsers(usersCountSnap.data().count)
      setTotalResources(resourcesCountSnap.data().count)
      setTotalTestsTaken(testsCountSnap.data().count)

      // Total downloads (sum of resources.downloads). Firestore doesn't provide server-side SUM without Admin/aggregation,
      // so we sum client-side over the first 500 docs (adjust if needed).
      const resourcesSnap = await getDocs(query(collection(db, "resources"), orderBy("createdAt", "desc"), limit(500)))
      const downloadsSum = resourcesSnap.docs.reduce((acc, d) => {
        const v = d.data()?.downloads
        return acc + (typeof v === "number" ? v : 0)
      }, 0)
      setTotalDownloads(downloadsSum)

      const recentUsersSnap = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc"), limit(8)))
      setRecentUsers(
        recentUsersSnap.docs.map((d) => ({ uid: d.id, ...(d.data() as any) })) as unknown as UserRow[],
      )

      const eventsSnap = await getDocs(query(collection(db, "analyticsEvents"), orderBy("createdAt", "desc"), limit(100)))
      setEvents(
        eventsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as unknown as AnalyticsEventRow[],
      )
    } catch (e) {
      console.error("Analytics fetch failed:", e)
      setError(e instanceof Error ? e.message : "Failed to load analytics.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const statCards = useMemo(
    () => [
      { label: "Registered Users", value: totalUsers.toLocaleString(), icon: Users },
      { label: "Uploaded Resources", value: totalResources.toLocaleString(), icon: FileText },
      { label: "Total Downloads", value: totalDownloads.toLocaleString(), icon: Download },
      { label: "Tests Taken", value: totalTestsTaken.toLocaleString(), icon: ClipboardList },
    ],
    [totalDownloads, totalResources, totalTestsTaken, totalUsers],
  )

  const filteredEvents = useMemo(() => {
    const q = logSearch.trim().toLowerCase()
    if (!q) return events
    return events.filter((ev) => buildSearchBlob(ev).includes(q))
  }, [events, logSearch])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between h-16 px-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Platform stats and recent activity</p>
          </div>
          <Button variant="outline" className="bg-card border-border" onClick={fetchAll} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Refresh
          </Button>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive px-4 py-3">
            <div className="font-medium">Couldn’t load analytics</div>
            <div className="text-sm opacity-90">{error}</div>
          </div>
        ) : null}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="bg-card/50 border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-3xl font-bold text-foreground">{loading ? "—" : s.value}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/15 text-primary border border-primary/20">
                  <s.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent registrations */}
          <div className="lg:col-span-1 bg-card/50 border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg text-foreground">Recent registrations</h3>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-10 text-muted-foreground">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Loading...
              </div>
            ) : recentUsers.length === 0 ? (
              <div className="text-sm text-muted-foreground">No users found.</div>
            ) : (
              <div className="space-y-3">
                {recentUsers.map((u) => {
                  const initials =
                    (u.name || "User")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "US"
                  return (
                    <div key={u.uid} className="flex items-center justify-between p-3 bg-card/50 rounded-xl">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="border border-border">
                          <AvatarImage src={u.photoURL || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{u.name || "Unnamed user"}</p>
                          <p className="text-sm text-muted-foreground truncate">{u.email || "—"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary/15 text-primary border-primary/30">{u.role || "student"}</Badge>
                        {u.disabled ? (
                          <Badge className="bg-destructive/15 text-destructive border-destructive/30">deactivated</Badge>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Activity log */}
          <div className="lg:col-span-2 bg-card/50 border border-border rounded-2xl p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-5">
              <div className="flex items-center gap-2 flex-wrap">
                <Activity className="w-5 h-5 text-primary shrink-0" />
                <h3 className="font-semibold text-lg text-foreground">Activity log</h3>
                <Badge className="bg-muted text-muted-foreground border-border">latest 100</Badge>
              </div>
              <div className="w-full sm:max-w-xs space-y-1.5">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    type="search"
                    placeholder="Search actions, emails, resources…"
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    className="pl-9 h-9 bg-background/80"
                    aria-label="Search activity log"
                  />
                </div>
                {!loading && events.length > 0 ? (
                  <p className="text-[11px] text-muted-foreground text-right sm:text-left">
                    Showing {filteredEvents.length} of {events.length}
                    {logSearch.trim() ? " (filtered)" : ""}
                  </p>
                ) : null}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-10 text-muted-foreground">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Loading...
              </div>
            ) : events.length === 0 ? (
              <div className="text-sm text-muted-foreground">No events yet.</div>
            ) : filteredEvents.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
                No logs match &ldquo;{logSearch.trim()}&rdquo;. Try a different search.
              </div>
            ) : (
              <div
                role="region"
                aria-label="Activity log entries"
                className={cn(
                  "max-h-[min(52vh,420px)] overflow-y-auto overflow-x-hidden rounded-xl border border-border/80 bg-muted/10 p-2 pr-1.5",
                  "space-y-2.5",
                  "[scrollbar-width:thin]",
                  "[&::-webkit-scrollbar]:w-2",
                  "[&::-webkit-scrollbar-thumb]:rounded-full",
                  "[&::-webkit-scrollbar-thumb]:bg-border",
                  "[&::-webkit-scrollbar-track]:bg-transparent",
                )}
              >
                {filteredEvents.map((ev) => {
                  const visual = getEventVisual(ev.type)
                  const cat = getLogCategoryStyle(getLogCategoryKey(ev.type))
                  const { relative, full } = formatActivityTime(ev.createdAt)
                  const summary = buildHumanSummary(ev)
                  const detailsLine = describeDetails(ev)
                  const Icon = visual.Icon
                  return (
                    <div
                      key={ev.id}
                      className={cn(
                        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between rounded-xl border border-border/90 p-3 border-l-4 shadow-sm",
                        visual.rowTintClass,
                        cat.rowBgClass,
                      )}
                    >
                      <div className="flex gap-3 min-w-0 flex-1">
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
                            visual.iconWrapClass,
                          )}
                        >
                          <Icon className={visual.iconClass} aria-hidden />
                        </div>
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide shrink-0",
                                cat.pillClass,
                              )}
                            >
                              {cat.label}
                            </span>
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold w-fit shrink-0",
                                visual.badgeClass,
                              )}
                            >
                              {visual.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {ev.actorEmail ? (
                                <>By {ev.actorEmail}</>
                              ) : (
                                <span className="italic">System / automated</span>
                              )}
                            </span>
                          </div>
                          <p className="text-sm text-foreground leading-snug">{summary}</p>
                          {detailsLine ? (
                            <p className="text-xs text-muted-foreground">{detailsLine}</p>
                          ) : null}
                        </div>
                      </div>
                      <div className="shrink-0 text-left sm:text-right sm:pl-2 border-t border-border/60 pt-2 sm:border-t-0 sm:pt-0 sm:max-w-[11rem]">
                        <time
                          className="text-xs font-medium text-foreground tabular-nums block"
                          dateTime={ev.createdAt?.toDate?.()?.toISOString()}
                          title={full || undefined}
                        >
                          {relative}
                        </time>
                        {full ? (
                          <span className="text-[10px] text-muted-foreground mt-1 block leading-tight break-words">
                            {full}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

