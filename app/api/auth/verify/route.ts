import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/user"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any

      await connectDB()
      const user = await User.findById(decoded.userId).select("-password")

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      return NextResponse.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
    } catch (jwtError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
