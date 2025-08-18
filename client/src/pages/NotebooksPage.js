import React, { useState, useEffect } from 'react';
import { laptopsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import './NotebooksPage.css';

const NotebooksPage = () => {
  const [laptops, setLaptops] = useState([]);
  const [filteredLaptops, setFilteredLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const [priceFilters, setPriceFilters] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const { addToCart } = useCart();

  const loadLaptops = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await laptopsAPI.getAll();
      
      // Procesar los datos del backend para asegurar compatibilidad
      const processedLaptops = (response.data || []).map(laptop => ({
        id: laptop.id || laptop._id,
        name: laptop.name,
        description: laptop.description || `${laptop.brand} ${laptop.name}`,
        originalPrice: laptop.originalPrice || laptop.price,
        price: laptop.discountedPrice || laptop.price,
        discount: laptop.discount || 0,
        rating: laptop.rating || 0,
        reviews: laptop.reviewCount || 0,
        image: laptop.image || '/placeholder-laptop.svg',
        brand: laptop.brand,
        category: laptop.category,
        inStock: laptop.inStock
      }));
      
      setLaptops(processedLaptops);
      setFilteredLaptops(processedLaptops);
    } catch (err) {
      console.error('Error loading laptops:', err);
      setError('Error al cargar los productos desde el servidor. Verifique la conexión.');
      setLaptops([]);
      setFilteredLaptops([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (laptop) => {
    try {
      setAddingToCart(prev => ({ ...prev, [laptop.id]: true }));
      
      // Crear objeto de producto compatible con el contexto del carrito
      const productForCart = {
        _id: laptop.id,
        id: laptop.id,
        name: laptop.name,
        price: laptop.price,
        image: laptop.image,
        brand: laptop.brand,
        model: laptop.model || laptop.name
      };
      
      const result = await addToCart(productForCart, 1);
       if (result.success) {
         console.log('Producto agregado al carrito');
       }
     } catch (err) {
       console.error('Error adding to cart:', err);
     } finally {
       setAddingToCart(prev => ({ ...prev, [laptop.id]: false }));
     }
   };

  useEffect(() => {
    loadLaptops();
  }, []);

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    let filtered = [...laptops];

    // Aplicar filtros de precio
    if (priceFilters.length > 0) {
      filtered = filtered.filter(laptop => {
        return priceFilters.some(range => {
          const price = laptop.price;
          switch (range) {
            case 'range1': return price >= 1000 && price <= 2499;
            case 'range2': return price >= 2500 && price <= 2999;
            case 'range3': return price >= 3500 && price <= 4999;
            case 'range4': return price >= 5000 && price <= 7999;
            default: return false;
          }
        });
      });
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredLaptops(filtered);
  }, [laptops, priceFilters, sortBy]);

  const handlePriceFilterChange = (range, checked) => {
    if (checked) {
      setPriceFilters(prev => [...prev, range]);
    } else {
      setPriceFilters(prev => prev.filter(r => r !== range));
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="notebooks-page">
        <div className="container">
          <h1>Notebooks</h1>
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando productos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notebooks-page">
      <div className="container">
        {/* Sección de ofertas especiales */}
        <div className="special-offers-banner">
          <div className="anniversary-badge">
            <span className="badge-text">Aniversário Lenovo</span>
          </div>
          <h2 className="offers-title">
            Aproveite até <span className="discount-highlight">33% OFF</span> em ofertas imperdíveis em todo o site!
          </h2>
          <p className="offers-subtitle">
            Ofertas imperdíveis no Aniversário Lenovo! | Frete Grátis no Brasil | Pagamento em até 12x sem juros |
          </p>
        </div>

        <div className="page-layout">
          {/* Sidebar com filtros */}
          <aside className="filters-sidebar">
            <h3>Faixa de Preço</h3>
            <div className="price-filters">
              <div className="price-range">
                <label>
                  <input 
                    type="checkbox" 
                    onChange={(e) => handlePriceFilterChange('range1', e.target.checked)}
                  />
                  R$1.000 até R$2.499 ({laptops.filter(l => l.price >= 1000 && l.price <= 2499).length})
                </label>
              </div>
              <div className="price-range">
                <label>
                  <input 
                    type="checkbox" 
                    onChange={(e) => handlePriceFilterChange('range2', e.target.checked)}
                  />
                  R$2.500 até R$2.999 ({laptops.filter(l => l.price >= 2500 && l.price <= 2999).length})
                </label>
              </div>
              <div className="price-range">
                <label>
                  <input 
                    type="checkbox" 
                    onChange={(e) => handlePriceFilterChange('range3', e.target.checked)}
                  />
                  R$3.500 até R$4.999 ({laptops.filter(l => l.price >= 3500 && l.price <= 4999).length})
                </label>
              </div>
              <div className="price-range">
                <label>
                  <input 
                    type="checkbox" 
                    onChange={(e) => handlePriceFilterChange('range4', e.target.checked)}
                  />
                  R$5.000 até R$7.999 ({laptops.filter(l => l.price >= 5000 && l.price <= 7999).length})
                </label>
              </div>
            </div>
          </aside>

          {/* Área principal de produtos */}
          <main className="products-main">
            <div className="products-header">
              <div className="results-info">
                <h2>{filteredLaptops.length} Resultados correspondientes</h2>
              </div>
              <div className="sort-controls">
                <span>Ordenar por:</span>
                <select className="sort-select" value={sortBy} onChange={handleSortChange}>
                  <option value="name">Nome</option>
                  <option value="priceAsc">Preço Crescente</option>
                  <option value="priceDesc">Preço Decrescente</option>
                  <option value="rating">Mais Avaliados</option>
                </select>
                <div className="view-controls">
                  <button className="view-btn grid-view active">⊞</button>
                  <button className="view-btn list-view">☰</button>
                </div>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={loadLaptops} className="retry-btn">
                  Reintentar
                </button>
              </div>
            )}

            <div className="products-grid">
              {filteredLaptops.map((laptop) => (
                <div key={laptop.id} className="product-card">
                  <div className="product-image">
                    <img 
                      src={laptop.image || '/placeholder-laptop.svg'}
                    alt={laptop.name}
                    onError={(e) => {
                      e.target.src = '/placeholder-laptop.svg';
                    }}
                    />
                    {laptop.discount && (
                      <div className="discount-badge">
                        -{laptop.discount}%
                      </div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{laptop.name}</h3>
                    <p className="product-description">{laptop.description}</p>
                    
                    {laptop.rating && (
                      <div className="product-rating">
                        <div className="stars">
                          {renderStars(laptop.rating)}
                        </div>
                        <span className="rating-text">
                          {laptop.rating} ({laptop.reviews})
                        </span>
                      </div>
                    )}
                    
                    <div className="product-price">
                      {laptop.originalPrice && (
                        <div className="original-price">
                          {formatPrice(laptop.originalPrice)}
                        </div>
                      )}
                      <div className="current-price">
                        {formatPrice(laptop.price)}
                      </div>
                    </div>
                    
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(laptop)}
                      disabled={addingToCart[laptop.id]}
                    >
                      {addingToCart[laptop.id] ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredLaptops.length === 0 && !loading && (
              <div className="empty-state">
                <p>{laptops.length === 0 ? 'No se encontraron productos' : 'No hay productos que coincidan con los filtros seleccionados'}</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default NotebooksPage;