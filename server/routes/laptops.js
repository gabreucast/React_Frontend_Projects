const express = require('express');
const router = express.Router();
const Laptop = require('../models/Laptop');

// GET /api/laptops - Obtener todas las laptops con filtros opcionales
router.get('/', async (req, res) => {
  try {
    const {
      brand,
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      limit = 20
    } = req.query;

    // Construir filtros
    const filters = {};
    
    if (brand) {
      filters.brand = { $regex: brand, $options: 'i' };
    }
    
    if (category) {
      filters.category = category;
    }
    
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { 'specifications.processor': { $regex: search, $options: 'i' } }
      ];
    }

    // Configurar ordenamiento
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calcular paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Ejecutar consulta
    const laptops = await Laptop.find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Laptop.countDocuments(filters);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: laptops,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error al obtener laptops:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener laptops',
      message: error.message
    });
  }
});

// GET /api/laptops/brands - Obtener todas las marcas disponibles
router.get('/brands', async (req, res) => {
  try {
    const brands = await Laptop.distinct('brand');
    
    res.json({
      success: true,
      data: brands.sort()
    });
  } catch (error) {
    console.error('Error al obtener marcas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener marcas',
      message: error.message
    });
  }
});

// GET /api/laptops/categories - Obtener todas las categorías disponibles
router.get('/categories', async (req, res) => {
  try {
    const categories = await Laptop.distinct('category');
    
    res.json({
      success: true,
      data: categories.sort()
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener categorías',
      message: error.message
    });
  }
});

// GET /api/laptops/recommendations - Obtener laptops recomendadas
router.get('/recommendations', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const recommendations = await Laptop.find({ isRecommended: true })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Error al obtener recomendaciones:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener recomendaciones',
      message: error.message
    });
  }
});

// GET /api/laptops/price-range - Obtener rango de precios
router.get('/price-range', async (req, res) => {
  try {
    const priceRange = await Laptop.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);
    
    const result = priceRange[0] || { minPrice: 0, maxPrice: 0 };
    
    res.json({
      success: true,
      data: {
        min: result.minPrice,
        max: result.maxPrice
      }
    });
  } catch (error) {
    console.error('Error al obtener rango de precios:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener rango de precios',
      message: error.message
    });
  }
});

// GET /api/laptops/search - Búsqueda avanzada
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Parámetro de búsqueda requerido',
        message: 'Debe proporcionar un término de búsqueda'
      });
    }
    
    const searchResults = await Laptop.find({
      $text: { $search: q }
    }, {
      score: { $meta: 'textScore' }
    })
    .sort({ score: { $meta: 'textScore' } })
    .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: searchResults,
      query: q
    });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({
      success: false,
      error: 'Error en búsqueda',
      message: error.message
    });
  }
});

// GET /api/laptops/:id - Obtener laptop por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    let laptop;
    
    // Verificar si el ID es un ObjectId válido de MongoDB
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Es un ObjectId válido, buscar por _id
      laptop = await Laptop.findById(id);
    } else {
      // No es un ObjectId válido, buscar por el campo id personalizado
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        laptop = await Laptop.findOne({ id: numericId });
      }
    }
    
    if (!laptop) {
      return res.status(404).json({
        success: false,
        error: 'Laptop no encontrada',
        message: `No se encontró una laptop con ID: ${id}`
      });
    }
    
    res.json({
      success: true,
      data: laptop
    });
  } catch (error) {
    console.error('Error al obtener laptop:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener laptop',
      message: error.message
    });
  }
});

// POST /api/laptops - Crear nueva laptop (para administración)
router.post('/', async (req, res) => {
  try {
    const laptopData = req.body;
    
    // Generar ID único si no se proporciona
    if (!laptopData.id) {
      const lastLaptop = await Laptop.findOne().sort({ id: -1 });
      laptopData.id = lastLaptop ? lastLaptop.id + 1 : 1;
    }
    
    const newLaptop = new Laptop(laptopData);
    const savedLaptop = await newLaptop.save();
    
    res.status(201).json({
      success: true,
      data: savedLaptop,
      message: 'Laptop creada exitosamente'
    });
  } catch (error) {
    console.error('Error al crear laptop:', error);
    res.status(400).json({
      success: false,
      error: 'Error al crear laptop',
      message: error.message
    });
  }
});

// PUT /api/laptops/:id - Actualizar laptop
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    let updatedLaptop;
    
    // Verificar si el ID es un ObjectId válido de MongoDB
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Es un ObjectId válido, buscar por _id
      updatedLaptop = await Laptop.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    } else {
      // No es un ObjectId válido, buscar por el campo id personalizado
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        updatedLaptop = await Laptop.findOneAndUpdate(
          { id: numericId },
          updateData,
          { new: true, runValidators: true }
        );
      }
    }
    
    if (!updatedLaptop) {
      return res.status(404).json({
        success: false,
        error: 'Laptop no encontrada',
        message: `No se encontró una laptop con ID: ${id}`
      });
    }
    
    res.json({
      success: true,
      data: updatedLaptop,
      message: 'Laptop actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar laptop:', error);
    res.status(400).json({
      success: false,
      error: 'Error al actualizar laptop',
      message: error.message
    });
  }
});

// DELETE /api/laptops/:id - Eliminar laptop
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    let deletedLaptop;
    
    // Verificar si el ID es un ObjectId válido de MongoDB
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Es un ObjectId válido, buscar por _id
      deletedLaptop = await Laptop.findByIdAndDelete(id);
    } else {
      // No es un ObjectId válido, buscar por el campo id personalizado
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        deletedLaptop = await Laptop.findOneAndDelete({ id: numericId });
      }
    }
    
    if (!deletedLaptop) {
      return res.status(404).json({
        success: false,
        error: 'Laptop no encontrada',
        message: `No se encontró una laptop con ID: ${id}`
      });
    }
    
    res.json({
      success: true,
      data: deletedLaptop,
      message: 'Laptop eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar laptop:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar laptop',
      message: error.message
    });
  }
});

module.exports = router;