"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Chatbot from "@/components/chatbot"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent Successfully",
        description: "We'll get back to you within 24 hours.",
      })
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
      setLoading(false)
    }, 1000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with us for any questions, concerns, or to schedule an appointment. We're here to help you with
            all your healthcare needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Contact Cards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span>Phone</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">Emergency Helpline</p>
                    <p className="text-blue-600">+91 1800-123-4567</p>
                    <p className="text-sm text-gray-600">Available 24/7</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="font-medium">General Inquiries</p>
                    <p className="text-blue-600">+91 11-2345-6789</p>
                    <p className="text-sm text-gray-600">Mon-Sat: 9:00 AM - 6:00 PM</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span>Email</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">General Support</p>
                    <p className="text-blue-600">info@hindswaasthseva.com</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="font-medium">Appointments</p>
                    <p className="text-blue-600">appointments@hindswaasthseva.com</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="font-medium">Emergency</p>
                    <p className="text-blue-600">emergency@hindswaasthseva.com</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span>Address</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">Main Office</p>
                    <p className="text-gray-600">
                      Healthcare Plaza, Sector 18
                      <br />
                      New Delhi, India - 110001
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>Working Hours</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturday</span>
                      <span className="font-medium">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sunday</span>
                      <span className="font-medium">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Emergency</span>
                        <span className="font-medium text-red-600">24/7 Available</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="appointment">Appointment Booking</SelectItem>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="billing">Billing & Insurance</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Please describe your inquiry in detail..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">How do I book an appointment?</h4>
                    <p className="text-sm text-gray-600">
                      You can book an appointment online through our website, call our helpline, or visit any of our
                      partner hospitals directly.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">What insurance plans do you accept?</h4>
                    <p className="text-sm text-gray-600">
                      We accept most major insurance plans. Please contact us with your insurance details to verify
                      coverage.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Do you provide emergency services?</h4>
                    <p className="text-sm text-gray-600">
                      Yes, we provide 24/7 emergency services. Call our emergency helpline +91 1800-123-4567 for
                      immediate assistance.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Can I reschedule my appointment?</h4>
                    <p className="text-sm text-gray-600">
                      Yes, you can reschedule your appointment up to 24 hours before the scheduled time through your
                      patient dashboard or by calling us.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Chatbot />
    </div>
  )
}
