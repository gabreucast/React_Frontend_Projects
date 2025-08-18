import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import laptopService from '../../services/laptopService';
import '../../styles/ProductCatalog.css'

const ProductCatalog = () => {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    brand: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });
  const [brands, setBrands] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadBrands();
    loadLaptops();
  }, [filters]);

  const loadBrands = async () => {
    try {
      const response = await laptopService.getBrands();
      setBrands(response.data || []);
    } catch (err) {
      console.error('Error loading brands:', err);
    }
  };

  const loadLaptops = async () => {
    try {
      setLoading(true);
      const response = await laptopService.getAll(filters);
      setLaptops(response.data || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar los productos');
      console.error('Error loading laptops:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      brand: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    });
  };

  const formatPrice = (price, currency = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="star half" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star empty" />);
    }

    return stars;
  };

  if (loading && laptops.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={loadLaptops} className="retry-btn">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="product-catalog">
      {/* Header del catálogo */}
      <div className="catalog-header">
        <h1>Catálogo de Laptops</h1>
        <p>Encuentra la laptop perfecta para tus necesidades</p>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filters-header">
          <button 
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filtros
          </button>
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar laptops..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Marca:</label>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
              >
                <option value="">Todas las marcas</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Precio mínimo:</label>
              <input
                type="number"
                placeholder="R$ 0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Precio máximo:</label>
              <input
                type="number"
                placeholder="R$ 50.000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>

            <button onClick={clearFilters} className="clear-filters-btn">
              <FaTimes /> Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Grid de productos */}
      <div className="products-grid">
        {laptops.map(laptop => (
          <div key={laptop._id} className="product-card">
            <div className="product-image">
              <img 
                src={laptop.image || '/placeholder-laptop.svg'} 
                alt={laptop.name}
                onError={(e) => {
                  e.target.src = '/placeholder-laptop.svg';
                }}
              />
              <div className="product-badge">
                {laptop.brand}
              </div>
            </div>

            <div className="product-info">
              <h3 className="product-name">{laptop.name}</h3>
              
              <div className="product-rating">
                {renderStars(laptop.rating?.average || 0)}
                <span className="rating-text">
                  ({laptop.rating?.count || 0} reseñas)
                </span>
              </div>

              <div className="product-specs">
                <div className="spec-item">
                  <span className="spec-label">Procesador:</span>
                  <span className="spec-value">{laptop.specifications?.processor}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">RAM:</span>
                  <span className="spec-value">{laptop.specifications?.ram}GB</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Almacenamiento:</span>
                  <span className="spec-value">{laptop.specifications?.storage}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Pantalla:</span>
                  <span className="spec-value">{laptop.specifications?.screen?.size}"</span>
                </div>
              </div>

              <div className="product-price">
                <span className="price">{formatPrice(laptop.price, laptop.currency)}</span>
                {laptop.oldPrice && (
                  <span className="old-price">{formatPrice(laptop.oldPrice, laptop.currency)}</span>
                )}
              </div>

              <div className="product-actions">
                <Link to={`/product/${laptop._id}`} className="view-details-btn">
                  Ver detalles
                </Link>
                <button className="add-to-cart-btn">
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {laptops.length === 0 && !loading && (
        <div className="no-products">
          <p>No se encontraron productos con los filtros seleccionados</p>
          <button onClick={clearFilters} className="clear-filters-btn">
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
