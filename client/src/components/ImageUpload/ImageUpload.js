import React, { useState, useRef } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ onImageUpload, currentImage, disabled = false }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona solo archivos de imagen');
      return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 5MB permitido');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:3001/api/upload/image', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        const imageUrl = result.data.fullUrl;
        setPreview(imageUrl);
        onImageUpload(imageUrl);
      } else {
        alert(result.message || 'Error al subir la imagen');
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir la imagen. Inténtalo de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload-container">
      <label className="image-upload-label">Imagen del Producto</label>
      
      <div 
        className={`image-upload-area ${
          dragOver ? 'drag-over' : ''
        } ${disabled ? 'disabled' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        {preview ? (
          <div className="image-preview">
            <img src={preview} alt="Preview" className="preview-image" />
            <div className="image-overlay">
              <button 
                type="button" 
                className="remove-image-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                disabled={disabled}
              >
                ✕
              </button>
              <button 
                type="button" 
                className="change-image-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                disabled={disabled || uploading}
              >
                Cambiar
              </button>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            {uploading ? (
              <div className="upload-loading">
                <div className="spinner"></div>
                <p>Subiendo imagen...</p>
              </div>
            ) : (
              <>
                <div className="upload-icon">📷</div>
                <p className="upload-text">
                  Arrastra una imagen aquí o haz clic para seleccionar
                </p>
                <p className="upload-hint">
                  Formatos: JPG, PNG, GIF, WEBP (máx. 5MB)
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        disabled={disabled || uploading}
      />
    </div>
  );
};

export default ImageUpload;