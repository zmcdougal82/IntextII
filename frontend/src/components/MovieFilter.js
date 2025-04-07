import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';
import movieService from '../services/movieService';

const MovieFilter = ({ onFilterChange, initialFilters = {} }) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || '');
  const [selectedGenres, setSelectedGenres] = useState(initialFilters.genres || []);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      try {
        const genres = await movieService.getGenres();
        setAvailableGenres(genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const handleGenreToggle = (genre) => {
    setSelectedGenres(prevGenres => {
      if (prevGenres.includes(genre)) {
        return prevGenres.filter(g => g !== genre);
      } else {
        return [...prevGenres, genre];
      }
    });
  };

  const applyFilters = () => {
    onFilterChange({
      searchTerm,
      genres: selectedGenres,
      page: 1 // Reset to first page when filters change
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenres([]);
    onFilterChange({
      searchTerm: '',
      genres: [],
      page: 1
    });
  };

  return (
    <div className="movie-filter mb-4">
      <Form onSubmit={handleSearch}>
        <Row className="align-items-center">
          <Col xs={12} md={6} lg={8}>
            <Form.Group className="mb-3 mb-md-0">
              <div className="input-group">
                <Form.Control
                  type="text"
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="primary" type="submit">
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </div>
            </Form.Group>
          </Col>
          <Col xs={12} md={6} lg={4} className="d-flex justify-content-md-end">
            <Button 
              variant="outline-secondary" 
              className="me-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FontAwesomeIcon icon={faFilter} className="me-1" />
              Filters {selectedGenres.length > 0 && `(${selectedGenres.length})`}
            </Button>
            {(searchTerm || selectedGenres.length > 0) && (
              <Button 
                variant="outline-danger"
                onClick={clearFilters}
              >
                <FontAwesomeIcon icon={faTimes} className="me-1" />
                Clear
              </Button>
            )}
          </Col>
        </Row>
        
        {showFilters && (
          <div className="filter-options mt-3 p-3 border rounded">
            <h5>Genres</h5>
            {loading ? (
              <p>Loading genres...</p>
            ) : (
              <div className="genre-list">
                {availableGenres.map((genre) => (
                  <Badge
                    key={genre}
                    bg={selectedGenres.includes(genre) ? "primary" : "secondary"}
                    className="me-2 mb-2 p-2 genre-badge"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleGenreToggle(genre)}
                  >
                    {genre}
                    {selectedGenres.includes(genre) && (
                      <FontAwesomeIcon icon={faTimes} className="ms-1" />
                    )}
                  </Badge>
                ))}
              </div>
            )}
            <div className="mt-3">
              <Button 
                variant="primary" 
                onClick={applyFilters}
                className="me-2"
              >
                Apply Filters
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowFilters(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
};

export default MovieFilter;
