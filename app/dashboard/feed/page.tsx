"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MoreHorizontal, Clock, Pin, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/hooks/use-auth"
import type { Post } from "@/lib/services/post.service"

interface PostWithLiked extends Post {
  isLiked?: boolean
}

export default function FeedPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<PostWithLiked[]>([])
  const [loading, setLoading] = useState(true)
  const [likingPostId, setLikingPostId] = useState<string | null>(null)

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/posts")
      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }
      const data = await response.json()
      
      // Mark posts as liked based on likedBy array
      // Note: createdAt is now a string from API, not a Timestamp
      const postsWithLiked: PostWithLiked[] = data.posts.map((post: any) => ({
        ...post,
        isLiked: user ? (post.likedBy || []).includes(user.uid) : false,
      }))
      
      setPosts(postsWithLiked)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: string) => {
    if (!user) {
      return
    }

    try {
      setLikingPostId(postId)
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.uid }),
      })

      if (!response.ok) {
        throw new Error("Failed to toggle like")
      }

      const result = await response.json()

      // Update the post in the local state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: result.likes,
                isLiked: result.isLiked,
                likedBy: result.isLiked
                  ? [...(post.likedBy || []), user.uid]
                  : post.likedBy?.filter((uid) => uid !== user.uid) || [],
              }
            : post
        )
      )
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setLikingPostId(null)
    }
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
        <div className="max-w-4xl mx-auto">
          {/* Main Feed */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No posts available yet.</p>
              </div>
            ) : (
              posts.map((post) => (
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
                        <AvatarImage src={post.author?.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-primary-foreground">
                          {post.author?.name?.charAt(0).toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{post.author?.name || "Unknown Author"}</span>
                          {post.author?.role && (
                            <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground border-0">
                              {post.author.role}
                            </Badge>
                          )}
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
                    </div>
                  </div>

                  <p className="text-sm text-foreground whitespace-pre-line mb-4">{post.content}</p>

                  {post.image && (
                    <div className="rounded-xl overflow-hidden mb-4">
                      <img src={post.image || "/placeholder.svg"} alt="Post" className="w-full h-auto object-cover" />
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-4 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        disabled={!user || likingPostId === post.id}
                        className={cn(
                          "text-muted-foreground hover:text-foreground hover:bg-accent",
                          post.isLiked && "text-red-500",
                        )}
                      >
                        {likingPostId === post.id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Heart className={cn("w-4 h-4 mr-1", post.isLiked && "fill-red-500")} />
                        )}
                        {post.likes}
                    </Button>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
