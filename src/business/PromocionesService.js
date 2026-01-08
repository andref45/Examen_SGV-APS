class PromocionesService {
  constructor(dataLayer, productosService) {
    this.dataLayer = dataLayer;
    this.productosService = productosService;
  }

  registrarEvento(nombre, fecha, descripcion) {
    if (!nombre || !fecha) {
      throw new Error('Nombre y fecha son requeridos para registrar evento');
    }

    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj.getTime())) {
      throw new Error('Fecha invalida');
    }

    const id = this.dataLayer.insertEvento(nombre, fecha, descripcion || '');
    return { id, nombre, fecha, descripcion };
  }

  listarEventos() {
    return this.dataLayer.getAllEventos();
  }

  marcarProductoDestacado(productoId, destacado = true) {
    const producto = this.productosService.obtenerProducto(productoId);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    const destacadoValue = destacado ? 1 : 0;
    const actualizado = this.dataLayer.updateDestacadoProducto(productoId, destacadoValue);

    if (!actualizado) {
      throw new Error('No se pudo actualizar el producto');
    }

    return { id: productoId, destacado };
  }

  listarProductosDestacados() {
    return this.dataLayer.getProductosDestacados();
  }

  obtenerPromocionesActivas() {
    const productosDestacados = this.listarProductosDestacados();
    const eventos = this.listarEventos();

    const fechaActual = new Date();
    const eventosFuturos = eventos.filter(evento => {
      const fechaEvento = new Date(evento.fecha);
      return fechaEvento >= fechaActual;
    });

    return {
      productosDestacados,
      eventosFuturos
    };
  }
}

module.exports = PromocionesService;
