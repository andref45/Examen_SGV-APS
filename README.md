# Sistema de Gestion y Venta de Artesanias del Pueblo Saraguro (SGV-APS)

Sistema web para la gestion y comercializacion de productos artesanales de Saraguro, implementado con arquitectura cliente/servidor de 3 capas estricta en un solo nodo.

## Arquitectura de 3 Capas

El sistema implementa una arquitectura de 3 capas estricta donde cada capa tiene responsabilidades bien definidas y solo se comunica con las capas adyacentes:

### 1. Capa de Datos (Data Layer)
**Ubicacion:** `src/data/`

**Responsabilidad:** Gestiona el acceso al almacenamiento JSON y todas las operaciones CRUD.

**Archivos:**
- `database.js`: Clase DataLayer que contiene todos los metodos de acceso a datos

**Comunicacion:** Solo se comunica con la Capa de Logica de Negocio (no conoce la existencia de la capa de presentacion).

**Funciones principales:**
- Operaciones CRUD para productos, pedidos, items de pedidos y eventos
- Consultas especializadas (productos destacados, items de pedido, etc.)
- Inicializacion y gestion de la base de datos

### 2. Capa de Logica de Negocio (Business Layer)
**Ubicacion:** `src/business/`

**Responsabilidad:** Implementa las reglas de negocio y coordina las operaciones entre la capa de presentacion y la capa de datos.

**Archivos:**
- `ProductosService.js`: Gestion de productos y validaciones
- `PedidosService.js`: Gestion de pedidos, calculo de totales y validaciones de stock
- `PromocionesService.js`: Gestion de eventos y productos destacados

**Comunicacion:**
- Recibe solicitudes de la Capa de Presentacion
- Invoca metodos de la Capa de Datos
- No tiene acceso directo a HTTP ni a detalles de la interfaz

**Reglas de negocio implementadas:**
- Validacion de tipos de artesania permitidos
- Verificacion de disponibilidad de stock antes de crear pedidos
- Validacion de formas de pago
- Calculo automatico de montos totales
- Reduccion automatica de stock al crear pedidos
- Validacion de estados de pedidos

### 3. Capa de Presentacion (Presentation Layer)
**Ubicacion:** `src/presentation/`

**Responsabilidad:** Maneja la comunicacion HTTP, rutas REST y delega las operaciones a la capa de logica de negocio.

**Archivos:**
- `ProductosController.js`: Controlador REST para productos
- `PedidosController.js`: Controlador REST para pedidos
- `PromocionesController.js`: Controlador REST para promociones y eventos
- `server.js`: Configuracion del servidor Express y enrutamiento

**Comunicacion:**
- Recibe peticiones HTTP del cliente
- Delega el procesamiento a la Capa de Logica de Negocio
- Retorna respuestas HTTP al cliente
- No accede directamente a la Capa de Datos

### Cliente (Frontend)
**Ubicacion:** `public/`

**Archivos:**
- `index.html`: Interfaz de usuario
- `css/styles.css`: Estilos de la aplicacion
- `js/app.js`: Logica del cliente y comunicacion con la API

**Comunicacion:** Solo se comunica con la Capa de Presentacion mediante peticiones HTTP REST.

## Flujo de Comunicacion

```
Cliente (Browser)
    |
    | HTTP REST
    v
Capa de Presentacion (Controllers + Express)
    |
    | Llamadas a metodos
    v
Capa de Logica de Negocio (Services)
    |
    | Operaciones de datos
    v
Capa de Datos (DataLayer + JSON)
```

**Ejemplo de flujo para crear un pedido:**

1. Cliente hace POST a `/api/pedidos` con datos del pedido
2. PedidosController recibe la peticion HTTP
3. PedidosController llama a `pedidosService.crearPedido()`
4. PedidosService valida los datos y reglas de negocio:
   - Verifica stock usando `productosService.verificarDisponibilidad()`
   - Calcula el monto total consultando precios
5. PedidosService llama a metodos de DataLayer:
   - `dataLayer.insertPedido()`
   - `dataLayer.insertPedidoItem()`
6. ProductosService actualiza stock llamando a `dataLayer.updateStockProducto()`
7. El resultado fluye de regreso: DataLayer -> Service -> Controller -> Cliente

## Componentes del Sistema

### Componente 1: Gestion de Productos
**Funcionalidades:**
- Crear artesania con tipo, diseno, materiales, precio, stock y artesana responsable
- Listar productos del catalogo
- Actualizar stock de productos
- Marcar productos como destacados

**Tipos de artesania soportados:**
- Collares
- Aretes
- Manillas
- Carteras
- Otros

### Componente 2: Gestion de Pedidos
**Funcionalidades:**
- Crear pedido con productos seleccionados, cliente y forma de pago
- Cambiar estado del pedido (pendiente, enviado, entregado)
- Calcular monto total automaticamente
- Reducir stock automaticamente al confirmar pedido
- Validar disponibilidad de stock antes de crear pedido

**Formas de pago:**
- Efectivo
- Tarjeta
- Transferencia

### Componente 3: Gestion de Promociones
**Funcionalidades:**
- Registrar eventos y ferias con fecha y descripcion
- Marcar y desmarcar productos como destacados
- Listar productos destacados
- Listar eventos programados
- Obtener promociones activas

## Stack Tecnologico

- **Backend:** Node.js con Express
- **Almacenamiento:** JSON (modulo fs nativo de Node.js)
- **Frontend:** HTML5, CSS3, JavaScript vanilla
- **Arquitectura:** Cliente/Servidor - 3 Capas
- **Deployment:** Un solo nodo

## Requisitos Previos

- Node.js (version 14 o superior)
- npm (version 6 o superior)

## Instalacion

1. Clonar el repositorio o descargar los archivos

2. Instalar dependencias:
```bash
npm install
```

## Ejecucion

### 1. Inicializar datos de prueba (opcional pero recomendado)

```bash
npm run init-data
```

Este comando crea:
- 5 productos de ejemplo
- 2 eventos programados
- 2 pedidos de prueba
- 2 productos marcados como destacados

### 2. Iniciar el servidor

```bash
npm start
```

El servidor se iniciara en `http://localhost:3000`

## Uso del Sistema

### Interfaz Web

Acceder a `http://localhost:3000` en el navegador.

La interfaz cuenta con 3 pestanas principales:

1. **Productos:**
   - Crear nuevos productos
   - Ver catalogo completo
   - Actualizar stock
   - Marcar/desmarcar productos destacados

2. **Pedidos:**
   - Crear nuevos pedidos
   - Seleccionar multiples productos
   - Ver historial de pedidos
   - Cambiar estado de pedidos

3. **Promociones:**
   - Registrar eventos y ferias
   - Ver productos destacados
   - Ver eventos programados

### API REST

#### Productos

- `GET /api/productos` - Listar todos los productos
- `GET /api/productos/:id` - Obtener un producto
- `POST /api/productos` - Crear producto
- `PUT /api/productos/:id/stock` - Actualizar stock
- `PUT /api/productos/:id/destacado` - Marcar como destacado

#### Pedidos

- `GET /api/pedidos` - Listar todos los pedidos
- `GET /api/pedidos/:id` - Obtener un pedido con items
- `POST /api/pedidos` - Crear pedido
- `PUT /api/pedidos/:id/estado` - Cambiar estado del pedido

#### Promociones

- `GET /api/eventos` - Listar eventos
- `POST /api/eventos` - Crear evento
- `GET /api/productos-destacados` - Listar productos destacados
- `GET /api/promociones-activas` - Obtener promociones activas

## Estructura del Proyecto

```
/
├── src/
│   ├── data/               # Capa de Datos
│   │   └── database.js     # Acceso a almacenamiento JSON
│   ├── business/           # Capa de Logica de Negocio
│   │   ├── ProductosService.js
│   │   ├── PedidosService.js
│   │   └── PromocionesService.js
│   └── presentation/       # Capa de Presentacion
│       ├── ProductosController.js
│       ├── PedidosController.js
│       ├── PromocionesController.js
│       └── server.js
├── public/                 # Frontend
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
├── scripts/
│   └── init-data.js        # Script de inicializacion
├── index.js                # Punto de entrada
├── package.json
└── README.md
```

## Validacion de Arquitectura 3 Capas

Para validar la arquitectura estricta de 3 capas:

1. **Separacion fisica:** Cada capa esta en un directorio diferente
2. **Separacion logica:** Cada capa tiene clases/modulos independientes
3. **Comunicacion unidireccional:**
   - Cliente -> Presentacion (HTTP)
   - Presentacion -> Logica de Negocio (metodos)
   - Logica de Negocio -> Datos (metodos)
4. **Sin bypass:** Ninguna capa salta a otra que no sea adyacente
5. **Responsabilidades claras:** Cada capa tiene funciones especificas

## Almacenamiento de Datos

Los datos se persisten en un archivo JSON (`data.json`) con las siguientes colecciones:

- `productos`: Almacena el catalogo de artesanias
- `pedidos`: Almacena la informacion de pedidos
- `pedidoItems`: Detalle de productos por pedido
- `eventos`: Almacena eventos y ferias programadas
- `counters`: Contadores para generacion de IDs automaticos

## Caracteristicas Técnicas

- Servidor Express configurado con middleware JSON
- Archivos estaticos servidos desde `public/`
- Almacenamiento en JSON con fs (modulo nativo de Node.js)
- Interfaz responsiva con CSS Grid y Flexbox
- JavaScript vanilla (sin frameworks frontend)
- Arquitectura RESTful
- Separacion estricta de capas
- Un solo nodo de deployment
