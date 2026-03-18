"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, RefreshCw, Users, FileText, Download, ClipboardList, Activity } from "lucide-react"
import { collection, getCountFromServer, getDocs, limit, orderBy, query, type Timestamp } from "firebase/firestore"
import { getFirestoreDB } from "@/lib/firebase"

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
      return type
  }
}

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
  if (ev.type === "test.submitted") {
    const score = getNumber(ev.meta, "score")
    const correct = getNumber(ev.meta, "correct")
    const total = getNumber(ev.meta, "totalQuestions")
    if (score !== null && correct !== null && total !== null) return `Score: ${score}% (${correct}/${total})`
    if (score !== null) return `Score: ${score}%`
  }

  const fileName = getString(ev.meta, "fileName")
  if (ev.type === "resource.downloaded" && fileName) return `File: ${fileName}`

  return null
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [totalUsers, setTotalUsers] = useState(0)
  const [totalResources, setTotalResources] = useState(0)
  const [totalDownloads, setTotalDownloads] = useState(0)
  const [totalTestsTaken, setTotalTestsTaken] = useState(0)

  const [recentUsers, setRecentUsers] = useState<UserRow[]>([])
  const [events, setEvents] = useState<AnalyticsEventRow[]>([])

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

      const eventsSnap = await getDocs(query(collection(db, "analyticsEvents"), orderBy("createdAt", "desc"), limit(25)))
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

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between h-16 px-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Analytics</h1>
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
            <div className="flex items-center gap-2 mb-5">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg text-foreground">Activity log</h3>
              <Badge className="bg-muted text-muted-foreground border-border">latest 25</Badge>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-10 text-muted-foreground">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Loading...
              </div>
            ) : events.length === 0 ? (
              <div className="text-sm text-muted-foreground">No events yet.</div>
            ) : (
              <div className="space-y-3">
                {events.map((ev) => (
                  <div key={ev.id} className="flex items-start justify-between gap-3 p-3 bg-card/50 rounded-xl">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-primary/15 text-primary border-primary/30">{humanizeEventType(ev.type)}</Badge>
                        {ev.actorEmail ? (
                          <span className="text-sm text-muted-foreground truncate">by {ev.actorEmail}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">by system</span>
                        )}
                      </div>
                      {describeTarget(ev) ? (
                        <div className="text-sm text-foreground mt-1 truncate">{describeTarget(ev)}</div>
                      ) : null}
                      {describeDetails(ev) ? (
                        <div className="text-sm text-muted-foreground mt-1 truncate">{describeDetails(ev)}</div>
                      ) : null}
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0">
                      {ev.createdAt?.toDate ? ev.createdAt.toDate().toLocaleString() : "—"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

