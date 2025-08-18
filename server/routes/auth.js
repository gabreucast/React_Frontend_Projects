const express = require('express');
const Admin = require('../models/Admin');
const { authenticateToken, generateToken } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/auth/login
// @desc    Login de administrador
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar campos requeridos
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son requeridos'
      });
    }

    // Buscar administrador por username o email
    const admin = await Admin.findOne({
      $or: [
        { username: username },
        { email: username }
      ],
      isActive: true
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Actualizar último login
    await admin.updateLastLogin();

    // Generar token
    const token = generateToken(admin._id);

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
          lastLogin: admin.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/auth/register
// @desc    Registrar nuevo administrador (solo para super admin)
// @access  Private (Super Admin)
router.post('/register', authenticateToken, async (req, res) => {
  try {
    // Solo super admin puede crear nuevos admins
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requieren permisos de super administrador'
      });
    }

    const { username, email, password, role = 'admin' } = req.body;

    // Validar campos requeridos
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario, email y contraseña son requeridos'
      });
    }

    // Verificar si ya existe
    const existingAdmin = await Admin.findOne({
      $or: [
        { username },
        { email }
      ]
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'El usuario o email ya existe'
      });
    }

    // Crear nuevo administrador
    const newAdmin = new Admin({
      username,
      email,
      password,
      role
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: 'Administrador creado exitosamente',
      data: {
        admin: {
          id: newAdmin._id,
          username: newAdmin.username,
          email: newAdmin.email,
          role: newAdmin.role,
          createdAt: newAdmin.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/auth/profile
// @desc    Obtener perfil del administrador
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        admin: {
          id: req.admin._id,
          username: req.admin.username,
          email: req.admin.email,
          role: req.admin.role,
          lastLogin: req.admin.lastLogin,
          createdAt: req.admin.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout (invalidar token del lado del cliente)
// @access  Private
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logout exitoso'
  });
});

module.exports = router;