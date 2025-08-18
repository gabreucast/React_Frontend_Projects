import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import './ProductCard.css'

const ProductCard = ({ laptop }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsLoading(true)
    try {
      const result = await addToCart(laptop._id, 1)
      if (result.success) {
        // Mostrar feedback visual (opcional)
        console.log('Produto adicionado ao carrinho')
      }
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFavoriteToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  return (
    <div className="card product-card">
      {/* Badges superiores */}
      <div className="product-badges">
        <div className="badges-left">
          <span className="anniversary-badge">Aniversário Lenovo</span>
          {laptop.specifications?.storage && (
            <span className="storage-badge">
              Armazenamento {laptop.specifications.storage.includes('SSD') ? 'SSD' : 'HDD'}
            </span>
          )}
        </div>
        <button 
          className="favorite-btn"
          onClick={handleFavoriteToggle}
          title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <svg viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <Link to={`/products/${laptop._id}`} className="product-link">
        <div className="product-image">
          {laptop.images && laptop.images.length > 0 ? (
            <img 
              src={laptop.images[0].url} 
              alt={laptop.images[0].alt || laptop.name}
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="product-image-placeholder" style={{ display: laptop.images && laptop.images.length > 0 ? 'none' : 'flex' }}>
            <svg width="80" height="60" fill="currentColor" viewBox="0 0 400 300">
              <rect x="50" y="80" width="300" height="140" rx="10" fill="#e0e0e0" stroke="#ccc" strokeWidth="2"/>
              <rect x="70" y="100" width="260" height="100" rx="5" fill="#333"/>
              <rect x="180" y="130" width="40" height="40" rx="20" fill="#666"/>
              <text x="200" y="250" textAnchor="middle" fontSize="12" fill="#999">{laptop.brand}</text>
            </svg>
          </div>
        </div>

        <div className="product-body">
          <h3 className="product-title">
            {laptop.brand} {laptop.name} {laptop.model}
          </h3>
          
          <div className="product-rating">
            <div className="stars">
              {laptop.rating && laptop.rating.average > 0 && (
                [...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`star ${i < Math.floor(laptop.rating.average) ? 'filled' : ''}`}
                  >
                    ★
                  </span>
                ))
              )}
            </div>
            {laptop.rating && laptop.rating.average > 0 && (
              <span className="rating-text">{laptop.rating.average} ({laptop.rating.count || 0})</span>
            )}
          </div>

          <div className="product-specs">
            <div className="spec-item">
              <span className="spec-label">Processador:</span>
              <span className="spec-value">{laptop.specifications?.processor}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">RAM:</span>
              <span className="spec-value">{laptop.specifications?.ram}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Armazenamento:</span>
              <span className="spec-value">{laptop.specifications?.storage}</span>
            </div>
          </div>

          <div className="product-categories">
            {laptop.categories && (
              <div className="category-badges">
                {laptop.categories.study >= 4 && <span className="category-tag">Estudio</span>}
                {laptop.categories.work >= 4 && <span className="category-tag">Trabajo</span>}
                {laptop.categories.gaming >= 4 && <span className="category-tag">Gaming</span>}
                {laptop.categories.mobility >= 4 && <span className="category-tag">Portátil</span>}
              </div>
            )}
          </div>

          <div className="product-footer">
            <div className="product-price">
              <span className="current-price">{formatPrice(laptop.price)}</span>
              {laptop.originalPrice && laptop.originalPrice > laptop.price && (
                <span className="original-price">{formatPrice(laptop.originalPrice)}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
      
      <div className="product-footer">
        <div className="pricing-section">
          <div className="price-info">
            <span className="current-price">{formatPrice(laptop.price)}</span>
            {laptop.originalPrice && laptop.originalPrice > laptop.price && (
              <>
                <span className="original-price">{formatPrice(laptop.originalPrice)}</span>
                <span className="discount-percentage">
                  {Math.round(((laptop.originalPrice - laptop.price) / laptop.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>
          <div className="payment-options">
            <span className="installments">À vista no PIX com 14% OFF</span>
          </div>
        </div>
        
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={isLoading || laptop.stock === 0}
        >
          {isLoading ? 'Adicionando...' : laptop.stock === 0 ? 'Sem estoque' : 'Adicionar ao Carrinho'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard