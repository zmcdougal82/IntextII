import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faFilm, faUserShield } from '@fortawesome/free-solid-svg-icons';

const AppNavbar = () => {
  const { currentUser, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <FontAwesomeIcon icon={faFilm} className="me-2" />
          Movie Recommendations
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Hodfsame</Nav.Link>
            <Nav.Link as={Link} to="/movies">Mofdsavies</Nav.Link>
            {isAuthenticated() && (
              <Nav.Link as={Link} to="/my-ratings">My Rafdsatings</Nav.Link>
            )}
            {isAdmin() && (
              <Nav.Link as={Link} to="/admin/movies">
                <FontAwesomeIcon icon={faUserShield} className="me-1" />
                Manage Movies
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/privacy">Privacy</Nav.Link>
          </Nav>
          <Nav>
            {isAuthenticated() ? (
              <>
                <Navbar.Text className="me-3">
                  <FontAwesomeIcon icon={faUser} className="me-1" />
                  {currentUser?.name}
                </Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
