import React from 'react';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Tecnologia que Transforma</h1>
          <p>Descubra nossa nova linha de produtos projetados para impulsionar sua produtividade e criatividade.</p>
          <div className="hero-buttons">
            <button className="btn-primary">Explorar Produtos</button>
            <button className="btn-secondary">Ver Ofertas</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="product-showcase">
            <div className="product-card">
              <div className="product-image">💻</div>
              <h3>Laptops</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}