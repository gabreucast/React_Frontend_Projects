const express = require('express');
const router = express.Router();

// Simulación de carrito en memoria (en producción usaríamos base de datos)
let cartItems = [];
let cartIdCounter = 1;

// GET /api/cart - Obtener items del carrito
router.get('/', (req, res) => {
  try {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({
      success: true,
      data: {
        items: cartItems,
        total: total,
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener carrito',
      message: error.message
    });
  }
});

// POST /api/cart - Agregar item al carrito
router.post('/', (req, res) => {
  try {
    const { laptopId, name, price, image, quantity = 1 } = req.body;
    
    if (!laptopId || !name || !price) {
      return res.status(400).json({
        success: false,
        error: 'Datos incompletos',
        message: 'Se requieren laptopId, name y price'
      });
    }
    
    // Verificar si el item ya existe en el carrito
    const existingItemIndex = cartItems.findIndex(item => item.laptopId === laptopId);
    
    if (existingItemIndex > -1) {
      // Si existe, actualizar cantidad
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Si no existe, agregar nuevo item
      const newItem = {
        id: cartIdCounter++,
        laptopId,
        name,
        price,
        image,
        quantity,
        addedAt: new Date().toISOString()
      };
      cartItems.push(newItem);
    }
    
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({
      success: true,
      message: 'Item agregado al carrito',
      data: {
        items: cartItems,
        total: total,
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al agregar item al carrito',
      message: error.message
    });
  }
});

// PUT /api/cart/:id - Actualizar cantidad de item
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Cantidad inválida',
        message: 'La cantidad debe ser mayor a 0'
      });
    }
    
    const itemIndex = cartItems.findIndex(item => item.id === parseInt(id));
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item no encontrado',
        message: `No se encontró un item con ID: ${id}`
      });
    }
    
    cartItems[itemIndex].quantity = quantity;
    
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({
      success: true,
      message: 'Cantidad actualizada',
      data: {
        items: cartItems,
        total: total,
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al actualizar item',
      message: error.message
    });
  }
});

// DELETE /api/cart/:id - Eliminar item del carrito
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const itemIndex = cartItems.findIndex(item => item.id === parseInt(id));
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item no encontrado',
        message: `No se encontró un item con ID: ${id}`
      });
    }
    
    cartItems.splice(itemIndex, 1);
    
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({
      success: true,
      message: 'Item eliminado del carrito',
      data: {
        items: cartItems,
        total: total,
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar item',
      message: error.message
    });
  }
});

// DELETE /api/cart - Limpiar carrito
router.delete('/', (req, res) => {
  try {
    cartItems = [];
    
    res.json({
      success: true,
      message: 'Carrito limpiado',
      data: {
        items: [],
        total: 0,
        itemCount: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al limpiar carrito',
      message: error.message
    });
  }
});

module.exports = router;