import { useState } from 'react';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 Formulario enviado');
    console.log('📝 Datos del formulario:', { username: formData.username, password: '***' });
    
    setLoading(true);
    setError('');
    
    try {
      console.log('🔄 Llamando función login...');
      const result = await login(formData);
      console.log('📋 Resultado del login:', result);
      
      if (!result.success) {
        console.log('❌ Login falló:', result.error);
        setError(result.error || 'Error en el login');
      } else {
        console.log('✅ Login exitoso!');
      }
    } catch (err) {
      console.error('💥 Error en handleSubmit:', err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
      console.log('🏁 Proceso de login terminado');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };



  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <Lock size={32} />
          </div>
          <h1>Panel de Administración</h1>
          <p>Accede al sistema de gestión de productos</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <div className="input-wrapper">
              <User className="input-icon" size={20} />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Ingresa tu usuario"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading || !formData.username || !formData.password}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>



        <div className="admin-login-footer">
          <p>Sistema de administración Lenovo Store</p>
          <small>Credenciales por defecto: admin / admin123456</small>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;