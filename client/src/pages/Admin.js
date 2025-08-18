import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import AdminLogin from '../components/AdminLogin/AdminLogin'
import ImageManager from '../components/ImageManager/ImageManager'
import { Plus, Edit, Trash2, Search, Filter, Save, X } from 'lucide-react'
import api from '../services/api'
import '../styles/Admin.css'

const Admin = () => {
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth();
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    price: '',
    originalPrice: '',
    category: '',
    description: '',
    specifications: {
      processor: '',
      ram: '',
      storage: '',
      graphics: '',
      display: '',
      battery: '',
      weight: '',
      os: '',
      categories: {
        gaming: 0,
        work: 0,
        study: 0,
        design: 0,
        programming: 0
      }
    },
    features: [],
    images: [],
    isActive: true
  })

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/laptops')
      setProducts(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts()
    }
  }, [isAuthenticated])

  // Se está carregando a autenticação, mostrar loading
  if (authLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      if (parent === 'categories') {
        setFormData(prev => ({
          ...prev,
          specifications: {
            ...prev.specifications,
            categories: {
              ...prev.specifications.categories,
              [child]: parseInt(value) || 0
            }
          }
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          specifications: {
            ...prev.specifications,
            [child]: value
          }
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Gerar um ID único para produtos novos
      const generateId = () => {
        return Date.now() + Math.floor(Math.random() * 1000)
      }

      // Obtener la primera imagen o usar una por defecto
      const imageUrl = formData.images && formData.images.length > 0 
        ? (formData.images[0].url || formData.images[0]) 
        : '/placeholder-laptop.svg'

      // Mapear categoría a valores válidos del enum
      const categoryMapping = {
        'Gaming': 'gaming',
        'Negócios': 'business',
        'Ultrabook': 'ultrabook',
        'Workstation': 'workstation',
        'Econômico': 'budget'
      };
      
      const mappedCategory = categoryMapping[formData.category] || 'business';

      const productData = {
        id: editingProduct ? editingProduct.id : generateId(),
        name: formData.name || 'Laptop sem nome',
        brand: formData.brand || 'Marca não especificada',
        price: parseFloat(formData.price) || 0,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : parseFloat(formData.price),
        image: imageUrl,
        category: mappedCategory,
        specifications: {
          processor: formData.specifications.processor || 'Intel Core i5',
          ram: formData.specifications.ram || '8GB',
          storage: formData.specifications.storage || '256GB SSD',
          graphics: formData.specifications.graphics || 'Intel UHD Graphics',
          display: formData.specifications.display || '15.6" Full HD',
          battery: formData.specifications.battery || '8 horas',
          weight: formData.specifications.weight || '2.0kg',
          os: formData.specifications.os || 'Windows 11'
        },
        features: formData.features?.filter(f => f.trim() !== '') || [],
        inStock: true,
        stockQuantity: 10,
        rating: 0,
        reviewCount: 0,
        isRecommended: false,
        tags: [formData.brand?.toLowerCase(), 'laptop']
      }



      if (editingProduct) {
        await api.put(`/laptops/${editingProduct._id}`, productData)
        setSuccessMessage('Produto atualizado com sucesso!')
      } else {
        await api.post('/laptops', productData)
        setSuccessMessage('Produto criado com sucesso!')
      }

      setShowModal(false)
      setEditingProduct(null)
      resetForm()
      fetchProducts()
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Erro ao salvar o produto: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      brand: product.brand || '',
      model: product.model || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      category: product.category || '',
      description: product.description || '',
      specifications: {
        processor: product.specifications?.processor || '',
        ram: product.specifications?.ram || '',
        storage: product.specifications?.storage || '',
        graphics: product.specifications?.graphics || '',
        display: product.specifications?.display || '',
        battery: product.specifications?.battery || '',
        weight: product.specifications?.weight || '',
        os: product.specifications?.os || '',
        categories: {
          gaming: product.categories?.gaming || 0,
          work: product.categories?.work || 0,
          study: product.categories?.study || 0,
          design: product.categories?.design || 0,
          programming: product.categories?.programming || 0,
          mobility: product.categories?.mobility || 0,
          budget: product.categories?.budget || 0
        }
      },
      features: product.features || [],
      images: product.images || [],
      isActive: product.isActive !== false
    })
    setShowModal(true)
  }

  const handleDelete = async (productId) => {
    if (window.confirm('Tem certeza de que deseja excluir este produto?')) {
      try {
        await api.delete(`/laptops/${productId}`)
        fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Erro ao excluir o produto')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      model: '',
      price: '',
      originalPrice: '',
      category: '',
      description: '',
      specifications: {
        processor: '',
        ram: '',
        storage: '',
        graphics: '',
        display: '',
        battery: '',
        weight: '',
        os: '',
        categories: {
          gaming: 0,
          work: 0,
          study: 0,
          design: 0,
          programming: 0,
          mobility: 0,
          budget: 0
        }
      },
      features: [],
      images: [],
      isActive: true
    })
  }

  const safeProducts = Array.isArray(products) ? products : []
  const filteredProducts = safeProducts.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBrand = !selectedBrand || product.brand === selectedBrand
    return matchesSearch && matchesBrand
  })

  const brands = [...new Set(safeProducts.map(p => p.brand).filter(Boolean))]

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="admin-header-left">
          <div className="admin-logo">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="admin-title">
            <h1>Painel de Administração</h1>
            <p>Gestão de produtos MatchTech</p>
          </div>
        </div>
        
        <div className="admin-header-right">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="admin-user-details">
              <span className="admin-user-name">{user?.name}</span>
              <span className="admin-user-role">{user?.role}</span>
            </div>
          </div>
          
          <button 
            className="btn-primary"
            onClick={() => {
              resetForm()
              setEditingProduct(null)
              setShowModal(true)
            }}
          >
            <Plus size={20} />
            Adicionar Produto
          </button>
          
          <button 
            className="btn-logout"
            onClick={logout}
            title="Encerrar sessão"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      <div className="admin-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="">Todas as marcas</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {successMessage && (
        <div className="success-message">
          <div className="success-content">
            <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {successMessage}
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando produtos...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
            </svg>
          </div>
          <h3>Nenhum produto encontrado</h3>
          <p>Adicione produtos para começar a gerenciar seu inventário</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} />
            Adicionar Primeiro Produto
          </button>
        </div>
      ) : (
        <div className="products-grid-container">
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product._id} className="product-card-admin">
                <div className="product-image-container">
                  <img 
                    src={product.image || product.images?.[0] || '/placeholder-laptop.svg'} 
                    alt={product.name}
                    className="product-image-admin"
                    onError={(e) => {
                      e.target.src = '/placeholder-laptop.svg';
                    }}
                  />
                  <div className="product-status-badge">
                    <span className={`status-indicator ${product.isActive ? 'active' : 'inactive'}`}>
                      {product.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
                
                <div className="product-info-admin">
                  <div className="product-header">
                    <h3 className="product-name">{product.name}</h3>
                    <span className="product-brand">{product.brand}</span>
                  </div>
                  
                  <div className="product-details">
                    <div className="product-price">
                      <span className="price-label">Preço:</span>
                      <span className="price-value">R$ {product.price?.toLocaleString('pt-BR')}</span>
                    </div>
                    
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="product-original-price">
                        <span className="original-price">R$ {product.originalPrice?.toLocaleString('pt-BR')}</span>
                        <span className="discount-badge">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </span>
                      </div>
                    )}
                    
                    <div className="product-specs">
                      {product.specifications?.processor && (
                        <span className="spec-item">
                          <strong>CPU:</strong> {product.specifications.processor}
                        </span>
                      )}
                      {product.specifications?.ram && (
                        <span className="spec-item">
                          <strong>RAM:</strong> {product.specifications.ram}
                        </span>
                      )}
                      {product.specifications?.storage && (
                        <span className="spec-item">
                          <strong>Armazenamento:</strong> {product.specifications.storage}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="product-actions">
                    <button 
                      className="btn-edit-modern"
                      onClick={() => handleEdit(product)}
                      title="Editar produto"
                    >
                      <Edit size={18} />
                      <span>Editar</span>
                    </button>
                    <button 
                      className="btn-delete-modern"
                      onClick={() => handleDelete(product._id)}
                      title="Excluir produto"
                    >
                      <Trash2 size={18} />
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{editingProduct ? 'Editar Produto' : 'Adicionar Produto'}</h2>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nome</label>
                  <input
                    className="form-input"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Marca</label>
                  <input
                    className="form-input"
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Modelo</label>
                  <input
                    className="form-input"
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Preço</label>
                  <input
                    className="form-input"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Preço Original</label>
                  <input
                    className="form-input"
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Categoria</label>
                  <select
                    className="form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Negócios">Negócios</option>
                    <option value="Ultrabook">Ultrabook</option>
                    <option value="Workstation">Workstation</option>
                    <option value="Econômico">Econômico</option>
                  </select>
                </div>
                
                <div className="form-group full-width">
                  <label className="form-label">Descrição</label>
                  <textarea
                    className="form-textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
              </div>
              
              <ImageManager
                images={formData.images || []}
                onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
              />
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Processador</label>
                  <input
                    className="form-input"
                    type="text"
                    name="specifications.processor"
                    value={formData.specifications.processor}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">RAM</label>
                  <input
                    className="form-input"
                    type="text"
                    name="specifications.ram"
                    value={formData.specifications.ram}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Armazenamento</label>
                  <input
                    className="form-input"
                    type="text"
                    name="specifications.storage"
                    value={formData.specifications.storage}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Gráficos</label>
                  <input
                    className="form-input"
                    type="text"
                    name="specifications.graphics"
                    value={formData.specifications.graphics}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Tela</label>
                  <input
                    className="form-input"
                    type="text"
                    name="specifications.display"
                    value={formData.specifications.display}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Peso (kg)</label>
                  <input
                    className="form-input"
                    type="number"
                    step="0.1"
                    name="specifications.weight"
                    value={formData.specifications.weight}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Bateria</label>
                  <input
                    className="form-input"
                    type="text"
                    name="specifications.battery"
                    value={formData.specifications.battery}
                    onChange={handleInputChange}
                    placeholder="ex: 8 horas"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Sistema Operacional</label>
                  <input
                    className="form-input"
                    type="text"
                    name="specifications.os"
                    value={formData.specifications.os}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="categories-section">
                <h3>Categorias (1-5)</h3>
                <div className="categories-grid">
                  {Object.keys(formData.specifications.categories).map(category => (
                    <div key={category} className="form-group">
                      <label>{category.charAt(0).toUpperCase() + category.slice(1)}</label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        name={`categories.${category}`}
                        value={formData.specifications.categories[category]}
                        onChange={handleInputChange}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="save-btn">
                  <Save size={16} />
                  {editingProduct ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin