import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HeroSection from './components/HeroSection/HeroSection';
import ProductCatalog from './components/ProductCatalog/ProductCatalog';
import NotebooksPage from './pages/NotebooksPage';
import ProductDetailPage from './pages/ProductDetailPage';
import Admin from './pages/Admin';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import './styles/globals.css';

// Componente para la página principal
const HomePage = () => (
  <div className="home-page">
    <HeroSection />
    <section className="products-section">
      <div className="container">
        <div className="section-header text-center">
          <h2>Nossa Coleção de Laptops</h2>
          <p>Descubra a tecnologia mais avançada com o selo de qualidade Lenovo</p>
        </div>
        <ProductCatalog />
      </div>
    </section>
  </div>
);

// Componente Layout que maneja Header y Footer condicionalmente
const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return children;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/notebooks" element={<NotebooksPage />} />
                <Route path="/producto/:id" element={<ProductDetailPage />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Layout>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
