import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaShoppingCart, FaEye } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import laptopService from '../../services/laptopService';
import './ProductCard.css';

const ProductCard = ({ laptop, showQuickActions = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      const result = await addToCart(laptop, 1);
      if (result.success) {
        // Mostrar feedback visual exitoso
        console.log('Producto agregado al carrito');
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // TODO: Implementar lógica de favoritos
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const formatPrice = (price) => {
    return laptopService.formatPrice(price);
  };

  const calculateDiscount = () => {
    if (laptop.oldPrice && laptop.oldPrice > laptop.price) {
      return laptopService.calculateDiscount(laptop.oldPrice, laptop.price);
    }
    return 0;
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

  const getImageUrl = () => {
    if (imageError) return '/placeholder-laptop.svg';
    
    // Usar la primera imagen disponible del array o la imagen por defecto
    const imageUrl = laptop.images?.[0] || laptop.image;
    return laptopService.getImageUrl(imageUrl);
  };

  const discountPercentage = calculateDiscount();

  return (
    <div className="product-card">
      {/* Badges superiores */}
      <div className="product-badges">
        <div className="badges-left">
          {laptop.badges?.includes('featured') && (
            <span className="badge featured-badge">Destacado</span>
          )}
          {discountPercentage > 0 && (
            <span className="badge discount-badge">
              -{discountPercentage}%
            </span>
          )}
          {laptop.stock < 5 && laptop.stock > 0 && (
            <span className="badge stock-badge">¡Últimas unidades!</span>
          )}
        </div>
        
        {showQuickActions && (
          <div className="quick-actions">
            <button 
              className={`quick-action-btn favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={handleFavoriteToggle}
              title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <FaHeart />
            </button>
          </div>
        )}
      </div>
      
      <Link to={`/producto/${laptop._id || laptop.id}`} className="product-link">
        <div className="product-image">
          <img 
            src={getImageUrl()}
            alt={laptop.name}
            loading="lazy"
            onError={handleImageError}
          />
          
          {showQuickActions && (
            <div className="hover-overlay">
              <div className="overlay-actions">
                <button className="overlay-btn">
                  <FaEye />
                  <span>Vista rápida</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="product-body">
          {/* Marca y nombre */}
          <div className="product-brand">
            {laptop.brand}
          </div>
          
          <h3 className="product-title">
            {laptop.name}
          </h3>
          
          <p className="product-model">
            {laptop.model}
          </p>
          
          {/* Rating */}
          {laptop.rating && laptop.rating > 0 && (
            <div className="product-rating">
              <div className="stars">
                {renderStars(laptop.rating)}
              </div>
              <span className="rating-text">
                {laptop.rating} ({laptop.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Especificaciones principales */}
          <div className="product-specs">
            {laptop.specifications?.processor && (
              <div className="spec-item">
                <span className="spec-value">{laptop.specifications.processor}</span>
              </div>
            )}
            {laptop.specifications?.ram && (
              <div className="spec-item">
                <span className="spec-value">{laptop.specifications.ram}</span>
              </div>
            )}
            {laptop.specifications?.storage && (
              <div className="spec-item">
                <span className="spec-value">{laptop.specifications.storage}</span>
              </div>
            )}
          </div>

          {/* Categorías/Tags */}
          {laptop.categories && (
            <div className="product-categories">
              {laptop.categories.map((category, index) => (
                <span key={index} className="category-tag">{category}</span>
              ))}
            </div>
          )}
        </div>
      </Link>
      
      {/* Footer con precio y acciones */}
      <div className="product-footer">
        <div className="pricing-section">
          <div className="price-info">
            <span className="current-price">{formatPrice(laptop.price)}</span>
            {laptop.oldPrice && laptop.oldPrice > laptop.price && (
              <span className="original-price">{formatPrice(laptop.oldPrice)}</span>
            )}
          </div>
          
          {discountPercentage > 0 && (
            <div className="savings-info">
              <span className="savings-text">
                Ahorras {formatPrice(laptop.oldPrice - laptop.price)}
              </span>
            </div>
          )}
          
          <div className="payment-options">
            <span className="installments">
              Hasta 12 cuotas sin interés
            </span>
          </div>
        </div>
        
        <div className="action-buttons">
          <button 
            className="btn btn-primary add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={isLoading || laptop.stock === 0}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <FaShoppingCart />
                {laptop.stock === 0 ? 'Sin stock' : 'Agregar'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;