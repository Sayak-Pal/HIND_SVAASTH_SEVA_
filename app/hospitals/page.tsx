"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Star, Search, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Chatbot from "@/components/chatbot"

interface Hospital {
  id: string
  name: string
  address: string
  city: string
  state: string
  phone: string
  rating: number
  specialties: string[]
  doctors: number
  image: string
}

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState("all")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch hospitals
    const fetchHospitals = async () => {
      setLoading(true)
      // Mock data
      const mockHospitals: Hospital[] = [
        {
          id: "1",
          name: "Apollo Hospital",
          address: "Sarita Vihar, Mathura Road",
          city: "New Delhi",
          state: "Delhi",
          phone: "+91 11 2692 5858",
          rating: 4.5,
          specialties: ["Cardiology", "Neurology", "Oncology", "Orthopedics"],
          doctors: 45,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "2",
          name: "Fortis Hospital",
          address: "Sector 62, Phase VIII",
          city: "Mohali",
          state: "Punjab",
          phone: "+91 172 521 0000",
          rating: 4.3,
          specialties: ["Cardiology", "Gastroenterology", "Nephrology"],
          doctors: 38,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "3",
          name: "Max Super Speciality Hospital",
          address: "Press Enclave Road, Saket",
          city: "New Delhi",
          state: "Delhi",
          phone: "+91 11 2651 5050",
          rating: 4.4,
          specialties: ["Oncology", "Neurology", "Cardiology", "Pediatrics"],
          doctors: 52,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "4",
          name: "Manipal Hospital",
          address: "HAL Airport Road",
          city: "Bangalore",
          state: "Karnataka",
          phone: "+91 80 2502 4444",
          rating: 4.2,
          specialties: ["Orthopedics", "Dermatology", "ENT", "Ophthalmology"],
          doctors: 41,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "5",
          name: "Kokilaben Dhirubhai Ambani Hospital",
          address: "Rao Saheb Achutrao Patwardhan Marg",
          city: "Mumbai",
          state: "Maharashtra",
          phone: "+91 22 4269 6969",
          rating: 4.6,
          specialties: ["Cardiology", "Neurology", "Oncology", "Transplant"],
          doctors: 67,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "6",
          name: "AIIMS",
          address: "Ansari Nagar",
          city: "New Delhi",
          state: "Delhi",
          phone: "+91 11 2658 8500",
          rating: 4.7,
          specialties: ["All Specialties", "Research", "Emergency"],
          doctors: 89,
          image: "/placeholder.svg?height=200&width=300",
        },
      ]

      setTimeout(() => {
        setHospitals(mockHospitals)
        setFilteredHospitals(mockHospitals)
        setLoading(false)
      }, 1000)
    }

    fetchHospitals()
  }, [])

  useEffect(() => {
    let filtered = hospitals

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (hospital) =>
          hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by city
    if (selectedCity !== "all") {
      filtered = filtered.filter((hospital) => hospital.city === selectedCity)
    }

    // Filter by specialty
    if (selectedSpecialty !== "all") {
      filtered = filtered.filter((hospital) => hospital.specialties.includes(selectedSpecialty))
    }

    setFilteredHospitals(filtered)
  }, [hospitals, searchTerm, selectedCity, selectedSpecialty])

  const cities = Array.from(new Set(hospitals.map((h) => h.city)))
  const specialties = Array.from(new Set(hospitals.flatMap((h) => h.specialties)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Partner Hospitals</h1>
            <p className="text-gray-600">Loading hospitals...</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Partner Hospitals</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find the best healthcare facilities near you. We partner with top hospitals across India to provide you with
            quality medical care.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search hospitals, cities, or specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Select Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedCity("all")
                setSelectedSpecialty("all")
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredHospitals.length} of {hospitals.length} hospitals
          </p>
        </div>

        {/* Hospital Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital) => (
            <Card key={hospital.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={hospital.image || "/placeholder.svg"}
                  alt={hospital.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{hospital.rating}</span>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-lg">{hospital.name}</CardTitle>
                <CardDescription className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span>
                    {hospital.address}, {hospital.city}, {hospital.state}
                  </span>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{hospital.phone}</span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">{hospital.doctors} Doctors Available</p>
                    <div className="flex flex-wrap gap-1">
                      {hospital.specialties.slice(0, 3).map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {hospital.specialties.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{hospital.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button className="flex-1" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Book Appointment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredHospitals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hospitals found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => {
                setSearchTerm("")
                setSelectedCity("all")
                setSelectedSpecialty("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <Chatbot />
    </div>
  )
}
