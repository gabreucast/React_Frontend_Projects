import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import laptopService from '../../services/laptopService';
import './ProductSection.css';

const ProductSection = () => {
  const [featuredLaptops, setFeaturedLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    loadFeaturedLaptops();
  }, []);

  const loadFeaturedLaptops = async () => {
    try {
      setLoading(true);
      const response = await laptopService.getRecommendations();
      setFeaturedLaptops(response.data || []);
    } catch (err) {
      console.error('Error loading featured laptops:', err);
      // Fallback con datos de ejemplo
      setFeaturedLaptops([
        {
          _id: '1',
          name: 'ThinkPad X1 Carbon Gen 10',
          brand: 'Lenovo',
          price: 12999,
          currency: 'BRL',
          image: '/placeholder-laptop.jpg',
          rating: { average: 4.8, count: 127 },
          specifications: {
            processor: 'Intel Core i7-1260P',
            ram: 16,
            storage: '512GB SSD',
            screen: { size: 14, resolution: '2560x1440' }
          }
        },
        {
          _id: '2',
          name: 'Legion 5 Pro Gaming',
          brand: 'Lenovo',
          price: 8999,
          currency: 'BRL',
          image: '/placeholder-laptop.jpg',
          rating: { average: 4.6, count: 89 },
          specifications: {
            processor: 'AMD Ryzen 7 6800H',
            ram: 32,
            storage: '1TB SSD',
            screen: { size: 16, resolution: '2560x1600' }
          }
        },
        {
          _id: '3',
          name: 'IdeaPad 3',
          brand: 'Lenovo',
          price: 3499,
          currency: 'BRL',
          image: '/placeholder-laptop.jpg',
          rating: { average: 4.4, count: 156 },
          specifications: {
            processor: 'Intel Core i5-1135G7',
            ram: 8,
            storage: '256GB SSD',
            screen: { size: 15.6, resolution: '1920x1080' }
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === Math.ceil(featuredLaptops.length / 3) - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? Math.ceil(featuredLaptops.length / 3) - 1 : prev - 1
    );
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
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }
    
    const emptyStars = 5 - fullStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star empty" />);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <section className="product-section">
        <div className="container">
          <div className="section-header">
            <h2>Productos Destacados</h2>
            <p>Descubre nuestras mejores ofertas</p>
          </div>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando productos...</p>
          </div>
        </div>
      </section>
    );
  }

  const slides = [];
  for (let i = 0; i < featuredLaptops.length; i += 3) {
    slides.push(featuredLaptops.slice(i, i + 3));
  }

  return (
    <section className="product-section">
      <div className="container">
        <div className="section-header">
          <h2>Productos Destacados</h2>
          <p>Descubre nuestras mejores ofertas y laptops más populares</p>
          <Link to="/notebooks" className="view-all-btn">
            Ver todos los productos
            <FaArrowRight />
          </Link>
        </div>

        <div className="products-carousel">
          <button 
            className="carousel-btn prev" 
            onClick={prevSlide}
            aria-label="Anterior"
          >
            <FaArrowLeft />
          </button>

          <div className="carousel-container">
            <div 
              className="carousel-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, slideIndex) => (
                <div key={slideIndex} className="carousel-slide">
                  {slide.map((laptop) => (
                    <div key={laptop._id} className="featured-product-card">
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
                        {laptop.discount && (
                          <div className="discount-badge">
                            -{laptop.discount}%
                          </div>
                        )}
                      </div>

                      <div className="product-info">
                        <h3 className="product-name">{laptop.name}</h3>
                        
                        <div className="product-rating">
                          {renderStars(laptop.rating?.average || 0)}
                          <span className="rating-text">
                            ({laptop.rating?.count || 0})
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
                            <span className="spec-label">Pantalla:</span>
                            <span className="spec-value">{laptop.specifications?.screen?.size}"</span>
                          </div>
                        </div>

                        <div className="product-price">
                          <span className="price">{formatPrice(laptop.price, laptop.currency)}</span>
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
              ))}
            </div>
          </div>

          <button 
            className="carousel-btn next" 
            onClick={nextSlide}
            aria-label="Siguiente"
          >
            <FaArrowRight />
          </button>
        </div>

        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;