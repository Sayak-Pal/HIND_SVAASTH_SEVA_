"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { Calendar, Clock, MapPin, User, CreditCard, FileText, Plus } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface Appointment {
  id: string
  hospitalName: string
  doctorName: string
  specialty: string
  date: string
  time: string
  status: "upcoming" | "completed" | "cancelled"
  patientName: string
  symptoms?: string
}

interface Payment {
  id: string
  appointmentId: string
  amount: number
  status: "paid" | "pending" | "failed"
  date: string
  method: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role === "admin") {
      router.push("/admin/dashboard")
      return
    }

    fetchUserData()
  }, [user, router])

  const fetchUserData = async () => {
    try {
      // Mock data for demonstration
      const mockAppointments: Appointment[] = [
        {
          id: "1",
          hospitalName: "Apollo Hospital",
          doctorName: "Dr. Rajesh Kumar",
          specialty: "Cardiology",
          date: "2024-01-15",
          time: "10:00 AM",
          status: "upcoming",
          patientName: user?.name || "Patient",
          symptoms: "Chest pain and shortness of breath",
        },
        {
          id: "2",
          hospitalName: "Max Hospital",
          doctorName: "Dr. Priya Sharma",
          specialty: "Neurology",
          date: "2024-01-10",
          time: "02:30 PM",
          status: "completed",
          patientName: user?.name || "Patient",
          symptoms: "Headaches and dizziness",
        },
        {
          id: "3",
          hospitalName: "Fortis Hospital",
          doctorName: "Dr. Amit Singh",
          specialty: "Orthopedics",
          date: "2024-01-20",
          time: "11:30 AM",
          status: "upcoming",
          patientName: user?.name || "Patient",
          symptoms: "Knee pain after exercise",
        },
      ]

      const mockPayments: Payment[] = [
        {
          id: "1",
          appointmentId: "2",
          amount: 1200,
          status: "paid",
          date: "2024-01-10",
          method: "Credit Card",
        },
        {
          id: "2",
          appointmentId: "1",
          amount: 800,
          status: "pending",
          date: "2024-01-15",
          method: "Online Payment",
        },
      ]

      setAppointments(mockAppointments)
      setPayments(mockPayments)
    } catch (error) {
      console.error("Failed to fetch user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user || user.role === "admin") {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  const upcomingAppointments = appointments.filter((apt) => apt.status === "upcoming")
  const completedAppointments = appointments.filter((apt) => apt.status === "completed")
  const pendingPayments = payments.filter((payment) => payment.status === "pending")

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Manage your appointments and health records</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                Next appointment:{" "}
                {upcomingAppointments[0] ? format(new Date(upcomingAppointments[0].date), "MMM d") : "None"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Visits</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedAppointments.length}</div>
              <p className="text-xs text-muted-foreground">Total consultations this year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{pendingPayments.reduce((sum, p) => sum + p.amount, 0)}</div>
              <p className="text-xs text-muted-foreground">
                {pendingPayments.length} pending payment{pendingPayments.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/book-appointment">
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Book New Appointment</span>
              </Button>
            </Link>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              View Medical Records
            </Button>
            <Button variant="outline">
              <CreditCard className="h-4 w-4 mr-2" />
              Make Payment
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="appointments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Appointments</CardTitle>
                <CardDescription>View and manage your upcoming and past appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No appointments found</p>
                      <Link href="/book-appointment">
                        <Button className="mt-4">Book Your First Appointment</Button>
                      </Link>
                    </div>
                  ) : (
                    appointments.map((appointment) => (
                      <Card key={appointment.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
                              <p className="text-gray-600">{appointment.specialty}</p>
                            </div>
                            <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{appointment.hospitalName}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>{format(new Date(appointment.date), "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>{appointment.time}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span>{appointment.patientName}</span>
                            </div>
                          </div>

                          {appointment.symptoms && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">
                                <strong>Symptoms:</strong> {appointment.symptoms}
                              </p>
                            </div>
                          )}

                          <div className="flex space-x-2 mt-4">
                            {appointment.status === "upcoming" && (
                              <>
                                <Button size="sm" variant="outline">
                                  Reschedule
                                </Button>
                                <Button size="sm" variant="outline">
                                  Cancel
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View your payment history and pending payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No payments found</p>
                    </div>
                  ) : (
                    payments.map((payment) => {
                      const appointment = appointments.find((apt) => apt.id === payment.appointmentId)
                      return (
                        <Card key={payment.id} className="border-l-4 border-l-green-500">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-semibold text-lg">₹{payment.amount}</h3>
                                <p className="text-gray-600">
                                  {appointment
                                    ? `${appointment.doctorName} - ${appointment.specialty}`
                                    : "Consultation Fee"}
                                </p>
                              </div>
                              <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span>{format(new Date(payment.date), "MMM d, yyyy")}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <CreditCard className="h-4 w-4 text-gray-400" />
                                <span>{payment.method}</span>
                              </div>
                            </div>

                            {payment.status === "pending" && (
                              <div className="flex space-x-2 mt-4">
                                <Button size="sm">Pay Now</Button>
                                <Button size="sm" variant="outline">
                                  View Invoice
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <p className="mt-1 text-gray-900">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Account Type</label>
                      <p className="mt-1 text-gray-900 capitalize">{user.role}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Member Since</label>
                      <p className="mt-1 text-gray-900">January 2024</p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button>Edit Profile</Button>
                    <Button variant="outline">Change Password</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
