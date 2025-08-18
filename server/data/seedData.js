const laptopsData = [
  {
    id: 1,
    name: "ThinkPad X1 Carbon Gen 11",
    brand: "Lenovo",
    price: 1899,
    originalPrice: 2199,
    discount: 14,
    image: "/images/thinkpad-x1-carbon.jpg",
    category: "business",
    specifications: {
      processor: "Intel Core i7-1365U",
      ram: "16GB LPDDR5",
      storage: "512GB SSD",
      graphics: "Intel Iris Xe",
      display: "14\" WUXGA IPS",
      battery: "57Wh",
      weight: "1.12kg",
      os: "Windows 11 Pro"
    },
    features: [
      "Pantalla táctil opcional",
      "Teclado retroiluminado",
      "Lector de huellas",
      "Cámara IR",
      "Certificación MIL-STD-810H"
    ],
    inStock: true,
    stockQuantity: 25,
    rating: 4.8,
    reviewCount: 156,
    isRecommended: true,
    tags: ["ultrabook", "business", "premium"]
  },
  {
    id: 2,
    name: "Legion 5 Pro Gaming",
    brand: "Lenovo",
    price: 1299,
    originalPrice: 1499,
    discount: 13,
    image: "/images/legion-5-pro.jpg",
    category: "gaming",
    specifications: {
      processor: "AMD Ryzen 7 6800H",
      ram: "16GB DDR5",
      storage: "1TB SSD",
      graphics: "NVIDIA RTX 4060 8GB",
      display: "16\" QHD 165Hz",
      battery: "80Wh",
      weight: "2.5kg",
      os: "Windows 11 Home"
    },
    features: [
      "Pantalla QHD 165Hz",
      "Teclado RGB",
      "Sistema de refrigeración Legion Coldfront",
      "Audio Nahimic 3D",
      "Webcam con obturador de privacidad"
    ],
    inStock: true,
    stockQuantity: 18,
    rating: 4.7,
    reviewCount: 89,
    isRecommended: true,
    tags: ["gaming", "high-performance", "rgb"]
  },
  {
    id: 3,
    name: "IdeaPad 3 15",
    brand: "Lenovo",
    price: 549,
    originalPrice: 649,
    discount: 15,
    image: "/images/ideapad-3-15.jpg",
    category: "budget",
    specifications: {
      processor: "AMD Ryzen 5 5500U",
      ram: "8GB DDR4",
      storage: "256GB SSD",
      graphics: "AMD Radeon Graphics",
      display: "15.6\" FHD IPS",
      battery: "45Wh",
      weight: "1.65kg",
      os: "Windows 11 Home"
    },
    features: [
      "Pantalla antirreflejos",
      "Cámara con obturador de privacidad",
      "Audio Dolby",
      "Teclado numérico",
      "Múltiples puertos"
    ],
    inStock: true,
    stockQuantity: 42,
    rating: 4.3,
    reviewCount: 234,
    isRecommended: false,
    tags: ["budget", "everyday", "student"]
  },
  {
    id: 4,
    name: "ThinkPad P1 Gen 6",
    brand: "Lenovo",
    price: 2899,
    originalPrice: 3299,
    discount: 12,
    image: "/images/thinkpad-p1-gen6.jpg",
    category: "workstation",
    specifications: {
      processor: "Intel Core i7-13800H",
      ram: "32GB DDR5",
      storage: "1TB SSD",
      graphics: "NVIDIA RTX A2000 8GB",
      display: "16\" WQUXGA OLED",
      battery: "90Wh",
      weight: "1.81kg",
      os: "Windows 11 Pro"
    },
    features: [
      "Pantalla OLED 4K",
      "Certificación ISV",
      "Teclado retroiluminado",
      "Lector de huellas",
      "Cámara IR con Windows Hello"
    ],
    inStock: true,
    stockQuantity: 8,
    rating: 4.9,
    reviewCount: 45,
    isRecommended: true,
    tags: ["workstation", "professional", "oled"]
  },
  {
    id: 5,
    name: "Yoga 9i 14",
    brand: "Lenovo",
    price: 1599,
    originalPrice: 1799,
    discount: 11,
    image: "/images/yoga-9i-14.jpg",
    category: "ultrabook",
    specifications: {
      processor: "Intel Core i7-1360P",
      ram: "16GB LPDDR5",
      storage: "512GB SSD",
      graphics: "Intel Iris Xe",
      display: "14\" 2.8K OLED Touch",
      battery: "75Wh",
      weight: "1.4kg",
      os: "Windows 11 Home"
    },
    features: [
      "Pantalla OLED táctil 2.8K",
      "Convertible 2-en-1",
      "Audio Bowers & Wilkins",
      "Stylus incluido",
      "Carga rápida"
    ],
    inStock: true,
    stockQuantity: 15,
    rating: 4.6,
    reviewCount: 78,
    isRecommended: true,
    tags: ["2-in-1", "oled", "premium", "convertible"]
  },
  {
    id: 6,
    name: "Legion Slim 7i",
    brand: "Lenovo",
    price: 1799,
    originalPrice: 1999,
    discount: 10,
    image: "/images/legion-slim-7i.jpg",
    category: "gaming",
    specifications: {
      processor: "Intel Core i7-13700H",
      ram: "16GB DDR5",
      storage: "1TB SSD",
      graphics: "NVIDIA RTX 4070 8GB",
      display: "16\" WQXGA 240Hz",
      battery: "99.99Wh",
      weight: "2.1kg",
      os: "Windows 11 Home"
    },
    features: [
      "Pantalla 240Hz G-SYNC",
      "Diseño ultradelgado",
      "Teclado RGB por zona",
      "Sistema de refrigeración avanzado",
      "Audio Nahimic 3D"
    ],
    inStock: true,
    stockQuantity: 12,
    rating: 4.8,
    reviewCount: 67,
    isRecommended: true,
    tags: ["gaming", "slim", "high-refresh"]
  }
];

module.exports = laptopsData;