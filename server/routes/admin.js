const express = require('express');
const Laptop = require('../models/Laptop');
const { authenticateToken } = require('../middleware/auth');
const { upload, handleMulterError, deleteFile } = require('../middleware/upload');
const path = require('path');
const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// @route   GET /api/admin/products
// @desc    Obtener todos los productos para administración
// @access  Private (Admin)
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, inStock } = req.query;
    
    const query = {};
    
    // Filtros
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { 'specifications.processor': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    if (inStock !== undefined) {
      query.inStock = inStock === 'true';
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 }
    };

    const laptops = await Laptop.find(query)
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit);

    const total = await Laptop.countDocuments(query);

    res.json({
      success: true,
      data: laptops,
      pagination: {
        currentPage: options.page,
        totalPages: Math.ceil(total / options.limit),
        totalItems: total,
        itemsPerPage: options.limit,
        hasNextPage: options.page < Math.ceil(total / options.limit),
        hasPrevPage: options.page > 1
      }
    });

  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/admin/products/:id
// @desc    Obtener producto por ID
// @access  Private (Admin)
router.get('/products/:id', async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);
    
    if (!laptop) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: laptop
    });

  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/admin/products
// @desc    Crear nuevo producto
// @access  Private (Admin)
router.post('/products', upload.single('image'), handleMulterError, async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData || '{}');
    
    // Validar campos requeridos
    const requiredFields = ['name', 'brand', 'price', 'category'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return res.status(400).json({
          success: false,
          message: `El campo ${field} es requerido`
        });
      }
    }

    // Agregar imagen si se subió
    if (req.file) {
      productData.image = `/uploads/images/${req.file.filename}`;
    }

    // Calcular precio con descuento
    if (productData.discount && productData.discount > 0) {
      productData.discountedPrice = productData.price * (1 - productData.discount / 100);
    } else {
      productData.discountedPrice = productData.price;
    }

    const laptop = new Laptop(productData);
    await laptop.save();

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: laptop
    });

  } catch (error) {
    // Eliminar archivo subido si hay error
    if (req.file) {
      deleteFile(req.file.filename);
    }
    
    console.error('Error creando producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/admin/products/:id
// @desc    Actualizar producto
// @access  Private (Admin)
router.put('/products/:id', upload.single('image'), handleMulterError, async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);
    
    if (!laptop) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    const updateData = JSON.parse(req.body.productData || '{}');
    const oldImagePath = laptop.image;

    // Actualizar imagen si se subió una nueva
    if (req.file) {
      updateData.image = `/uploads/images/${req.file.filename}`;
      
      // Eliminar imagen anterior si existe y no es la imagen por defecto
      if (oldImagePath && oldImagePath.startsWith('/uploads/')) {
        const oldFilename = path.basename(oldImagePath);
        deleteFile(oldFilename);
      }
    }

    // Recalcular precio con descuento
    if (updateData.price !== undefined || updateData.discount !== undefined) {
      const price = updateData.price || laptop.price;
      const discount = updateData.discount || laptop.discount || 0;
      
      if (discount > 0) {
        updateData.discountedPrice = price * (1 - discount / 100);
      } else {
        updateData.discountedPrice = price;
      }
    }

    const updatedLaptop = await Laptop.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: updatedLaptop
    });

  } catch (error) {
    // Eliminar archivo subido si hay error
    if (req.file) {
      deleteFile(req.file.filename);
    }
    
    console.error('Error actualizando producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   DELETE /api/admin/products/:id
// @desc    Eliminar producto
// @access  Private (Admin)
router.delete('/products/:id', async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);
    
    if (!laptop) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Eliminar imagen asociada si existe
    if (laptop.image && laptop.image.startsWith('/uploads/')) {
      const filename = path.basename(laptop.image);
      deleteFile(filename);
    }

    await Laptop.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/admin/products/:id/toggle-stock
// @desc    Cambiar estado de stock del producto
// @access  Private (Admin)
router.post('/products/:id/toggle-stock', async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);
    
    if (!laptop) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    laptop.inStock = !laptop.inStock;
    if (!laptop.inStock) {
      laptop.stockQuantity = 0;
    }
    
    await laptop.save();

    res.json({
      success: true,
      message: `Producto ${laptop.inStock ? 'habilitado' : 'deshabilitado'} exitosamente`,
      data: laptop
    });

  } catch (error) {
    console.error('Error cambiando estado de stock:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/admin/stats
// @desc    Obtener estadísticas del dashboard
// @access  Private (Admin)
router.get('/stats', async (req, res) => {
  try {
    const totalProducts = await Laptop.countDocuments();
    const inStockProducts = await Laptop.countDocuments({ inStock: true });
    const outOfStockProducts = await Laptop.countDocuments({ inStock: false });
    const categories = await Laptop.distinct('category');
    const brands = await Laptop.distinct('brand');
    
    const categoryStats = await Laptop.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        inStockProducts,
        outOfStockProducts,
        totalCategories: categories.length,
        totalBrands: brands.length,
        categories,
        brands,
        categoryStats
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;