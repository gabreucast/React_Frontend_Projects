import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const ProductCard = ({ laptop }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsLoading(true)
    try {
      const result = await addToCart(laptop, 1)
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  return (
    <div className="card product-card">
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

        <div className="card-body">
          <div className="product-brand">{laptop.brand}</div>
          <h3 className="product-name">{laptop.name}</h3>
          <p className="product-model">{laptop.model}</p>
          
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
          </div>

          <div className="product-categories">
            {laptop.categories && (
              <div className="category-badges">
                {laptop.categories.study >= 4 && <span className="badge">Estudio</span>}
                {laptop.categories.work >= 4 && <span className="badge">Trabajo</span>}
                {laptop.categories.gaming >= 4 && <span className="badge">Gaming</span>}
                {laptop.categories.mobility >= 4 && <span className="badge">Portátil</span>}
              </div>
            )}
          </div>

          <div className="product-footer">
            <div className="product-price">
              <span className="price-current">{formatPrice(laptop.price)}</span>
              {laptop.originalPrice && laptop.originalPrice > laptop.price && (
                <span className="price-original">{formatPrice(laptop.originalPrice)}</span>
              )}
            </div>

            <div className="product-rating">
              {laptop.rating && laptop.rating.average > 0 && (
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`star ${i < Math.floor(laptop.rating.average) ? 'filled' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="rating-count">({laptop.rating.count})</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      <div className="card-footer">
        <button 
          className="btn btn-primary btn-add-cart"
          onClick={handleAddToCart}
          disabled={isLoading || !laptop.availability?.inStock}
        >
          {isLoading ? (
            <span className="loading"></span>
          ) : !laptop.availability?.inStock ? (
            'Sin stock'
          ) : (
            'Adicionar ao carrinho'
          )}
        </button>
      </div>
    </div>
  )
}

export default ProductCard