class PromocionesController {
  constructor(promocionesService) {
    this.promocionesService = promocionesService;
  }

  registrarEvento(req, res) {
    try {
      const { nombre, fecha, descripcion } = req.body;
      const evento = this.promocionesService.registrarEvento(nombre, fecha, descripcion);
      res.status(201).json({ success: true, data: evento });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  listarEventos(req, res) {
    try {
      const eventos = this.promocionesService.listarEventos();
      res.json({ success: true, data: eventos });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  marcarProductoDestacado(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { destacado } = req.body;
      const resultado = this.promocionesService.marcarProductoDestacado(id, destacado);
      res.json({ success: true, data: resultado });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  listarProductosDestacados(req, res) {
    try {
      const productos = this.promocionesService.listarProductosDestacados();
      res.json({ success: true, data: productos });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  obtenerPromocionesActivas(req, res) {
    try {
      const promociones = this.promocionesService.obtenerPromocionesActivas();
      res.json({ success: true, data: promociones });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = PromocionesController;
