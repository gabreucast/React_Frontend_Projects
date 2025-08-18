import api from './api'

// Datos estáticos de laptops inspirados en Lenovo
const staticLaptops = [
  {
    id: 1,
    name: "ThinkPad X1 Carbon Gen 11",
    brand: "Lenovo",
    category: "Business",
    price: 12999.99,
    oldPrice: 14999.99,
    rating: 4.8,
    reviewCount: 127,
    stock: 15,
    specifications: {
      processor: "Intel Core i7-1355U",
      ram: "16GB LPDDR5",
      storage: "512GB SSD NVMe",
      graphics: "Intel Iris Xe",
      screen: "14\" 2.8K OLED",
      weight: "1.12kg",
      battery: "57Wh"
    },
    categories: ["business", "premium", "ultrabook"],
    images: [
      "/placeholder-laptop.svg",
      "/placeholder-laptop.svg"
    ],
    badges: ["featured", "new"],
    description: "O ThinkPad mais fino e leve com desempenho empresarial premium."
  },
  {
    id: 2,
    name: "Legion Pro 7i Gen 8",
    brand: "Lenovo",
    category: "Gaming",
    price: 18999.99,
    oldPrice: 21999.99,
    rating: 4.9,
    reviewCount: 89,
    stock: 8,
    specifications: {
      processor: "Intel Core i9-13900HX",
      ram: "32GB DDR5",
      storage: "1TB SSD NVMe",
      graphics: "NVIDIA RTX 4080 12GB",
      screen: "16\" 2.5K 240Hz",
      weight: "2.8kg",
      battery: "99.9Wh"
    },
    categories: ["gaming", "performance", "premium"],
    images: [
      "/placeholder-laptop.svg",
      "/placeholder-laptop.svg"
    ],
    badges: ["gaming", "discount"],
    description: "Potência gaming extrema com refrigeração avançada e tela de alta frequência."
  },
  {
    id: 3,
    name: "IdeaPad Slim 5i Gen 8",
    brand: "Lenovo",
    category: "Student",
    price: 4999.99,
    oldPrice: 5999.99,
    rating: 4.5,
    reviewCount: 203,
    stock: 25,
    specifications: {
      processor: "Intel Core i5-1335U",
      ram: "8GB DDR4",
      storage: "256GB SSD",
      graphics: "Intel Iris Xe",
      screen: "15.6\" FHD IPS",
      weight: "1.75kg",
      battery: "47Wh"
    },
    categories: ["student", "budget", "everyday"],
    images: [
      "/placeholder-laptop.svg",
      "/placeholder-laptop.svg"
    ],
    badges: ["student", "discount"],
    description: "Perfeita para estudantes com excelente relação custo-benefício."
  },
  {
    id: 4,
    name: "ThinkPad P16 Gen 2",
    brand: "Lenovo",
    category: "Workstation",
    price: 24999.99,
    oldPrice: 27999.99,
    rating: 4.7,
    reviewCount: 45,
    stock: 5,
    specifications: {
      processor: "Intel Core i7-13700HX",
      ram: "64GB DDR5",
      storage: "2TB SSD NVMe",
      graphics: "NVIDIA RTX A2000 8GB",
      screen: "16\" 4K OLED",
      weight: "3.2kg",
      battery: "94Wh"
    },
    categories: ["workstation", "professional", "premium"],
    images: [
      "/placeholder-laptop.svg",
      "/placeholder-laptop.svg"
    ],
    badges: ["workstation", "professional"],
    description: "Estação de trabalho móvel para profissionais exigentes."
  },
  {
    id: 5,
    name: "Yoga 9i Gen 8",
    brand: "Lenovo",
    category: "Convertible",
    price: 15999.99,
    oldPrice: 17999.99,
    rating: 4.6,
    reviewCount: 78,
    stock: 12,
    specifications: {
      processor: "Intel Core i7-1360P",
      ram: "16GB LPDDR5",
      storage: "1TB SSD NVMe",
      graphics: "Intel Iris Xe",
      screen: "14\" 2.8K OLED Touch",
      weight: "1.37kg",
      battery: "75Wh"
    },
    categories: ["convertible", "premium", "creative"],
    images: [
      "/placeholder-laptop.svg",
      "/placeholder-laptop.svg"
    ],
    badges: ["convertible", "premium"],
    description: "Laptop conversível premium com tela sensível ao toque OLED e design elegante."
  },
  {
    id: 6,
    name: "ThinkBook 14s Gen 4",
    brand: "Lenovo",
    category: "Business",
    price: 7999.99,
    oldPrice: 8999.99,
    rating: 4.4,
    reviewCount: 156,
    stock: 18,
    specifications: {
      processor: "AMD Ryzen 7 7735U",
      ram: "16GB DDR5",
      storage: "512GB SSD",
      graphics: "AMD Radeon 680M",
      screen: "14\" FHD IPS",
      weight: "1.5kg",
      battery: "60Wh"
    },
    categories: ["business", "amd", "mid-range"],
    images: [
      "/placeholder-laptop.svg",
      "/placeholder-laptop.svg"
    ],
    badges: ["business", "amd"],
    description: "Laptop empresarial com processador AMD e excelente duração de bateria."
  },
  {
    id: 7,
    name: "Legion 5 Pro Gen 8",
    brand: "Lenovo",
    category: "Gaming",
    price: 12999.99,
    oldPrice: 14999.99,
    rating: 4.8,
    reviewCount: 134,
    stock: 3,
    specifications: {
      processor: "AMD Ryzen 7 7745H",
      ram: "16GB DDR5",
      storage: "512GB SSD",
      graphics: "NVIDIA RTX 4060 8GB",
      screen: "16\" 2.5K 165Hz",
      weight: "2.5kg",
      battery: "80Wh"
    },
    categories: ["gaming", "amd", "mid-range"],
    images: [
      "/placeholder-laptop.svg",
      "/placeholder-laptop.svg"
    ],
    badges: ["gaming", "amd"],
    description: "Gaming de alto desempenho com a melhor relação custo-benefício."
  },
  {
    id: 8,
    name: "IdeaPad 3 Gen 8",
    brand: "Lenovo",
    category: "Budget",
    price: 2999.99,
    oldPrice: 3499.99,
    rating: 4.2,
    reviewCount: 312,
    stock: 30,
    specifications: {
      processor: "Intel Core i3-1215U",
      ram: "4GB DDR4",
      storage: "128GB SSD",
      graphics: "Intel UHD Graphics",
      screen: "15.6\" FHD TN",
      weight: "1.85kg",
      battery: "45Wh"
    },
    categories: ["budget", "entry", "everyday"],
    images: [
      "/placeholder-laptop.svg",
      "/placeholder-laptop.svg"
    ],
    badges: ["budget", "entry"],
    description: "Laptop econômica perfeita para tarefas básicas e navegação web."
  }
];

const staticBrands = [
  "Lenovo",
  "ThinkPad",
  "Legion",
  "IdeaPad",
  "Yoga",
  "ThinkBook"
];

const staticPriceRange = {
  min: 2999.99,
  max: 24999.99
};

// Simular delay de API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const laptopService = {
  // Obtener todos los laptops con filtros opcionales
  getAll: async (filters = {}) => {
    await delay(500); // Simular delay de red
    
    let filteredLaptops = [...staticLaptops];
    
    // Aplicar filtros
    if (filters.brand) {
      filteredLaptops = filteredLaptops.filter(laptop => 
        laptop.brand.toLowerCase().includes(filters.brand.toLowerCase()) ||
        laptop.name.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }
    
    if (filters.minPrice) {
      filteredLaptops = filteredLaptops.filter(laptop => laptop.price >= parseFloat(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      filteredLaptops = filteredLaptops.filter(laptop => laptop.price <= parseFloat(filters.maxPrice));
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredLaptops = filteredLaptops.filter(laptop => 
        laptop.name.toLowerCase().includes(searchTerm) ||
        laptop.brand.toLowerCase().includes(searchTerm) ||
        laptop.category.toLowerCase().includes(searchTerm)
      );
    }
    
    // Aplicar paginación
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLaptops = filteredLaptops.slice(startIndex, endIndex);
    
    return {
      data: paginatedLaptops,
      total: filteredLaptops.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(filteredLaptops.length / limit)
    };
  },

  // Obtener laptop por ID
  getById: async (id) => {
    await delay(300);
    const laptop = staticLaptops.find(l => l.id === parseInt(id));
    if (!laptop) {
      throw new Error('Laptop no encontrado');
    }
    return { data: laptop };
  },

  // Obtener recomendaciones
  getRecommendations: async () => {
    await delay(400);
    // Retornar laptops destacados
    const featured = staticLaptops.filter(l => l.badges.includes('featured'));
    return { data: featured };
  },

  // Obtener marcas disponibles
  getBrands: async () => {
    await delay(200);
    return { data: staticBrands };
  },

  // Obtener rango de precios
  getPriceRange: async () => {
    await delay(200);
    return { data: staticPriceRange };
  },

  // Formatear precio
  formatPrice: (price) => {
    if (!price) return '$0';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  },

  // Calcular descuento
  calculateDiscount: (originalPrice, currentPrice) => {
    if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  },

  // Obtener URL de imagen
  getImageUrl: (imageUrl) => {
    if (!imageUrl) return '/placeholder-laptop.svg';
    
    // Si ya es una URL completa, devolverla tal como está
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Si es una ruta relativa del servidor
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:3002';
    return `${serverUrl}/${imageUrl}`;
  }
};

export default laptopService;