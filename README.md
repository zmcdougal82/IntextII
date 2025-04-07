# Movie Recommendation Web Application

A modern, professional full-stack movie recommendation web application built with .NET Core API 8.0 and React.

## Features

### User Features

- **Home Page**: A clean, modern landing page that introduces the site.
- **Create Account Page**: Allows users to register by entering account information.
- **Login Page**: Allows users to log in securely.
- **Movie Page**:
  - Displays movie cards with images and titles
  - Supports filtering by genre and searching by title
  - Implements infinite scroll for loading more movies
- **Movie Detail Page**:
  - Shows full movie information
  - Allows users to rate movies
- **Privacy Page**: Displays the website's privacy policy.

### Admin Features

- **Manage Movies**:
  - Add, edit, and delete movies
  - Paginated view with adjustable page size
  - Dynamic pagination

## Technology Stack

- **Backend**: .NET Core API 8.0
- **Frontend**: React
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Bootstrap 5 with custom CSS

## Project Structure

```
/
├── backend/                # .NET Core API project
│   ├── Controllers/        # API controllers
│   ├── Data/               # Database context
│   ├── DTOs/               # Data Transfer Objects
│   ├── Models/             # Database models
│   └── Properties/         # Project properties
│
├── frontend/               # React frontend
│   ├── public/             # Static files
│   └── src/
│       ├── assets/         # Images and other assets
│       ├── components/     # Reusable UI components
│       ├── context/        # React context providers
│       ├── pages/          # Page components
│       └── services/       # API services
│
└── Movies.db               # SQLite database
```

## Getting Started

### Prerequisites

- [.NET SDK 8.0](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (v6 or later)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd movie-recommendation-app
   ```

2. Install dependencies:
   ```
   npm run install-all
   ```

3. Run the application:
   ```
   npm run dev
   ```

This will start both the backend API and the React frontend concurrently.

- Backend API: http://localhost:5000
- Frontend: http://localhost:3000

## Usage

### User Access

- Browse movies without logging in
- Create an account to rate movies
- View and manage your ratings

### Admin Access

To access admin features, log in with an admin account:
- Email: admin@example.com
- Password: Admin123!

## License

This project is licensed under the MIT License - see the LICENSE file for details.
