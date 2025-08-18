// src/components/Cart/CartItem.js
// Componente para mostrar un item individual del carrito

import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatPrice, calculateItemSubtotal } from '../../services/cartService';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) {
      handleRemove();
      return;
    }
    
    if (newQuantity > 10) {
      alert('Cantidad máxima permitida: 10');
      return;
    }
    
    setIsUpdating(true);
    try {
      updateQuantity(item.id, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleRemove = () => {
    setShowDeleteModal(true);
  };
  
  const confirmRemove = () => {
    removeFromCart(item.id);
  };
  
  const cancelRemove = () => {
    setShowDeleteModal(false);
  };
  
  const incrementQuantity = () => {
    handleQuantityChange(item.quantity + 1);
  };
  
  const decrementQuantity = () => {
    handleQuantityChange(item.quantity - 1);
  };
  
  const subtotal = calculateItemSubtotal(item);
  
  return (
    <div className="cart-item">
      <div className="cart-item__image">
        <img 
          src={item.image || '/placeholder-laptop.svg'} 
          alt={item.name}
          onError={(e) => {
            e.target.src = '/placeholder-laptop.svg';
          }}
        />
      </div>
      
      <div className="cart-item__details">
        <div className="cart-item__info">
          <h4 className="cart-item__name">{item.name}</h4>
          <div className="cart-item__meta">
            {item.brand && (
              <span className="cart-item__brand">{item.brand}</span>
            )}
            {item.model && (
              <span className="cart-item__model">Modelo: {item.model}</span>
            )}
          </div>
          <div className="cart-item__price">
            <span className="cart-item__unit-price">{formatPrice(item.price)} c/u</span>
            <span className="cart-item__subtotal">{formatPrice(subtotal)}</span>
          </div>
        </div>
        
        <div className="cart-item__controls">
          <div className="cart-item__quantity">
            <button 
              className="quantity-btn quantity-btn--decrease"
              onClick={decrementQuantity}
              disabled={isUpdating || item.quantity <= 1}
              aria-label="Disminuir cantidad"
            >
              <i className="fas fa-minus"></i>
            </button>
            
            <span className="quantity-display">
              {isUpdating ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                item.quantity
              )}
            </span>
            
            <button 
              className="quantity-btn quantity-btn--increase"
              onClick={incrementQuantity}
              disabled={isUpdating || item.quantity >= 10}
              aria-label="Aumentar cantidad"
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
          
          <button 
            className="cart-item__remove"
            onClick={handleRemove}
            disabled={isUpdating}
            aria-label={`Eliminar ${item.name} del carrito`}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={cancelRemove}
        onConfirm={confirmRemove}
        productName={item.name}
      />
    </div>
  );
};

export default CartItem;