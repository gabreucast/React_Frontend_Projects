import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Grupo 3</h3>
            <p>Inovação e qualidade em cada produto</p>
          </div>
          <div className="footer-section">
            <h4>Produtos</h4>
            <ul>
              <li><a href="#laptops">Laptops</a></li>
              <li><a href="#desktops">Desktops</a></li>
              <li><a href="#tablets">Tablets</a></li>
              <li><a href="#accessories">Acessórios</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Suporte</h4>
            <ul>
              <li><a href="#help">Central de Ajuda</a></li>
              <li><a href="#warranty">Garantia</a></li>
              <li><a href="#drivers">Drivers</a></li>
              <li><a href="#contact">Contato</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Empresa</h4>
            <ul>
              <li><a href="#about">Sobre Nós</a></li>
              <li><a href="#careers">Carreiras</a></li>
              <li><a href="#news">Notícias</a></li>
              <li><a href="#investors">Investidores</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Grupo 3. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}