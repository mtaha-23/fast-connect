"use client"

import { useState } from "react"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

const tourLocations = [
  {
    id: 1,
    name: "Main Building",
    description: "The central administrative building housing offices, lecture halls, and the library.",
    image: "/university-main-building.jpg",
    icon: Building,
  },
  {
    id: 2,
    name: "Library",
    description: "State-of-the-art library with digital resources, study areas, and research facilities.",
    image: "/modern-university-library.png",
    icon: BookOpen,
  },
  {
    id: 3,
    name: "Computer Labs",
    description: "Advanced computing facilities with latest hardware and software for practical learning.",
    image: "/computer-lab.png",
    icon: FlaskConical,
  },
  {
    id: 4,
    name: "Cafeteria",
    description: "Spacious dining area offering diverse food options for students and faculty.",
    image: "/university-cafeteria.jpg",
    icon: Utensils,
  },
  {
    id: 5,
    name: "Sports Complex",
    description: "Multi-purpose sports facilities including gymnasium, courts, and playing fields.",
    image: "/sports-complex.jpg",
    icon: Dumbbell,
  },
  {
    id: 6,
    name: "Campus Grounds",
    description: "Beautiful green spaces and gardens for relaxation and outdoor activities.",
    image: "/university-campus-grounds.jpg",
    icon: Trees,
  },
]

export default function TourPage() {
  const [currentLocation, setCurrentLocation] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showInfo, setShowInfo] = useState(true)

  const location = tourLocations[currentLocation]

  const handlePrevious = () => {
    setCurrentLocation((prev) => (prev === 0 ? tourLocations.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentLocation((prev) => (prev === tourLocations.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="min-h-screen bg-black">
      <DashboardHeader title="360° Campus Tour" description="Explore FAST University campus virtually" />

      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Main Viewer */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
            <div className="relative aspect-video">
              <img
                src={location.image || "/placeholder.svg"}
                alt={location.name}
                className="w-full h-full object-cover"
              />

              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40">
                {/* Top Bar */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <Badge className="bg-black/50 border-white/10 text-white backdrop-blur-sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    {location.name}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                      onClick={() => setShowInfo(!showInfo)}
                    >
                      <Info className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                  onClick={handleNext}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>

                {/* Bottom Bar */}
                <div className="absolute bottom-4 left-4 right-4">
                  {showInfo && (
                    <div className="bg-black/70 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/10">
                      <h3 className="text-white font-semibold text-lg mb-1">{location.name}</h3>
                      <p className="text-white/70 text-sm">{location.description}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-black/50 hover:bg-black/70 text-white shrink-0 backdrop-blur-sm"
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
                            index === currentLocation ? "bg-blue-500" : "bg-white/30 hover:bg-white/50",
                          )}
                        />
                      ))}
                    </div>

                    <span className="text-white text-sm shrink-0">
                      {currentLocation + 1} / {tourLocations.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Selector */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Explore Locations</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {tourLocations.map((loc, index) => (
                <div
                  key={loc.id}
                  className={cn(
                    "cursor-pointer transition-all overflow-hidden rounded-xl border",
                    currentLocation === index
                      ? "border-blue-500/50 ring-2 ring-blue-500/20"
                      : "border-white/5 hover:border-white/20",
                  )}
                  onClick={() => setCurrentLocation(index)}
                >
                  <div className="aspect-square relative">
                    <img src={loc.image || "/placeholder.svg"} alt={loc.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center mb-2",
                          currentLocation === index ? "bg-blue-500" : "bg-white/20",
                        )}
                      >
                        <loc.icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-white text-sm font-medium line-clamp-1">{loc.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Campus Stats */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-blue-400">50+</p>
                <p className="text-sm text-white/50">Buildings</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-400">100+</p>
                <p className="text-sm text-white/50">Acres</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-400">25+</p>
                <p className="text-sm text-white/50">Labs</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-400">5</p>
                <p className="text-sm text-white/50">Campuses</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
