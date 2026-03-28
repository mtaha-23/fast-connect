"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Trash2, UserX, UserCheck, Search } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import { collection, getDocs, limit, orderBy, query as fsQuery, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { getFirestoreDB } from "@/lib/firebase"
import { logAnalyticsEvent } from "@/lib/services/analytics.service"
import { isSuperAdminEmail } from "@/lib/constants/super-admin"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type AdminUser = {
  uid: string
  name: string
  email: string
  emailVerified: boolean
  role?: "admin" | "student" | string
  photoURL?: string | null
  createdAt?: string
  updatedAt?: string
  disabled?: boolean
  deactivatedAt?: string | null
}

export default function AdminUsersPage() {
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [submittingUid, setSubmittingUid] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [users, setUsers] = useState<AdminUser[]>([])
  const [query, setQuery] = useState("")
  const [roleError, setRoleError] = useState<string | null>(null)

  const [confirmDeleteUid, setConfirmDeleteUid] = useState<string | null>(null)
  const [confirmToggleUid, setConfirmToggleUid] = useState<string | null>(null)

  const selectedDeleteUser = useMemo(
    () => users.find((u) => u.uid === confirmDeleteUid) ?? null,
    [confirmDeleteUid, users],
  )
  const selectedToggleUser = useMemo(
    () => users.find((u) => u.uid === confirmToggleUid) ?? null,
    [confirmToggleUid, users],
  )

  const fetchUsers = async (opts?: { q?: string }) => {
    if (!user) return
    try {
      setLoading(true)
      setError(null)

      const db = getFirestoreDB()
      const usersRef = collection(db, "users")
      const qy = fsQuery(usersRef, orderBy("createdAt", "desc"), limit(200))
      const snap = await getDocs(qy)

      const rows: AdminUser[] = snap.docs.map((d) => ({ uid: d.id, ...(d.data() as any) }))
      setUsers(rows)
    } catch (e) {
      console.error("Admin users fetch failed:", e)
      setUsers([])
      setError(e instanceof Error ? e.message : "Failed to fetch users.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => (u.name ?? "").toLowerCase().includes(q) || (u.email ?? "").toLowerCase().includes(q))
  }, [query, users])

  const canChangeRoles = isSuperAdminEmail(user?.email ?? null)

  const changeRole = async (target: AdminUser, nextRole: "admin" | "student") => {
    if (!user || !canChangeRoles) return
    if (target.uid === user.uid) return
    const previousRole = target.role === "admin" ? "admin" : "student"
    if (previousRole === nextRole) return
    setRoleError(null)
    setSubmittingUid(target.uid)
    try {
      const db = getFirestoreDB()
      const userRef = doc(db, "users", target.uid)
      const now = new Date().toISOString()
      await updateDoc(userRef, {
        role: nextRole,
        updatedAt: now,
      })
      await logAnalyticsEvent({
        type: "user.role_changed",
        actorUid: user.uid,
        actorEmail: user.email ?? undefined,
        targetUid: target.uid,
        meta: {
          previousRole,
          newRole: nextRole,
          email: target.email,
          name: target.name,
        },
      })
      await fetchUsers()
    } catch (e) {
      setRoleError(e instanceof Error ? e.message : "Failed to update role.")
    } finally {
      setSubmittingUid(null)
    }
  }

  const toggleDeactivate = async (u: AdminUser) => {
    if (!user) return
    setSubmittingUid(u.uid)
    try {
      const db = getFirestoreDB()
      const userRef = doc(db, "users", u.uid)
      const now = new Date().toISOString()
      const nextDisabled = !Boolean(u.disabled)
      await updateDoc(userRef, {
        disabled: nextDisabled,
        deactivatedAt: nextDisabled ? now : null,
        updatedAt: now,
      })
      await logAnalyticsEvent({
        type: nextDisabled ? "user.deactivated" : "user.reactivated",
        actorUid: user.uid,
        actorEmail: user.email ?? undefined,
        targetUid: u.uid,
        meta: { email: u.email, name: u.name },
      })
      await fetchUsers()
    } finally {
      setSubmittingUid(null)
      setConfirmToggleUid(null)
    }
  }

  const deleteUser = async (uid: string) => {
    if (!user) return
    setSubmittingUid(uid)
    try {
      const victim = users.find((x) => x.uid === uid) ?? null
      const db = getFirestoreDB()
      await deleteDoc(doc(db, "users", uid))
      await logAnalyticsEvent({
        type: "user.deleted",
        actorUid: user.uid,
        actorEmail: user.email ?? undefined,
        targetUid: uid,
        meta: victim ? { email: victim.email, name: victim.name } : undefined,
      })
      await fetchUsers()
    } finally {
      setSubmittingUid(null)
      setConfirmDeleteUid(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between h-16 px-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Users</h1>
            <p className="text-sm text-muted-foreground">
              Deactivate or delete accounts. Changing roles is limited to the designated super admin.
            </p>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-5">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="pl-9 bg-card/50 border-border"
            />
          </div>
          <Button variant="outline" className="bg-card border-border" onClick={() => fetchUsers()} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Refresh
          </Button>
        </div>

        {error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive px-4 py-3">
            <div className="font-medium">Couldn’t load users</div>
            <div className="text-sm opacity-90">{error}</div>
          </div>
        ) : null}

        {roleError ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive px-4 py-3">
            <div className="font-medium">Role update failed</div>
            <div className="text-sm opacity-90">{roleError}</div>
          </div>
        ) : null}

        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Loading users...
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((u) => {
              const initials =
                (u.name || "User")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "US"

              const isDisabled = Boolean(u.disabled)
              const isBusy = submittingUid === u.uid

              return (
                <div key={u.uid} className="flex items-center justify-between p-4 bg-card/50 border border-border rounded-2xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="border border-border shrink-0">
                      <AvatarImage src={u.photoURL || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-foreground truncate max-w-[420px]">{u.name || "Unnamed user"}</p>
                        <Badge
                          className={
                            isDisabled
                              ? "bg-destructive/15 text-destructive border-destructive/30"
                              : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          }
                        >
                          {isDisabled ? "deactivated" : "active"}
                        </Badge>
                        {canChangeRoles ? (
                          <Select
                            value={u.role === "admin" ? "admin" : "student"}
                            onValueChange={(v) => changeRole(u, v as "admin" | "student")}
                          >
                            <SelectTrigger
                              className="h-8 w-[118px] text-xs bg-card/80 border-border"
                              disabled={isBusy || u.uid === user?.uid}
                              title={u.uid === user?.uid ? "You cannot change your own role here" : undefined}
                            >
                              <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">student</SelectItem>
                              <SelectItem value="admin">admin</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge className="bg-primary/15 text-primary border-primary/30">{u.role || "student"}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      className="bg-card border-border"
                      onClick={() => setConfirmToggleUid(u.uid)}
                      disabled={isBusy || u.role === "admin"}
                      title={u.role === "admin" ? "Admins can't be deactivated here" : undefined}
                    >
                      {isBusy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      {isDisabled ? <UserCheck className="w-4 h-4 mr-2" /> : <UserX className="w-4 h-4 mr-2" />}
                      {isDisabled ? "Reactivate" : "Deactivate"}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setConfirmDeleteUid(u.uid)}
                      disabled={isBusy || u.role === "admin"}
                      title={u.role === "admin" ? "Admins can't be deleted here" : undefined}
                    >
                      {isBusy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                      Delete
                    </Button>
                  </div>
                </div>
              )
            })}

            {filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">No users found.</div>
            ) : null}
          </div>
        )}
      </div>

      {/* Confirm deactivate/reactivate */}
      <AlertDialog open={Boolean(confirmToggleUid)} onOpenChange={(o) => !o && setConfirmToggleUid(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedToggleUser?.disabled ? "Reactivate this user?" : "Deactivate this user?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedToggleUser?.disabled
                ? "They will be able to sign in again."
                : "They will be blocked from signing in until reactivated."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(submittingUid)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedToggleUser && toggleDeactivate(selectedToggleUser)}
              disabled={!selectedToggleUser || Boolean(submittingUid)}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm delete */}
      <AlertDialog open={Boolean(confirmDeleteUid)} onOpenChange={(o) => !o && setConfirmDeleteUid(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the user profile from Firestore. (Deleting the Firebase Authentication account requires a
              service account / Admin privileges.)
              {selectedDeleteUser?.email ? ` (${selectedDeleteUser.email})` : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(submittingUid)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDeleteUid && deleteUser(confirmDeleteUid)}
              disabled={!confirmDeleteUid || Boolean(submittingUid)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

