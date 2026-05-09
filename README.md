# Food Waste Management & Donation System

## Overview
The Food Waste Management & Donation System is a full-stack web application designed to connect food donors (like restaurants, event organizers, and individuals) with receivers (charities, NGOs, and people in need). The goal is to reduce food waste by facilitating seamless food donations and requests.   

Live Link :- https://food-waste-management-donation-system.onrender.com

## Key Features
- **User Authentication**: Secure sign-up and login using JWT.
- **Role-Based Access**: Distinct functionalities for donors, receivers, and potentially administrators.
- **Donation Listings**: Donors can list available surplus food with relevant details.
- **Request System**: Receivers can browse and request available donations.
- **Email Notifications**: Integrated email service (via SendGrid) for updates on donations and requests.
- **Responsive Design**: Mobile-friendly, modern user interface built with React and Tailwind CSS.

## Tech Stack
### Frontend (Client)
- **Framework**: React 19 (via Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend (Server)
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Email Service**: @sendgrid/mail / nodemailer
- **Image Uploads**: Cloudinary (Supported dependency)

## Prerequisites
Before you begin, ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/en/download/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or MongoDB Atlas)
- Git

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Food-Waste-Management-Donation-System
   ```

2. **Install Client Dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

3. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

## Environment Variables Configuration

You need to create a `.env` file in both the `client` and `server` directories to properly configure the application.

### Server (`server/.env`)
Create a `.env` file in the `server` directory and configure the following variables:
```env
# Server Port
PORT=5000

# MongoDB Connection URI
MONGODB_URI=mongodb://127.0.0.1:27017/food_waste_db

# Frontend URL (for CORS allowance)
FRONTEND_URL=http://localhost:5173

# JSON Web Token
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# SendGrid Email Service Setup
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=your_verified_sendgrid_email@example.com
```

### Client (`client/.env`)
Create a `.env` file in the `client` directory and configure the following variables:
```env
# Backend API URL (Ensure this matches your server port)
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME="Food Waste Management System"
```

## Running the Application

To run the application locally, you will need two separate terminal windows (one for the server and one for the client). The root `package.json` provides scripts to easily start them.

1. **Start the Backend Server:**
   Open a terminal in the root directory and run:
   ```bash
   npm run server
   ```
   *The backend API will start on http://localhost:5000 (or the port defined in your .env)*

2. **Start the Frontend Client:**
   Open a second terminal in the root directory and run:
   ```bash
   npm run client
   ```
   *The React app will automatically open in your browser at http://localhost:5173*
   
   *(Note: Running `npm run dev` in the root directory will also start the client).*

## License
This project is licensed under the ISC License.
