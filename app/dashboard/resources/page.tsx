"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  FileText,
  Download,
  Eye,
  Calendar,
  FileType,
  BookOpen,
  GraduationCap,
  Code,
  Calculator,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { LucideIcon } from "lucide-react"

// Icon mapping function
const iconMap: Record<string, LucideIcon> = {
  FileText,
  Calculator,
  BookOpen,
  Code,
  GraduationCap,
  FileType,
}

interface Resource {
  id: string
  title: string
  type: "Past Paper" | "Study Guide" | "Notes" | "Practice Set" | "Official Document"
  category: "Entry Test" | "Mathematics" | "English" | "CS" | "Analytical" | "General"
  subject: string
  date: string
  size: string
  icon: string
  color: string
  fileUrl?: string
}

const categories = ["All", "Entry Test", "Mathematics", "English", "CS", "Analytical", "General"]
const types = ["All Types", "Past Paper", "Study Guide", "Notes", "Practice Set", "Official Document"]

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedType, setSelectedType] = useState("All Types")
  const [previewResource, setPreviewResource] = useState<Resource | null>(null)

  // Fetch resources from API
  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch("/api/resources")
        if (!response.ok) {
          throw new Error("Failed to fetch resources")
        }
        const data = await response.json()
        setResources(data.resources || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load resources")
        console.error("Error fetching resources:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  // Handle download (no count tracking)
  const handleDownload = async (resource: Resource) => {
    try {
      if (resource.fileUrl) {
        window.open(resource.fileUrl, "_blank")
      } else {
        console.log("No file URL available for download")
      }
    } catch (err) {
      console.error("Error opening resource:", err)
    }
  }

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory
    const matchesType = selectedType === "All Types" || resource.type === selectedType
    return matchesSearch && matchesCategory && matchesType
  })

  // Get icon component from string
  const getIcon = (iconName: string): LucideIcon => {
    return iconMap[iconName] || FileText
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <DashboardHeader
          title="Campus Resources"
          description="Access study materials, past papers, and official documents"
        />
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Loading resources...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <DashboardHeader
          title="Campus Resources"
          description="Access study materials, past papers, and official documents"
        />
        <div className="p-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-destructive mb-2">Error loading resources</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Campus Resources"
        description="Access study materials, past papers, and official documents"
      />

      <div className="p-6 space-y-6">
        {/* Search & Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-primary mb-1">{resources.length}</p>
            <p className="text-xs text-muted-foreground font-medium">Total Resources</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-primary mb-1">{resources.filter((r) => r.type === "Past Paper").length}</p>
            <p className="text-xs text-muted-foreground font-medium">Past Papers</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-primary mb-1">
              {new Set(resources.map((r) => r.category)).size}
            </p>
            <p className="text-xs text-muted-foreground font-medium">Categories</p>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredResources.map((resource) => {
            const IconComponent = getIcon(resource.icon)
            return (
              <Card key={resource.id} className="group hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="pt-6">
                  {/* Icon & Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("p-3 rounded-xl", resource.color)}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary">{resource.type}</Badge>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold mb-2 line-clamp-2 min-h-[2.5rem]">{resource.title}</h3>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {resource.date}
                    </span>
                    <span>{resource.size}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => setPreviewResource(resource)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDownload(resource)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No resources found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewResource} onOpenChange={() => setPreviewResource(null)}>
        <DialogContent className="max-w-5xl w-[95vw] max-h-[95vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="line-clamp-2">{previewResource?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 flex-1 overflow-hidden flex flex-col min-h-0">
            {/* Preview Area */}
            {previewResource?.fileUrl ? (
              <div className="flex-1 min-h-0 border rounded-lg overflow-hidden bg-muted">
                <iframe
                  src={(() => {
                    // Convert Google Drive download URL to preview URL
                    const url = previewResource.fileUrl!
                    // Extract file ID from download URL
                    const downloadMatch = url.match(/[?&]id=([^&]+)/)
                    if (downloadMatch) {
                      const fileId = downloadMatch[1]
                      return `https://drive.google.com/file/d/${fileId}/preview`
                    }
                    // If already a view URL, convert to preview
                    const viewMatch = url.match(/\/file\/d\/([^\/]+)/)
                    if (viewMatch) {
                      const fileId = viewMatch[1]
                      return `https://drive.google.com/file/d/${fileId}/preview`
                    }
                    // Fallback to original URL
                    return url
                  })()}
                  className="w-full h-full min-h-[500px]"
                  title={previewResource.title}
                  allow="autoplay"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="text-center">
                  {previewResource && (
                    (() => {
                      const IconComponent = getIcon(previewResource.icon)
                      return <IconComponent className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    })()
                  )}
                  <p className="text-muted-foreground">Preview not available. Download to view the full document.</p>
                </div>
              </div>
            )}

            {/* Details */}
            {previewResource?.size && (
              <div className="text-sm flex-shrink-0 pt-2 border-t">
                <div>
                  <p className="text-muted-foreground text-xs">Size</p>
                  <p className="font-medium">{previewResource.size}</p>
                </div>
              </div>
            )}

            {/* Download Button */}
            <Button 
              className="w-full flex-shrink-0"
              onClick={() => previewResource && handleDownload(previewResource)}
            >
              <Download className="w-4 h-4 mr-2" />
              Download {previewResource?.title}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
