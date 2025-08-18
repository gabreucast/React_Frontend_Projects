const mongoose = require('mongoose');
require('dotenv').config();
const Laptop = require('../models/Laptop');

const updateProductsActive = async () => {
  try {
    // Conectar a MongoDB
    console.log('Conectando a MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Actualizar todos los productos que no tienen el campo isActive
    const result = await Laptop.updateMany(
      { isActive: { $exists: false } },
      { $set: { isActive: true } }
    );

    console.log(`Productos actualizados: ${result.modifiedCount}`);

    // También actualizar productos que tienen isActive como null o undefined
    const result2 = await Laptop.updateMany(
      { $or: [{ isActive: null }, { isActive: undefined }] },
      { $set: { isActive: true } }
    );

    console.log(`Productos con isActive null/undefined actualizados: ${result2.modifiedCount}`);

    // Mostrar algunos productos para verificar
    const sampleProducts = await Laptop.find({}).limit(5).select('name isActive inStock');
    console.log('\nMuestra de productos actualizados:');
    sampleProducts.forEach(product => {
      console.log(`- ${product.name}: isActive=${product.isActive}, inStock=${product.inStock}`);
    });

    console.log('\n✅ Actualización completada exitosamente');
  } catch (error) {
    console.error('❌ Error actualizando productos:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Conexión cerrada');
  }
};

// Ejecutar el script
updateProductsActive();