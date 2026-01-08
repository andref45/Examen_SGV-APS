const DataLayer = require('./src/data/database');
const ProductosService = require('./src/business/ProductosService');
const PedidosService = require('./src/business/PedidosService');
const PromocionesService = require('./src/business/PromocionesService');
const ProductosController = require('./src/presentation/ProductosController');
const PedidosController = require('./src/presentation/PedidosController');
const PromocionesController = require('./src/presentation/PromocionesController');
const PresentationServer = require('./src/presentation/server');

const dataLayer = new DataLayer();

const productosService = new ProductosService(dataLayer);
const pedidosService = new PedidosService(dataLayer, productosService);
const promocionesService = new PromocionesService(dataLayer, productosService);

const productosController = new ProductosController(productosService);
const pedidosController = new PedidosController(pedidosService);
const promocionesController = new PromocionesController(promocionesService);

const server = new PresentationServer(
  productosController,
  pedidosController,
  promocionesController
);

const PORT = process.env.PORT || 3000;
server.start(PORT);
