"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon, MapPin, User, Phone } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Hospital {
  id: string
  name: string
  city: string
}

interface Doctor {
  id: string
  name: string
  specialty: string
  hospitalId: string
}

export default function BookAppointmentPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    hospitalId: "",
    doctorId: "",
    date: undefined as Date | undefined,
    time: "",
    patientName: user?.name || "",
    patientPhone: "",
    patientAge: "",
    symptoms: "",
    appointmentType: "consultation",
  })
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Load hospitals
    const mockHospitals: Hospital[] = [
      { id: "1", name: "Apollo Hospital", city: "New Delhi" },
      { id: "2", name: "Fortis Hospital", city: "Mohali" },
      { id: "3", name: "Max Super Speciality Hospital", city: "New Delhi" },
      { id: "4", name: "Manipal Hospital", city: "Bangalore" },
      { id: "5", name: "Kokilaben Dhirubhai Ambani Hospital", city: "Mumbai" },
      { id: "6", name: "AIIMS", city: "New Delhi" },
    ]
    setHospitals(mockHospitals)
  }, [user, router])

  useEffect(() => {
    if (formData.hospitalId) {
      // Load doctors for selected hospital
      const mockDoctors: Doctor[] = [
        { id: "1", name: "Dr. Rajesh Kumar", specialty: "Cardiology", hospitalId: formData.hospitalId },
        { id: "2", name: "Dr. Priya Sharma", specialty: "Neurology", hospitalId: formData.hospitalId },
        { id: "3", name: "Dr. Amit Singh", specialty: "Orthopedics", hospitalId: formData.hospitalId },
        { id: "4", name: "Dr. Sunita Gupta", specialty: "Pediatrics", hospitalId: formData.hospitalId },
        { id: "5", name: "Dr. Vikram Mehta", specialty: "General Medicine", hospitalId: formData.hospitalId },
      ]
      setDoctors(mockDoctors)
    } else {
      setDoctors([])
    }
  }, [formData.hospitalId])

  useEffect(() => {
    if (formData.date && formData.doctorId) {
      // Generate available time slots
      const times = [
        "09:00 AM",
        "09:30 AM",
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "11:30 AM",
        "02:00 PM",
        "02:30 PM",
        "03:00 PM",
        "03:30 PM",
        "04:00 PM",
        "04:30 PM",
        "05:00 PM",
        "05:30 PM",
        "06:00 PM",
      ]
      setAvailableTimes(times)
    } else {
      setAvailableTimes([])
    }
  }, [formData.date, formData.doctorId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.hospitalId || !formData.doctorId || !formData.date || !formData.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          date: formData.date.toISOString(),
          userId: user?.id,
        }),
      })

      if (response.ok) {
        toast({
          title: "Appointment Booked Successfully",
          description: "Your appointment has been confirmed. You will receive a confirmation email shortly.",
        })
        router.push("/dashboard")
      } else {
        throw new Error("Failed to book appointment")
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Unable to book appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedHospital = hospitals.find((h) => h.id === formData.hospitalId)
  const selectedDoctor = doctors.find((d) => d.id === formData.doctorId)

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Book an Appointment</h1>
          <p className="text-gray-600">Schedule your consultation with our expert doctors</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
                <CardDescription>Please fill in all the required information to book your appointment</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Hospital Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="hospital">Select Hospital *</Label>
                    <Select
                      value={formData.hospitalId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, hospitalId: value, doctorId: "", time: "" }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a hospital" />
                      </SelectTrigger>
                      <SelectContent>
                        {hospitals.map((hospital) => (
                          <SelectItem key={hospital.id} value={hospital.id}>
                            {hospital.name} - {hospital.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Doctor Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Select Doctor *</Label>
                    <Select
                      value={formData.doctorId}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, doctorId: value, time: "" }))}
                      disabled={!formData.hospitalId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label>Select Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.date && "text-muted-foreground",
                          )}
                          disabled={!formData.doctorId}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => setFormData((prev) => ({ ...prev, date, time: "" }))}
                          disabled={(date) => date < new Date() || date.getDay() === 0}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="time">Select Time *</Label>
                    <Select
                      value={formData.time}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, time: value }))}
                      disabled={!formData.date}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimes.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Patient Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Patient Information</h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="patientName">Patient Name *</Label>
                        <Input
                          id="patientName"
                          value={formData.patientName}
                          onChange={(e) => setFormData((prev) => ({ ...prev, patientName: e.target.value }))}
                          placeholder="Enter patient name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patientPhone">Phone Number *</Label>
                        <Input
                          id="patientPhone"
                          type="tel"
                          value={formData.patientPhone}
                          onChange={(e) => setFormData((prev) => ({ ...prev, patientPhone: e.target.value }))}
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="patientAge">Age *</Label>
                        <Input
                          id="patientAge"
                          type="number"
                          value={formData.patientAge}
                          onChange={(e) => setFormData((prev) => ({ ...prev, patientAge: e.target.value }))}
                          placeholder="Enter age"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="appointmentType">Appointment Type</Label>
                        <Select
                          value={formData.appointmentType}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, appointmentType: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="consultation">Consultation</SelectItem>
                            <SelectItem value="followup">Follow-up</SelectItem>
                            <SelectItem value="checkup">Health Checkup</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="symptoms">Symptoms / Reason for Visit</Label>
                      <Textarea
                        id="symptoms"
                        value={formData.symptoms}
                        onChange={(e) => setFormData((prev) => ({ ...prev, symptoms: e.target.value }))}
                        placeholder="Please describe your symptoms or reason for the visit..."
                        rows={4}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Booking Appointment..." : "Book Appointment"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Appointment Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Appointment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedHospital && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">{selectedHospital.name}</p>
                      <p className="text-sm text-gray-600">{selectedHospital.city}</p>
                    </div>
                  </div>
                )}

                {selectedDoctor && (
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">{selectedDoctor.name}</p>
                      <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                    </div>
                  </div>
                )}

                {formData.date && (
                  <div className="flex items-start space-x-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">{format(formData.date, "EEEE, MMMM d, yyyy")}</p>
                      {formData.time && <p className="text-sm text-gray-600">{formData.time}</p>}
                    </div>
                  </div>
                )}

                {formData.patientName && (
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Patient: {formData.patientName}</p>
                      {formData.patientAge && <p className="text-sm text-gray-600">Age: {formData.patientAge} years</p>}
                    </div>
                  </div>
                )}

                {formData.patientPhone && (
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">{formData.patientPhone}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Consultation Fee</span>
                    <span className="text-lg font-bold text-green-600">₹500</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Payment can be made at the hospital or online</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
