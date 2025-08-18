const express = require('express');
const router = express.Router();
const { upload, handleMulterError } = require('../middleware/upload');
const path = require('path');

// Ruta para subir una sola imagen
router.post('/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se ha subido ningún archivo'
      });
    }

    // Construir URL de la imagen
    const imageUrl = `/uploads/images/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Imagen subida exitosamente',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: imageUrl,
        fullUrl: `${req.protocol}://${req.get('host')}${imageUrl}`
      }
    });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para subir múltiples imágenes
router.post('/images', upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se han subido archivos'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: `/uploads/images/${file.filename}`,
      fullUrl: `${req.protocol}://${req.get('host')}/uploads/images/${file.filename}`
    }));

    res.json({
      success: true,
      message: `${req.files.length} imagen(es) subida(s) exitosamente`,
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Error al subir imágenes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Middleware para manejar errores de multer
router.use(handleMulterError);

module.exports = router;