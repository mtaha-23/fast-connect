"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Pause,
  Expand,
  Volume2,
  VolumeX,
  MapPin,
  Info,
  ChevronLeft,
  ChevronRight,
  Building,
  BookOpen,
  Utensils,
  Dumbbell,
  FlaskConical,
  Trees,
  Loader2,
  LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { TourLocation } from "@/lib/services/tour.service"

// Map icon string names to icon components
const iconMap: Record<string, LucideIcon> = {
  Building,
  BookOpen,
  Utensils,
  Dumbbell,
  FlaskConical,
  Trees,
  MapPin,
}

interface TourLocationWithIcon extends Omit<TourLocation, "icon"> {
  icon: LucideIcon
}

export default function TourPage() {
  const [tourLocations, setTourLocations] = useState<TourLocationWithIcon[]>([])
  const [currentLocation, setCurrentLocation] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch tour locations from API
  useEffect(() => {
    fetchTourLocations()
  }, [])

  const fetchTourLocations = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/tour-locations")
      if (!response.ok) {
        throw new Error("Failed to fetch tour locations")
      }
      const data = await response.json()
      
      // Map icon strings to icon components
      const locationsWithIcons: TourLocationWithIcon[] = data.locations.map((loc: TourLocation) => ({
        ...loc,
        icon: iconMap[loc.icon] || MapPin,
      }))
      
      setTourLocations(locationsWithIcons)
      if (locationsWithIcons.length > 0) {
        setCurrentLocation(0)
      }
    } catch (err) {
      console.error("Error fetching tour locations:", err)
      setError(err instanceof Error ? err.message : "Failed to load tour locations")
    } finally {
      setLoading(false)
    }
  }

  const location = tourLocations[currentLocation]

  const handlePrevious = () => {
    setCurrentLocation((prev) => (prev === 0 ? tourLocations.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentLocation((prev) => (prev === tourLocations.length - 1 ? 0 : prev + 1))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader title="360° Campus Tour" description="Explore FAST University campus virtually" />
        <div className="p-6">
          <div className="max-w-6xl mx-auto flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader title="360° Campus Tour" description="Explore FAST University campus virtually" />
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={fetchTourLocations}>Try Again</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (tourLocations.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader title="360° Campus Tour" description="Explore FAST University campus virtually" />
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tour locations available yet.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="360° Campus Tour" description="Explore FAST University campus virtually" />

      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Main Viewer */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="relative aspect-video">
              <img
                src={location?.image || "/placeholder.svg"}
                alt={location?.name || "Tour location"}
                className="w-full h-full object-cover"
              />

              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40">
                {/* Top Bar */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <Badge className="bg-background/80 border-border text-foreground backdrop-blur-sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    {location?.name || "Unknown Location"}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-background/80 hover:bg-background/90 text-foreground backdrop-blur-sm"
                      onClick={() => setShowInfo(!showInfo)}
                    >
                      <Info className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-background/80 hover:bg-background/90 text-foreground backdrop-blur-sm"
                    >
                      <Expand className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="w-20 h-20 rounded-full bg-blue-500/30 hover:bg-blue-500/50 backdrop-blur-sm border-2 border-white/30"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" />
                    )}
                  </Button>
                </div>

                {/* Navigation Arrows */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 text-foreground backdrop-blur-sm"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 text-foreground backdrop-blur-sm"
                  onClick={handleNext}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>

                {/* Bottom Bar */}
                <div className="absolute bottom-4 left-4 right-4">
                  {showInfo && location && (
                    <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 mb-4 border border-border">
                      <h3 className="text-foreground font-semibold text-lg mb-1">{location.name}</h3>
                      <p className="text-muted-foreground text-sm">{location.description}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-background/80 hover:bg-background/90 text-foreground shrink-0 backdrop-blur-sm"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>

                    <div className="flex-1 flex items-center gap-1">
                      {tourLocations.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentLocation(index)}
                          className={cn(
                            "flex-1 h-1.5 rounded-full transition-all",
                            index === currentLocation ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
                          )}
                        />
                      ))}
                    </div>

                    <span className="text-foreground text-sm shrink-0">
                      {currentLocation + 1} / {tourLocations.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Selector */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Explore Locations</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {tourLocations.map((loc, index) => {
                const IconComponent = loc.icon
                return (
                  <div
                    key={loc.id}
                    className={cn(
                      "cursor-pointer transition-all overflow-hidden rounded-xl border",
                      currentLocation === index
                        ? "border-primary/50 ring-2 ring-primary/20"
                        : "border-border hover:border-primary/30",
                    )}
                    onClick={() => setCurrentLocation(index)}
                  >
                    <div className="aspect-square relative">
                      <img src={loc.image || "/placeholder.svg"} alt={loc.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center mb-2",
                            currentLocation === index ? "bg-primary" : "bg-muted/50",
                          )}
                        >
                          <IconComponent className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <p className="text-foreground text-sm font-medium line-clamp-1">{loc.name}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Campus Stats */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">5</p>
                <p className="text-sm text-muted-foreground">Buildings</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">100+</p>
                <p className="text-sm text-muted-foreground">Acres</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">6+</p>
                <p className="text-sm text-muted-foreground">Labs</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">20+</p>
                <p className="text-sm text-muted-foreground">Rooms</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
