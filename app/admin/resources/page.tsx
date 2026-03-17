"use client"

import { useEffect, useState, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Edit, Trash2, Loader2, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

type ResourceType = "Past Paper" | "Study Guide" | "Notes" | "Practice Set" | "Official Document"
type ResourceCategory = "Entry Test" | "Mathematics" | "English" | "CS" | "Analytical" | "General"

interface AdminResource {
  id: string
  title: string
  type: ResourceType
  category: ResourceCategory
  subject: string
  date: string
  size: string
  icon: string
  color: string
  fileUrl?: string
  filePublicId?: string
  fileName?: string
}

const resourceTypes: ResourceType[] = ["Past Paper", "Study Guide", "Notes", "Practice Set", "Official Document"]
const resourceCategories: ResourceCategory[] = ["Entry Test", "Mathematics", "English", "CS", "Analytical", "General"]

const iconOptions = ["FileText", "Calculator", "BookOpen", "Code", "GraduationCap", "FileType"]

const colorOptions: { label: string; value: string }[] = [
  { label: "Blue", value: "bg-blue-500" },
  { label: "Emerald", value: "bg-emerald-500" },
  { label: "Purple", value: "bg-violet-500" },
  { label: "Orange", value: "bg-orange-500" },
  { label: "Pink", value: "bg-pink-500" },
]

type FormState = {
  title: string
  type: ResourceType
  category: ResourceCategory
  subject: string
  date: string
  size: string
  icon: string
  color: string
  fileUrl: string
  filePublicId: string
  fileName: string
}

const defaultFormState: FormState = {
  title: "",
  type: "Past Paper",
  category: "Entry Test",
  subject: "",
  date: "",
  size: "",
  icon: "FileText",
  color: "bg-blue-500",
  fileUrl: "",
  filePublicId: "",
  fileName: "",
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<AdminResource[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [selectedResource, setSelectedResource] = useState<AdminResource | null>(null)
  const [formData, setFormData] = useState<FormState>(defaultFormState)
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/resources")
      if (!res.ok) {
        throw new Error("Failed to fetch resources")
      }
      const data = await res.json()
      const mapped: AdminResource[] = (data.resources || []).map((r: any) => ({
        id: r.id,
        title: r.title ?? "",
        type: r.type as ResourceType,
        category: r.category as ResourceCategory,
        subject: r.subject ?? "",
        date: r.date ?? "",
        size: r.size ?? "",
        icon: r.icon || "FileText",
        color: r.color || "bg-blue-500",
        fileUrl: r.fileUrl || "",
        filePublicId: r.filePublicId || "",
        fileName: r.fileName || "",
      }))
      setResources(mapped)
    } catch (error) {
      console.error("Error fetching resources:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setFormData(defaultFormState)
    setFile(null)
    setIsCreateDialogOpen(true)
  }

  const handleEdit = (resource: AdminResource) => {
    setSelectedResource(resource)
    setFormData({
      title: resource.title,
      type: resource.type,
      category: resource.category,
      subject: resource.subject,
      date: resource.date,
      size: resource.size,
      icon: resource.icon,
      color: resource.color,
      fileUrl: resource.fileUrl || "",
      filePublicId: resource.filePublicId || "",
      fileName: resource.fileName || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (resource: AdminResource) => {
    setSelectedResource(resource)
    setIsDeleteDialogOpen(true)
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] || null
    if (!selected) {
      setFile(null)
      return
    }

    const maxBytes = 5 * 1024 * 1024 // 5MB
    if (selected.size > maxBytes) {
      alert("File is too large. Maximum size is 5 MB.")
      event.target.value = ""
      setFile(null)
      return
    }

    setFile(selected)
    // Enforce "upload OR link" (clear link when uploading a file)
    setFormData((prev) => ({ ...prev, fileUrl: "", filePublicId: "" }))
    const sizeInMb = selected.size / (1024 * 1024)
    const formattedSize = `${sizeInMb.toFixed(1)} MB`
    setFormData((prev) => ({
      ...prev,
      size: formattedSize,
    }))
  }

  const resolveFile = async () => {
    // If a new file is selected, upload it to Cloudinary
    if (file) {
      const formDataToSend = new FormData()
      formDataToSend.append("file", file)
      formDataToSend.append("desiredName", formData.title)

      const response = await fetch("/api/resources/upload", {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        const message = errorData?.error || "Failed to upload file"
        throw new Error(message)
      }

      const data = await response.json()
      const size = formData.size || `${(file.size / (1024 * 1024)).toFixed(1)} MB`

      return {
        fileUrl: (data.url as string) || "",
        filePublicId: (data.publicId as string) || "",
        fileName: (data.fileName as string) || file.name || "",
        size,
      }
    }

    // Otherwise, fall back to the URL in the text field (if any)
    return {
      fileUrl: formData.fileUrl.trim() || "",
      filePublicId: formData.filePublicId || "",
      fileName: formData.fileName || "",
      size: formData.size,
    }
  }

  const submitCreate = async () => {
    const hasUpload = !!file
    const hasLink = !!formData.fileUrl.trim()
    if (hasUpload && hasLink) {
      alert("Choose only one: upload a file OR provide a file link.")
      return
    }

    const hasFileOrLink = hasUpload || hasLink
    if (!formData.title || !hasFileOrLink) {
      return
    }

    try {
      setSubmitting(true)
      const { fileUrl, filePublicId, fileName, size } = await resolveFile()
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          type: formData.type,
          category: formData.category,
          subject: formData.subject,
          date: formData.date,
          size,
          icon: formData.icon,
          color: formData.color,
          fileUrl: fileUrl || undefined,
          filePublicId: filePublicId || undefined,
          fileName: fileName || undefined,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to create resource")
      }

      setIsCreateDialogOpen(false)
      setFile(null)
      await fetchResources()
    } catch (error) {
      console.error("Error creating resource:", error)
      alert("Failed to create resource. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const submitUpdate = async () => {
    if (!selectedResource) return
    const hasUpload = !!file
    const hasLink = !!formData.fileUrl.trim()
    if (hasUpload && hasLink) {
      alert("Choose only one: upload a file OR provide a file link.")
      return
    }

    const hasFileOrLink = hasUpload || hasLink || !!selectedResource.fileUrl
    if (!formData.title || !hasFileOrLink) {
      return
    }

    try {
      setSubmitting(true)
      const { fileUrl, filePublicId, fileName, size } = await resolveFile()
      const res = await fetch(`/api/resources/${selectedResource.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          type: formData.type,
          category: formData.category,
          subject: formData.subject,
          date: formData.date,
          size,
          icon: formData.icon,
          color: formData.color,
          fileUrl: fileUrl || undefined,
          filePublicId: filePublicId || undefined,
          fileName: fileName || undefined,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to update resource")
      }

      setIsEditDialogOpen(false)
      setSelectedResource(null)
      setFile(null)
      await fetchResources()
    } catch (error) {
      console.error("Error updating resource:", error)
      alert("Failed to update resource. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const submitDelete = async () => {
    if (!selectedResource) return

    try {
      setSubmitting(true)
      const res = await fetch(`/api/resources/${selectedResource.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete resource")
      }

      setIsDeleteDialogOpen(false)
      setSelectedResource(null)
      await fetchResources()
    } catch (error) {
      console.error("Error deleting resource:", error)
      alert("Failed to delete resource. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const hasFileOrLinkForForm = !!file || !!formData.fileUrl.trim()
  const canSubmit = !!formData.title && hasFileOrLinkForForm

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between h-16 px-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Resources</h1>
            <p className="text-sm text-muted-foreground">Manage study materials and downloadable resources</p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Resource
          </Button>
        </div>
      </header>

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No resources yet. Create your first resource!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-card/50 border border-border rounded-2xl p-5 hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={cn("p-3 rounded-xl", resource.color)}>
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-foreground">{resource.title}</h2>
                        <Badge variant="secondary" className="text-xs">
                          {resource.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {resource.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Subject:</span> {resource.subject || "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {resource.date && <span className="mr-3">Date: {resource.date}</span>}
                        {resource.size && <span>Size: {resource.size}</span>}
                      </p>
                      {resource.fileUrl && (
                        <p className="text-xs text-muted-foreground break-all">
                          File URL: <span className="underline">{resource.fileUrl}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(resource)}
                      className="text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-primary/20 dark:hover:text-primary"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(resource)}
                      className="text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-popover border-border max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Resource</DialogTitle>
            <DialogDescription>Create a new study resource</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1"
                placeholder="e.g., Entry Test Past Paper"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: ResourceType) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: ResourceCategory) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="mt-1"
                placeholder="e.g. Statistics"
              />
            </div>
            <div>
              <Label htmlFor="date">Date / Session (optional)</Label>
              <Input
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1"
                placeholder="e.g., March 2024"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="icon">Icon</Label>
                <Select
                  value={formData.icon}
                  onValueChange={(value: string) => setFormData({ ...formData, icon: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <Select
                  value={formData.color}
                  onValueChange={(value: string) => setFormData({ ...formData, color: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="fileUrl">File URL (optional)</Label>
              <Input
                id="fileUrl"
                value={formData.fileUrl}
                onChange={(e) => {
                  const value = e.target.value
                  setFormData({ ...formData, fileUrl: value })
                  if (value.trim().length > 0) {
                    // Enforce "upload OR link" (clear selected upload when typing a link)
                    setFile(null)
                  }
                }}
                className="mt-1"
                placeholder="Paste Google Drive or file link"
                disabled={!!file}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Choose one: upload a file or provide a file URL.
              </p>
            </div>
            <div>
              <Label htmlFor="file-input">Upload file (optional)</Label>
              <Input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                className="mt-1"
                disabled={!!formData.fileUrl.trim()}
              />
             
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={submitCreate}
              disabled={submitting || !canSubmit}
              className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white"
            >
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Add Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-popover border-border max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
            <DialogDescription>Update the resource details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1"
                placeholder="Resource title"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: ResourceType) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: ResourceCategory) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-subject">Subject</Label>
              <Input
                id="edit-subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="mt-1"
                placeholder="Subject"
              />
            </div>
            <div>
              <Label htmlFor="edit-date">Date / Session (optional)</Label>
              <Input
                id="edit-date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-icon">Icon</Label>
                <Select
                  value={formData.icon}
                  onValueChange={(value: string) => setFormData({ ...formData, icon: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-color">Color</Label>
                <Select
                  value={formData.color}
                  onValueChange={(value: string) => setFormData({ ...formData, color: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-fileUrl">File URL (optional)</Label>
              <Input
                id="edit-fileUrl"
                value={formData.fileUrl}
                onChange={(e) => {
                  const value = e.target.value
                  setFormData({ ...formData, fileUrl: value })
                  if (value.trim().length > 0) {
                    // Enforce "upload OR link"
                    setFile(null)
                  }
                }}
                className="mt-1"
                placeholder="Paste Google Drive or file link"
                disabled={!!file}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Choose one: upload a file or provide a file URL.
              </p>
            </div>
            <div>
              <Label htmlFor="edit-file-input">Upload file (optional)</Label>
              <Input
                id="edit-file-input"
                type="file"
                onChange={handleFileChange}
                className="mt-1"
                disabled={!!formData.fileUrl.trim()}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Max file size 5 MB. Uploading a new file will replace the existing one.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={submitUpdate}
              disabled={submitting || !canSubmit}
              className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white"
            >
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-popover border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this resource? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={submitDelete}
              disabled={submitting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

