"use client"

import { useState } from "react"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const resources = [
  {
    id: 1,
    title: "FAST Entry Test Past Papers 2023",
    type: "Past Paper",
    category: "Entry Test",
    subject: "All Subjects",
    date: "2023",
    downloads: 1250,
    size: "2.4 MB",
    icon: FileText,
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Mathematics Formula Sheet",
    type: "Study Guide",
    category: "Mathematics",
    subject: "Mathematics",
    date: "2024",
    downloads: 890,
    size: "1.1 MB",
    icon: Calculator,
    color: "bg-emerald-500",
  },
  {
    id: 3,
    title: "English Vocabulary Guide",
    type: "Study Guide",
    category: "English",
    subject: "English",
    date: "2024",
    downloads: 756,
    size: "3.2 MB",
    icon: BookOpen,
    color: "bg-pink-500",
  },
  {
    id: 4,
    title: "Computer Science Fundamentals",
    type: "Notes",
    category: "CS",
    subject: "Computer Science",
    date: "2024",
    downloads: 1120,
    size: "5.7 MB",
    icon: Code,
    color: "bg-indigo-500",
  },
  {
    id: 5,
    title: "Entry Test Sample Paper #1",
    type: "Past Paper",
    category: "Entry Test",
    subject: "All Subjects",
    date: "2022",
    downloads: 2340,
    size: "1.8 MB",
    icon: FileText,
    color: "bg-blue-500",
  },
  {
    id: 6,
    title: "Analytical Reasoning Practice",
    type: "Practice Set",
    category: "Analytical",
    subject: "IQ/Analytical",
    date: "2024",
    downloads: 678,
    size: "2.1 MB",
    icon: GraduationCap,
    color: "bg-orange-500",
  },
  {
    id: 7,
    title: "FAST Prospectus 2024",
    type: "Official Document",
    category: "General",
    subject: "Information",
    date: "2024",
    downloads: 3450,
    size: "8.5 MB",
    icon: FileType,
    color: "bg-cyan-500",
  },
  {
    id: 8,
    title: "Calculus Complete Notes",
    type: "Notes",
    category: "Mathematics",
    subject: "Mathematics",
    date: "2024",
    downloads: 567,
    size: "4.2 MB",
    icon: Calculator,
    color: "bg-emerald-500",
  },
]

const categories = ["All", "Entry Test", "Mathematics", "English", "CS", "Analytical", "General"]
const types = ["All Types", "Past Paper", "Study Guide", "Notes", "Practice Set", "Official Document"]

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedType, setSelectedType] = useState("All Types")
  const [previewResource, setPreviewResource] = useState<(typeof resources)[0] | null>(null)

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory
    const matchesType = selectedType === "All Types" || resource.type === selectedType
    return matchesSearch && matchesCategory && matchesType
  })

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{resources.length}</p>
              <p className="text-sm text-muted-foreground">Total Resources</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{resources.filter((r) => r.type === "Past Paper").length}</p>
              <p className="text-sm text-muted-foreground">Past Papers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">
                {resources.reduce((acc, r) => acc + r.downloads, 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Downloads</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">5</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </CardContent>
          </Card>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="group hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="pt-6">
                {/* Icon & Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("p-3 rounded-xl", resource.color)}>
                    <resource.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary">{resource.type}</Badge>
                </div>

                {/* Title */}
                <h3 className="font-semibold mb-2 line-clamp-2 min-h-[3rem]">{resource.title}</h3>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {resource.date}
                  </span>
                  <span>{resource.size}</span>
                </div>

                {/* Downloads */}
                <p className="text-sm text-muted-foreground mb-4">{resource.downloads.toLocaleString()} downloads</p>

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
                  <Button size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewResource?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Preview Area */}
            <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                {previewResource && <previewResource.icon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />}
                <p className="text-muted-foreground">Preview not available. Download to view the full document.</p>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium">{previewResource?.type}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Category</p>
                <p className="font-medium">{previewResource?.category}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Size</p>
                <p className="font-medium">{previewResource?.size}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Downloads</p>
                <p className="font-medium">{previewResource?.downloads.toLocaleString()}</p>
              </div>
            </div>

            {/* Download Button */}
            <Button className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download {previewResource?.title}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
