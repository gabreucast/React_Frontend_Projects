# MatchTech - Sistema de Métodos de Pago

Sistema completo con frontend React y backend Node.js/Express para gestionar métodos de pago.

## Estructura del Proyecto

```
React_Frontend_Projects/
├── client/          # Frontend React
├── server/          # Backend Node.js/Express
└── README.md        # Este archivo
```

## Configuración y Ejecución

### 1. Servidor (Backend)

#### Instalación
```bash
cd server
npm install
```

#### Configuración
- El archivo `.env` ya está configurado con:
  - MongoDB URI
  - Puerto: 65432
  - NODE_ENV: development

#### Ejecutar el servidor
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

#### Inicializar datos de métodos de pago
```bash
# Ejecutar seed para crear métodos de pago en la base de datos
npm run seed:payments
```

### 2. Cliente (Frontend)

#### Instalación
```bash
cd client
npm install
```

#### Configuración
- El archivo `.env` está configurado para conectar con el servidor en `http://localhost:65432/api`

#### Ejecutar el cliente
```bash
# Modo desarrollo
npm start
```

## API Endpoints

### Métodos de Pago
- `GET /api/payment-methods` - Obtener todos los métodos
- `GET /api/payment-methods/:id` - Obtener por ID
- `GET /api/payment-methods/category/general` - Métodos generales (Boleto, PIX)
- `GET /api/payment-methods/category/credit_card` - Tarjetas de crédito
- `POST /api/payment-methods` - Crear nuevo método
- `PUT /api/payment-methods/:id` - Actualizar método
- `DELETE /api/payment-methods/:id` - Eliminar método
- `POST /api/payment-methods/initialize` - Inicializar datos de ejemplo

### Otros Endpoints
- `GET /api/health` - Verificar salud de la API
- `GET /api/test` - Endpoint de prueba

## Características del Sistema

### Frontend
- **Fallback Inteligente**: Si la API no está disponible, usa datos estáticos
- **Hook Personalizado**: `usePaymentMethods` para gestionar estado
- **Compatibilidad**: Mantiene la estructura existente del código
- **Estados de Carga**: Maneja loading, error y datos vacíos

### Backend
- **MongoDB**: Base de datos con Mongoose
- **Validación**: Validación de datos de entrada
- **CORS**: Configurado para desarrollo
- **Archivos Estáticos**: Servir archivos desde carpeta public
- **Manejo de Errores**: Respuestas consistentes de error

## Datos de Métodos de Pago

### Métodos Generales
1. **Boleto Bancário** (ID: 1)
2. **PIX** (ID: 2)

### Tarjetas de Crédito
3. **Visa** (ID: 3)
4. **Mastercard** (ID: 4)
5. **American Express** (ID: 5)
6. **Elo** (ID: 6)

## Flujo de Trabajo

1. **Iniciar el servidor**: `cd server && npm run dev`
2. **Ejecutar seed** (opcional): `npm run seed:payments`
3. **Iniciar el cliente**: `cd client && npm start`
4. **Verificar funcionamiento**: El frontend debería mostrar los métodos de pago

## Solución de Problemas

### Si el servidor no inicia
- Verificar que el puerto 65432 esté libre
- Revisar la conexión a MongoDB
- Verificar las variables de entorno en `.env`

### Si el frontend no muestra datos de la API
- El sistema usa fallback automático a datos estáticos
- Verificar la consola del navegador para errores de red
- Confirmar que el servidor esté ejecutándose en el puerto correcto

### Si hay problemas de CORS
- El servidor ya está configurado para permitir CORS
- Verificar que la URL de la API en el cliente sea correcta

## Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- CORS
- dotenv

### Frontend
- React
- Hooks personalizados
- Fetch API
- CSS personalizado

## Próximos Pasos

- [ ] Agregar autenticación
- [ ] Implementar cache en el frontend
- [ ] Agregar tests unitarios
- [ ] Configurar CI/CD
- [ ] Optimizar imágenes de métodos de pago