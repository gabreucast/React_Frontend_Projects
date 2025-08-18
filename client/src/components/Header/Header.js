// src/components/Header.js
// Comentários em PT-BR explicando cada parte

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaHeart, FaBars, FaTimes, FaSearch } from 'react-icons/fa'; // Ícones do usuário, carrinho e favoritos
import './Header.css'; // Estilos específicos do Header
import logo from '../../assets/lenovo-logo.svg'; // Logo (coloque sua imagem em src/assets)

const Header = () => {
  // Estados para controlar a interface
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // TODO: Integrar com contexto de autenticação
  const [favorites, setFavorites] = useState([]); // TODO: Integrar com contexto de favoritos
  const [cartCount, setCartCount] = useState(0);
  const [sessionId, setSessionId] = useState('');

  // Generar o recuperar sessionId
  useEffect(() => {
    let currentSessionId = localStorage.getItem('sessionId');
    if (!currentSessionId) {
      currentSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('sessionId', currentSessionId);
    }
    setSessionId(currentSessionId);
    loadCartCount(currentSessionId);

    // Escuchar eventos de actualización del carrito
    const handleCartUpdate = () => {
      loadCartCount(currentSessionId);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Cargar cantidad de items en el carrito
  const loadCartCount = async (sessionId) => {
    try {
      // TODO: Implementar cuando se tenga el servicio del carrito
      // const cartData = await cartAPI.getBySessionId(sessionId);
      // const count = cartData.items ? cartData.items.reduce((total, item) => total + item.quantity, 0) : 0;
      setCartCount(0);
    } catch (error) {
      console.log('No hay carrito existente o error al cargar:', error);
      setCartCount(0);
    }
  };

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implementar navegación a página de resultados
      console.log('Buscar:', searchQuery);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  // Función para autenticación con Google (placeholder)
  const handleGoogleLogin = () => {
    // TODO: Implementar autenticación con Google
    console.log('Iniciar sessão com Google');
  };

  // Função para encerrar sessão
  const handleLogout = () => {
    // TODO: Implementar logout
    setUser(null);
    setIsUserMenuOpen(false);
  };

  // Función para manejar click en carrito
  const handleCartClick = () => {
    console.log('Abrir carrito, sessionId:', sessionId);
    // TODO: Implementar modal del carrito o navegación
  };
  return (
    // Cabeçalho geral do site
    <header className="header">
      {/* Faixa promocional (topo) */}
      <div className="header__top__promo" aria-label="faixa promocional">
        <strong>LenovoPro.</strong> Conheça nossos programas exclusivos de descontos e benefícios para empresas. <strong>Cadastre-se gratuitamente.</strong>
      </div>

      {/* Linha com logo, busca e ícones à direita */}
      <div className="header__top">
        {/* Logo da marca */}
        <img src={logo} alt="Lenovo" className="header__logo" />

        {/* Campo de busca central */}
        <div className="header__search">
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Procurar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="header__search-input"
                aria-label="buscar produtos"
                autoFocus
              />
              <button type="submit" className="search-submit-btn">
                <FaSearch />
              </button>
            </form>
          ) : (
            <button 
              className="search-toggle-btn"
              onClick={() => setIsSearchOpen(true)}
            >
              <FaSearch className="search-icon" />
              <span>Procurar produtos</span>
            </button>
          )}
        </div>

        {/* Ícones de ações rápidas (conta, favoritos, carrinho) */}
        <div className="header__icons" aria-label="ações do usuário">
          {/* Menu do usuário */}
          <div className="user-menu-container">
            <button 
              className="header__icon user-icon"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              title="Minha conta"
            >
              <FaUser />
            </button>
            {isUserMenuOpen && (
              <div className="user-dropdown">
                {user ? (
                  <>
                    <div className="user-info">
                      <span>Olá, {user.name}</span>
                    </div>
                    <button onClick={handleLogout} className="dropdown-item">
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleGoogleLogin} className="dropdown-item">
                      Entrar com Google
                    </button>
                    <button className="dropdown-item">
                      Criar conta
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Favoritos */}
          <button className="header__icon" title="Favoritos">
            <FaHeart />
            {favorites.length > 0 && (
              <span className="icon-badge">{favorites.length}</span>
            )}
          </button>

          {/* Carrinho */}
          <button 
            className="header__icon cart-icon" 
            title="Carrinho"
            onClick={handleCartClick}
          >
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="icon-badge cart-badge">{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Navegação principal com submenus */}
      <nav className="header__nav" aria-label="navegação principal">
        {/* Botão do menu móvel */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Lista da esquerda (produtos/soluções/serviços/etc.) */}
        <ul className={`header__nav--left ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <li 
            className="has-submenu"
            onMouseEnter={() => setIsProductsDropdownOpen(true)}
            onMouseLeave={() => setIsProductsDropdownOpen(false)}
          >
            Produtos
            <ul className={`submenu ${isProductsDropdownOpen ? 'dropdown-open' : ''}`}>
              <li>Promoções</li>
              <li><Link to="/notebooks">Notebooks</Link></li>
              <li>Desktops</li>
              <li>Workstations</li>
              <li>Tablets</li>
              <li>Servidores e Armazenamento</li>
              <li>Acessórios</li>
              <li>Monitores</li>
              <li>Serviços</li>
              <li>IA</li>
            </ul>
          </li>

          <li className="has-submenu">
            Soluções
            <ul className="submenu">
              <li>IA</li>
              <li>Digital Workplace</li>
              <li>Nuvem Híbrida</li>
              <li>Edge</li>
              <li>Sustentabilidade</li>
              <li>TruScale</li>
              <li>Soluções por Indústria</li>
              <li>Parceiros da Aliança</li>
              <li>Outras Soluções</li>
              <li>Recursos</li>
            </ul>
          </li>

          <li className="has-submenu">
            Serviços
            <ul className="submenu">
              <li>Serviços de Consultoria</li>
              <li>Serviços de Implantação</li>
              <li>Serviços Gerenciados</li>
              <li>Serviços de Segurança</li>
              <li>Serviços de Suporte</li>
              <li>TruScale</li>
              <li>Consulta de Garantia</li>
            </ul>
          </li>

          <li>Suporte</li>

          <li className="has-submenu">
            Sobre Lenovo
            <ul className="submenu">
              <li>Quem Somos</li>
              <li>Nossos Líderes</li>
              <li>Inovação</li>
              <li>Nosso Impacto</li>
            </ul>
          </li>

          <li className="has-submenu">
            Promoções
            <ul className="submenu">
              <li>Todas as Promoções</li>
              <li>Membros e Programas</li>
              <li>Outlet</li>
            </ul>
          </li>
        </ul>

        {/* Lista da direita (atalhos de áreas) */}
        <ul className="header__nav--right">
          <li>Empresa</li>
          <li>Educação</li>
          <li>Gaming</li>
        </ul>
      </nav>

      {/* Faixa informativa inferior (banner cinza) */}
      <div className="header__bottom">
        <p>
          <strong>LenovoPro.</strong> Conheça nossos programas exclusivos de descontos e benefícios
          para empresas. <strong>Cadastre-se gratuitamente.</strong>
        </p>
      </div>
    </header>
  );
};

export default Header;
