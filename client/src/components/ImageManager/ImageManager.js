import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import './ImageManager.css';

const ImageManager = ({ images = [], onImagesChange, maxImages = 5 }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return 'Tipo de archivo no válido. Solo se permiten: JPEG, JPG, PNG, GIF, WEBP';
    }

    if (file.size > maxSize) {
      return 'El archivo es demasiado grande. Máximo 5MB permitido.';
    }

    return null;
  };

  const handleFiles = async (files) => {
    setError('');
    const fileArray = Array.from(files);
    
    if (images.length + fileArray.length > maxImages) {
      setError(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    const validFiles = [];
    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      validFiles.push(file);
    }

    setUploading(true);
    
    try {
      const newImages = [];
      
      for (const file of validFiles) {
        // Subir imagen al servidor
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch('http://localhost:3001/api/upload/image', {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
          newImages.push({
            url: result.data.fullUrl,
            filename: result.data.filename,
            name: result.data.originalName,
            size: result.data.size
          });
        } else {
          throw new Error(result.message || 'Error al subir imagen');
        }
      }
      
      onImagesChange([...images, ...newImages]);
    } catch (err) {
      console.error('Error al subir imágenes:', err);
      setError(err.message || 'Error al procesar las imágenes');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-manager">
      <div className="image-manager-header">
        <h3>Gestión de Imágenes</h3>
        <span className="image-count">{images.length}/{maxImages}</span>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`upload-area ${
          dragActive ? 'drag-active' : ''
        } ${uploading ? 'uploading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          style={{ display: 'none' }}
          disabled={uploading || images.length >= maxImages}
        />
        
        <div className="upload-content">
          {uploading ? (
            <>
              <div className="spinner"></div>
              <p>Procesando imágenes...</p>
            </>
          ) : (
            <>
              <Upload size={48} />
              <p>Arrastra imágenes aquí o haz clic para seleccionar</p>
              <small>JPEG, PNG, GIF, WEBP - Máximo 5MB cada una</small>
            </>
          )}
        </div>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="images-grid">
          {images.map((image, index) => (
            <div key={index} className="image-item">
              <div className="image-preview">
                <img
                  src={image.url || image.preview || image}
                  alt={`Preview ${index + 1}`}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="image-fallback" style={{ display: 'none' }}>
                  <ImageIcon size={24} />
                  <span>Error al cargar</span>
                </div>
              </div>
              
              <div className="image-info">
                <span className="image-name">
                  {image.name || `Imagen ${index + 1}`}
                </span>
                {image.size && (
                  <span className="image-size">
                    {(image.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                )}
              </div>
              
              <button
                type="button"
                className="remove-image"
                onClick={() => removeImage(index)}
                title="Eliminar imagen"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageManager;