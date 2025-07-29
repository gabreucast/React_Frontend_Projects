import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductSection from './components/ProductSection';
import Footer from './components/Footer';
import './styles.css';

export default function App() {
  return (
    <div className="App">
      <Header />
      <HeroSection />
      <ProductSection />
      <Footer />
    </div>
  );
}
