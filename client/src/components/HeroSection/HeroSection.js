import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaPlay, FaShoppingCart, FaStar, FaTruck, FaShieldAlt, FaCreditCard } from 'react-icons/fa';
import './HeroSection.css';

const HeroSection = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
    // Aquí podrías abrir un modal con video
    console.log('Reproducir video promocional');
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="badge-icon">⚡</span>
              <span>Nuevos modelos disponibles</span>
            </div>
            
            <h1 className="hero-title">
              Tecnología <span className="highlight">Lenovo</span><br />
              que transforma tu mundo
            </h1>
            
            <p className="hero-subtitle">
              Descubre nuestra amplia gama de laptops diseñadas para profesionales, 
              gamers, estudiantes y creativos. Potencia, innovación y calidad en cada dispositivo.
            </p>
            
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Modelos disponibles</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">4.8</div>
                <div className="stat-label">
                  <FaStar className="star-icon" />
                  Calificación promedio
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24h</div>
                <div className="stat-label">Envío express</div>
              </div>
            </div>
            
            <div className="hero-actions">
              <Link to="/notebooks" className="hero-btn primary">
                <FaShoppingCart />
                Explorar Catálogo
                <FaArrowRight />
              </Link>
              <button className="hero-btn secondary" onClick={handlePlayVideo}>
                <FaPlay />
                Ver demo
              </button>
            </div>
            
            <div className="hero-features">
              <div className="feature-item">
                <FaTruck className="feature-icon" />
                <div className="feature-text">
                  <strong>Envío gratis</strong>
                  <span>En compras mayores a $50.000</span>
                </div>
              </div>
              <div className="feature-item">
                <FaShieldAlt className="feature-icon" />
                <div className="feature-text">
                  <strong>Garantía extendida</strong>
                  <span>Hasta 3 años de cobertura</span>
                </div>
              </div>
              <div className="feature-item">
                <FaCreditCard className="feature-icon" />
                <div className="feature-text">
                  <strong>Financiación flexible</strong>
                  <span>Hasta 18 cuotas sin interés</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="hero-image-container">
              {/* Laptop principal */}
              <div className="main-laptop">
                <img 
                  src="/placeholder-laptop.svg" 
                  alt="Lenovo ThinkPad" 
                  className="laptop-image"
                />
              </div>
              
              {/* Cards flotantes con promociones */}
              <div className="floating-card card-business">
                <div className="card-header">
                  <div className="card-icon business">💼</div>
                  <div className="card-badge">Empresarial</div>
                </div>
                <div className="card-content">
                  <h4>ThinkPad Series</h4>
                  <p className="card-price">Desde $75.999</p>
                  <span className="card-discount">20% OFF</span>
                </div>
              </div>
              
              <div className="floating-card card-gaming">
                <div className="card-header">
                  <div className="card-icon gaming">🎮</div>
                  <div className="card-badge">Gaming</div>
                </div>
                <div className="card-content">
                  <h4>Legion Series</h4>
                  <p className="card-price">Desde $129.999</p>
                  <span className="card-discount">25% OFF</span>
                </div>
              </div>
              
              <div className="floating-card card-student">
                <div className="card-header">
                  <div className="card-icon student">🎓</div>
                  <div className="card-badge">Estudiantes</div>
                </div>
                <div className="card-content">
                  <h4>IdeaPad Series</h4>
                  <p className="card-price">Desde $35.999</p>
                  <span className="card-discount">15% OFF</span>
                </div>
              </div>
              
              <div className="floating-card card-creative">
                <div className="card-header">
                  <div className="card-icon creative">🎨</div>
                  <div className="card-badge">Creativos</div>
                </div>
                <div className="card-content">
                  <h4>Yoga Series</h4>
                  <p className="card-price">Desde $89.999</p>
                  <span className="card-discount">Nuevo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Elementos de fondo decorativos */}
      <div className="hero-bg-elements">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="bg-grid"></div>
        <div className="bg-dots"></div>
      </div>
      
      {/* Indicadores de scroll */}
      <div className="scroll-indicator">
        <div className="scroll-text">Desliza para explorar</div>
        <div className="scroll-arrow">↓</div>
      </div>
    </section>
  );
};

export default HeroSection;