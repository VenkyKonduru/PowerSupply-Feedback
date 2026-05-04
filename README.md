# PowerPulse | Power Supply Feedback Portal ⚡

A premium, full-stack feedback management system designed for seamless communication between residents and utility administrators. PowerPulse provides a secure and efficient way to report, track, and resolve power utility issues.

![PowerPulse Mockup](https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200&h=400)

## ✨ Features

- **Dual-Portal Access**: Dedicated interfaces for Residents (Report Issues) and Administrators (Manage Feedback).
- **Secure Authentication**: JWT-based security with password hashing (Bcrypt) and role-based access control.
- **Admin Approval Workflow**: Robust security where new admin accounts must be approved by a super-admin before gaining access.
- **Secure Password Reset**: Secure token-based password reset flow with automated email delivery via Nodemailer.
- **Feedback Lifecycle Management**: Track reports from 'Pending' to 'In Progress' and 'Resolved' with real-time status updates.
- **Modern UI/UX**: Premium "Glassmorphism" design system with responsive layouts, smooth animations, and intuitive navigation.
- **Email Notifications**: Automated alerts for administrators when new feedback is submitted.
- **Interactive Dashboard**: Bento-grid style admin dashboard for quick overview of pending approvals and recent reports.

## 🛠️ Tech Stack

**Frontend:**
- Vanilla HTML5 & CSS3 (Custom Design System)
- JavaScript (ES6+)
- Axios (API Communication)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Database & ODM)
- JSON Web Tokens (Authentication)
- Nodemailer (Email Services)

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB instance (Local or Atlas)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/VenkyKonduru/PowerSupply-Feedback.git
   cd PowerSupply-Feedback
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ADMIN_EMAIL=main_admin_to_receive_alerts@example.com
   ```

4. **Run the Application**
   ```bash
   npm start
   # or
   node server.js
   ```
   The portal will be accessible at `http://localhost:5000`.

## 📂 Project Structure

```text
├── backend/
│   ├── middleware/   # JWT & Role validation
│   ├── models/       # Mongoose Schemas (User, Feedback)
│   ├── routes/       # API Endpoints (Auth, Feedback)
│   ├── utils/        # Utilities (sendEmail)
│   ├── server.js     # Entry point & App configuration
│   └── .env          # Environment variables
├── frontend/
│   ├── index.html    # Login page
│   ├── register.html # Registration page
│   ├── dashboard.html # Resident portal
│   ├── admin-dashboard.html # Administrator portal
│   ├── reset-password.html  # Secure token-based password reset
│   ├── style.css     # Global styles & Design system
│   └── app.js        # Frontend logic & API calls
└── README.md
```

## 🔒 Demo Credentials

- **Resident**: `user@test.com` | `password123`
- **Administrator**: `powersupplyfeedback@powerpulse.com` | `admin123`

---
Developed with ❤️ for efficient utility management.
