"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Chrome } from "lucide-react"

interface Session {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function GoogleLoginButton() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Simulate session check
    const checkSession = async () => {
      try {
        // This would normally be a real session check
        // For now, we'll simulate no session
        setSession(null)
      } catch (error) {
        console.error("Session check failed:", error)
        setSession(null)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const handleSignIn = async () => {
    try {
      // Redirect to sign-in page
      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Redirect failed:", error)
    }
  }

  const handleSignOut = async () => {
    try {
      setSession(null)
      console.log("Signed out")
    } catch (error) {
      console.error("Sign out failed:", error)
    }
  }

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg bg-white/80 backdrop-blur-sm"
      >
        <Chrome className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    )
  }

  if (loading) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="border-slate-300 text-slate-700 rounded-lg bg-white/80 backdrop-blur-sm"
      >
        Loading...
      </Button>
    )
  }

  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
              <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-medium leading-none">{session.user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href="/dashboard" className="cursor-pointer">
              Dashboard
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/profile" className="cursor-pointer">
              Profile
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button
      onClick={handleSignIn}
      variant="outline"
      size="sm"
      className="border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg bg-white/80 backdrop-blur-sm"
    >
      <Chrome className="w-4 h-4 mr-2" />
      Sales Login
    </Button>
  )
}
