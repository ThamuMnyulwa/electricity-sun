"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  role: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>
  logout: () => Promise<void>
  register: (
    name: string,
    email: string,
    password: string,
    role?: string,
  ) => Promise<{ success: boolean; error?: string }>
}

// Create a default context value to avoid null checks
const defaultContextValue: AuthContextType = {
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  register: async () => ({ success: false }),
}

const AuthContext = createContext<AuthContextType>(defaultContextValue)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const checkSession = async () => {
      try {
        console.log("Checking session...")
        const res = await fetch("/api/auth/session", {
          // Use cache: 'no-store' to prevent caching
          cache: "no-store",
        })
        const data = await res.json()

        if (data.authenticated && data.user) {
          console.log("Session found, user is authenticated:", data.user.email)
          setUser(data.user)
        } else {
          console.log("No active session found")
          setUser(null)
        }
      } catch (error) {
        console.error("Session check error:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log("Making login request to API...")
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      console.log("Login API response:", res.status, data)

      if (!res.ok) {
        console.error("Login API error:", data.error)
        return {
          success: false,
          error: data.error || "Login failed",
        }
      }

      console.log("Setting user state:", data.user)
      setUser(data.user)
      return {
        success: true,
        user: data.user,
      }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        error: "An unexpected error occurred",
      }
    }
  }

  const logout = async () => {
    try {
      console.log("Logging out...")
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      console.log("Logout successful")
      setUser(null)
      router.push("/sign-in")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const register = async (name: string, email: string, password: string, role = "user") => {
    try {
      console.log("Making registration request to API...")
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      })

      const data = await res.json()
      console.log("Registration API response:", res.status, data)

      if (!res.ok) {
        console.error("Registration API error:", data.error)
        return {
          success: false,
          error: data.error || "Registration failed",
        }
      }

      return {
        success: true,
      }
    } catch (error) {
      console.error("Registration error:", error)
      return {
        success: false,
        error: "An unexpected error occurred",
      }
    }
  }

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      register,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
