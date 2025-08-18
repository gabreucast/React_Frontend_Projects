// src/components/Cart/ConfirmDeleteModal.js
// Modal de confirmación para eliminar productos del carrito

import React from 'react';
import './ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="confirm-modal-overlay" onClick={handleOverlayClick}>
      <div className="confirm-modal">
        <div className="confirm-modal__header">
          <h3>Eliminar producto</h3>
          <button 
            className="confirm-modal__close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="confirm-modal__body">
          <div className="confirm-modal__icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <p className="confirm-modal__message">
            ¿Estás seguro de que quieres eliminar <strong>{productName}</strong> del carrito?
          </p>
          <p className="confirm-modal__submessage">
            Esta acción no se puede deshacer.
          </p>
        </div>
        
        <div className="confirm-modal__footer">
          <button 
            className="btn btn--secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            className="btn btn--danger"
            onClick={handleConfirm}
          >
            <i className="fas fa-trash"></i>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;