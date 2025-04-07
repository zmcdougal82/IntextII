import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Table, 
  Button, 
  Form, 
  Modal, 
  Alert, 
  Spinner, 
  Badge,
  Row,
  Col,
  InputGroup
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faTrashAlt, 
  faPlus, 
  faSearch,
  faSave,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import movieService from '../../services/movieService';
import Pagination from '../../components/Pagination';

const ManageMovies = () => {
  // State for movie list
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for movie form
  const [showModal, setShowModal] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    director: '',
    cast: '',
    country: '',
    releaseYear: '',
    rating: '',
    duration: '',
    description: '',
    type: '',
    genres: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(null);
  
  // State for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMovieId, setDeleteMovieId] = useState(null);
  const [deleteMovieTitle, setDeleteMovieTitle] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  
  // State for available genres
  const [availableGenres, setAvailableGenres] = useState([]);
  const [genresLoading, setGenresLoading] = useState(false);
  
  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await movieService.getMovies({
          page: currentPage,
          pageSize: pageSize,
          searchTerm: searchTerm
        });
        
        setMovies(response.movies);
        setTotalPages(response.totalPages);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, [currentPage, pageSize, searchTerm]);
  
  // Fetch available genres
  useEffect(() => {
    const fetchGenres = async () => {
      setGenresLoading(true);
      
      try {
        const genres = await movieService.getGenres();
        setAvailableGenres(genres);
      } catch (err) {
        console.error('Error fetching genres:', err);
      } finally {
        setGenresLoading(false);
      }
    };
    
    fetchGenres();
  }, []);
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Handle page size change
  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to first page when changing page size
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };
  
  // Open add movie modal
  const handleAddMovie = () => {
    setFormMode('add');
    setFormData({
      id: '',
      title: '',
      director: '',
      cast: '',
      country: '',
      releaseYear: '',
      rating: '',
      duration: '',
      description: '',
      type: '',
      genres: []
    });
    setFormErrors({});
    setFormError(null);
    setFormSuccess(false);
    setShowModal(true);
  };
  
  // Open edit movie modal
  const handleEditMovie = (movie) => {
    setFormMode('edit');
    setFormData({
      id: movie.id,
      title: movie.title || '',
      director: movie.director || '',
      cast: movie.cast || '',
      country: movie.country || '',
      releaseYear: movie.releaseYear || '',
      rating: movie.rating || '',
      duration: movie.duration || '',
      description: movie.description || '',
      type: movie.type || '',
      genres: movie.genres || []
    });
    setFormErrors({});
    setFormError(null);
    setFormSuccess(false);
    setShowModal(true);
  };
  
  // Open delete confirmation modal
  const handleDeleteClick = (movie) => {
    setDeleteMovieId(movie.id);
    setDeleteMovieTitle(movie.title);
    setDeleteError(null);
    setShowDeleteModal(true);
  };
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field-specific error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // Handle genre toggle
  const handleGenreToggle = (genre) => {
    setFormData(prevData => {
      const genres = [...prevData.genres];
      
      if (genres.includes(genre)) {
        return {
          ...prevData,
          genres: genres.filter(g => g !== genre)
        };
      } else {
        return {
          ...prevData,
          genres: [...genres, genre]
        };
      }
    });
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (formData.releaseYear && (isNaN(formData.releaseYear) || formData.releaseYear < 1800 || formData.releaseYear > new Date().getFullYear())) {
      errors.releaseYear = 'Please enter a valid year';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setFormSubmitting(true);
    setFormError(null);
    setFormSuccess(false);
    
    try {
      if (formMode === 'add') {
        await movieService.createMovie(formData);
      } else {
        await movieService.updateMovie(formData.id, formData);
      }
      
      setFormSuccess(true);
      
      // Refresh movie list
      const response = await movieService.getMovies({
        page: currentPage,
        pageSize: pageSize,
        searchTerm: searchTerm
      });
      
      setMovies(response.movies);
      setTotalPages(response.totalPages);
      
      // Close modal after a short delay
      setTimeout(() => {
        setShowModal(false);
      }, 1500);
    } catch (err) {
      console.error('Error saving movie:', err);
      setFormError('Failed to save movie. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };
  
  // Handle movie deletion
  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    
    try {
      await movieService.deleteMovie(deleteMovieId);
      
      // Refresh movie list
      const response = await movieService.getMovies({
        page: currentPage,
        pageSize: pageSize,
        searchTerm: searchTerm
      });
      
      setMovies(response.movies);
      setTotalPages(response.totalPages);
      
      // Close modal
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting movie:', err);
      setDeleteError('Failed to delete movie. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };
  
  return (
    <Container className="py-5">
      <h1 className="mb-4">Manage Movies</h1>
      
      {/* Search and Add */}
      <Row className="mb-4">
        <Col md={8}>
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="primary" type="submit">
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </InputGroup>
          </Form>
        </Col>
        <Col md={4} className="d-flex justify-content-end">
          <Button variant="success" onClick={handleAddMovie}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add Movie
          </Button>
        </Col>
      </Row>
      
      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      {/* Page Size Selector */}
      <div className="d-flex justify-content-end mb-3">
        <Form.Group controlId="pageSize" className="d-flex align-items-center">
          <Form.Label className="me-2 mb-0">Items per page:</Form.Label>
          <Form.Select
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{ width: '80px' }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </Form.Select>
        </Form.Group>
      </div>
      
      {/* Movies Table */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading movies...</p>
        </div>
      ) : movies.length === 0 ? (
        <Alert variant="info">
          No movies found. Try adjusting your search or add a new movie.
        </Alert>
      ) : (
        <>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Director</th>
                  <th>Year</th>
                  <th>Rating</th>
                  <th>Genres</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map(movie => (
                  <tr key={movie.id}>
                    <td>{movie.title}</td>
                    <td>{movie.director || '-'}</td>
                    <td>{movie.releaseYear || '-'}</td>
                    <td>{movie.rating || '-'}</td>
                    <td>
                      {movie.genres && movie.genres.length > 0 ? (
                        <div className="d-flex flex-wrap">
                          {movie.genres.slice(0, 3).map((genre, index) => (
                            <Badge bg="secondary" className="me-1 mb-1" key={index}>
                              {genre}
                            </Badge>
                          ))}
                          {movie.genres.length > 3 && (
                            <Badge bg="secondary" className="me-1 mb-1">
                              +{movie.genres.length - 3}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditMovie(movie)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteClick(movie)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
      
      {/* Add/Edit Movie Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {formMode === 'add' ? 'Add New Movie' : 'Edit Movie'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formSuccess && (
            <Alert variant="success" className="mb-4">
              Movie {formMode === 'add' ? 'added' : 'updated'} successfully!
            </Alert>
          )}
          
          {formError && (
            <Alert variant="danger" className="mb-4">
              {formError}
            </Alert>
          )}
          
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="title">
                  <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.title}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3" controlId="director">
                  <Form.Label>Director</Form.Label>
                  <Form.Control
                    type="text"
                    name="director"
                    value={formData.director}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3" controlId="releaseYear">
                  <Form.Label>Release Year</Form.Label>
                  <Form.Control
                    type="number"
                    name="releaseYear"
                    value={formData.releaseYear}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.releaseYear}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.releaseYear}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3" controlId="rating">
                  <Form.Label>Rating</Form.Label>
                  <Form.Select
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                  >
                    <option value="">Select rating</option>
                    <option value="G">G</option>
                    <option value="PG">PG</option>
                    <option value="PG-13">PG-13</option>
                    <option value="R">R</option>
                    <option value="NC-17">NC-17</option>
                    <option value="TV-Y">TV-Y</option>
                    <option value="TV-Y7">TV-Y7</option>
                    <option value="TV-G">TV-G</option>
                    <option value="TV-PG">TV-PG</option>
                    <option value="TV-14">TV-14</option>
                    <option value="TV-MA">TV-MA</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3" controlId="duration">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="text"
                    name="duration"
                    placeholder="e.g., 120 min or 2 seasons"
                    value={formData.duration}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3" controlId="type">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="">Select type</option>
                    <option value="Movie">Movie</option>
                    <option value="TV Show">TV Show</option>
                    <option value="Documentary">Documentary</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3" controlId="country">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3" controlId="cast">
                  <Form.Label>Cast</Form.Label>
                  <Form.Control
                    type="text"
                    name="cast"
                    placeholder="Comma-separated list of actors"
                    value={formData.cast}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Genres</Form.Label>
                  {genresLoading ? (
                    <div className="text-center py-2">
                      <Spinner animation="border" size="sm" />
                      <span className="ms-2">Loading genres...</span>
                    </div>
                  ) : (
                    <div className="d-flex flex-wrap">
                      {availableGenres.map((genre) => (
                        <Badge
                          key={genre}
                          bg={formData.genres.includes(genre) ? "primary" : "secondary"}
                          className="me-2 mb-2 p-2"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleGenreToggle(genre)}
                        >
                          {genre}
                          {formData.genres.includes(genre) && (
                            <FontAwesomeIcon icon={faTimes} className="ms-1" />
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end mt-3">
              <Button 
                variant="secondary" 
                className="me-2"
                onClick={() => setShowModal(false)}
                disabled={formSubmitting}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={formSubmitting}
              >
                {formSubmitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteError && (
            <Alert variant="danger" className="mb-4">
              {deleteError}
            </Alert>
          )}
          
          <p>
            Are you sure you want to delete the movie "{deleteMovieTitle}"?
            This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faTrashAlt} className="me-2" />
                Delete
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageMovies;
