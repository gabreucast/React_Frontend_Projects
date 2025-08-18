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
              <span>Novos modelos disponíveis</span>
            </div>
            
            <h1 className="hero-title">
              Tecnologia <span className="highlight">Lenovo</span><br />
              que transforma seu mundo
            </h1>
            
            <p className="hero-subtitle">
              Descubra nossa ampla gama de laptops projetados para profissionais, 
              gamers, estudantes e criativos. Potência, inovação e qualidade em cada dispositivo.
            </p>
            
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Modelos disponíveis</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">4.8</div>
                <div className="stat-label">
                  <FaStar className="star-icon" />
                  Avaliação média
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24h</div>
                <div className="stat-label">Entrega expressa</div>
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
                Ver demonstração
              </button>
            </div>
            
            <div className="hero-features">
              <div className="feature-item">
                <FaTruck className="feature-icon" />
                <div className="feature-text">
                  <strong>Frete grátis</strong>
                  <span>Em compras acima de R$ 500</span>
                </div>
              </div>
              <div className="feature-item">
                <FaShieldAlt className="feature-icon" />
                <div className="feature-text">
                  <strong>Garantia estendida</strong>
                  <span>Até 3 anos de cobertura</span>
                </div>
              </div>
              <div className="feature-item">
                <FaCreditCard className="feature-icon" />
                <div className="feature-text">
                  <strong>Financiamento flexível</strong>
                  <span>Até 18x sem juros</span>
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
                  <p className="card-price">A partir de R$ 7.599</p>
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
                  <p className="card-price">A partir de R$ 12.999</p>
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
                  <p className="card-price">A partir de R$ 3.599</p>
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
                  <p className="card-price">A partir de R$ 8.999</p>
                  <span className="card-discount">Novo</span>
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
        <div className="scroll-text">Role para explorar</div>
        <div className="scroll-arrow">↓</div>
      </div>
    </section>
  );
};

export default HeroSection;