// src/components/Header.jsx
// Comentários em PT-BR explicando cada parte

import React from 'react';
import { FaUser, FaShoppingCart, FaHeart } from 'react-icons/fa'; // Ícones do usuário, carrinho e favoritos
import './Header.css'; // Estilos específicos do Header
import logo from '../assets/lenovo-logo.png'; // Logo (coloque sua imagem em src/assets)

const Header = () => {
  return (
    // Cabeçalho geral do site
    <header className="header">
      {/* Faixa promocional (topo) */}
      <div className="header__top__promo" aria-label="faixa promocional" />

      {/* Linha com logo, busca e ícones à direita */}
      <div className="header__top">
        {/* Logo da marca */}
        <img src={logo} alt="Lenovo" className="header__logo" />

        {/* Campo de busca central */}
        <div className="header__search">
          <input
            type="text"
            placeholder="Procurar produtos"
            className="header__search-input"
            aria-label="buscar produtos"
          />
        </div>

        {/* Ícones de ações rápidas (conta, favoritos, carrinho) */}
        <div className="header__icons" aria-label="ações do usuário">
          <FaUser className="header__icon" title="Minha conta" />
          <FaHeart className="header__icon" title="Favoritos" />
          <FaShoppingCart className="header__icon" title="Carrinho" />
        </div>
      </div>

      {/* Navegação principal com submenus */}
      <nav className="header__nav" aria-label="navegação principal">
        {/* Lista da esquerda (produtos/soluções/serviços/etc.) */}
        <ul className="header__nav--left">
          <li className="has-submenu">
            Produtos
            <ul className="submenu">
              <li>Promoções</li>
              <li>Notebooks</li>
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
