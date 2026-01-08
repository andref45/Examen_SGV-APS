class PedidosService {
  constructor(dataLayer, productosService) {
    this.dataLayer = dataLayer;
    this.productosService = productosService;
  }

  crearPedido(cliente, formaPago, items) {
    if (!cliente || !formaPago || !items || items.length === 0) {
      throw new Error('Datos invalidos para crear pedido');
    }

    const formasPagoValidas = ['efectivo', 'tarjeta', 'transferencia'];
    if (!formasPagoValidas.includes(formaPago.toLowerCase())) {
      throw new Error('Forma de pago no valida');
    }

    for (const item of items) {
      const disponible = this.productosService.verificarDisponibilidad(
        item.productoId,
        item.cantidad
      );
      if (!disponible) {
        const producto = this.productosService.obtenerProducto(item.productoId);
        throw new Error(`Stock insuficiente para ${producto.tipo} - ${producto.diseno}`);
      }
    }

    let montoTotal = 0;
    for (const item of items) {
      const producto = this.productosService.obtenerProducto(item.productoId);
      montoTotal += producto.precio * item.cantidad;
    }

    const fecha = new Date().toISOString();
    const pedidoId = this.dataLayer.insertPedido(cliente, formaPago, montoTotal, fecha);

    for (const item of items) {
      const producto = this.productosService.obtenerProducto(item.productoId);
      this.dataLayer.insertPedidoItem(
        pedidoId,
        item.productoId,
        item.cantidad,
        producto.precio
      );
      this.productosService.reducirStock(item.productoId, item.cantidad);
    }

    return {
      id: pedidoId,
      cliente,
      formaPago,
      montoTotal,
      fecha,
      estado: 'pendiente'
    };
  }

  listarPedidos() {
    return this.dataLayer.getAllPedidos();
  }

  obtenerPedido(id) {
    const pedido = this.dataLayer.getPedidoById(id);
    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }

    const items = this.dataLayer.getPedidoItems(id);
    return { ...pedido, items };
  }

  cambiarEstado(id, nuevoEstado) {
    const estadosValidos = ['pendiente', 'enviado', 'entregado'];
    if (!estadosValidos.includes(nuevoEstado.toLowerCase())) {
      throw new Error('Estado no valido');
    }

    const pedido = this.dataLayer.getPedidoById(id);
    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }

    const actualizado = this.dataLayer.updateEstadoPedido(id, nuevoEstado);
    if (!actualizado) {
      throw new Error('No se pudo actualizar el estado');
    }

    return { id, nuevoEstado };
  }

  calcularMontoTotal(items) {
    let total = 0;
    for (const item of items) {
      const producto = this.productosService.obtenerProducto(item.productoId);
      total += producto.precio * item.cantidad;
    }
    return total;
  }
}

module.exports = PedidosService;
