// src/components/Cart/CartModal.js
// Componente modal del carrito de compras

import React from 'react';
import { useCart } from '../../context/CartContext';
import { formatPrice, generateCartSummary } from '../../services/cartService';
import CartItem from './CartItem';
import './CartModal.css';

const CartModal = () => {
  const { items, isOpen, toggleCart, clearCart, totalItems, totalPrice } = useCart();
  
  if (!isOpen) return null;
  
  const cartSummary = generateCartSummary(items);
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      toggleCart();
    }
  };
  
  const handleCheckout = () => {
    // Aquí se implementaría la lógica de checkout
    alert('Funcionalidad de checkout en desarrollo');
  };
  
  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      clearCart();
    }
  };
  
  return (
    <div className="cart-modal-overlay" onClick={handleOverlayClick}>
      <div className="cart-modal">
        {/* Header del modal */}
        <div className="cart-modal__header">
          <h2 className="cart-modal__title">
            <i className="fas fa-shopping-cart"></i>
            Carrito de Compras
            {totalItems > 0 && (
              <span className="cart-modal__count">({totalItems})</span>
            )}
          </h2>
          <button 
            className="cart-modal__close"
            onClick={toggleCart}
            aria-label="Cerrar carrito"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {/* Contenido del carrito */}
        <div className="cart-modal__content">
          {cartSummary.isEmpty ? (
            <div className="cart-modal__empty">
              <i className="fas fa-shopping-cart cart-modal__empty-icon"></i>
              <h3>Tu carrito está vacío</h3>
              <p>Adicione alguns produtos para começar sua compra</p>
              <button 
                className="cart-modal__continue-shopping"
                onClick={toggleCart}
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <>
              {/* Lista de productos */}
              <div className="cart-modal__items">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
              
              {/* Resumen de totales */}
              <div className="cart-modal__summary">
                <div className="cart-summary">
                  <div className="cart-summary__row">
                    <span>Subtotal ({cartSummary.itemCount} produtos):</span>
                    <span className="cart-summary__value">{cartSummary.formattedSubtotal}</span>
                  </div>
                  
                  <div className="cart-summary__row">
                    <span>IVA (19%):</span>
                    <span className="cart-summary__value">{cartSummary.formattedTax}</span>
                  </div>
                  
                  <div className="cart-summary__row">
                    <span>Frete:</span>
                    <span className="cart-summary__value cart-summary__shipping">
                      {cartSummary.formattedShipping}
                    </span>
                  </div>
                  
                  {cartSummary.shipping === 0 && (
                    <div className="cart-summary__free-shipping">
                      <i className="fas fa-truck"></i>
                      Frete grátis no seu pedido!
                    </div>
                  )}
                  
                  <div className="cart-summary__row cart-summary__total">
                    <span>Total:</span>
                    <span className="cart-summary__value">{cartSummary.formattedTotal}</span>
                  </div>
                </div>
              </div>
              
              {/* Acciones del carrito */}
              <div className="cart-modal__actions">
                <button 
                  className="cart-modal__clear"
                  onClick={handleClearCart}
                >
                  <i className="fas fa-trash"></i>
                  Vaciar Carrito
                </button>
                
                <button 
                  className="cart-modal__continue"
                  onClick={toggleCart}
                >
                  Continuar Comprando
                </button>
                
                <button 
                  className="cart-modal__checkout"
                  onClick={handleCheckout}
                >
                  <i className="fas fa-credit-card"></i>
                  Proceder al Pago
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;