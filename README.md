# HIND SWAASTH SEVA - Healthcare Management System

A comprehensive full-stack healthcare web application built with Next.js, React, and MongoDB. The platform provides seamless healthcare services including appointment booking, hospital listings, patient management, and an intelligent chatbot assistant.

## 🌟 Features

### Public Features (No Login Required)
- **Landing Page**: Overview of services with call-to-action buttons
- **Hospital & Doctor Listings**: Browse healthcare providers with search and filters
- **Services Information**: Detailed information about available medical services
- **Contact Information**: Multiple ways to reach support.
- **Chatbot Widget**: AI-powered assistant available on all pages

### Authentication System
- **User Registration**: Create patient or admin accounts
- **Secure Login**: JWT-based authentication with token storage
- **Role-based Access**: Different permissions for patients and administrators

### Protected Features (Login Required)
- **Appointment Booking**: Schedule consultations with preferred doctors
- **Payment Integration**: Placeholder for future payment gateway integration
- **Patient Dashboard**: View appointments, payments, and medical history
- **Admin Dashboard**: Comprehensive management of users and appointments

### Chatbot Features
- **24/7 Availability**: Always accessible chat widget
- **FAQ Responses**: Answers common healthcare questions
- **Navigation Assistance**: Helps users find what they need
- **Contextual Help**: Provides relevant information based on user queries

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **React 18**: Modern React with hooks and context
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI components
- **Lucide React**: Beautiful icons

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing and security

### Additional Features
- **TypeScript**: Type-safe development
- **Responsive Design**: Mobile-first approach
- **Loading States**: Enhanced user experience
- **Toast Notifications**: User feedback system

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or cloud)
- Git for version control

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd hind-swaasth-seva
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Update the environment variables:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/hind-swaasth-seva
   JWT_SECRET=your-super-secret-jwt-key-here
   \`\`\`

4. **Database Setup**
   - Start your MongoDB server
   - The application will automatically create collections on first run
   - Optional: Run the SQL scripts in `/scripts` folder for initial data

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### For Patients
1. **Register/Login**: Create an account or sign in
2. **Browse Hospitals**: Find healthcare providers near you
3. **Book Appointments**: Schedule consultations with doctors
4. **Manage Profile**: View appointments and payment history
5. **Use Chatbot**: Get instant help and information

### For Administrators
1. **Admin Login**: Sign in with admin credentials
2. **User Management**: View and manage all registered users
3. **Appointment Oversight**: Monitor all appointments across the system
4. **Analytics**: View system statistics and performance metrics

### Demo Accounts
- **Patient**: `patient@demo.com` / `password123`
- **Admin**: `admin@demo.com` / `password123`

## 🏗️ Project Structure

\`\`\`
hind-swaasth-seva/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   └── appointments/         # Appointment management
│   ├── admin/                    # Admin-only pages
│   ├── book-appointment/         # Appointment booking
│   ├── dashboard/                # User dashboard
│   ├── hospitals/                # Hospital listings
│   ├── services/                 # Services information
│   └── contact/                  # Contact page
├── components/                   # Reusable React components
│   ├── ui/                       # shadcn/ui components
│   ├── chatbot.tsx              # Chatbot widget
│   ├── navbar.tsx               # Navigation component
│   └── footer.tsx               # Footer component
├── contexts/                     # React contexts
│   └── auth-context.tsx         # Authentication context
├── hooks/                        # Custom React hooks
│   └── use-auth.ts              # Authentication hook
├── lib/                          # Utility libraries
│   ├── mongodb.ts               # Database connection
│   └── utils.ts                 # Helper functions
├── models/                       # Database models
│   ├── user.ts                  # User schema
│   └── appointment.ts           # Appointment schema
├── scripts/                      # Database scripts
│   ├── create-tables.sql        # Table creation
│   └── seed-data.sql            # Sample data
└── README.md                     # Project documentation
\`\`\`

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation
- **CORS Protection**: Configured for security
- **Environment Variables**: Sensitive data protection

## 🎨 UI/UX Features

- **Responsive Design**: Works on all device sizes
- **Dark/Light Mode**: Theme support (can be extended)
- **Loading States**: Skeleton loaders and spinners
- **Toast Notifications**: User feedback system
- **Accessible**: ARIA labels and keyboard navigation
- **Modern Design**: Clean, professional healthcare theme

## 🤖 Chatbot Capabilities

The integrated chatbot can help users with:
- **Appointment Booking**: Guide through the booking process
- **Service Information**: Explain available medical services
- **Hospital Locations**: Provide hospital details and directions
- **FAQ Responses**: Answer common healthcare questions
- **Navigation Help**: Assist with website navigation
- **Contact Information**: Provide support contact details

## 🔮 Future Enhancements

### Planned Features
- **Payment Gateway Integration**: Razorpay/Stripe integration
- **Email Notifications**: Appointment confirmations and reminders
- **SMS Alerts**: Text message notifications
- **Video Consultations**: Telemedicine capabilities
- **Medical Records**: Digital health record management
- **Prescription Management**: Digital prescription system
- **Insurance Integration**: Insurance claim processing
- **Multi-language Support**: Regional language options

### Technical Improvements
- **Real-time Updates**: WebSocket integration
- **Advanced Analytics**: Detailed reporting dashboard
- **Mobile App**: React Native companion app
- **AI Enhancements**: Smarter chatbot with NLP
- **Performance Optimization**: Caching and CDN integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Email**: support@hindswaasthseva.com
- **Phone**: +91 1800-123-4567
- **Documentation**: Check this README and inline code comments
- **Issues**: Create a GitHub issue for bugs or feature requests

## 🙏 Acknowledgments

- **shadcn/ui**: For the beautiful UI components
- **Lucide**: For the comprehensive icon library
- **Next.js Team**: For the amazing React framework
- **MongoDB**: For the flexible database solution
- **Tailwind CSS**: For the utility-first CSS framework

---

**HIND SWAASTH SEVA** - Making healthcare accessible and digital for everyone in India. 🇮🇳
