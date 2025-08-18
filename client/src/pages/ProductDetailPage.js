import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaArrowLeft, FaCheck, FaTruck, FaShieldAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import laptopService from '../services/laptopService';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [laptop, setLaptop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadLaptop();
  }, [id]);

  const loadLaptop = async () => {
    try {
      setLoading(true);
      const data = await laptopService.getById(id);
      setLaptop(data);
      setError(null);
    } catch (error) {
      console.error('Error loading laptop:', error);
      setError('Erro ao carregar o produto');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      const result = await addToCart(laptop, quantity);
      if (result.success) {
        // Mostrar mensaje de éxito
        console.log('Producto agregado al carrito');
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (error || !laptop) {
    return (
      <div className="product-detail-error">
        <h2>Producto no encontrado</h2>
        <p>{error || 'El producto que buscas no existe.'}</p>
        <button onClick={handleGoBack} className="btn-back">
          <FaArrowLeft /> Volver
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <button onClick={handleGoBack} className="btn-back">
          <FaArrowLeft /> Volver
        </button>

        <div className="product-detail">
          <div className="product-images">
            <div className="main-image">
              <img 
                src={laptop.images && laptop.images[selectedImage] ? laptop.images[selectedImage] : '/placeholder-laptop.svg'} 
                alt={laptop.name}
                onError={(e) => {
                  e.target.src = '/placeholder-laptop.svg';
                }}
              />
            </div>
            {laptop.images && laptop.images.length > 1 && (
              <div className="image-thumbnails">
                {laptop.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${laptop.name} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                    onError={(e) => {
                      e.target.src = '/placeholder-laptop.svg';
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <div className="product-header">
              <h1>{laptop.name}</h1>
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < 4 ? 'filled' : ''} />
                  ))}
                </div>
                <span className="rating-text">(4.0) • 128 reseñas</span>
              </div>
            </div>

            <div className="product-price">
              <span className="current-price">${laptop.price?.toLocaleString()}</span>
              {laptop.originalPrice && laptop.originalPrice > laptop.price && (
                <span className="original-price">${laptop.originalPrice.toLocaleString()}</span>
              )}
            </div>

            <div className="product-description">
              <p>{laptop.description}</p>
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <label>Cantidad:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  className="btn-add-cart"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  <FaShoppingCart />
                  {isAddingToCart ? 'Agregando...' : 'Agregar al Carrito'}
                </button>
                
                <button 
                  className={`btn-favorite ${isFavorite ? 'active' : ''}`}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <FaHeart />
                </button>
              </div>
            </div>

            <div className="product-benefits">
              <div className="benefit">
                <FaTruck className="benefit-icon" />
                <span>Frete grátis para todo o país</span>
              </div>
              <div className="benefit">
                <FaShieldAlt className="benefit-icon" />
                <span>Garantia oficial de 1 ano</span>
              </div>
              <div className="benefit">
                <FaCheck className="benefit-icon" />
                <span>Producto nuevo y original</span>
              </div>
            </div>
          </div>
        </div>

        {laptop.specifications && (
          <div className="product-specifications">
            <h3>Especificaciones Técnicas</h3>
            <div className="specs-grid">
              {laptop.specifications.processor && (
                <div className="spec-item">
                  <strong>Procesador:</strong>
                  <span>{laptop.specifications.processor}</span>
                </div>
              )}
              {laptop.specifications.ram && (
                <div className="spec-item">
                  <strong>Memoria RAM:</strong>
                  <span>{laptop.specifications.ram}</span>
                </div>
              )}
              {laptop.specifications.storage && (
                <div className="spec-item">
                  <strong>Almacenamiento:</strong>
                  <span>{laptop.specifications.storage}</span>
                </div>
              )}
              {laptop.specifications.graphics && (
                <div className="spec-item">
                  <strong>Tarjeta Gráfica:</strong>
                  <span>{laptop.specifications.graphics}</span>
                </div>
              )}
              {laptop.specifications.display && (
                <div className="spec-item">
                  <strong>Pantalla:</strong>
                  <span>{laptop.specifications.display}</span>
                </div>
              )}
              {laptop.specifications.battery && (
                <div className="spec-item">
                  <strong>Batería:</strong>
                  <span>{laptop.specifications.battery}</span>
                </div>
              )}
              {laptop.specifications.weight && (
                <div className="spec-item">
                  <strong>Peso:</strong>
                  <span>{laptop.specifications.weight}</span>
                </div>
              )}
              {laptop.specifications.os && (
                <div className="spec-item">
                  <strong>Sistema Operativo:</strong>
                  <span>{laptop.specifications.os}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;