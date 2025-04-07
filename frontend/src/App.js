import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import UserRatings from './pages/UserRatings';
import Privacy from './pages/Privacy';
import ManageMovies from './pages/admin/ManageMovies';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movies/:id" element={<MovieDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/privacy" element={<Privacy />} />
              
              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/my-ratings" element={<UserRatings />} />
              </Route>
              
              {/* Admin Routes */}
              <Route element={<PrivateRoute adminOnly={true} />}>
                <Route path="/admin/movies" element={<ManageMovies />} />
              </Route>
              
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="bg-dark text-white py-4 mt-auto">
            <Container>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                <div className="mb-3 mb-md-0">
                  <p className="mb-0">&copy; {new Date().getFullYear()} Movie Recommendation App</p>
                </div>
                <div>
                  <a href="/privacy" className="text-white text-decoration-none me-3">Privacy Policy</a>
                  <a href="mailto:contact@movierecommendation.com" className="text-white text-decoration-none">Contact Us</a>
                </div>
              </div>
            </Container>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
