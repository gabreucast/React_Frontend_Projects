import React from 'react';

export default function ProductSection() {
  const products = [
    {
      id: 1,
      name: 'Série ThinkPad',
      description: 'Laptops profissionais para empresas',
      icon: '💼',
      category: 'Business'
    },
    {
      id: 2,
      name: 'Série Gaming',
      description: 'Potência extrema para gaming',
      icon: '🎮',
      category: 'Gaming'
    },
    {
      id: 3,
      name: 'Série IdeaPad',
      description: 'Perfeitas para uso diário',
      icon: '✨',
      category: 'Pessoal'
    },
    {
      id: 4,
      name: 'Workstation',
      description: 'Para profissionais criativos',
      icon: '🎨',
      category: 'Criativo'
    }
  ];

  return (
    <section className="products">
      <div className="container">
        <div className="section-header">
          <h2>Nossos Produtos</h2>
          <p>Encontre a solução perfeita para suas necessidades</p>
        </div>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-icon">{product.icon}</div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <span className="product-category">{product.category}</span>
              <button className="btn-explore">Explorar</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}