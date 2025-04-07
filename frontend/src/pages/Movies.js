import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import MovieFilter from '../components/MovieFilter';
import Pagination from '../components/Pagination';
import movieService from '../services/movieService';

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Get filter values from URL params or use defaults
  const getFiltersFromParams = useCallback(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    const searchTerm = searchParams.get('search') || '';
    const genres = searchParams.getAll('genre');
    
    return {
      page,
      searchTerm,
      genres,
      pageSize: 12 // Fixed page size
    };
  }, [searchParams]);
  
  const [filters, setFilters] = useState(getFiltersFromParams());
  
  // Update URL when filters change
  const updateUrlParams = useCallback((newFilters) => {
    const params = new URLSearchParams();
    
    if (newFilters.page > 1) {
      params.set('page', newFilters.page.toString());
    }
    
    if (newFilters.searchTerm) {
      params.set('search', newFilters.searchTerm);
    }
    
    if (newFilters.genres && newFilters.genres.length > 0) {
      newFilters.genres.forEach(genre => {
        params.append('genre', genre);
      });
    }
    
    setSearchParams(params);
  }, [setSearchParams]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    updateUrlParams(updatedFilters);
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    handleFilterChange({ page });
  };
  
  // Fetch movies based on filters
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await movieService.getMovies({
          page: filters.page,
          pageSize: filters.pageSize,
          searchTerm: filters.searchTerm,
          genres: filters.genres
        });
        
        setMovies(response.movies);
        setTotalPages(response.totalPages);
        setTotalCount(response.totalCount);
      } catch (err) {
        console.error('Error fetching movies:', err);
        // Extract error message or use a default message
        const errorMessage = err.response?.data?.title || 
                            err.response?.data?.message || 
                            err.message || 
                            'Failed to load movies. Please try again later.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, [filters]);
  
  // Sync filters with URL params when URL changes
  useEffect(() => {
    setFilters(getFiltersFromParams());
  }, [searchParams, getFiltersFromParams]);
  
  return (
    <Container className="py-4">
      <h1 className="mb-4">Movies</h1>
      
      <MovieFilter 
        onFilterChange={handleFilterChange}
        initialFilters={{
          searchTerm: filters.searchTerm,
          genres: filters.genres
        }}
      />
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading movies...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : movies.length === 0 ? (
        <Alert variant="info">
          No movies found. Try adjusting your filters.
        </Alert>
      ) : (
        <>
          <p className="text-muted mb-4">
            Showing {movies.length} of {totalCount} movies
          </p>
          
          <Row>
            {movies.map(movie => (
              <Col key={movie.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <MovieCard movie={movie} />
              </Col>
            ))}
          </Row>
          
          <Pagination 
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Container>
  );
};

export default Movies;
