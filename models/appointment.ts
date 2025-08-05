import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hospitalId: {
    type: String,
    required: true,
  },
  doctorId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  patientPhone: {
    type: String,
    required: true,
  },
  patientAge: {
    type: String,
    required: true,
  },
  symptoms: {
    type: String,
  },
  appointmentType: {
    type: String,
    enum: ["consultation", "followup", "checkup", "emergency"],
    default: "consultation",
  },
  status: {
    type: String,
    enum: ["upcoming", "completed", "cancelled"],
    default: "upcoming",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema)
