import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

class ImageService {
  /**
   * Atualiza as imagens de um produto específico
   */
  async updateProductImages(productId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/images/update-product/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error updating product images:', error);
      throw error;
    }
  }

  /**
   * Atualiza as imagens de todos os produtos
   */
  async updateAllProductImages() {
    try {
      const response = await axios.post(`${API_BASE_URL}/images/update-all`);
      return response.data;
    } catch (error) {
      console.error('Error updating all product images:', error);
      throw error;
    }
  }

  /**
   * Busca imagens para uma marca e modelo específicos
   */
  async searchImages(brand, model, count = 3) {
    try {
      const response = await axios.get(`${API_BASE_URL}/images/search/${brand}/${model}`, {
        params: { count }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching images:', error);
      throw error;
    }
  }

  /**
   * Gera uma URL de imagem otimizada usando Unsplash Source
   */
  generateUnsplashUrl(query, width = 800, height = 600) {
    const encodedQuery = encodeURIComponent(query);
    return `https://source.unsplash.com/${width}x${height}/?${encodedQuery}`;
  }

  /**
   * Função desabilitada - As imagens agora são gerenciadas únicamente pelo administrador
   */
  generateProductImageUrls(brand, model, specs) {
    console.log('⚠️  Geração automática de imagens desabilitada');
    console.log('📝 As imagens devem ser gerenciadas manualmente pelo administrador');
    
    // Retornar array vazio para que não se gerem imagens automaticamente
    return [];
  }

  /**
   * Valida se uma URL de imagem é acessível
   */
  async validateImageUrl(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtém uma imagem de fallback baseada na marca
   */
  getFallbackImage(brand) {
    const fallbackImages = {
      'Apple': '/images/apple-laptop.svg',
      'Asus': '/images/asus-laptop.svg',
      'Dell': '/images/dell-laptop.svg',
      'HP': '/images/hp-laptop.svg',
      'Lenovo': '/images/lenovo-laptop.svg',
      'MSI': '/images/msi-laptop.svg',
      'Acer': '/images/acer-laptop.svg'
    };

    return fallbackImages[brand] || '/images/generic-laptop.svg';
  }
}

export default new ImageService();