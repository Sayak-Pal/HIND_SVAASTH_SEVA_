import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import Appointment from "@/models/appointment"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any

    const appointmentData = await request.json()

    await connectDB()

    const appointment = await Appointment.create({
      ...appointmentData,
      userId: decoded.userId,
      status: "upcoming",
    })

    return NextResponse.json({
      message: "Appointment booked successfully",
      appointment,
    })
  } catch (error) {
    console.error("Appointment booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any

    await connectDB()

    let appointments
    if (decoded.role === "admin") {
      appointments = await Appointment.find({}).sort({ date: -1 })
    } else {
      appointments = await Appointment.find({ userId: decoded.userId }).sort({ date: -1 })
    }

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error("Fetch appointments error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
