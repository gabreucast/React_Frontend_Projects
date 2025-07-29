import React from 'react';

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="nav-brand">
          <h2>Grupo 3</h2>
        </div>
        <nav className="nav-menu">
          <ul>
            <li><a href="#home">Início</a></li>
            <li><a href="#products">Produtos</a></li>
            <li><a href="#services">Serviços</a></li>
            <li><a href="#support">Suporte</a></li>
            <li><a href="#contact">Contato</a></li>
          </ul>
        </nav>
        <div className="nav-actions">
          <button className="btn-search">🔍</button>
          <button className="btn-cart">🛒</button>
        </div>
      </div>
    </header>
  );
}