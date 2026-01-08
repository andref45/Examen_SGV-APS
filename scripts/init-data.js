const DataLayer = require('../src/data/database');
const ProductosService = require('../src/business/ProductosService');
const PedidosService = require('../src/business/PedidosService');
const PromocionesService = require('../src/business/PromocionesService');

console.log('Inicializando datos de prueba...');

const dataLayer = new DataLayer();
const productosService = new ProductosService(dataLayer);
const pedidosService = new PedidosService(dataLayer, productosService);
const promocionesService = new PromocionesService(dataLayer, productosService);

try {
  const producto1 = productosService.crearProducto(
    'collar',
    'Tradicional Saraguro',
    'Mostacilla, hilo, cierre metalico',
    25.50,
    15,
    'Maria Lozano'
  );
  console.log('Producto creado:', producto1);

  const producto2 = productosService.crearProducto(
    'arete',
    'Circular Multicolor',
    'Mostacilla, alambre, base metalica',
    12.00,
    20,
    'Rosa Quizhpe'
  );
  console.log('Producto creado:', producto2);

  const producto3 = productosService.crearProducto(
    'manilla',
    'Tejido Andino',
    'Hilo de colores, mostacilla',
    8.50,
    30,
    'Carmen Morocho'
  );
  console.log('Producto creado:', producto3);

  const producto4 = productosService.crearProducto(
    'cartera',
    'Bordada a Mano',
    'Tela, hilo bordado, cierre',
    45.00,
    10,
    'Ana Guaman'
  );
  console.log('Producto creado:', producto4);

  const producto5 = productosService.crearProducto(
    'collar',
    'Plata y Piedras',
    'Plata, piedras naturales, hilo',
    65.00,
    5,
    'Lucia Saraguro'
  );
  console.log('Producto creado:', producto5);

  promocionesService.marcarProductoDestacado(producto1.id, true);
  promocionesService.marcarProductoDestacado(producto4.id, true);
  console.log('Productos destacados marcados');

  const evento1 = promocionesService.registrarEvento(
    'Feria de Artesanias Saraguro',
    '2026-02-15',
    'Feria anual de artesanias tradicionales en la plaza central'
  );
  console.log('Evento creado:', evento1);

  const evento2 = promocionesService.registrarEvento(
    'Exposicion Cultura Viva',
    '2026-03-20',
    'Exposicion de artesanias y demostracion de tecnicas ancestrales'
  );
  console.log('Evento creado:', evento2);

  const pedido1 = pedidosService.crearPedido(
    'Juan Perez',
    'efectivo',
    [
      { productoId: producto1.id, cantidad: 2 },
      { productoId: producto2.id, cantidad: 3 }
    ]
  );
  console.log('Pedido creado:', pedido1);

  pedidosService.cambiarEstado(pedido1.id, 'enviado');
  console.log('Estado de pedido actualizado');

  const pedido2 = pedidosService.crearPedido(
    'Maria Garcia',
    'tarjeta',
    [
      { productoId: producto4.id, cantidad: 1 }
    ]
  );
  console.log('Pedido creado:', pedido2);

  console.log('\nDatos de prueba inicializados exitosamente!');
  console.log('Productos creados: 5');
  console.log('Eventos creados: 2');
  console.log('Pedidos creados: 2');
  console.log('\nPuede iniciar el servidor con: npm start');

} catch (error) {
  console.error('Error al inicializar datos:', error.message);
} finally {
  dataLayer.close();
}
