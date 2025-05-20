
# Petchly - Pet Care Services Platform
Petchly is a comprehensive web application designed to connect pet owners with professional pet care services. The platform allows users to book various pet care services, manage appointments, and get AI-powered advice for pet care.

## Features
- **Service Booking**: Schedule appointments for various pet care services
- **Video Conferencing**: Connect with veterinarians and pet care specialists through video calls
- **AI Assistant**: Get instant advice and answers to pet care questions using our AI-powered assistant
- **User Dashboard**: Manage bookings, view appointment history, and track pet care activities
- **Responsive Design**: Fully responsive interface that works on desktop and mobile devices

## Tech Stack
- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **AI Integration**: Groq API with Llama 3.3 70B model
- **Video Conferencing**: Stream Video SDK

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Groq API key (for AI assistant functionality)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Petchly.git
cd Petchly
```
Install dependencies for both frontend and backend:
bash
Run
# Install backend dependenciescd servernpm install# Install frontend dependenciescd ../uinpm install
Create a .env file in the server directory with the following variables:
plaintext
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/petchlyGROQ_API_KEY=your_groq_api_key
```
Replace your_groq_api_key with your actual Groq API key.
Running the Application
Start the backend server:

Run
```bash

cd server
npm start
```
Run Start the frontend development server:
```bash
cd ui
npm start
```
Open your browser and navigate to http://localhost:3000
Project Structure
plaintext

```plaintext
Petchly/
├── server/                # Backend Node.js/Express server
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── index.js           # Server entry point
│
├── ui/                    # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   └── App.js         # Main application component
│   └── package.json       # Frontend dependencies
│
└── README.md              # Project documentation
```    
API Endpoints

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create a new booking |
| GET | `/api/bookings` | Get all bookings |
| POST | `/api/bookings/ai-assistant` | Get AI-powered pet care advice |

### Contributing
Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
License
This project is licensed under the MIT License - see the LICENSE file for details.

### Acknowledgments
[Stream Video SDK](https://getstream.io/video/) for video conferencing capabilities
[Groq](https://groq.com/) for AI assistant functionality
[Tailwind CSS](https://tailwindcss.com/) for styling
[MongoDB](https://www.mongodb.com/) for database services
