import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api'
const API_PASSWORD = process.env.REACT_APP_API_PASSWORD

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    ...(API_PASSWORD && { 'Authorization': `Bearer ${API_PASSWORD}` })
  }
})

// Interceptor para gerenciar respostas
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API Error:', error)
    
    if (error.response) {
      // O servidor respondeu com um código de erro
      throw new Error(error.response.data.message || 'Erro no servidor')
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      throw new Error('Não foi possível conectar com o servidor')
    } else {
      // Algo aconteceu ao configurar a requisição
      throw new Error('Erro na requisição')
    }
  }
)

// APIs específicas
export const laptopsAPI = {
  getAll: () => api.get('/laptops'),
  getById: (id) => api.get(`/laptops/${id}`)
}

export const cartAPI = {
  getItems: (sessionId) => api.get(`/cart/${sessionId}`),
  addItem: (sessionId, item) => api.post(`/cart/${sessionId}/add`, item),
  removeItem: (sessionId, itemId) => api.delete(`/cart/${sessionId}/remove/${itemId}`),
  updateQuantity: (sessionId, itemId, quantity) => api.put(`/cart/${sessionId}/update/${itemId}`, { quantity }),
  clear: (sessionId) => api.delete(`/cart/${sessionId}/clear`)
}

export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  getLaptops: (token) => api.get('/admin/laptops', { 
    headers: { Authorization: `Bearer ${token}` }
  }),
  createLaptop: (laptopData, token) => api.post('/admin/laptops', laptopData, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  updateLaptop: (id, laptopData, token) => api.put(`/admin/laptops/${id}`, laptopData, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  deleteLaptop: (id, token) => api.delete(`/admin/laptops/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const uploadAPI = {
  uploadImage: (formData, token) => api.post('/upload', formData, {
    headers: { 
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}

export default api