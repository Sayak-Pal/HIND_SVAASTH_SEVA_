"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "patient" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, role: "patient" | "admin") => Promise<boolean>
  logout: () => void
  loading: boolean
}

// Export AuthContext as a named export
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem("token")
    if (token) {
      // Verify token with backend
      verifyToken(token)
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        localStorage.removeItem("token")
      }
    } catch (error) {
      console.error("Token verification failed:", error)
      localStorage.removeItem("token")
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("token", data.token)
        setUser(data.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    role: "patient" | "admin",
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("token", data.token)
        setUser(data.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
