class ProductosController {
  constructor(productosService) {
    this.productosService = productosService;
  }

  crearProducto(req, res) {
    try {
      const { tipo, diseno, materiales, precio, stock, artesana } = req.body;
      const producto = this.productosService.crearProducto(
        tipo,
        diseno,
        materiales,
        parseFloat(precio),
        parseInt(stock),
        artesana
      );
      res.status(201).json({ success: true, data: producto });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  listarProductos(req, res) {
    try {
      const productos = this.productosService.listarProductos();
      res.json({ success: true, data: productos });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  obtenerProducto(req, res) {
    try {
      const id = parseInt(req.params.id);
      const producto = this.productosService.obtenerProducto(id);
      res.json({ success: true, data: producto });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  }

  actualizarStock(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { stock } = req.body;
      const resultado = this.productosService.actualizarStock(id, parseInt(stock));
      res.json({ success: true, data: resultado });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

module.exports = ProductosController;
