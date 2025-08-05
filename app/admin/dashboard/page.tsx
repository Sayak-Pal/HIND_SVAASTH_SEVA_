"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { Users, Calendar, CreditCard, Activity, Search, Eye, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"

interface User {
  id: string
  name: string
  email: string
  role: "patient" | "admin"
  joinDate: string
  status: "active" | "inactive"
}

interface Appointment {
  id: string
  patientName: string
  patientEmail: string
  hospitalName: string
  doctorName: string
  specialty: string
  date: string
  time: string
  status: "upcoming" | "completed" | "cancelled"
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "admin") {
      router.push("/dashboard")
      return
    }

    fetchAdminData()
  }, [user, router])

  const fetchAdminData = async () => {
    try {
      // Mock data for demonstration
      const mockUsers: User[] = [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          role: "patient",
          joinDate: "2024-01-10",
          status: "active",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "patient",
          joinDate: "2024-01-12",
          status: "active",
        },
        {
          id: "3",
          name: "Dr. Admin",
          email: "admin@example.com",
          role: "admin",
          joinDate: "2024-01-01",
          status: "active",
        },
        {
          id: "4",
          name: "Mike Johnson",
          email: "mike@example.com",
          role: "patient",
          joinDate: "2024-01-15",
          status: "inactive",
        },
      ]

      const mockAppointments: Appointment[] = [
        {
          id: "1",
          patientName: "John Doe",
          patientEmail: "john@example.com",
          hospitalName: "Apollo Hospital",
          doctorName: "Dr. Rajesh Kumar",
          specialty: "Cardiology",
          date: "2024-01-15",
          time: "10:00 AM",
          status: "upcoming",
        },
        {
          id: "2",
          patientName: "Jane Smith",
          patientEmail: "jane@example.com",
          hospitalName: "Max Hospital",
          doctorName: "Dr. Priya Sharma",
          specialty: "Neurology",
          date: "2024-01-10",
          time: "02:30 PM",
          status: "completed",
        },
        {
          id: "3",
          patientName: "Mike Johnson",
          patientEmail: "mike@example.com",
          hospitalName: "Fortis Hospital",
          doctorName: "Dr. Amit Singh",
          specialty: "Orthopedics",
          date: "2024-01-20",
          time: "11:30 AM",
          status: "upcoming",
        },
        {
          id: "4",
          patientName: "Sarah Wilson",
          patientEmail: "sarah@example.com",
          hospitalName: "AIIMS",
          doctorName: "Dr. Sunita Gupta",
          specialty: "Pediatrics",
          date: "2024-01-08",
          time: "09:00 AM",
          status: "cancelled",
        },
      ]

      setUsers(mockUsers)
      setAppointments(mockAppointments)
    } catch (error) {
      console.error("Failed to fetch admin data:", error)
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
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!user || user.role !== "admin") {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === "active").length
  const totalAppointments = appointments.length
  const upcomingAppointments = appointments.filter((apt) => apt.status === "upcoming").length
  const completedAppointments = appointments.filter((apt) => apt.status === "completed").length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, appointments, and system overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">{activeUsers} active users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAppointments}</div>
              <p className="text-xs text-muted-foreground">{upcomingAppointments} upcoming</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Visits</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedAppointments}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹45,230</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users or appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No users found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium">Name</th>
                            <th className="text-left py-3 px-4 font-medium">Email</th>
                            <th className="text-left py-3 px-4 font-medium">Role</th>
                            <th className="text-left py-3 px-4 font-medium">Join Date</th>
                            <th className="text-left py-3 px-4 font-medium">Status</th>
                            <th className="text-left py-3 px-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium">{user.name}</td>
                              <td className="py-3 px-4 text-gray-600">{user.email}</td>
                              <td className="py-3 px-4">
                                <Badge variant="outline" className="capitalize">
                                  {user.role}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-gray-600">
                                {format(new Date(user.joinDate), "MMM d, yyyy")}
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Management</CardTitle>
                <CardDescription>View and manage all appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No appointments found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredAppointments.map((appointment) => (
                        <Card key={appointment.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-semibold text-lg">{appointment.patientName}</h3>
                                <p className="text-gray-600">{appointment.patientEmail}</p>
                              </div>
                              <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
                              <div>
                                <p className="font-medium">Doctor</p>
                                <p className="text-gray-600">{appointment.doctorName}</p>
                                <p className="text-gray-500">{appointment.specialty}</p>
                              </div>
                              <div>
                                <p className="font-medium">Hospital</p>
                                <p className="text-gray-600">{appointment.hospitalName}</p>
                              </div>
                              <div>
                                <p className="font-medium">Date & Time</p>
                                <p className="text-gray-600">{format(new Date(appointment.date), "MMM d, yyyy")}</p>
                                <p className="text-gray-500">{appointment.time}</p>
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                              {appointment.status === "upcoming" && (
                                <Button size="sm" variant="outline">
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart placeholder - User registration over time
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appointment Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart placeholder - Appointments by specialty
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart placeholder - Monthly revenue
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hospital Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart placeholder - Appointments by hospital
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
