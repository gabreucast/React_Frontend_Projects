import api from './api'

// Funciones utilitarias del carrito

/**
 * Formatea el precio en formato de moneda
 * @param {number} price - Precio a formatear
 * @returns {string} Precio formateado
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

/**
 * Calcula el subtotal de un item del carrito
 * @param {Object} item - Item del carrito
 * @returns {number} Subtotal del item
 */
export const calculateItemSubtotal = (item) => {
  return item.price * item.quantity;
};

/**
 * Calcula el total del carrito
 * @param {Array} items - Items del carrito
 * @returns {Object} Objeto con totales calculados
 */
export const calculateCartTotals = (items) => {
  const subtotal = items.reduce((total, item) => total + calculateItemSubtotal(item), 0);
  const tax = subtotal * 0.19; // IVA del 19%
  const shipping = subtotal > 200000 ? 0 : 15000; // Envío gratis para compras mayores a $200,000
  const total = subtotal + tax + shipping;
  
  return {
    subtotal,
    tax,
    shipping,
    total,
    itemCount: items.reduce((count, item) => count + item.quantity, 0)
  };
};

/**
 * Valida si un producto puede ser agregado al carrito
 * @param {Object} product - Producto a validar
 * @returns {Object} Resultado de la validación
 */
export const validateProduct = (product) => {
  if (!product) {
    return {
      isValid: false,
      message: 'Producto no válido'
    };
  }
  
  if (!product._id) {
    return {
      isValid: false,
      message: 'ID de producto requerido'
    };
  }
  
  if (!product.name) {
    return {
      isValid: false,
      message: 'Nombre de producto requerido'
    };
  }
  
  if (!product.price || product.price <= 0) {
    return {
      isValid: false,
      message: 'Precio de producto inválido'
    };
  }
  
  return {
    isValid: true,
    message: 'Producto válido'
  };
};

/**
 * Genera un resumen del carrito para mostrar al usuario
 * @param {Array} items - Items del carrito
 * @returns {Object} Resumen del carrito
 */
export const generateCartSummary = (items) => {
  const totals = calculateCartTotals(items);
  
  return {
    ...totals,
    isEmpty: items.length === 0,
    hasItems: items.length > 0,
    formattedSubtotal: formatPrice(totals.subtotal),
    formattedTax: formatPrice(totals.tax),
    formattedShipping: totals.shipping === 0 ? 'Gratis' : formatPrice(totals.shipping),
    formattedTotal: formatPrice(totals.total),
    items: items.map(item => ({
      ...item,
      formattedPrice: formatPrice(item.price),
      formattedSubtotal: formatPrice(calculateItemSubtotal(item))
    }))
  };
};

/**
 * Configuración del carrito
 */
export const cartConfig = {
  maxQuantityPerItem: 10,
  freeShippingThreshold: 200000,
  taxRate: 0.19,
  shippingCost: 15000,
  storageKey: 'lenovo-cart'
};

// Servicio de API del carrito (manteniendo compatibilidad)
export const cartService = {
  // Obtener carrinho por sessionId
  getCart: async (sessionId) => {
    const response = await api.get(`/cart/${sessionId}`)
    return response.data
  },

  // Obtener resumo do carrinho
  getCartSummary: async (sessionId) => {
    const response = await api.get(`/cart/${sessionId}/summary`)
    return response.data
  },

  // Adicionar item ao carrinho
  addToCart: async (sessionId, laptopId, quantity = 1) => {
    const response = await api.post(`/cart/${sessionId}/items`, {
      laptopId,
      quantity
    })
    return response.data
  },

  // Atualizar quantidade do item
  updateCartItem: async (sessionId, laptopId, quantity) => {
    const response = await api.put(`/cart/${sessionId}/items/${laptopId}`, {
      quantity
    })
    return response.data
  },

  // Remover item do carrinho
  removeFromCart: async (sessionId, laptopId) => {
    const response = await api.delete(`/cart/${sessionId}/items/${laptopId}`)
    return response.data
  },

  // Limpar carrinho
  clearCart: async (sessionId) => {
    const response = await api.delete(`/cart/${sessionId}`)
    return response.data
  }
}

export default {
  formatPrice,
  calculateItemSubtotal,
  calculateCartTotals,
  validateProduct,
  generateCartSummary,
  cartConfig,
  cartService
};