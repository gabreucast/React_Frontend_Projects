const mongoose = require('mongoose');

const laptopSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['gaming', 'business', 'ultrabook', 'workstation', 'budget']
  },
  specifications: {
    processor: {
      type: String,
      required: true
    },
    ram: {
      type: String,
      required: true
    },
    storage: {
      type: String,
      required: true
    },
    graphics: {
      type: String,
      required: true
    },
    display: {
      type: String,
      required: true
    },
    battery: {
      type: String
    },
    weight: {
      type: String
    },
    os: {
      type: String,
      default: 'Windows 11'
    }
  },
  features: [{
    type: String
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isRecommended: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento de las consultas
laptopSchema.index({ brand: 1 });
laptopSchema.index({ category: 1 });
laptopSchema.index({ price: 1 });
laptopSchema.index({ name: 'text', brand: 'text' });

// Método para calcular el precio con descuento
laptopSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0) {
    return this.price * (1 - this.discount / 100);
  }
  return this.price;
});

// Asegurar que los virtuals se incluyan en JSON
laptopSchema.set('toJSON', { virtuals: true });
laptopSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Laptop', laptopSchema);