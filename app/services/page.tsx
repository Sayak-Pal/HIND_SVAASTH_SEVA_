import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, Calendar, Shield, Stethoscope, Brain, Bone, Eye, Baby, Activity } from "lucide-react";
import Link from "next/link";
import Chatbot from "@/components/chatbot";

export default function ServicesPage() {
  const services = [
    {
      title: "General Consultation",
      description: "Comprehensive medical consultation for all your health concerns with experienced general practitioners.",
      icon: Stethoscope,
      features: ["Initial diagnosis", "Health screening", "Preventive care", "Referrals to specialists"],
      price: "₹500 - ₹1,000"
    },
    {
      title: "Cardiology",
      description: "Expert cardiac care including heart disease prevention, diagnosis, and treatment.",
      icon: Heart,
      features: ["ECG & Echo tests", "Heart disease treatment", "Cardiac surgery", "Preventive cardiology"],
      price: "₹1,200 - ₹2,500"
    },
    {
      title: "Neurology",
      description: "Specialized care for brain, spine, and nervous system disorders.",
      icon: Brain,
      features: ["Neurological examination", "Brain imaging", "Stroke treatment", "Epilepsy management"],
      price: "₹1,500 - ₹3,000"
    },
    {
      title: "Orthopedics",
      description: "Complete bone, joint, and musculoskeletal system care and treatment.",
      icon: Bone,
      features: ["Joint replacement", "Fracture treatment", "Sports injuries", "Arthritis management"],
      price: "₹1,000 - ₹2,000"
    },
    {
      title: "Ophthalmology",
      description: "Comprehensive eye care services including vision correction and eye surgery.",
      icon: Eye,
      features: ["Eye examinations", "Cataract surgery", "Retinal treatment", "Vision correction"],
      price: "₹800 - ₹1,800"
    },
    {
      title: "Pediatrics",
      description: "Specialized healthcare services for infants, children, and adolescents.",
      icon: Baby,
      features: ["Child health checkups", "Vaccination", "Growth monitoring", "Pediatric emergencies"],
      price: "₹600 - ₹1,200"
    },
    {
      title: "Emergency Services",
      description: "24/7 emergency medical care for critical and urgent health situations.",
      icon: Shield,
      features: ["24/7 availability", "Trauma care", "Critical care", "Emergency surgery"],
      price: "₹2,000 - ₹10,000"
    },
    {
      title: "Health Checkups",
      description: "Comprehensive health screening packages for early detection and prevention.",
      icon: Activity,
      features: ["Full body checkup", "Blood tests", "Imaging studies", "Health reports"],
      price: "₹3,000 - ₹8,000"
    },
    {
      title: "Specialist Care",
      description: "Access to specialized doctors across various medical disciplines.",
      icon: Users,
      features: ["Expert consultations", "Advanced treatments", "Multidisciplinary care", "Follow-up support"],
      price: "₹1,500 - ₹4,000"
    }
  ];

  const packages = [
    {
      name: "Basic Health Package",
      price: "₹2,999",
      duration: "Annual",
      features: [
        "2 General consultations",
        "Basic blood tests",
        "Blood pressure monitoring",
        "BMI assessment",
        "Health report"
      ]
    },
    {
      name: "Comprehensive Package",
      price: "₹7,999",
      duration: "Annual",
      features: [
        "4 General consultations",
        "2 Specialist consultations",
        "Complete blood panel",
        "ECG & X-ray",
        "Diabetes screening",
        "Health report with recommendations"
      ],
      popular: true
    },
    {
      name: "Premium Care Package",
      price: "₹15,999",
      duration: "Annual",
      features: [
        "Unlimited consultations",
        "All specialist access",
        "Advanced imaging (MRI/CT)",
        "Cardiac screening",
        "Cancer screening",
        "Dedicated health manager",
        "Priority appointments"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Medical Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive healthcare services delivered by expert medical professionals 
            using state-of-the-art technology and compassionate care.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <service.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <p className="text-sm text-green-600 font-medium">{service.price}</p>
                  </div>
                </div>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">What's Included:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="w-full">
                    Book Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Health Packages */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Health Packages</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive health packages designed to meet your specific needs 
              and budget. All packages include follow-up consultations and health reports.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className={`relative ${pkg.popular ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-blue-600">{pkg.price}</span>
                    <span className="text-gray-600">/{pkg.duration}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${pkg.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    variant={pkg.popular ? 'default' : 'outline'}
                  >
                    Choose Package
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Why Choose HIND SWAASTH SEVA?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Expert Doctors</h3>
              <p className="text-sm text-gray-600">Qualified and experienced medical professionals</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-600">Round-the-clock emergency and support services</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Easy Booking</h3>
              <p className="text-sm text-gray-600">Simple online appointment booking system</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Quality Care</h3>
              <p className="text-sm text-gray-600">Compassionate and personalized healthcare</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6">
            Book your appointment today and take the first step towards better health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-appointment">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Book Appointment Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Chatbot />
    </div>
  );
}
