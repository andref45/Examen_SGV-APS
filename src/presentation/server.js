const express = require('express');
const path = require('path');

class PresentationServer {
  constructor(productosController, pedidosController, promocionesController) {
    this.app = express();
    this.productosController = productosController;
    this.pedidosController = pedidosController;
    this.promocionesController = promocionesController;

    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '../../public')));
  }

  setupRoutes() {
    this.app.get('/api/productos', (req, res) =>
      this.productosController.listarProductos(req, res)
    );

    this.app.get('/api/productos/:id', (req, res) =>
      this.productosController.obtenerProducto(req, res)
    );

    this.app.post('/api/productos', (req, res) =>
      this.productosController.crearProducto(req, res)
    );

    this.app.put('/api/productos/:id/stock', (req, res) =>
      this.productosController.actualizarStock(req, res)
    );

    this.app.get('/api/pedidos', (req, res) =>
      this.pedidosController.listarPedidos(req, res)
    );

    this.app.get('/api/pedidos/:id', (req, res) =>
      this.pedidosController.obtenerPedido(req, res)
    );

    this.app.post('/api/pedidos', (req, res) =>
      this.pedidosController.crearPedido(req, res)
    );

    this.app.put('/api/pedidos/:id/estado', (req, res) =>
      this.pedidosController.cambiarEstado(req, res)
    );

    this.app.get('/api/eventos', (req, res) =>
      this.promocionesController.listarEventos(req, res)
    );

    this.app.post('/api/eventos', (req, res) =>
      this.promocionesController.registrarEvento(req, res)
    );

    this.app.put('/api/productos/:id/destacado', (req, res) =>
      this.promocionesController.marcarProductoDestacado(req, res)
    );

    this.app.get('/api/productos-destacados', (req, res) =>
      this.promocionesController.listarProductosDestacados(req, res)
    );

    this.app.get('/api/promociones-activas', (req, res) =>
      this.promocionesController.obtenerPromocionesActivas(req, res)
    );

    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../../public/index.html'));
    });
  }

  start(port = 3000) {
    this.app.listen(port, () => {
      console.log(`Servidor iniciado en http://localhost:${port}`);
      console.log('Sistema de Gestion de Artesanias Saraguro');
      console.log('Arquitectura 3 capas: Presentacion -> Logica de Negocio -> Datos');
    });
  }
}

module.exports = PresentationServer;
