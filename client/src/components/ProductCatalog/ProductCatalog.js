import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaSearch, FaFilter, FaTimes, FaShoppingCart, FaHeart } from 'react-icons/fa';
import laptopService from '../../services/laptopService';
import ProductCard from '../ProductCard/ProductCard';
import './ProductCatalog.css';

const ProductCatalog = ({ showFilters = true, limit = null, title = null }) => {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'featured'
  });
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    loadLaptops();
  }, [filters, limit]);

  const loadLaptops = async () => {
    try {
      setLoading(true);
      setError(null);

      let laptopData;
      
      if (limit) {
        // Si hay límite, cargar laptops destacadas
        laptopData = await laptopService.getFeaturedLaptops ? 
          await laptopService.getFeaturedLaptops(limit) :
          (await laptopService.getAll({ limit })).data.slice(0, limit);
      } else {
        // Cargar todas las laptops
        const response = await laptopService.getAll(filters);
        laptopData = response.data || [];
      }

      setLaptops(laptopData);
    } catch (err) {
      console.error('Error al cargar laptops:', err);
      setError('Erro ao carregar os produtos. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'featured'
    });
  };

  const formatPrice = (price, currency = 'ARS') => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const renderFilterBar = () => {
    if (!showFilters) return null;

    return (
      <div className="filter-bar">
        <div className="filter-controls">
          {/* Búsqueda */}
          <div className="search-filter">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar laptops..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Filtros rápidos */}
          <div className="quick-filters">
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="filter-select"
            >
              <option value="featured">Destacados</option>
              <option value="price_low">Precio: Menor a Mayor</option>
              <option value="price_high">Precio: Mayor a Menor</option>
              <option value="rating">Mejor Valorados</option>
              <option value="name">Nombre A-Z</option>
            </select>

            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className="filter-select"
            >
              <option value="">Todas las marcas</option>
              <option value="Lenovo">Lenovo</option>
            </select>
          </div>

          {/* Botón de filtros avanzados */}
          <button
            onClick={() => setShowFilterModal(true)}
            className="btn btn-outline filter-btn"
          >
            <FaFilter />
            Filtros
          </button>

          {/* Limpiar filtros */}
          {(filters.search || filters.brand || filters.minPrice || filters.maxPrice) && (
            <button
              onClick={clearFilters}
              className="btn btn-secondary clear-filters-btn"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="results-info">
          <span>{laptops.length} producto{laptops.length !== 1 ? 's' : ''} encontrado{laptops.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    );
  };

  const renderFilterModal = () => {
    if (!showFilterModal) return null;

    return (
      <div className="filter-modal-overlay" onClick={() => setShowFilterModal(false)}>
        <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
          <div className="filter-modal-header">
            <h3>Filtros Avanzados</h3>
            <button
              onClick={() => setShowFilterModal(false)}
              className="close-modal-btn"
            >
              ×
            </button>
          </div>

          <div className="filter-modal-content">
            {/* Filtro de precio */}
            <div className="filter-group">
              <label>Rango de Precio</label>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="Precio mín."
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="price-input"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Precio máx."
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="price-input"
                />
              </div>
            </div>

            {/* Categorías */}
            <div className="filter-group">
              <label>Categorías</label>
              <div className="category-filters">
                <button className="category-btn" onClick={() => handleFilterChange('search', 'gaming')}>
                  Gaming
                </button>
                <button className="category-btn" onClick={() => handleFilterChange('search', 'business')}>
                  Empresarial
                </button>
                <button className="category-btn" onClick={() => handleFilterChange('search', 'student')}>
                  Estudantes
                </button>
                <button className="category-btn" onClick={() => handleFilterChange('search', 'creative')}>
                  Criativos
                </button>
              </div>
            </div>
          </div>

          <div className="filter-modal-footer">
            <button
              onClick={clearFilters}
              className="btn btn-secondary"
            >
              Limpiar Todo
            </button>
            <button
              onClick={() => setShowFilterModal(false)}
              className="btn btn-primary"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="catalog-loading">
        <div className="loading-spinner"></div>
        <p>Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalog-error">
        <p>{error}</p>
        <button onClick={loadLaptops} className="btn btn-primary">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="product-catalog">
      {title && <h2 className="catalog-title">{title}</h2>}
      
      {renderFilterBar()}
      
      {laptops.length === 0 ? (
        <div className="no-results">
          <p>Não foram encontrados produtos que correspondam aos seus critérios de busca.</p>
          <button onClick={clearFilters} className="btn btn-primary">
            Ver todos os produtos
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {laptops.map(laptop => (
            <ProductCard
              key={laptop._id || laptop.id}
              laptop={laptop}
              showQuickActions={true}
            />
          ))}
        </div>
      )}

      {!limit && laptops.length > 0 && (
        <div className="catalog-footer">
          <p>¿No encuentras lo que buscas?</p>
          <Link to="/contacto" className="btn btn-outline">
            Contacta con un especialista
          </Link>
        </div>
      )}

      {renderFilterModal()}
    </div>
  );
};

export default ProductCatalog;
