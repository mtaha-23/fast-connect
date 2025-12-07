"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Calendar,
  MapPin,
  Clock,
  Pin,
  TrendingUp,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Post {
  id: number
  author: {
    name: string
    role: string
    avatar: string
  }
  content: string
  image?: string
  timestamp: string
  likes: number
  comments: number
  isPinned?: boolean
  type: "announcement" | "event" | "news" | "update"
}

const posts: Post[] = [
  {
    id: 1,
    author: {
      name: "FAST Admissions",
      role: "Official",
      avatar: "/generic-university-logo.png",
    },
    content:
      "Entry Test dates announced for Fall 2024 admissions! Register now on our portal. Early bird registration ends on May 15th. Don't miss this opportunity to join FAST University!\n\n📅 Test Date: June 15, 2024\n📍 All campuses\n⏰ Registration deadline: May 30, 2024",
    timestamp: "2 hours ago",
    likes: 245,
    comments: 32,
    isPinned: true,
    type: "announcement",
  },
  {
    id: 2,
    author: {
      name: "FAST Events",
      role: "Official",
      avatar: "/events-logo.jpg",
    },
    content:
      "Join us for the Annual Tech Fest 2024! Experience cutting-edge technology, workshops, and competitions. Open to all students and aspiring tech enthusiasts.",
    image: "/tech-fest-event-banner.jpg",
    timestamp: "5 hours ago",
    likes: 189,
    comments: 24,
    type: "event",
  },
  {
    id: 3,
    author: {
      name: "FAST News",
      role: "Official",
      avatar: "/generic-news-logo.png",
    },
    content:
      "Congratulations to our students for winning first place at the National Programming Competition! 🏆 Our CS team beat 50+ universities to claim the top spot. Proud moment for the FAST family!",
    timestamp: "1 day ago",
    likes: 512,
    comments: 78,
    type: "news",
  },
]

const upcomingEvents = [
  { title: "Entry Test", date: "June 15", location: "All Campuses" },
  { title: "Tech Fest 2024", date: "July 20-22", location: "Islamabad" },
  { title: "Career Fair", date: "August 5", location: "Lahore" },
]

const trendingTopics = [
  { tag: "#FASTAdmissions2024", posts: 1234 },
  { tag: "#TechFest", posts: 567 },
  { tag: "#ProgrammingChampions", posts: 345 },
]

export default function FeedPage() {
  const [likedPosts, setLikedPosts] = useState<number[]>([])

  const handleLike = (postId: number) => {
    setLikedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]))
  }

  const getTypeBadge = (type: Post["type"]) => {
    const styles = {
      announcement: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      event: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      news: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      update: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    }
    return <Badge className={cn("border", styles[type])}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Social Feed" description="Stay updated with FAST University announcements" />

      <div className="p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className={cn(
                  "bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all",
                  post.isPinned && "border-primary/50",
                )}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-border">
                        <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-primary-foreground">
                          {post.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{post.author.name}</span>
                          <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground border-0">
                            {post.author.role}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {post.timestamp}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.isPinned && <Pin className="w-4 h-4 text-blue-400 fill-blue-400" />}
                      {getTypeBadge(post.type)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuItem className="text-foreground hover:bg-accent">
                            Save Post
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-foreground hover:bg-accent">
                            Copy Link
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <p className="text-sm text-foreground whitespace-pre-line mb-4">{post.content}</p>

                  {post.image && (
                    <div className="rounded-xl overflow-hidden mb-4">
                      <img src={post.image || "/placeholder.svg"} alt="Post" className="w-full h-auto object-cover" />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className={cn(
                          "text-muted-foreground hover:text-foreground hover:bg-accent",
                          likedPosts.includes(post.id) && "text-red-500",
                        )}
                      >
                        <Heart className={cn("w-4 h-4 mr-1", likedPosts.includes(post.id) && "fill-red-500")} />
                        {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.comments}
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Upcoming Events</h3>
              </div>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="p-3 bg-muted rounded-xl">
                    <p className="font-medium text-sm text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.date}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Trending</h3>
              </div>
              <div className="space-y-2">
                {trendingTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  >
                    <span className="text-sm font-medium text-primary">{topic.tag}</span>
                    <span className="text-xs text-muted-foreground">{topic.posts} posts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Community</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Users</span>
                  <span className="font-semibold text-foreground">12.5K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Posts Today</span>
                  <span className="font-semibold text-foreground">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">New Members</span>
                  <span className="font-semibold text-foreground">234</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
