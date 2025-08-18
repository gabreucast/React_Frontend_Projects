const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📱 Conectado a MongoDB');

    // Verificar si ya existe un administrador
    const existingAdmin = await Admin.findOne({ role: 'super_admin' });
    
    if (existingAdmin) {
      console.log('⚠️  Ya existe un super administrador:');
      console.log(`   Usuario: ${existingAdmin.username}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Creado: ${existingAdmin.createdAt}`);
      return;
    }

    // Crear super administrador por defecto
    const adminData = {
      username: 'admin',
      email: 'admin@lenovo-store.com',
      password: 'admin123456', // Cambiar en producción
      role: 'super_admin'
    };

    const admin = new Admin(adminData);
    await admin.save();

    console.log('✅ Super administrador creado exitosamente:');
    console.log(`   Usuario: ${admin.username}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Rol: ${admin.role}`);
    console.log(`   ID: ${admin._id}`);
    console.log('');
    console.log('🔐 Credenciales de acceso:');
    console.log(`   Usuario: ${adminData.username}`);
    console.log(`   Contraseña: ${adminData.password}`);
    console.log('');
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login');
    console.log('🌐 Accede al panel admin en: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Error creando administrador:', error.message);
    
    if (error.code === 11000) {
      console.log('⚠️  El usuario o email ya existe');
    }
  } finally {
    await mongoose.disconnect();
    console.log('📱 Desconectado de MongoDB');
  }
};

// Ejecutar script
createAdmin();