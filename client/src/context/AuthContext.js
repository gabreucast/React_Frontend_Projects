import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('adminToken');
      
      if (savedToken) {
        try {
          // Configurar el token en el header de axios
          api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
          
          // Verificar si el token es válido obteniendo el perfil
          const response = await api.get('/auth/profile');
          
          if (response.data.success) {
            setUser(response.data.data);
            setIsAuthenticated(true);
            setToken(savedToken);
          } else {
            // Token inválido
            localStorage.removeItem('adminToken');
            delete api.defaults.headers.common['Authorization'];
          }
        } catch (error) {
          console.error('Error verificando autenticación:', error);
          localStorage.removeItem('adminToken');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    console.log('🔐 Iniciando login con credenciales:', { username: credentials.username, password: '***' });
    console.log('🌐 URL de API configurada:', api.defaults.baseURL);
    
    try {
      console.log('📡 Enviando petición POST a /auth/login...');
      const response = await api.post('/auth/login', credentials);
      
      console.log('✅ Respuesta recibida:', response.status, response.data);
      
      // Check if we received token and admin data (successful login)
      if (response.data.token && response.data.admin) {
        const { token: newToken, admin } = response.data;
        console.log('🎉 Login exitoso, token recibido:', newToken ? 'SÍ' : 'NO');
        console.log('👤 Datos del admin:', admin);
        
        // Guardar token
        localStorage.setItem('adminToken', newToken);
        setToken(newToken);
        
        // Configurar header de autorización
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        // Actualizar estado
        setUser(admin);
        setIsAuthenticated(true);
        
        console.log('✅ Estado actualizado correctamente');
        return { success: true };
      } else {
        console.log('❌ Login falló - respuesta no exitosa:', response.data);
        return { 
          success: false, 
          error: response.data.message || 'Error en el login' 
        };
      }
    } catch (error) {
      console.error('💥 Error en login:', error);
      console.error('📊 Detalles del error:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Error de conexión' 
      };
    }
  };

  const logout = async () => {
    try {
      // Intentar hacer logout en el servidor
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar estado local independientemente del resultado del servidor
      localStorage.removeItem('adminToken');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
      setToken(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/api/auth/profile', profileData);
      
      if (response.data.success) {
        setUser(response.data.data);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Error actualizando perfil' 
        };
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error de conexión' 
      };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    token,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;