import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

// Crear el contexto
const CartContext = createContext();

// Tipos de acciones para el reducer
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
  TOGGLE_CART: 'TOGGLE_CART'
};

// Estado inicial del carrito
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false
};

// Función para calcular totales
const calculateTotals = (items) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  return { totalItems, totalPrice };
};

// Reducer para manejar las acciones del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product._id);
      
      let newItems;
      if (existingItemIndex >= 0) {
        // Si el producto ya existe, actualizar cantidad
        newItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Se é um produto novo, adicioná-lo
        const newItem = {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          brand: product.brand,
          model: product.model,
          quantity: quantity
        };
        newItems = [...state.items, newItem];
      }
      
      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        ...totals
      };
    }
    
    case CART_ACTIONS.REMOVE_ITEM: {
      const newItems = state.items.filter(item => item.id !== action.payload.id);
      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        ...totals
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Si la cantidad es 0 o menor, eliminar el item
        const newItems = state.items.filter(item => item.id !== id);
        const totals = calculateTotals(newItems);
        return {
          ...state,
          items: newItems,
          ...totals
        };
      }
      
      const newItems = state.items.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        ...totals
      };
    }
    
    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...initialState
      };
    }
    
    case CART_ACTIONS.LOAD_CART: {
      const items = action.payload || [];
      const totals = calculateTotals(items);
      return {
        ...state,
        items,
        ...totals
      };
    }
    
    case CART_ACTIONS.TOGGLE_CART: {
      return {
        ...state,
        isOpen: !state.isOpen
      };
    }
    
    default:
      return state;
  }
};

// Hook personalizado para usar el contexto del carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

// Proveedor del contexto del carrito
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem('lenovo-cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData });
      } catch (error) {
        console.error('Erro ao carregar o carrinho do localStorage:', error);
      }
    }
    setIsInitialized(true);
  }, []);
  
  // Guardar carrito en localStorage cuando cambie (solo después de la inicialización)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('lenovo-cart', JSON.stringify(state.items));
      
      // Disparar evento personalizado para actualizar otros componentes
      window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: { totalItems: state.totalItems }
      }));
    }
  }, [state.items, state.totalItems, isInitialized]);
  
  // Funciones para manejar el carrito
  const addToCart = (product, quantity = 1) => {
    dispatch({ 
      type: CART_ACTIONS.ADD_ITEM, 
      payload: { product, quantity } 
    });
    return { success: true, message: 'Producto agregado al carrito' };
  };
  
  const removeFromCart = (id) => {
    dispatch({ 
      type: CART_ACTIONS.REMOVE_ITEM, 
      payload: { id } 
    });
  };
  
  const updateQuantity = (id, quantity) => {
    dispatch({ 
      type: CART_ACTIONS.UPDATE_QUANTITY, 
      payload: { id, quantity } 
    });
  };
  
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };
  
  const toggleCart = () => {
    dispatch({ type: CART_ACTIONS.TOGGLE_CART });
  };
  
  const getCartTotal = () => {
    return state.totalItems;
  };
  
  const getCartItemsCount = () => {
    return state.totalItems;
  };
  
  const value = {
    // Estado
    cartItems: state.items, // Mantener compatibilidad
    items: state.items,
    totalItems: state.totalItems,
    totalPrice: state.totalPrice,
    isOpen: state.isOpen,
    
    // Funciones
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    getCartTotal,
    getCartItemsCount,
    isLoading: false // Mantener compatibilidad
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;