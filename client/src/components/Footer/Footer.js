import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaArrowRight } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const [clickCount, setClickCount] = useState(0);
  const [showAdminLink, setShowAdminLink] = useState(false);

  const handleCopyrightClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount >= 5) {
      setShowAdminLink(true);
      // Ocultar el enlace después de 10 segundos
      setTimeout(() => {
        setShowAdminLink(false);
        setClickCount(0);
      }, 10000);
    }
    
    // Reset counter después de 3 segundos si no se completa la secuencia
    setTimeout(() => {
      if (newCount < 5) {
        setClickCount(0);
      }
    }, 3000);
  };

  return (
    <footer className="footer">
      {/* Top Section with Newsletter */}
      <div className="footer__container">
        <div className="footer-left">
          <div className="footer-newsletter">
            <h3>Receba ofertas especiais e novidades</h3>
            <div className="newsletter-field">
              <input 
                type="email" 
                placeholder="Digite seu e-mail" 
                className="newsletter-input"
              />
              <button className="newsletter-go" type="submit">
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
        
        <div className="footer-center">
          <div className="footer-social">
            <a href="#" className="social-pill" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#" className="social-pill" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className="social-pill" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="social-pill" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="#" className="social-pill" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>
        
        <div className="footer-right">
          <div className="country-select-wrap">
            <div className="country-label">Brasil</div>
            <select className="country-select">
              <option>Português (Brasil)</option>
              <option>English (US)</option>
              <option>Español (México)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="footer-links">
        <div className="footer-column">
          <h4>SOBRE A LENOVO</h4>
          <ul>
            <li><a href="#">Nossa Empresa</a></li>
            <li><a href="#">Informações Legais</a></li>
            <li><a href="#">ESG</a></li>
            <li><a href="#">Reciclagem</a></li>
            <li><a href="#">Instituto Ayrton Senna</a></li>
            <li><a href="#">Notícias</a></li>
            <li><a href="#">Trabalhe na Lenovo</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h4>SUPORTE E GARANTIA</h4>
          <ul>
            <li><a href="#">Central Lenovo de Suporte</a></li>
            <li><a href="#">Rastrear Pedido</a></li>
            <li><a href="#">Consultar Status do Reparo</a></li>
            <li><a href="#">Assistência Técnica</a></li>
            <li><a href="#">Download de Drivers</a></li>
            <li><a href="#">Suporte Produtos Lenovo e Think</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h4>PRODUTOS</h4>
          <ul>
            <li><Link to="/notebooks">Notebooks & Ultrabooks</Link></li>
            <li><a href="#">Tablets</a></li>
            <li><a href="#">Desktops</a></li>
            <li><a href="#">Workstations</a></li>
            <li><a href="#">Servidores e Storage</a></li>
            <li><a href="#">Acessórios e Upgrades</a></li>
            <li><a href="#">Catálogo de Produtos</a></li>
            <li><a href="#">Recall</a></li>
            <li><a href="#">Promoções</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h4>RECURSOS</h4>
          <ul>
            <li><a href="#">Registro do produto</a></li>
            <li><a href="#">Fale conosco</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Quero ser um Parceiro</a></li>
            <li><a href="#">Programa de Vantagens Lenovo</a></li>
            <li><a href="#">Glossário</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h4>PME</h4>
          <ul>
            <li><a href="#">Indústrias</a></li>
            <li><a href="#">Cotação</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="footer-bottom-links">
            <a href="#">Privacidade</a>
            <span>|</span>
            <a href="#">Mapa do site</a>
            <span>|</span>
            <a href="#">Termos de utilização</a>
          </div>
          
          <div className="footer-copyright">
            <p 
              onClick={handleCopyrightClick}
              style={{ cursor: 'pointer', userSelect: 'none' }}
              title={clickCount > 0 ? `${5 - clickCount} clics restantes` : ''}
            >
              © 2025 Lenovo. Todos os direitos reservados.
            </p>
            <p className="company-info">
              Lenovo Tecnologia Brasil Ltda / CNPJ: 07.275.920/0001-61 / Est Municipal José Costa de Mesquita, 200 – Mod 11 - Bairro: Chácara Alvorada / Indaiatuba / SP CEP: 13337-200
            </p>
            {showAdminLink && (
              <div className="admin-access" style={{
                marginTop: '10px',
                padding: '8px 12px',
                background: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '4px',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                animation: 'fadeIn 0.3s ease-in'
              }}>
                <Link 
                  to="/admin" 
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  🔐 Painel de Administração
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;