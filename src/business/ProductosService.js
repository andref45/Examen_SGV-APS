class ProductosService {
  constructor(dataLayer) {
    this.dataLayer = dataLayer;
  }

  crearProducto(tipo, diseno, materiales, precio, stock, artesana) {
    if (!tipo || !diseno || !materiales || precio <= 0 || stock < 0 || !artesana) {
      throw new Error('Datos invalidos para crear producto');
    }

    const tiposValidos = ['collar', 'arete', 'manilla', 'cartera', 'otro'];
    if (!tiposValidos.includes(tipo.toLowerCase())) {
      throw new Error('Tipo de artesania no valido');
    }

    const id = this.dataLayer.insertProducto(tipo, diseno, materiales, precio, stock, artesana);
    return { id, tipo, diseno, materiales, precio, stock, artesana };
  }

  listarProductos() {
    return this.dataLayer.getAllProductos();
  }

  obtenerProducto(id) {
    const producto = this.dataLayer.getProductoById(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return producto;
  }

  actualizarStock(id, nuevoStock) {
    if (nuevoStock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    const producto = this.dataLayer.getProductoById(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    const actualizado = this.dataLayer.updateStockProducto(id, nuevoStock);
    if (!actualizado) {
      throw new Error('No se pudo actualizar el stock');
    }

    return { id, nuevoStock };
  }

  verificarDisponibilidad(id, cantidadSolicitada) {
    const producto = this.dataLayer.getProductoById(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    return producto.stock >= cantidadSolicitada;
  }

  reducirStock(id, cantidad) {
    const producto = this.dataLayer.getProductoById(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    const nuevoStock = producto.stock - cantidad;
    if (nuevoStock < 0) {
      throw new Error('Stock insuficiente');
    }

    return this.dataLayer.updateStockProducto(id, nuevoStock);
  }
}

module.exports = ProductosService;
