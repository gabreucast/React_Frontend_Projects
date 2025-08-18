const mongoose = require('mongoose');
const Laptop = require('../models/Laptop');
const laptopsData = require('../data/seedData');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('📦 Conectado a MongoDB para poblar la base de datos');

    // Limpiar la colección existente
    await Laptop.deleteMany({});
    console.log('🗑️ Datos existentes eliminados');

    // Insertar nuevos datos
    await Laptop.insertMany(laptopsData);
    console.log(`✅ ${laptopsData.length} laptops insertadas exitosamente`);

    // Mostrar estadísticas
    const totalLaptops = await Laptop.countDocuments();
    const brands = await Laptop.distinct('brand');
    const categories = await Laptop.distinct('category');

    console.log('\n📊 Estadísticas de la base de datos:');
    console.log(`   Total de laptops: ${totalLaptops}`);
    console.log(`   Marcas disponibles: ${brands.join(', ')}`);
    console.log(`   Categorías: ${categories.join(', ')}`);

    console.log('\n🎉 Base de datos poblada exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
    process.exit(1);
  }
};

// Ejecutar el script
seedDatabase();