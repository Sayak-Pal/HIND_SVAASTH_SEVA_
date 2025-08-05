"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Calendar, Shield, Phone, Mail, MapPin } from "lucide-react"
import Chatbot from "@/components/chatbot"
import { useAuth } from "@/hooks/use-auth"

export default function HomePage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    hospitals: 0,
    doctors: 0,
    patients: 0,
    appointments: 0,
  })

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        hospitals: 25,
        doctors: 150,
        patients: 5000,
        appointments: 12000,
      })
    }, 1000)
  }, [])

  const services = [
    {
      title: "General Consultation",
      description: "Expert medical consultation for all health concerns",
      icon: Heart,
    },
    {
      title: "Specialist Care",
      description: "Access to specialized doctors and treatments",
      icon: Users,
    },
    {
      title: "Emergency Services",
      description: "24/7 emergency medical care and support",
      icon: Shield,
    },
    {
      title: "Health Checkups",
      description: "Comprehensive health screening packages",
      icon: Calendar,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">HIND SWAASTH SEVA</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your trusted healthcare partner providing quality medical services across India. Book appointments, consult
            with expert doctors, and manage your health journey with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={user ? "/book-appointment" : "/login"}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Book Appointment Now
              </Button>
            </Link>
            <Link href="/hospitals">
              <Button size="lg" variant="outline">
                Find Hospitals
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">{stats.hospitals}+</div>
              <div className="text-blue-100">Partner Hospitals</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{stats.doctors}+</div>
              <div className="text-blue-100">Expert Doctors</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{stats.patients}+</div>
              <div className="text-blue-100">Happy Patients</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{stats.appointments}+</div>
              <div className="text-blue-100">Appointments Booked</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <service.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <CardTitle>Book Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Schedule your consultation with our expert doctors</p>
                <Link href={user ? "/book-appointment" : "/login"}>
                  <Button className="w-full">Book Now</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <CardTitle>Health Checkup</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Comprehensive health screening packages</p>
                <Link href={user ? "/book-appointment" : "/login"}>
                  <Button className="w-full">Schedule Checkup</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <CardTitle>Specialist Care</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Connect with specialized healthcare professionals</p>
                <Link href="/hospitals">
                  <Button className="w-full bg-transparent" variant="outline">
                    Find Specialists
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Phone className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">+91 1800-123-4567</p>
              <p className="text-gray-600">24/7 Emergency Helpline</p>
            </div>
            <div>
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-600">info@hindswaasthseva.com</p>
              <p className="text-gray-600">support@hindswaasthseva.com</p>
            </div>
            <div>
              <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Address</h3>
              <p className="text-gray-600">Healthcare Plaza, Sector 18</p>
              <p className="text-gray-600">New Delhi, India - 110001</p>
            </div>
          </div>
        </div>
      </section>

      <Chatbot />
    </div>
  )
}
